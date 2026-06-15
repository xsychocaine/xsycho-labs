import type { ProductType } from "@/lib/product-types";

export type DigitalProductConfig = {
  id: string;
  name: string;
  /** Price in USD */
  price: number;
  productType: ProductType;
  requiresIntake: boolean;
  downloadUrl?: string;
  cancelPath?: string;
};

export const DIGITAL_PRODUCTS = {
  "xsycho-vocal-chain-lite": {
    id: "xsycho-vocal-chain-lite",
    name: "Xsycho Vocal Chain Lite",
    price: 15,
    productType: "premade_preset",
    requiresIntake: false,
    downloadUrl:
      "https://j0njpbenh1.ufs.sh/f/cymtt7mnQqMFpUxRvfsWh5KdU9LaotqVWHcwCIDRM6bxGpiu",
    cancelPath: "/presets",
  },
  "xsycho-vocal-chain-pro": {
    id: "xsycho-vocal-chain-pro",
    name: "Xsycho Vocal Chain Pro",
    price: 25,
    productType: "premade_preset",
    requiresIntake: false,
    downloadUrl:
      "https://j0njpbenh1.ufs.sh/f/cymtt7mnQqMFgCBd7kjcrNPCWbRzSiIGwu5LxEl2kOo7np4T",
    cancelPath: "/presets",
  },
} as const satisfies Record<string, DigitalProductConfig>;

export type DigitalProductId = keyof typeof DIGITAL_PRODUCTS;

/** Legacy Stripe metadata slugs mapped to current product ids */
export const PRODUCT_ID_ALIASES: Record<string, DigitalProductId | string> = {
  vocal_preset_starter_fl: "xsycho-vocal-chain-lite",
  vocal_preset_starter_premium: "xsycho-vocal-chain-pro",
};

export function getDigitalProduct(id: string): DigitalProductConfig | null {
  const resolved = PRODUCT_ID_ALIASES[id] ?? id;
  return DIGITAL_PRODUCTS[resolved as DigitalProductId] ?? null;
}

export function listDigitalProducts(): DigitalProductConfig[] {
  return Object.values(DIGITAL_PRODUCTS);
}
