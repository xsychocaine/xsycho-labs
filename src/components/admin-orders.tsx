import { ModuleHeader, RecessedWell } from "@/components/console-ui";
import { parseOrderFileUrls, type OrderFileRecord } from "@/lib/order-files";
import { supabase } from "@/lib/supabase";
import { bodyClass, labelDimClass } from "@/lib/design-tokens";

type OrderRow = {
  id: string;
  email: string;
  product: string;
  stripe_session_id: string;
  file_urls: unknown;
  files_submitted: boolean;
  created_at: string;
};

function protectedFileHref(orderId: string, index: number) {
  return `/admin/files/${orderId}?index=${index}`;
}

function OrderFileLinks({
  orderId,
  files,
}: {
  orderId: string;
  files: OrderFileRecord[];
}) {
  if (files.length === 0) {
    return <span className="text-white/35">Pending</span>;
  }

  const linkClass =
    "text-xs-accent-bright/90 underline-offset-2 hover:text-xs-accent-bright hover:underline";

  if (files.length === 1) {
    return (
      <a
        href={protectedFileHref(orderId, 0)}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        View file
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {files.map((file, index) => (
        <a
          key={`${file.url}-${index}`}
          href={protectedFileHref(orderId, index)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          View file {index + 1}
        </a>
      ))}
    </div>
  );
}

export async function AdminOrders() {
  const { data, error } = await supabase.from("orders").select("*");
  const orders = (data ?? []) as OrderRow[];

  return (
    <>
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
                  const files = parseOrderFileUrls(order.file_urls);

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
                        <OrderFileLinks orderId={order.id} files={files} />
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
    </>
  );
}
