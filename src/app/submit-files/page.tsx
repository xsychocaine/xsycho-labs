import type { Metadata } from "next";
import { Suspense } from "react";
import { RecessedWell } from "@/components/console-ui";
import { SitePage } from "@/components/site-page";
import { SubmitFilesForm } from "@/components/submit-files-form";
import { bodyClass, labelDimClass } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Submit Files | Xsycho Labs",
  description:
    "Submit your project files after checkout so your mix, master, or preset session can begin.",
};

export default function SubmitFilesPage() {
  return (
    <SitePage
      eyebrow="Post-Checkout"
      title="Submit Your Files"
      description="Upload your stems, vocals, or references so we can start on your track."
      wide
    >
      <div className="flex flex-col gap-10">
        <p className={`text-pretty ${bodyClass} sm:text-base`}>
          Complete this form after payment. Include session notes and your
          project files. WAV or ZIP uploads work best.
        </p>

        <Suspense fallback={null}>
          <SubmitFilesForm />
        </Suspense>

        <RecessedWell className="p-6 sm:p-8">
          <p className={`${labelDimClass} text-xs-accent-bright/70`}>
            What happens next
          </p>
          <ul className={`mt-4 flex flex-col gap-3 text-sm leading-relaxed ${bodyClass}`}>
            {[
              "We receive your files and session notes",
              "Your mix, master, or preset work begins",
              "You receive your finished deliverables by email",
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
          <p className={`mt-6 border-t border-white/[0.06] pt-4 text-sm ${bodyClass}`}>
            Supported: WAV, MP3, AIFF, and ZIP project folders.
          </p>
        </RecessedWell>
      </div>
    </SitePage>
  );
}
