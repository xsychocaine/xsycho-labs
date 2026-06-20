"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ModuleHeader,
  PluginButtonShell,
  RecessedWell,
} from "@/components/console-ui";
import {
  getProductType,
  INTAKE_PROFILE,
  type ProductType,
} from "@/lib/product-types";
import { PRODUCT_OPTIONS, formatProduct } from "@/lib/products";
import { useUploadThing } from "@/lib/uploadthing";
import {
  bodyClass,
  labelClass,
  labelDimClass,
  transitionSmooth,
} from "@/lib/design-tokens";

const fieldClass =
  "w-full rounded-[2px] border border-white/[0.08] bg-xs-inset px-3 py-2.5 text-sm text-white shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] placeholder:text-white/25 focus:border-xs-accent/40 focus:outline-none focus:ring-1 focus:ring-xs-accent/25";

const readOnlyClass =
  "w-full rounded-[2px] border border-xs-accent/20 bg-xs-accent/5 px-3 py-2.5 font-mono text-[0.65rem] uppercase tracking-wider text-xs-accent-bright/80";

function FormField({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelDimClass}>
        {label}
      </label>
      {hint && <p className="text-xs text-white/35">{hint}</p>}
      {children}
    </div>
  );
}

function IntakeSection({
  moduleId,
  title,
  description,
  children,
}: {
  moduleId: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-white/[0.06] pt-6 first:border-t-0 first:pt-0">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={`${labelClass} text-xs-accent/70`}>{moduleId}</p>
          <h3 className="mt-1 text-base font-semibold tracking-tight text-white">
            {title}
          </h3>
          {description && (
            <p className={`mt-1 max-w-2xl text-sm ${bodyClass}`}>{description}</p>
          )}
        </div>
        <span
          aria-hidden
          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-xs-accent-bright shadow-[0_0_8px_rgba(168,85,247,0.9)] sm:mt-0"
        />
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

async function saveIntake(payload: Record<string, unknown>) {
  const res = await fetch("/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as {
    ok?: boolean;
    matched?: boolean;
    product?: string | null;
    error?: string;
  };

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to save submission");
  }

  return data;
}

export function SubmitFilesForm() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id")?.trim() || "";

  const [productType, setProductType] = useState<ProductType>("mixing");
  const [orderLoaded, setOrderLoaded] = useState(!sessionId);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [vocalStyle, setVocalStyle] = useState("");
  const [pluginsAvailable, setPluginsAvailable] = useState("");
  const [bpm, setBpm] = useState("");
  const [trackKey, setTrackKey] = useState("");
  const [referenceNotes, setReferenceNotes] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderLinked, setOrderLinked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const profile = INTAKE_PROFILE[productType];

  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/orders/lookup?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        if (!res.ok) return null;
        return res.json() as Promise<{
          email?: string;
          product?: string;
          productType?: ProductType;
        }>;
      })
      .then((data) => {
        if (!data) return;
        if (data.email) setEmail(data.email);
        if (data.product) setServiceType(data.product);
        if (data.productType) setProductType(data.productType);
        else if (data.product) setProductType(getProductType(data.product));
        setOrderLinked(true);
      })
      .catch(() => {})
      .finally(() => setOrderLoaded(true));
  }, [sessionId]);

  const buildPayload = useCallback(
    (uploadedFiles: { name: string; url: string; key?: string }[]) => ({
      email,
      name,
      sessionId: sessionId || undefined,
      serviceType: serviceType || null,
      bpm: bpm.trim() || null,
      trackKey: trackKey.trim() || null,
      referenceNotes: referenceNotes.trim() || null,
      generalNotes: generalNotes.trim() || null,
      vocalStyle: vocalStyle.trim() || null,
      pluginsAvailable: pluginsAvailable.trim() || null,
      files: uploadedFiles,
    }),
    [
      bpm,
      email,
      generalNotes,
      name,
      pluginsAvailable,
      referenceNotes,
      serviceType,
      sessionId,
      trackKey,
      vocalStyle,
    ],
  );

  const handleSaveResult = useCallback(
    (
      data: { matched?: boolean; product?: string | null },
      hadFiles: boolean,
    ) => {
      const serviceLabel = formatProduct(
        data.product ?? serviceType ?? "order",
      );

      setStatus(
        data.matched
          ? `Intake received and matched to ${serviceLabel}. We'll follow up by email.`
          : sessionId
            ? "Intake received. Your order may still be processing. We'll match it shortly."
            : "Intake received. We couldn't match an order yet. Confirm your checkout email.",
      );
      setError(null);
      if (hadFiles) {
        setFiles([]);
      }
      setBpm("");
      setTrackKey("");
      setReferenceNotes("");
      setGeneralNotes("");
      setVocalStyle("");
      setPluginsAvailable("");
    },
    [serviceType, sessionId],
  );

  const { startUpload, isUploading } = useUploadThing("musicUploader", {
    onClientUploadComplete: async (uploaded) => {
      try {
        const data = await saveIntake(
          buildPayload(
            uploaded.map((file) => ({
              name: file.name,
              url: file.ufsUrl ?? file.url,
              key: file.key,
            })),
          ),
        );
        handleSaveResult(data, true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Upload finished but saving the submission failed.",
        );
      } finally {
        setSubmitting(false);
      }
    },
    onUploadError: (err) => {
      setError(err.message);
      setSubmitting(false);
    },
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setError(null);

    if (!profile) return;

    if (profile.filesRequired && files.length === 0) {
      setError("Please select at least one file to upload.");
      return;
    }

    setSubmitting(true);

    if (files.length === 0) {
      try {
        const data = await saveIntake(buildPayload([]));
        handleSaveResult(data, false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to save submission.",
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }

    await startUpload(files, {
      sessionId: sessionId || undefined,
      email: email.trim() || undefined,
    });
  }

  if (!orderLoaded) {
    return null;
  }

  if (productType === "premade_preset") {
    return (
      <RecessedWell className="p-6 sm:p-8">
        <p className={`${labelDimClass} text-xs-accent-bright/70`}>
          No intake required
        </p>
        <p className={`mt-3 text-sm ${bodyClass}`}>
          Premade preset orders are delivered by email. No file upload is
          needed. Check your inbox for download instructions.
        </p>
      </RecessedWell>
    );
  }

  if (!profile) return null;

  const busy = isUploading || submitting;

  return (
    <RecessedWell className="overflow-hidden">
      <ModuleHeader label={profile.moduleLabel} />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 p-5 sm:p-6 lg:p-8"
      >
        {orderLinked && (
          <div className="rounded-[2px] border border-xs-accent/25 bg-xs-accent/5 px-4 py-3">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-xs-accent-bright/90">
              Checkout session linked
            </p>
            <p className={`mt-1 text-sm ${bodyClass}`}>
              Order details prefilled from your payment. Confirm everything
              before submitting.
            </p>
          </div>
        )}

        <IntakeSection
          moduleId="01 · CLIENT"
          title="Client Identity"
          description="Who we should contact and how this intake ties to your order."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="name" label="Name">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Artist or client name"
                className={fieldClass}
              />
            </FormField>

            <FormField
              id="email"
              label="Email"
              hint="Must match your Stripe checkout email when no session is linked."
            >
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@email.com"
                className={fieldClass}
              />
            </FormField>
          </div>

          {sessionId ? (
            <FormField
              id="session-id"
              label="Order / Session ID"
              hint="Linked automatically from checkout."
            >
              <input
                id="session-id"
                name="sessionId"
                type="text"
                readOnly
                value={sessionId}
                className={readOnlyClass}
              />
            </FormField>
          ) : null}
        </IntakeSection>

        {(profile.showServiceType ||
          profile.showVocalStyle ||
          profile.showPlugins ||
          profile.showBpmKey) && (
          <IntakeSection
            moduleId="02 · SPECS"
            title={
              profile.showVocalStyle ? "Preset Details" : "Session Specs"
            }
            description={
              profile.showVocalStyle
                ? "Your vocal style and plugin setup so the chain can be built correctly."
                : "Technical details that help set direction before processing."
            }
          >
            <div
              className={`grid gap-5 ${profile.showBpmKey ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
            >
              {profile.showServiceType && (
                <FormField id="service-type" label="Service Type">
                  <select
                    id="service-type"
                    name="serviceType"
                    required
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className={`${fieldClass} cursor-pointer`}
                  >
                    <option value="" disabled className="bg-[#0b0b0f]">
                      Select service
                    </option>
                    {PRODUCT_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-[#0b0b0f]"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FormField>
              )}

              {profile.showVocalStyle && (
                <FormField
                  id="vocal-style"
                  label="Vocal Style"
                  hint="Genre, tone, delivery. e.g. melodic trap, gritty rock."
                >
                  <input
                    id="vocal-style"
                    name="vocalStyle"
                    type="text"
                    required
                    value={vocalStyle}
                    onChange={(e) => setVocalStyle(e.target.value)}
                    placeholder="Melodic trap, airy R&B…"
                    className={fieldClass}
                  />
                </FormField>
              )}

              {profile.showPlugins && (
                <FormField
                  id="plugins"
                  label="Plugins Available"
                  hint="Stock FL plugins, third-party chains, etc."
                >
                  <input
                    id="plugins"
                    name="pluginsAvailable"
                    type="text"
                    required
                    value={pluginsAvailable}
                    onChange={(e) => setPluginsAvailable(e.target.value)}
                    placeholder="FL stock, FabFilter, Waves…"
                    className={fieldClass}
                  />
                </FormField>
              )}

              {profile.showBpmKey && (
                <>
                  <FormField
                    id="bpm"
                    label="BPM (optional)"
                    hint="e.g. 140 or 128 to 132"
                  >
                    <input
                      id="bpm"
                      name="bpm"
                      type="text"
                      value={bpm}
                      onChange={(e) => setBpm(e.target.value)}
                      placeholder="140"
                      className={fieldClass}
                    />
                  </FormField>

                  <FormField
                    id="track-key"
                    label="Key (optional)"
                    hint="e.g. Am, F# minor"
                  >
                    <input
                      id="track-key"
                      name="trackKey"
                      type="text"
                      value={trackKey}
                      onChange={(e) => setTrackKey(e.target.value)}
                      placeholder="Key signature"
                      className={fieldClass}
                    />
                  </FormField>
                </>
              )}
            </div>
          </IntakeSection>
        )}

        {profile.showReference && (
          <IntakeSection
            moduleId="03 · REFS"
            title="References"
            description="Optional sonic targets or loudness notes."
          >
            <FormField
              id="reference-notes"
              label={profile.referenceLabel}
              hint={profile.referenceHint}
            >
              <textarea
                id="reference-notes"
                name="referenceNotes"
                rows={4}
                value={referenceNotes}
                onChange={(e) => setReferenceNotes(e.target.value)}
                placeholder="Sounds like… / Target: … / Link: …"
                className={`${fieldClass} min-h-[6rem] resize-y`}
              />
            </FormField>
          </IntakeSection>
        )}

        <IntakeSection
          moduleId={profile.showReference ? "04 · NOTES" : "03 · NOTES"}
          title="Session Notes"
          description="Anything else we should know before starting."
        >
          <FormField
            id="general-notes"
            label={profile.notesLabel}
            hint={profile.notesHint}
          >
            <textarea
              id="general-notes"
              name="generalNotes"
              rows={5}
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Session details, delivery notes, creative direction…"
              className={`${fieldClass} min-h-[8rem] resize-y`}
            />
          </FormField>
        </IntakeSection>

        <IntakeSection
          moduleId={profile.showReference ? "05 · FILES" : "04 · FILES"}
          title="Source Files"
          description={
            profile.filesRequired
              ? "Upload the files needed to start your session."
              : "Upload only if you want us to hear your raw takes first."
          }
        >
          <FormField
            id="file"
            label={profile.filesLabel}
            hint={profile.filesHint}
          >
            <input
              id="file"
              name="file"
              type="file"
              required={profile.filesRequired}
              multiple
              accept=".wav,.zip,.aiff,.mp3,audio/*,application/zip"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              className={`${fieldClass} cursor-pointer file:mr-4 file:rounded-[2px] file:border-0 file:bg-xs-accent/20 file:px-3 file:py-1.5 file:font-mono file:text-[0.65rem] file:uppercase file:tracking-wider file:text-xs-accent-bright hover:file:bg-xs-accent/30`}
            />
            {files.length > 0 && (
              <p className="font-mono text-[0.65rem] uppercase tracking-wider text-white/35">
                Queued: {files.map((file) => file.name).join(", ")}
              </p>
            )}
          </FormField>
        </IntakeSection>

        <div className="border-t border-white/[0.06] pt-6">
          <button
            type="submit"
            disabled={busy}
            className={`group/control flex w-full max-w-sm flex-col gap-1.5 disabled:cursor-not-allowed disabled:opacity-60 ${transitionSmooth}`}
          >
            <PluginButtonShell variant="primary" moduleId="SUBMIT" disabled={busy}>
              {busy ? "Submitting…" : profile.submitLabel}
            </PluginButtonShell>
          </button>
        </div>

        {status && (
          <p className={`text-sm text-emerald-400/90 ${bodyClass}`} role="status">
            {status}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-400/90" role="alert">
            {error}
          </p>
        )}
      </form>
    </RecessedWell>
  );
}
