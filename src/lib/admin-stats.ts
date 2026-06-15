import {
  formatProduct,
  getProductConfig,
  productRequiresIntake,
  resolveProductId,
} from "@/lib/products";

export type AdminOrder = {
  id: string;
  email: string;
  product: string;
  product_type: string | null;
  stripe_session_id: string;
  file_urls: unknown;
  files_submitted: boolean;
  created_at: string;
};

export type ProductBreakdownRow = {
  id: string;
  name: string;
  count: number;
  revenue: number;
};

export type AdminStats = {
  orderCount: number;
  revenueTotal: number;
  pendingCount: number;
  submittedCount: number;
  digitalDeliveryCount: number;
  productBreakdown: ProductBreakdownRow[];
};

export type OrderStatus = "delivered" | "submitted" | "pending";

export function getOrderStatus(order: AdminOrder): OrderStatus {
  const productId = resolveProductId(order.product);
  const config = getProductConfig(productId);
  const isPremade =
    config?.productType === "premade_preset" ||
    order.product_type === "premade_preset";

  if (isPremade) return "delivered";
  if (order.files_submitted) return "submitted";
  return "pending";
}

export function computeAdminStats(orders: AdminOrder[]): AdminStats {
  const breakdownMap = new Map<string, ProductBreakdownRow>();
  let revenueTotal = 0;
  let pendingCount = 0;
  let submittedCount = 0;
  let digitalDeliveryCount = 0;

  for (const order of orders) {
    const productId = resolveProductId(order.product);
    const config = getProductConfig(productId);
    const price = config?.price ?? 0;
    const name = formatProduct(productId);
    const status = getOrderStatus(order);

    revenueTotal += price;

    if (status === "delivered") {
      digitalDeliveryCount += 1;
      submittedCount += 1;
    } else if (status === "submitted") {
      submittedCount += 1;
    } else {
      pendingCount += 1;
    }

    const existing = breakdownMap.get(productId);
    if (existing) {
      existing.count += 1;
      existing.revenue += price;
    } else {
      breakdownMap.set(productId, { id: productId, name, count: 1, revenue: price });
    }
  }

  const productBreakdown = [...breakdownMap.values()].sort(
    (a, b) => b.count - a.count || b.revenue - a.revenue,
  );

  return {
    orderCount: orders.length,
    revenueTotal,
    pendingCount,
    submittedCount,
    digitalDeliveryCount,
    productBreakdown,
  };
}

export function orderNeedsIntake(order: AdminOrder): boolean {
  const productId = resolveProductId(order.product);
  return productRequiresIntake(productId);
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatOrderDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}
