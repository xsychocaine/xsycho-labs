"use client";

import { RecessedWell } from "@/components/console-ui";
import {
  getIntakeChecklist,
  getIntakePageCopy,
  getProductType,
  type ProductType,
} from "@/lib/product-types";
import { bodyClass, labelDimClass } from "@/lib/design-tokens";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function SubmitFilesIntro() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id")?.trim() || "";
  const [productType, setProductType] = useState<ProductType>("mixing");

  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/orders/lookup?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        if (!res.ok) return null;
        return res.json() as Promise<{
          product?: string;
          productType?: ProductType;
        }>;
      })
      .then((data) => {
        if (!data) return;
        setProductType(
          data.productType ?? getProductType(data.product ?? "mixing"),
        );
      })
      .catch(() => {});
  }, [sessionId]);

  if (productType === "premade_preset") {
    return (
      <RecessedWell className="p-6 sm:p-8">
        <p className={`${labelDimClass} text-xs-accent-bright/70`}>
          Premade preset order
        </p>
        <p className={`mt-4 text-sm leading-relaxed ${bodyClass}`}>
          This order type does not require intake. Your preset delivery
          instructions were sent to your checkout email.
        </p>
      </RecessedWell>
    );
  }

  const copy = getIntakePageCopy(productType);
  const checklist = getIntakeChecklist(productType);

  return (
    <RecessedWell className="p-6 sm:p-8">
      <p className={`${labelDimClass} text-xs-accent-bright/70`}>
        {copy.eyebrow}
      </p>
      <p className={`mt-4 text-sm leading-relaxed ${bodyClass}`}>
        {copy.description}
      </p>
      <p className={`mt-6 ${labelDimClass} text-xs-accent-bright/70`}>
        Intake checklist
      </p>
      <ul className={`mt-4 flex flex-col gap-3 text-sm leading-relaxed ${bodyClass}`}>
        {checklist.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span
              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-xs-accent/80"
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
    </RecessedWell>
  );
}
