import type { Metadata } from "next";
import { ModuleHeader, RecessedWell } from "@/components/console-ui";
import { SitePage } from "@/components/site-page";
import { supabase } from "@/lib/supabase";
import { bodyClass, labelDimClass } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Admin | Xsycho Labs",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type OrderRow = {
  id: string;
  email: string;
  product: string;
  stripe_session_id: string;
  file_urls: unknown;
  files_submitted: boolean;
  created_at: string;
};

export default async function AdminPage() {
  const { data, error } = await supabase.from("orders").select("*");

  const orders = (data ?? []) as OrderRow[];

  return (
    <SitePage
      eyebrow="Internal"
      title="Orders"
      description="Recent checkout orders and file submission status."
      wide
    >
      {error && (
        <p className="text-sm text-red-400/90" role="alert">
          Failed to load orders: {error.message}
        </p>
      )}

      <RecessedWell className="overflow-hidden">
        <ModuleHeader label="ORD · ADMIN" />
        <div className="overflow-x-auto p-5 sm:p-6 lg:p-8">
          {orders.length === 0 ? (
            <p className={`text-sm ${bodyClass}`}>No orders yet.</p>
          ) : (
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className={`border-b border-white/[0.08] ${labelDimClass}`}>
                  <th className="pb-3 pr-4 font-normal">Email</th>
                  <th className="pb-3 pr-4 font-normal">Product</th>
                  <th className="pb-3 pr-4 font-normal">Session</th>
                  <th className="pb-3 pr-4 font-normal">Files</th>
                  <th className="pb-3 font-normal">Created</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const fileCount = Array.isArray(order.file_urls)
                    ? order.file_urls.length
                    : 0;

                  return (
                    <tr
                      key={order.id}
                      className={`border-b border-white/[0.04] ${bodyClass}`}
                    >
                      <td className="py-3 pr-4 text-white/90">{order.email}</td>
                      <td className="py-3 pr-4 text-white/75">
                        {order.product.replace(/_/g, " ")}
                      </td>
                      <td className="py-3 pr-4 font-mono text-[0.65rem] text-white/45">
                        {order.stripe_session_id.slice(0, 18)}…
                      </td>
                      <td className="py-3 pr-4">
                        {order.files_submitted ? (
                          <span className="text-emerald-400/90">
                            {fileCount} uploaded
                          </span>
                        ) : (
                          <span className="text-white/35">Pending</span>
                        )}
                      </td>
                      <td className="py-3 text-white/45">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </RecessedWell>
    </SitePage>
  );
}
