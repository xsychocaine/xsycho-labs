export const PRODUCT_CATALOG = {
  mixing_service: "Mixing",
  mastering_service: "Mastering",
  mix_master_bundle: "Mix + Master Bundle",
  vocal_preset: "Fully Custom Vocal Preset",
  vocal_preset_starter_fl: "Vocal Starter Chain — FL Stock",
  vocal_preset_starter_premium: "Vocal Starter Chain — Premium",
} as const;

export type ProductSlug = keyof typeof PRODUCT_CATALOG;

export const PRODUCT_OPTIONS = Object.entries(PRODUCT_CATALOG).map(
  ([value, label]) => ({ value, label }),
);

export function formatProduct(slug: string) {
  return (
    PRODUCT_CATALOG[slug as ProductSlug] ?? slug.replace(/_/g, " ")
  );
}
