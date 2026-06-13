import Link from "next/link";
import { Suspense } from "react";
import { SuccessOrderRecord } from "@/components/success-order-record";

export default function Success() {
  return (
    <div style={{ padding: 40, color: "white", background: "#050505", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 32, marginBottom: 10 }}>Payment Successful 🎉</h1>

      <p style={{ opacity: 0.8, marginBottom: 30 }}>
        Your order has been received. Now submit your files so we can start working on your track.
      </p>

      <Suspense fallback={null}>
        <SuccessOrderRecord />
      </Suspense>

      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <Link href="/submit-files">
          <button style={{ padding: 15, background: "#a855f7", color: "white", borderRadius: 8 }}>
            Upload Your Files
          </button>
        </Link>

        <Link href="/">
          <button style={{ padding: 15, background: "#222", color: "white", borderRadius: 8 }}>
            Back to Home
          </button>
        </Link>
      </div>

      <div style={{ marginTop: 40, opacity: 0.6 }}>
        <p>What happens next:</p>
        <ul>
          <li>We receive your files</li>
          <li>We process your mix/master</li>
          <li>You receive your finished track</li>
        </ul>
      </div>
    </div>
  );
}
