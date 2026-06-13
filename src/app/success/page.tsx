import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ModuleHeader,
  RecessedWell,
} from "@/components/console-ui";
import { SitePage } from "@/components/site-page";
import { SuccessActions } from "@/components/success-actions";
import { SuccessOrderRecord } from "@/components/success-order-record";
import { bodyClass, labelDimClass } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Payment Successful | Xsycho Labs",
  description:
    "Your checkout is complete. Submit your project files so your mix, master, or preset session can begin.",
};

const nextSteps = [
  "We receive your files and session notes",
  "Your mix, master, or preset work begins",
  "You receive your finished deliverables by email",
];

export default function Success() {
  return (
    <SitePage
      eyebrow="Checkout Complete"
      title="Payment Successful"
      description="Your order is confirmed. Upload your stems or project files next so we can start on your track."
      wide
    >
      <div className="flex flex-col gap-10">
        <RecessedWell className="overflow-hidden">
          <ModuleHeader label="OUT · CONFIRM" />
          <div className="flex flex-col gap-6 p-5 sm:p-6 lg:p-8">
            <p className={`text-pretty ${bodyClass} sm:text-base`}>
              Stripe has processed your payment. Continue below to upload your
              files — your checkout session is linked automatically.
            </p>

            <Suspense fallback={null}>
              <SuccessOrderRecord />
            </Suspense>

            <Suspense fallback={null}>
              <SuccessActions />
            </Suspense>
          </div>
        </RecessedWell>

        <RecessedWell className="p-6 sm:p-8">
          <p className={`${labelDimClass} text-xs-accent-bright/70`}>
            What happens next
          </p>
          <ul
            className={`mt-4 flex flex-col gap-3 text-sm leading-relaxed ${bodyClass}`}
          >
            {nextSteps.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-xs-accent/80"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
          <p
            className={`mt-6 border-t border-white/[0.06] pt-4 text-sm ${bodyClass}`}
          >
            Questions about your order? Reach out via the contact page and
            include your checkout email.
          </p>
        </RecessedWell>
      </div>
    </SitePage>
  );
}
