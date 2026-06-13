"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function SuccessOrderRecord() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [note, setNote] = useState<string | null>(null);

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
      })
      .catch((err: unknown) => {
        console.error("[success] order record failed", err);
        setNote(
          "Payment received. If file matching fails, use the same email on the submit page.",
        );
      });
  }, [sessionId]);

  if (!note) return null;

  return (
    <p style={{ opacity: 0.7, marginTop: 16, fontSize: 14 }} role="status">
      {note}
    </p>
  );
}
