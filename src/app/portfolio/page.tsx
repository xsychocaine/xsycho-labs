import type { Metadata } from "next";
import { PortfolioPageContent } from "@/components/portfolio-page-content";

export const metadata: Metadata = {
  title: "Portfolio | Xsycho Labs",
  description:
    "Example vocal chain demonstrations and placeholder client slots. Real project features will replace these as work completes.",
};

export default function PortfolioPage() {
  return <PortfolioPageContent />;
}
