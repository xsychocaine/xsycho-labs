import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

/** Server-side catalog — product slug must match checkout button + Stripe metadata */
const PRODUCTS: Record<
  string,
  { name: string; unitAmount: number; cancelPath: string }
> = {
  mixing_service: {
    name: "Mixing",
    unitAmount: 1500,
    cancelPath: "/services",
  },
  mastering_service: {
    name: "Mastering",
    unitAmount: 1000,
    cancelPath: "/services",
  },
  mix_master_bundle: {
    name: "Mix + Master Bundle",
    unitAmount: 2000,
    cancelPath: "/services",
  },
  vocal_preset: {
    name: "Fully Custom Vocal Preset",
    unitAmount: 2500,
    cancelPath: "/presets",
  },
  vocal_preset_starter_fl: {
    name: "Xsycho Vocal Starter Chain, FL Stock Edition",
    unitAmount: 1000,
    cancelPath: "/presets",
  },
  vocal_preset_starter_premium: {
    name: "Xsycho Vocal Starter Chain, Premium Edition",
    unitAmount: 2000,
    cancelPath: "/presets",
  },
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { product?: unknown };
    const product =
      typeof body.product === "string" ? body.product.trim() : "";

    if (!product) {
      return NextResponse.json({ error: "product is required" }, { status: 400 });
    }

    const catalog = PRODUCTS[product];
    if (!catalog) {
      return NextResponse.json({ error: "Unknown product" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "");
    if (!baseUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_URL is not configured" },
        { status: 500 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: catalog.name },
            unit_amount: catalog.unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        product,
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${catalog.cancelPath}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
