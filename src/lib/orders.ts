import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export type SubmissionFile = {
  name: string;
  url: string;
  key?: string;
};

export async function recordOrderFromStripeSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new Error("Checkout session is not paid");
  }

  const email =
    session.customer_details?.email?.trim() ||
    session.customer_email?.trim() ||
    "";

  const product = session.metadata?.product?.trim() || "unknown";

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
        stripe_session_id: session.id,
        files_submitted: false,
      },
      { onConflict: "stripe_session_id" },
    )
    .select("id, email, product")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function saveSubmission(input: {
  email: string;
  name: string;
  notes?: string | null;
  files: SubmissionFile[];
}) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, product")
    .eq("email", normalizedEmail)
    .eq("files_submitted", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: submission, error: submissionError } = await supabase
    .from("submissions")
    .insert({
      email: normalizedEmail,
      name: input.name.trim(),
      notes: input.notes?.trim() || null,
      files: input.files,
      order_id: order?.id ?? null,
    })
    .select("id, order_id")
    .single();

  if (submissionError) {
    throw new Error(submissionError.message);
  }

  if (order?.id) {
    await supabase
      .from("orders")
      .update({ files_submitted: true })
      .eq("id", order.id);
  }

  return {
    submissionId: submission.id,
    matched: Boolean(order?.id),
    product: order?.product ?? null,
  };
}
