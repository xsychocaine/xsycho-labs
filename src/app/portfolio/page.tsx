import type { Metadata } from "next";
import {
  PageContainer,
  RackFrame,
  SectionReadout,
  rackInner,
} from "@/components/console-ui";
import { PortfolioWipOverlay } from "@/components/portfolio-wip-overlay";

export const metadata: Metadata = {
  title: "Portfolio | Xsycho Labs",
  description:
    "Portfolio coming soon. I feature my first client projects with social promotion. Book a session to claim a spotlight slot.",
};

const placeholderProjects = [
  { category: "Mix", title: "Your Track Here" },
  { category: "Master", title: "Your Release Here" },
  { category: "Preset", title: "Your Chain Here" },
  { category: "Mix", title: "Session Slot Open" },
  { category: "Master", title: "Session Slot Open" },
  { category: "Beat", title: "Session Slot Open" },
] as const;

export default function PortfolioPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] pb-16 pt-8 md:pt-12">
      <PortfolioWipOverlay />

      <PageContainer>
        <RackFrame interactive={false}>
          <div className={`${rackInner} pointer-events-none select-none opacity-30 blur-[2px]`}>
            <SectionReadout
              label="Session Files"
              title="Portfolio"
              note="Showcase loading. I feature my early clients first."
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {placeholderProjects.map((project, index) => (
                <article
                  key={`${project.title}-${index}`}
                  className="overflow-hidden rounded-[2px] border border-[#1c1c24] bg-[#0b0b0f] p-5"
                >
                  <div className="mb-4 aspect-[16/10] rounded-[2px] bg-[#0e0e12]" />
                  <p className="font-mono text-[0.6rem] uppercase tracking-wider text-white/25">
                    {project.category}
                  </p>
                  <h2 className="mt-2 text-sm font-medium text-white/40">
                    {project.title}
                  </h2>
                </article>
              ))}
            </div>
          </div>
        </RackFrame>
      </PageContainer>
    </div>
  );
}
