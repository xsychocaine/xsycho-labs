import type { Metadata } from "next";
import { Suspense } from "react";
import { SitePage } from "@/components/site-page";
import { SuccessPanel } from "@/components/success-experience";

export const metadata: Metadata = {
  title: "Payment Successful | Xsycho Labs",
  description:
    "Your checkout is complete. Follow the next steps for your order type.",
};

export default function Success() {
  return (
    <SitePage
      eyebrow="Checkout Complete"
      title="Payment Successful"
      description="Your order is confirmed. Next steps depend on what you purchased."
      wide
    >
      <Suspense fallback={null}>
        <SuccessPanel />
      </Suspense>
    </SitePage>
  );
}
