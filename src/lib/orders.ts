import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProductType, resolveProductId } from "@/lib/products";
import type { ProductType } from "@/lib/product-types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export type SubmissionFile = {
  name: string;
  url: string;
  key?: string;
};

function normalizeFileUrls(value: unknown): SubmissionFile[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const file = item as Record<string, unknown>;
    const name = typeof file.name === "string" ? file.name : "";
    const url = typeof file.url === "string" ? file.url : "";
    const key = typeof file.key === "string" ? file.key : undefined;
    if (!name || !url) return [];
    return [{ name, url, key }];
  });
}

export async function attachFileToOrder(input: {
  sessionId?: string;
  email?: string;
  file: SubmissionFile;
}) {
  const sessionId = input.sessionId?.trim();
  const email = input.email?.trim().toLowerCase();

  if (!sessionId && !email) {
    console.warn("[orders] attachFileToOrder: missing sessionId and email");
    return null;
  }

  const supabase = createAdminClient();
  const fileEntry = {
    name: input.file.name,
    url: input.file.url,
    key: input.file.key ?? null,
  };

  let order: { id: string; file_urls: unknown } | null = null;

  if (sessionId) {
    const { data, error } = await supabase
      .from("orders")
      .select("id, file_urls")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    order = data;
  } else if (email) {
    const { data, error } = await supabase
      .from("orders")
      .select("id, file_urls")
      .eq("email", email)
      .eq("files_submitted", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    order = data;
  }

  if (!order) {
    console.warn("[orders] attachFileToOrder: no matching order", {
      sessionId,
      email,
    });
    return null;
  }

  const fileUrls = [...normalizeFileUrls(order.file_urls), fileEntry];

  const { error: updateError } = await supabase
    .from("orders")
    .update({ file_urls: fileUrls, files_submitted: true })
    .eq("id", order.id);

  if (updateError) throw new Error(updateError.message);

  return order.id;
}

export async function recordOrderFromStripeSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new Error("Checkout session is not paid");
  }

  const email =
    session.customer_details?.email?.trim() ||
    session.customer_email?.trim() ||
    "";

  const product = resolveProductId(session.metadata?.product?.trim() || "unknown");
  const productType: ProductType =
    (session.metadata?.product_type?.trim() as ProductType | undefined) ||
    getProductType(product);

  if (!email) {
    throw new Error("No customer email on checkout session");
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .upsert(
      {
        email: email.toLowerCase(),
        product,
        product_type: productType,
        stripe_session_id: session.id,
        files_submitted: false,
      },
      { onConflict: "stripe_session_id" },
    )
    .select("id, email, product, product_type")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function saveSubmission(input: {
  email: string;
  name: string;
  files: SubmissionFile[];
  sessionId?: string;
  serviceType?: string | null;
  bpm?: string | null;
  trackKey?: string | null;
  referenceNotes?: string | null;
  generalNotes?: string | null;
  vocalStyle?: string | null;
  pluginsAvailable?: string | null;
  notes?: string | null;
}) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const sessionId = input.sessionId?.trim();
  const supabase = createAdminClient();

  let order: { id: string; product: string; product_type: string | null } | null =
    null;

  if (sessionId) {
    const { data, error } = await supabase
      .from("orders")
      .select("id, product, product_type")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    order = data;
  }

  if (!order) {
    const { data, error } = await supabase
      .from("orders")
      .select("id, product, product_type")
      .eq("email", normalizedEmail)
      .eq("files_submitted", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    order = data;
  }

  const serviceType =
    input.serviceType?.trim() ||
    (order?.product ? order.product : null);

  const generalNotes =
    input.generalNotes?.trim() || input.notes?.trim() || null;

  const { data: submission, error: submissionError } = await supabase
    .from("submissions")
    .insert({
      email: normalizedEmail,
      name: input.name.trim(),
      notes: generalNotes,
      session_id: sessionId ?? null,
      service_type: serviceType,
      bpm: input.bpm?.trim() || null,
      track_key: input.trackKey?.trim() || null,
      reference_notes: input.referenceNotes?.trim() || null,
      general_notes: generalNotes,
      vocal_style: input.vocalStyle?.trim() || null,
      plugins_available: input.pluginsAvailable?.trim() || null,
      files: input.files,
      order_id: order?.id ?? null,
    })
    .select("id, order_id")
    .single();

  if (submissionError) {
    throw new Error(submissionError.message);
  }

  if (order?.id) {
    const update: {
      files_submitted: boolean;
      file_urls?: { name: string; url: string; key: string | null }[];
    } = { files_submitted: true };

    if (input.files.length > 0) {
      update.file_urls = input.files.map((file) => ({
        name: file.name,
        url: file.url,
        key: file.key ?? null,
      }));
    }

    await supabase.from("orders").update(update).eq("id", order.id);
  }

  return {
    submissionId: submission.id,
    matched: Boolean(order?.id),
    product: order?.product ?? null,
    productType: order?.product_type ?? null,
  };
}
