import { createAdminClient } from "@/lib/supabase/admin";
import {
  formatProduct,
  getProductConfig,
  getProductType,
  productRequiresIntake,
  resolveProductDownloadUrl,
  resolveProductId,
} from "@/lib/products";
import type { ProductType } from "@/lib/product-types";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("session_id")?.trim();

  if (!sessionId) {
    return NextResponse.json(
      { error: "session_id is required" },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("email, product, product_type, stripe_session_id")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    if (!data) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const productId = resolveProductId(data.product);
    const productType =
      (data.product_type as ProductType | null) ?? getProductType(productId);
    const config = getProductConfig(productId);
    const baseUrl = process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "") ?? "";

    return NextResponse.json({
      email: data.email,
      product: productId,
      productName: formatProduct(productId),
      productType,
      requiresIntake: config?.requiresIntake ?? productRequiresIntake(productId),
      downloadUrl: resolveProductDownloadUrl(productId, baseUrl),
      sessionId: data.stripe_session_id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lookup failed";
    console.error("[orders/lookup]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
