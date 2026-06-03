import { getSiteUrl, getStripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

type CheckoutBody = {
  productName?: unknown;
  price?: unknown;
};

const MIN_USD = 0.5;
const MAX_USD = 10_000;

function parseCheckoutBody(body: CheckoutBody) {
  if (typeof body.productName !== "string" || !body.productName.trim()) {
    return { error: "productName is required" as const };
  }

  if (typeof body.price !== "number" || !Number.isFinite(body.price)) {
    return { error: "price must be a number (USD)" as const };
  }

  if (body.price < MIN_USD || body.price > MAX_USD) {
    return {
      error: `price must be between $${MIN_USD} and $${MAX_USD}` as const,
    };
  }

  const productName = body.productName.trim().slice(0, 120);
  const unitAmount = Math.round(body.price * 100);

  if (unitAmount < 50) {
    return { error: "price is below Stripe minimum ($0.50 USD)" as const };
  }

  return { productName, unitAmount };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const parsed = parseCheckoutBody(body);

    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const stripe = getStripe();
    const siteUrl = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: parsed.unitAmount,
            product_data: {
              name: parsed.productName,
            },
          },
        },
      ],
      success_url: `${siteUrl}/presets?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/presets?checkout=cancel`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 },
      );
    }

    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("[checkout]", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (
      error instanceof Error &&
      error.message.includes("is not configured")
    ) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Unable to start checkout" },
      { status: 500 },
    );
  }
}
