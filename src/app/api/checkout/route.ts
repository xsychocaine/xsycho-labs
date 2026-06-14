import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getProductConfig, productPriceCents } from "@/lib/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { product?: unknown };
    const product =
      typeof body.product === "string" ? body.product.trim() : "";

    if (!product) {
      return NextResponse.json({ error: "product is required" }, { status: 400 });
    }

    const catalog = getProductConfig(product);
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
            unit_amount: productPriceCents(catalog.id),
          },
          quantity: 1,
        },
      ],
      metadata: {
        product: catalog.id,
        product_type: catalog.productType,
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
