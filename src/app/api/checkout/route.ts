import { NextResponse } from "next/server";
import { getProductConfig } from "@/lib/products";
import { createCheckoutSession } from "@/lib/stripe-checkout";

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

    const session = await createCheckoutSession(catalog.id, baseUrl);

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
