"use client";

import { FormEvent, useState } from "react";
import { ModuleHeader, PluginButtonShell, RecessedWell } from "@/components/console-ui";
import { useUploadThing } from "@/lib/uploadthing";
import { bodyClass, labelDimClass, transitionSmooth } from "@/lib/design-tokens";

const fieldClass =
  "w-full rounded-[2px] border border-white/[0.08] bg-xs-inset px-3 py-2.5 text-sm text-white shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] placeholder:text-white/25 focus:border-xs-accent/40 focus:outline-none focus:ring-1 focus:ring-xs-accent/25";

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

export function SubmitFilesForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("musicUploader", {
    onClientUploadComplete: async (uploaded) => {
      try {
        const res = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name,
            notes: notes.trim() || null,
            files: uploaded.map((file) => ({
              name: file.name,
              url: file.ufsUrl ?? file.url,
              key: file.key,
            })),
          }),
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

        setStatus(
          data.matched
            ? `Files submitted and matched to your ${data.product?.replace(/_/g, " ") ?? "order"}. We'll follow up by email.`
            : "Files submitted. We couldn't match an order to that email yet — double-check it matches your checkout email.",
        );
        setError(null);
        setFiles([]);
        setNotes("");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Upload finished but saving the submission failed.",
        );
      }
    },
    onUploadError: (err) => {
      setError(err.message);
    },
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setError(null);

    if (files.length === 0) {
      setError("Please select at least one file to upload.");
      return;
    }

    await startUpload(files);
  }

  return (
    <RecessedWell className="overflow-hidden">
      <ModuleHeader label="IN · FILES" />
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="Your name"
              className={fieldClass}
            />
          </FormField>

          <FormField
            id="email"
            label="Email"
            hint="Use the same email from your Stripe checkout so we can match your order."
          >
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Email (used to match order)"
              className={fieldClass}
            />
          </FormField>
        </div>

        <FormField
          id="notes"
          label="Session Notes"
          hint="BPM, key, style references, and anything I should know before starting."
        >
          <textarea
            id="notes"
            name="notes"
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Project details, references, delivery notes…"
            className={`${fieldClass} min-h-[8rem] resize-y`}
          />
        </FormField>

        <FormField
          id="file"
          label="Project Files"
          hint="WAV, MP3, AIFF, or ZIP. Up to 5 files, 64MB each (audio) or 128MB (ZIP)."
        >
          <input
            id="file"
            name="file"
            type="file"
            required
            multiple
            accept=".wav,.zip,.aiff,.mp3,audio/*,application/zip"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className={`${fieldClass} cursor-pointer file:mr-4 file:rounded-[2px] file:border-0 file:bg-xs-accent/20 file:px-3 file:py-1.5 file:font-mono file:text-[0.65rem] file:uppercase file:tracking-wider file:text-xs-accent-bright hover:file:bg-xs-accent/30`}
          />
          {files.length > 0 && (
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-white/35">
              Selected: {files.map((file) => file.name).join(", ")}
            </p>
          )}
        </FormField>

        <div className="border-t border-white/[0.06] pt-5">
          <button
            type="submit"
            disabled={isUploading}
            className={`group/control flex w-full max-w-xs flex-col gap-1.5 disabled:cursor-not-allowed disabled:opacity-60 ${transitionSmooth}`}
          >
            <PluginButtonShell variant="primary" moduleId="SEND" disabled={isUploading}>
              {isUploading ? "Uploading…" : "Submit Files"}
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
