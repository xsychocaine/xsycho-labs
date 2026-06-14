import type { Metadata } from "next";
import { Suspense } from "react";
import { RecessedWell } from "@/components/console-ui";
import { SitePage } from "@/components/site-page";
import { SubmitFilesForm } from "@/components/submit-files-form";
import { bodyClass, labelDimClass } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Session Intake | Xsycho Labs",
  description:
    "Complete your post-checkout session intake with project specs, references, and source files.",
};

const intakeChecklist = [
  "Client name and email",
  "Service type, BPM, and key",
  "Reference track notes",
  "Production notes and file uploads",
];

export default function SubmitFilesPage() {
  return (
    <SitePage
      eyebrow="Post-Checkout Intake"
      title="Session Intake Form"
      description="Professional intake for your mix, master, or preset session. Complete every section so processing can begin without delays."
      wide
    >
      <div className="flex flex-col gap-10">
        <RecessedWell className="p-6 sm:p-8">
          <p className={`${labelDimClass} text-xs-accent-bright/70`}>
            Intake checklist
          </p>
          <ul className={`mt-4 flex flex-col gap-3 text-sm leading-relaxed ${bodyClass}`}>
            {intakeChecklist.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-xs-accent/80"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
          <p className={`mt-6 text-sm ${bodyClass}`}>
            WAV or ZIP uploads preferred. Include as much session detail as
            possible — the more context, the faster we can dial in your sound.
          </p>
        </RecessedWell>

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
