import { resend } from "@/lib/email";
import { recordOrderFromStripeSession } from "@/lib/orders";
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret is not configured" },
      { status: 500 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid webhook payload";
    console.error("[stripe/webhook] signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await recordOrderFromStripeSession(session.id);

      const email = session.customer_details?.email;
      if (email) {
        const baseUrl =
          process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "") ||
          "https://xsycholabs.com";
        const submitUrl = `${baseUrl}/submit-files?session_id=${encodeURIComponent(session.id)}`;

        try {
          await resend.emails.send({
            from: "Xsycho Labs <orders@xsycholabs.com>",
            to: email,
            subject: "We received your order 🎧",
            html: `
  <div style="background:#050505;color:#ffffff;padding:32px;font-family:Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;border:1px solid #7e22ce;border-radius:16px;padding:28px;background:#0b0b0f;">
      <h1 style="margin:0 0 12px;font-size:28px;">Xsycho Labs</h1>
      <p style="color:#c084fc;margin:0 0 24px;">Order confirmed</p>

      <h2 style="font-size:22px;margin-bottom:12px;">Thanks for your order 🎧</h2>

      <p style="line-height:1.6;color:#d4d4d8;">
        We received your payment. The next step is to upload your files so we can start processing your order.
      </p>

      <a href="${submitUrl}" style="display:inline-block;margin:24px 0;padding:14px 22px;background:#a855f7;color:white;text-decoration:none;border-radius:10px;font-weight:bold;">
        Upload Your Files
      </a>

      <div style="margin-top:28px;padding-top:20px;border-top:1px solid #27272a;color:#a1a1aa;font-size:14px;">
        <p>What to include:</p>
        <ul>
          <li>Stems or vocal files</li>
          <li>BPM and key if available</li>
          <li>Reference tracks or notes</li>
        </ul>
      </div>

      <p style="margin-top:28px;color:#71717a;font-size:13px;">
        Xsycho Labs — Mixing, Mastering & Custom Presets
      </p>
    </div>
  </div>
`,
          });
        } catch (emailErr) {
          console.error("[stripe/webhook] order email failed", emailErr);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook handler failed";
    console.error("[stripe/webhook]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
