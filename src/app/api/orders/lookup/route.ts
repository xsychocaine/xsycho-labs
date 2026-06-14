import { createAdminClient } from "@/lib/supabase/admin";
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
      .select("email, product, stripe_session_id")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    if (!data) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      email: data.email,
      product: data.product,
      sessionId: data.stripe_session_id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lookup failed";
    console.error("[orders/lookup]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
