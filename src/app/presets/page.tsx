import type { Metadata } from "next";
import { PresetsPageContent } from "@/components/presets-page-content";

export const metadata: Metadata = {
  title: "Presets | Xsycho Labs",
  description:
    "Instant-download vocal chains from $10, plus fully custom presets from $30.",
};

export default function PresetsPage() {
  return <PresetsPageContent />;
}
