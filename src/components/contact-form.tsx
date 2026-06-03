"use client";

import { FormEvent, useState } from "react";
import { ModuleHeader, PluginButtonShell, RecessedWell } from "@/components/console-ui";
import { bodyClass, labelDimClass, transitionSmooth } from "@/lib/design-tokens";

export const CONTACT_EMAIL = "xsychocaine@gmail.com";

const services = ["Mixing", "Mastering", "Preset", "Other"] as const;

const fieldClass =
  "w-full rounded-[2px] border border-white/[0.08] bg-xs-inset px-3 py-2.5 text-sm text-white shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] placeholder:text-white/25 focus:border-xs-accent/40 focus:outline-none focus:ring-1 focus:ring-xs-accent/25";

function FormField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelDimClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const service = String(data.get("service") ?? "Other");
    const message = String(data.get("message") ?? "").trim();

    const subject = encodeURIComponent(
      `[${service}] Inquiry from ${name}`,
    );
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nService: ${service}\n\n${message}`,
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col gap-8">
      <RecessedWell className="overflow-hidden">
        <ModuleHeader label="IN · SESSION" />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-5 sm:p-6 lg:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="name" label="Name">
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
                className={fieldClass}
              />
            </FormField>

            <FormField id="email" label="Email">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={fieldClass}
              />
            </FormField>
          </div>

          <FormField id="service" label="Service">
            <select
              id="service"
              name="service"
              required
              defaultValue="Mixing"
              className={`${fieldClass} cursor-pointer appearance-none bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-10 [background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a855f7' stroke-width='1.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")]`}
            >
              {services.map((service) => (
                <option key={service} value={service} className="bg-xs-inset">
                  {service}
                </option>
              ))}
            </select>
          </FormField>

          <FormField id="message" label="Message">
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Project details, references, timeline, and budget range…"
              className={`${fieldClass} resize-y min-h-[8rem]`}
            />
          </FormField>

          <div className="border-t border-white/[0.06] pt-5">
            <button
              type="submit"
              className={`group/control flex w-full max-w-xs flex-col gap-1.5 ${transitionSmooth}`}
            >
              <PluginButtonShell variant="primary" moduleId="SEND">
                Submit Inquiry
              </PluginButtonShell>
            </button>
          </div>

          {submitted && (
            <p className={`text-sm ${bodyClass}`} role="status">
              Your email client should open with your message pre-filled. If it
              didn&apos;t, email me directly at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-xs-accent-bright hover:text-xs-accent"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          )}
        </form>
      </RecessedWell>
    </div>
  );
}
