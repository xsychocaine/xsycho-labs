import type { Metadata } from "next";
import { PresetsPageContent } from "@/components/presets-page-content";

export const metadata: Metadata = {
  title: "Presets | Xsycho Labs",
  description:
    "Custom vocal presets from $30 and instant download chains from $15. Primary storefront for underground artists.",
};

export default function PresetsPage() {
  return <PresetsPageContent />;
}
