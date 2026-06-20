import type { Metadata } from "next";
import { Suspense } from "react";
import { RecessedWell } from "@/components/console-ui";
import { SitePage } from "@/components/site-page";
import { SubmitFilesForm } from "@/components/submit-files-form";
import { SubmitFilesIntro } from "@/components/submit-files-intro";
import { bodyClass, labelDimClass } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Session Intake | Xsycho Labs",
  description:
    "Complete your after checkout intake with project specs, references, and source files.",
};

export default function SubmitFilesPage() {
  return (
    <SitePage
      eyebrow="Post Checkout Intake"
      title="Session Intake Form"
      description="Complete the intake for your order so processing can begin without delays."
      wide
    >
      <div className="flex flex-col gap-10">
        <Suspense fallback={null}>
          <SubmitFilesIntro />
        </Suspense>

        <Suspense fallback={null}>
          <SubmitFilesForm />
        </Suspense>

        <RecessedWell className="p-6 sm:p-8">
          <p className={`${labelDimClass} text-xs-accent-bright/70`}>
            What happens next
          </p>
          <ul className={`mt-4 flex flex-col gap-3 text-sm leading-relaxed ${bodyClass}`}>
            {[
              "Your intake is logged and matched to your order",
              "Session specs are reviewed before processing",
              "Deliverables are sent to your email when complete",
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
