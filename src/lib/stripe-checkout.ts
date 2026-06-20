import Stripe from "stripe";
import { getProductConfig, productPriceCents } from "@/lib/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export async function createCheckoutSession(productId: string, baseUrl: string) {
  const catalog = getProductConfig(productId);
  if (!catalog) {
    throw new Error("Unknown product");
  }

  return stripe.checkout.sessions.create({
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
}
