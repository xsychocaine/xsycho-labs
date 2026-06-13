"use client";

import { useState } from "react";
import { PluginButtonShell } from "@/components/console-ui";
import { transitionSmooth } from "@/lib/design-tokens";

type CheckoutButtonProps = {
  product: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  moduleId?: string;
  className?: string;
};

export function CheckoutButton({
  product,
  children,
  variant = "primary",
  moduleId,
  className = "",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error(data.error ?? "No checkout URL returned");
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err instanceof Error ? err.message : "Checkout failed. Please try again.",
      );
      setLoading(false);
    }
  }

  return (
    <div className={`flex w-full flex-col gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={handleBuy}
        disabled={loading}
        className={`group/control flex w-full flex-col gap-1.5 text-left disabled:cursor-not-allowed disabled:opacity-60 ${transitionSmooth}`}
      >
        <PluginButtonShell
          variant={variant}
          moduleId={moduleId}
          disabled={loading}
        >
          {loading ? "Processing…" : children}
        </PluginButtonShell>
      </button>
      {error && (
        <p className="px-0.5 text-xs text-red-400/90" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
