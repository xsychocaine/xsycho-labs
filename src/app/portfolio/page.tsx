import type { Metadata } from "next";
import { PortfolioPageContent } from "@/components/portfolio-page-content";

export const metadata: Metadata = {
  title: "Portfolio | Xsycho Labs",
  description:
    "Before and after vocal chains, mix and master demonstrations, featured client work, and session testimonials from Xsycho Labs.",
};

export default function PortfolioPage() {
  return <PortfolioPageContent />;
}
