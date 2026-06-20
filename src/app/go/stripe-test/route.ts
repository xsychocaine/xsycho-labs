import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe-checkout";

const TEST_PRODUCT_ID = "stripe_live_test";

/** Hidden one-dollar checkout for live Stripe testing. Remove when done. */
export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "");
    if (!baseUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_URL is not configured" },
        { status: 500 },
      );
    }

    const session = await createCheckoutSession(TEST_PRODUCT_ID, baseUrl);

    if (!session.url) {
      return NextResponse.json(
        { error: "No checkout URL returned" },
        { status: 500 },
      );
    }

    return NextResponse.redirect(session.url);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
