import {
  DIGITAL_PRODUCTS,
  PRODUCT_ID_ALIASES,
  type DigitalProductConfig,
} from "@/lib/digital-products";
import type { ProductType } from "@/lib/product-types";

export type ProductConfig = {
  id: string;
  name: string;
  /** Price in USD */
  price: number;
  productType: ProductType;
  downloadUrl?: string;
  requiresIntake: boolean;
  cancelPath: string;
};

const SERVICE_PRODUCTS = {
  mixing_service: {
    id: "mixing_service",
    name: "Mixing",
    price: 15,
    productType: "mixing",
    requiresIntake: true,
    cancelPath: "/services",
  },
  mastering_service: {
    id: "mastering_service",
    name: "Mastering",
    price: 10,
    productType: "mastering",
    requiresIntake: true,
    cancelPath: "/services",
  },
  mix_master_bundle: {
    id: "mix_master_bundle",
    name: "Mix + Master Bundle",
    price: 20,
    productType: "mix_master",
    requiresIntake: true,
    cancelPath: "/services",
  },
  vocal_preset: {
    id: "vocal_preset",
    name: "Fully Custom Vocal Preset",
    price: 30,
    productType: "custom_preset",
    requiresIntake: true,
    cancelPath: "/presets",
  },
  /** Hidden live-mode Stripe test product. Remove before public launch. */
  stripe_live_test: {
    id: "stripe_live_test",
    name: "Stripe Live Mode Test",
    price: 1,
    productType: "premade_preset",
    requiresIntake: false,
    cancelPath: "/",
  },
} as const satisfies Record<string, ProductConfig>;

function toProductConfig(digital: DigitalProductConfig): ProductConfig {
  return {
    id: digital.id,
    name: digital.name,
    price: digital.price,
    productType: digital.productType,
    downloadUrl: digital.downloadUrl,
    requiresIntake: digital.requiresIntake,
    cancelPath: digital.cancelPath ?? "/presets",
  };
}

export const PRODUCTS: Record<string, ProductConfig> = {
  ...SERVICE_PRODUCTS,
  ...Object.fromEntries(
    Object.values(DIGITAL_PRODUCTS).map((product) => [
      product.id,
      toProductConfig(product),
    ]),
  ),
};

export type ProductSlug = keyof typeof PRODUCTS;

/** @deprecated Use getProductConfig(id).name */
export const PRODUCT_CATALOG = Object.fromEntries(
  Object.entries(PRODUCTS).map(([id, config]) => [id, config.name]),
) as Record<string, string>;

export const PRODUCT_OPTIONS = Object.entries(PRODUCTS)
  .filter(([, config]) => config.requiresIntake)
  .map(([value, config]) => ({ value, label: config.name }));

export function resolveProductId(slugOrId: string): string {
  return PRODUCT_ID_ALIASES[slugOrId] ?? slugOrId;
}

export function getProductConfig(slugOrId: string): ProductConfig | null {
  const id = resolveProductId(slugOrId);
  return PRODUCTS[id] ?? null;
}

export function getProductType(slugOrId: string): ProductType {
  return getProductConfig(slugOrId)?.productType ?? "mixing";
}

export function productRequiresIntake(slugOrId: string): boolean {
  return getProductConfig(slugOrId)?.requiresIntake ?? true;
}

export function resolveProductDownloadUrl(
  slugOrId: string,
  baseUrl?: string,
): string | null {
  const downloadUrl = getProductConfig(slugOrId)?.downloadUrl;
  if (!downloadUrl) return null;

  if (downloadUrl.startsWith("http://") || downloadUrl.startsWith("https://")) {
    return downloadUrl;
  }

  const base = baseUrl?.replace(/\/$/, "") ?? "";
  return `${base}${downloadUrl}`;
}

export function formatProduct(slugOrId: string) {
  return getProductConfig(slugOrId)?.name ?? slugOrId.replace(/_/g, " ");
}

export function isPremadePreset(slugOrId: string) {
  return getProductConfig(slugOrId)?.productType === "premade_preset";
}

export function productPriceCents(slugOrId: string): number {
  const config = getProductConfig(slugOrId);
  if (!config) return 0;
  return Math.round(config.price * 100);
}

export { DIGITAL_PRODUCTS, listDigitalProducts } from "@/lib/digital-products";
