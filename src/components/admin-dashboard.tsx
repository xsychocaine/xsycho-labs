import {
  ModuleHeader,
  RackFrame,
  RecessedWell,
} from "@/components/console-ui";
import {
  computeAdminStats,
  formatOrderDate,
  formatProduct,
  formatUsd,
  getOrderStatus,
  type AdminOrder,
} from "@/lib/admin-stats";
import { parseOrderFileUrls, type OrderFileRecord } from "@/lib/order-files";
import { supabase } from "@/lib/supabase";
import { bodyClass, labelDimClass } from "@/lib/design-tokens";

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
    return <span className="text-white/35">—</span>;
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

function StatusBadge({ status }: { status: ReturnType<typeof getOrderStatus> }) {
  const styles = {
    delivered: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300/90",
    submitted: "border-xs-accent/30 bg-xs-accent/10 text-xs-accent-bright/90",
    pending: "border-amber-500/30 bg-amber-500/10 text-amber-300/90",
  } as const;

  const labels = {
    delivered: "Delivered",
    submitted: "Submitted",
    pending: "Pending",
  } as const;

  return (
    <span
      className={`inline-flex rounded-[2px] border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[2px] border bg-xs-surface p-4 sm:p-5 ${
        accent
          ? "border-xs-accent/35 shadow-[0_0_32px_-12px_rgba(168,85,247,0.35)]"
          : "border-xs-border-module"
      }`}
    >
      <p className={labelDimClass}>{label}</p>
      <p
        className={`mt-2 font-mono text-2xl font-medium tracking-tight sm:text-3xl ${
          accent ? "text-xs-accent-bright" : "text-white"
        }`}
      >
        {value}
      </p>
      {hint && <p className={`mt-1.5 text-xs ${bodyClass}`}>{hint}</p>}
    </div>
  );
}

function AdminStatsPanel({ stats }: { stats: ReturnType<typeof computeAdminStats> }) {
  return (
    <div className="flex flex-col gap-6">
      <RecessedWell className="overflow-hidden">
        <ModuleHeader label="ADM · OVERVIEW" />
        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:p-6">
          <StatCard label="Orders" value={stats.orderCount} accent />
          <StatCard
            label="Revenue"
            value={formatUsd(stats.revenueTotal)}
            hint="Catalog prices · paid orders"
            accent
          />
          <StatCard
            label="Pending"
            value={stats.pendingCount}
            hint="Awaiting intake or files"
          />
          <StatCard
            label="Submitted"
            value={stats.submittedCount}
            hint="Intake received or delivered"
          />
          <StatCard
            label="Digital deliveries"
            value={stats.digitalDeliveryCount}
            hint={
              stats.digitalDeliveryCount > 0
                ? "Premade presets · auto-sent"
                : "No premade orders yet"
            }
          />
        </div>
      </RecessedWell>

      <RackFrame interactive={false}>
        <ModuleHeader label="ADM · PRODUCTS" />
        <div className="p-5 sm:p-6 lg:p-8">
          {stats.productBreakdown.length === 0 ? (
            <p className={`text-sm ${bodyClass}`}>No product data yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                <thead>
                  <tr className={`border-b border-white/[0.08] ${labelDimClass}`}>
                    <th className="pb-3 pr-4 font-normal">Product</th>
                    <th className="pb-3 pr-4 font-normal">Orders</th>
                    <th className="pb-3 font-normal">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.productBreakdown.map((row) => (
                    <tr
                      key={row.id}
                      className={`border-b border-white/[0.04] ${bodyClass}`}
                    >
                      <td className="py-3 pr-4 text-white/90">{row.name}</td>
                      <td className="py-3 pr-4 font-mono text-white/75">
                        {row.count}
                      </td>
                      <td className="py-3 font-mono text-xs-accent-bright/90">
                        {formatUsd(row.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </RackFrame>
    </div>
  );
}

function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const sorted = [...orders].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <RecessedWell className="overflow-hidden">
      <ModuleHeader label="ORD · LOG" />
      <div className="overflow-x-auto p-5 sm:p-6 lg:p-8">
        {sorted.length === 0 ? (
          <p className={`text-sm ${bodyClass}`}>No orders yet.</p>
        ) : (
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead>
              <tr className={`border-b border-white/[0.08] ${labelDimClass}`}>
                <th className="pb-3 pr-4 font-normal">Email</th>
                <th className="pb-3 pr-4 font-normal">Product</th>
                <th className="pb-3 pr-4 font-normal">Status</th>
                <th className="pb-3 pr-4 font-normal">Session</th>
                <th className="pb-3 pr-4 font-normal">Files</th>
                <th className="pb-3 font-normal">Created</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((order) => {
                const files = parseOrderFileUrls(order.file_urls);
                const status = getOrderStatus(order);

                return (
                  <tr
                    key={order.id}
                    className={`border-b border-white/[0.04] ${bodyClass}`}
                  >
                    <td className="py-3 pr-4 text-white/90">{order.email}</td>
                    <td className="py-3 pr-4 text-white/75">
                      {formatProduct(order.product)}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={status} />
                    </td>
                    <td className="py-3 pr-4 font-mono text-[0.65rem] text-white/45">
                      {order.stripe_session_id.slice(0, 18)}…
                    </td>
                    <td className="py-3 pr-4">
                      {status === "delivered" ? (
                        <span className="text-emerald-400/80">Email delivery</span>
                      ) : (
                        <OrderFileLinks orderId={order.id} files={files} />
                      )}
                    </td>
                    <td className="py-3 text-white/45">
                      {formatOrderDate(order.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </RecessedWell>
  );
}

export async function AdminDashboard() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as AdminOrder[];
  const stats = computeAdminStats(orders);

  return (
    <div className="flex flex-col gap-8">
      {error && (
        <p className="text-sm text-red-400/90" role="alert">
          Failed to load orders: {error.message}
        </p>
      )}

      <AdminStatsPanel stats={stats} />
      <OrdersTable orders={orders} />
    </div>
  );
}
