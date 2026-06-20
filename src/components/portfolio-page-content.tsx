import { ConversionCta } from "@/components/conversion-cta";
import {
  ModuleHeader,
  PageContainer,
  PageHeader,
  RackFrame,
  RecessedWell,
  SectionReadout,
  SiteFooter,
  rackInner,
} from "@/components/console-ui";
import { VocalChainDemoCard } from "@/components/portfolio-vocal-demo-card";
import {
  FEATURED_PROJECTS,
  VOCAL_CHAIN_DEMOS,
} from "@/lib/portfolio-data";
import {
  bodyClass,
  glowRest,
  labelDimClass,
  panelHover,
  sectionStack,
} from "@/lib/design-tokens";

function FeaturedProjectCard({
  project,
}: {
  project: (typeof FEATURED_PROJECTS)[number];
}) {
  const categoryColors: Record<string, string> = {
    Mix: "border-xs-accent/35 text-xs-accent-bright/90 bg-[#1e0a3a]/30",
    Master: "border-purple-400/30 text-purple-300/90 bg-purple-950/20",
    Preset: "border-xs-accent-bright/30 text-xs-accent-bright/80 bg-[#1e0a3a]/25",
    Production: "border-white/15 text-white/50 bg-black/30",
  };

  return (
    <article
      className={`group/slot relative flex flex-col overflow-hidden rounded-[2px] border border-xs-border-module bg-xs-surface ${glowRest} ${panelHover}`}
    >
      <ModuleHeader label={project.slot} />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 aspect-[16/10] overflow-hidden rounded-[2px] border border-white/[0.05] bg-xs-inset">
          <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
            <p className={`${labelDimClass} text-white/30`}>
              Future client slot
            </p>
          </div>
        </div>
        <span
          className={`inline-flex w-fit rounded-[2px] border px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest ${categoryColors[project.category]}`}
        >
          {project.category}
        </span>
        <h3 className="mt-3 text-sm font-medium text-white/45">
          {project.title}
        </h3>
        <p className={`mt-auto pt-4 ${labelDimClass} text-white/20`}>
          Placeholder until client work lands
        </p>
      </div>
    </article>
  );
}

export function PortfolioPageContent() {
  return (
    <div
      className={`relative text-white ${sectionStack} pb-16 pt-4 md:pb-20 md:pt-6`}
    >
      <PageContainer>
        <PageHeader
          label="Session Archive"
          title="Portfolio"
          note="Example demonstrations and placeholder client slots. Real project features will replace these as work completes."
        />
      </PageContainer>

      <PageContainer>
        <RecessedWell className="p-4 sm:p-5">
          <p className={`text-sm leading-relaxed ${bodyClass}`}>
            <span className="font-medium text-white/70">Note:</span> Vocal demos
            below are session examples, not paid client releases. Featured work
            slots are placeholders until real projects are cleared for showcase.
          </p>
        </RecessedWell>
      </PageContainer>

      <PageContainer>
        <RackFrame>
          <div className={rackInner}>
            <SectionReadout
              label="Vocal Chain"
              title="Example Demonstrations"
              note="Before and after comparisons showing what custom and premade chains can do on real takes."
            />
            <div className="flex flex-col gap-6">
              {VOCAL_CHAIN_DEMOS.map((demo) => (
                <VocalChainDemoCard key={demo.id} demo={demo} />
              ))}
            </div>
          </div>
        </RackFrame>
      </PageContainer>

      <PageContainer>
        <RackFrame interactive={false}>
          <div className={rackInner}>
            <SectionReadout
              label="Client Rack"
              title="Future Client Features"
              note="Reserved for upcoming client projects. Early sessions may get spotlight placement on the homepage."
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {FEATURED_PROJECTS.map((project) => (
                <FeaturedProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </RackFrame>
      </PageContainer>

      <ConversionCta
        title="Want your project on the rack?"
        note="Book mixing, mastering, or a custom preset. Reach out if you have questions first."
      />

      <SiteFooter />
    </div>
  );
}
