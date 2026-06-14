"use client";

import {
  getProductType,
  requiresIntake,
  SUCCESS_CONTENT,
  type ProductType,
} from "@/lib/product-types";
import { ModuleHeader, PluginControl, RecessedWell } from "@/components/console-ui";
import { bodyClass, labelDimClass } from "@/lib/design-tokens";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type LoadState = "idle" | "loading" | "ready" | "error";

type OrderLookup = {
  product?: string;
  productName?: string;
  productType?: ProductType;
  downloadUrl?: string | null;
  requiresIntake?: boolean;
};

export function SuccessPanel() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id")?.trim() || "";
  const [state, setState] = useState<LoadState>(sessionId ? "loading" : "idle");
  const [productType, setProductType] = useState<ProductType>("mixing");
  const [productName, setProductName] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    async function load() {
      try {
        const recordRes = await fetch("/api/orders/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!recordRes.ok) {
          const data = (await recordRes.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(data?.error ?? "Could not save order");
        }

        const recordData = (await recordRes.json()) as {
          order?: { product?: string; product_type?: string | null };
        };

        const lookupRes = await fetch(
          `/api/orders/lookup?session_id=${encodeURIComponent(sessionId)}`,
        );

        if (lookupRes.ok) {
          const lookupData = (await lookupRes.json()) as OrderLookup;

          if (!cancelled) {
            setProductType(
              lookupData.productType ??
                (recordData.order?.product_type as ProductType | undefined) ??
                getProductType(
                  lookupData.product ?? recordData.order?.product ?? "",
                ),
            );
            setProductName(lookupData.productName ?? null);
            setDownloadUrl(lookupData.downloadUrl ?? null);
          }
        } else if (!cancelled && recordData.order) {
          setProductType(
            (recordData.order.product_type as ProductType | undefined) ??
              getProductType(recordData.order.product ?? ""),
          );
        }

        if (!cancelled) {
          setStatusMessage("Order confirmed and saved.");
          setState("ready");
        }
      } catch (err: unknown) {
        console.error("[success] order load failed", err);
        if (!cancelled) {
          setStatusMessage(
            "Payment received. If intake matching fails, use the same checkout email on the submit page.",
          );
          setState("error");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const content = SUCCESS_CONTENT[productType];
  const moduleLabel =
    state === "ready" ? content.moduleLabel : "OUT · CONFIRM";
  const submitHref = sessionId
    ? `/submit-files?session_id=${encodeURIComponent(sessionId)}`
    : "/submit-files";
  const showDownload =
    productType === "premade_preset" && Boolean(downloadUrl);

  return (
    <RecessedWell className="overflow-hidden">
      <ModuleHeader label={moduleLabel} />
      <div className="flex flex-col gap-6 p-5 sm:p-6 lg:p-8">
        {!sessionId ? (
          <p className={`text-sm text-amber-400/90 ${bodyClass}`} role="status">
            Missing checkout session. Use the link from your order confirmation
            email.
          </p>
        ) : state === "loading" ? (
          <p className={`text-sm text-white/50 ${bodyClass}`} role="status">
            Confirming your order…
          </p>
        ) : (
          <>
            <div>
              <p className={`${labelDimClass} text-xs-accent-bright/70`}>
                {content.headline}
              </p>
              <p className={`mt-3 text-pretty ${bodyClass} sm:text-base`}>
                {content.description}
              </p>
            </div>

            {statusMessage && (
              <p
                className={`text-sm ${bodyClass} ${
                  state === "ready"
                    ? "text-emerald-400/90"
                    : state === "error"
                      ? "text-amber-400/90"
                      : "text-white/50"
                }`}
                role="status"
              >
                {statusMessage}
              </p>
            )}

            {showDownload && downloadUrl && (
              <div className="border-t border-white/[0.06] pt-6">
                <PluginControl href={downloadUrl} moduleId="DL">
                  Download {productName ?? "Preset"}
                </PluginControl>
                <p className={`mt-3 text-xs text-white/40 ${bodyClass}`}>
                  Also sent to your checkout email. Link expires with your
                  session — save the file locally.
                </p>
              </div>
            )}

            <div className="rounded-[2px] border border-white/[0.06] bg-xs-inset/40 p-4 sm:p-5">
              <p className={`${labelDimClass} text-xs-accent-bright/70`}>
                {requiresIntake(productType)
                  ? "Next step · Intake"
                  : "What happens next"}
              </p>
              <ul className={`mt-3 flex flex-col gap-2.5 text-sm ${bodyClass}`}>
                {content.steps.map((step) => (
                  <li key={step} className="flex gap-2.5">
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-xs-accent/80"
                      aria-hidden
                    />
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {content.showIntakeButton && (
              <div className="border-t border-white/[0.06] pt-6">
                <PluginControl href={submitHref} moduleId="INTAKE">
                  {content.intakeButtonLabel ?? "Complete Intake"}
                </PluginControl>
              </div>
            )}

            <p className={`text-sm ${bodyClass}`}>{content.footerNote}</p>
          </>
        )}
      </div>
    </RecessedWell>
  );
}
