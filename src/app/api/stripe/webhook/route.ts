import { resend } from "@/lib/email";
import {
  buildOrderConfirmationEmail,
  resolveProductSlugFromSession,
} from "@/lib/order-emails";
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
        const productSlug = resolveProductSlugFromSession(session);
        const { subject, html } = buildOrderConfirmationEmail({
          productSlug,
          baseUrl,
          submitUrl,
        });

        try {
          await resend.emails.send({
            from: "Xsycho Labs <orders@xsycholabs.com>",
            to: email,
            subject,
            html,
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
