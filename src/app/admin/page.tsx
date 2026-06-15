import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminDashboard } from "@/components/admin-dashboard";
import { SitePage } from "@/components/site-page";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin | Xsycho Labs",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return (
      <SitePage
        eyebrow="Internal"
        title="Admin Access"
        description="Restricted area for order management."
        wide
      >
        <AdminLoginForm />
      </SitePage>
    );
  }

  return (
    <SitePage
      eyebrow="Internal"
      title="Dashboard"
      description="Order metrics, product breakdown, and submission status."
      wide
    >
      <AdminDashboard />
    </SitePage>
  );
}
