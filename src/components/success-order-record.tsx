"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { bodyClass } from "@/lib/design-tokens";

type RecordState = "idle" | "loading" | "success" | "error";

export function SuccessOrderRecord() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [state, setState] = useState<RecordState>(
    sessionId ? "loading" : "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    fetch("/api/orders/record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(data?.error ?? "Could not save order");
        }

        setState("success");
        setMessage(
          "Order confirmed and saved. Continue to file upload when you're ready.",
        );
      })
      .catch((err: unknown) => {
        console.error("[success] order record failed", err);
        setState("error");
        setMessage(
          "Payment received. If file matching fails, use the same email on the submit page.",
        );
      });
  }, [sessionId]);

  if (!message) return null;

  return (
    <p
      className={`text-sm ${bodyClass} ${
        state === "success"
          ? "text-emerald-400/90"
          : state === "error"
            ? "text-amber-400/90"
            : "text-white/50"
      }`}
      role="status"
    >
      {message}
    </p>
  );
}
