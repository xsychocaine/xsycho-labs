"use client";

import { useState } from "react";
import { PluginButtonShell } from "@/components/console-ui";
import { transitionSmooth } from "@/lib/design-tokens";

type CheckoutButtonProps = {
  productName: string;
  price: number;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  moduleId?: string;
  className?: string;
};

export function CheckoutButton({
  productName,
  price,
  children,
  variant = "primary",
  moduleId,
  className = "",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, price }),
        redirect: "manual",
      });

      if (response.status === 303) {
        const location = response.headers.get("Location");
        if (location) {
          window.location.href = location;
          return;
        }
      }

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      throw new Error(data?.error ?? "Checkout failed. Please try again.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setLoading(false);
    }
  }

  return (
    <div className={`flex w-full flex-col gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={handleCheckout}
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
