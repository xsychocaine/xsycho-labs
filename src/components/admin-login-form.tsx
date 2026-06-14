"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleHeader, PluginButtonShell, RecessedWell } from "@/components/console-ui";
import { bodyClass, labelDimClass, transitionSmooth } from "@/lib/design-tokens";

const fieldClass =
  "w-full rounded-[2px] border border-white/[0.08] bg-xs-inset px-3 py-2.5 text-sm text-white shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] placeholder:text-white/25 focus:border-xs-accent/40 focus:outline-none focus:ring-1 focus:ring-xs-accent/25";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await res.json().catch(() => null)) as { error?: string } | null;

      if (!res.ok) {
        throw new Error(data?.error ?? "Authentication failed");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <RecessedWell className="mx-auto max-w-md overflow-hidden">
      <ModuleHeader label="AUTH · ADMIN" />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 p-5 sm:p-6 lg:p-8"
      >
        <p className={`text-sm ${bodyClass}`}>
          Enter the admin password to view orders.
        </p>

        <div className="flex flex-col gap-2">
          <label htmlFor="admin-password" className={labelDimClass}>
            Password
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className={fieldClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`group/control flex w-full max-w-xs flex-col gap-1.5 disabled:cursor-not-allowed disabled:opacity-60 ${transitionSmooth}`}
        >
          <PluginButtonShell variant="primary" moduleId="UNLOCK" disabled={loading}>
            {loading ? "Verifying…" : "Enter Admin"}
          </PluginButtonShell>
        </button>

        {error && (
          <p className="text-sm text-red-400/90" role="alert">
            {error}
          </p>
        )}
      </form>
    </RecessedWell>
  );
}
