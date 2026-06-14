import { isAdminAuthenticated } from "@/lib/admin-auth";
import { parseOrderFileUrls } from "@/lib/order-files";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  const { orderId } = await params;
  const indexParam = new URL(req.url).searchParams.get("index") ?? "0";
  const index = Number.parseInt(indexParam, 10);

  if (!orderId || Number.isNaN(index) || index < 0) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("file_urls")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !order) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  const files = parseOrderFileUrls(order.file_urls);
  const file = files[index];

  if (!file?.url) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.redirect(file.url);
}
