import type { Metadata } from "next";
import { Suspense } from "react";
import { ModuleHeader, RecessedWell } from "@/components/console-ui";
import { SitePage } from "@/components/site-page";
import { SuccessActions } from "@/components/success-actions";
import { SuccessOrderRecord } from "@/components/success-order-record";
import { bodyClass, labelDimClass } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Payment Successful | Xsycho Labs",
  description:
    "Your checkout is complete. Complete your session intake so mixing, mastering, or preset work can begin.",
};

const intakeSteps = [
  "Confirm your name, email, and linked order",
  "Add BPM, key, and service details",
  "Share reference tracks and production notes",
  "Upload stems, vocals, or project files",
];

export default function Success() {
  return (
    <SitePage
      eyebrow="Checkout Complete"
      title="Payment Successful"
      description="Your order is confirmed. Complete the session intake next — it's the studio handoff that kicks off your project."
      wide
    >
      <div className="flex flex-col gap-10">
        <RecessedWell className="overflow-hidden">
          <ModuleHeader label="OUT · CONFIRM" />
          <div className="flex flex-col gap-6 p-5 sm:p-6 lg:p-8">
            <p className={`text-pretty ${bodyClass} sm:text-base`}>
              Payment processed. Your checkout session will carry over to the
              intake form so your order, service type, and files stay linked.
            </p>

            <Suspense fallback={null}>
              <SuccessOrderRecord />
            </Suspense>

            <div className="rounded-[2px] border border-white/[0.06] bg-xs-inset/40 p-4 sm:p-5">
              <p className={`${labelDimClass} text-xs-accent-bright/70`}>
                Next step · Session intake
              </p>
              <ul className={`mt-3 flex flex-col gap-2.5 text-sm ${bodyClass}`}>
                {intakeSteps.map((step) => (
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

            <Suspense fallback={null}>
              <SuccessActions />
            </Suspense>
          </div>
        </RecessedWell>

        <RecessedWell className="p-6 sm:p-8">
          <p className={`${labelDimClass} text-xs-accent-bright/70`}>
            Studio workflow
          </p>
          <ul
            className={`mt-4 flex flex-col gap-3 text-sm leading-relaxed ${bodyClass}`}
          >
            {[
              "Intake received and matched to your order",
              "Specs reviewed, then processing begins",
              "Finished deliverables sent by email",
            ].map((item) => (
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
      </div>
    </SitePage>
  );
}
