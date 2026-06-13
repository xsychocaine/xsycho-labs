import { recordOrderFromStripeSession } from "@/lib/orders";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { sessionId?: unknown };

    if (typeof body.sessionId !== "string" || !body.sessionId.trim()) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 },
      );
    }

    const order = await recordOrderFromStripeSession(body.sessionId.trim());

    return NextResponse.json({ ok: true, order });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to record order";
    console.error("[orders/record]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
