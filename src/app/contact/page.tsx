import type { Metadata } from "next";
import {
  CONTACT_EMAIL,
  ContactForm,
} from "@/components/contact-form";
import { RecessedWell } from "@/components/console-ui";
import { SitePage } from "@/components/site-page";
import { bodyClass, labelDimClass } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Contact | Xsycho Labs",
  description:
    "Book mixing, mastering, or preset services. Send a project inquiry or reach out directly.",
};

export default function ContactPage() {
  return (
    <SitePage eyebrow="Connect" title="Contact" wide>
      <div className="flex flex-col gap-10">
        <p className={`text-pretty ${bodyClass} sm:text-base`}>
          Fill out the form below for mixing, mastering, or preset requests. I
          respond to serious inquiries within a few business days.
        </p>

        <ContactForm />

        <RecessedWell className="p-6 sm:p-8">
          <p className={`${labelDimClass} text-xs-accent-bright/70`}>
            Direct Contact
          </p>
          <p className={`mt-3 ${bodyClass}`}>
            Prefer email? Reach me directly for bookings and project questions.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-4 inline-flex items-center gap-2 font-mono text-sm text-xs-accent-bright transition-colors hover:text-xs-accent"
          >
            {CONTACT_EMAIL}
            <span aria-hidden className="text-white/30">
              →
            </span>
          </a>
          <ul className={`mt-6 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-sm leading-relaxed ${bodyClass}`}>
            {[
              "Project type and goals",
              "Reference tracks or links",
              "Timeline and budget range",
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
