import {
  ModuleCard,
  ModuleHeader,
  PageContainer,
  PageHeader,
  PluginControl,
  RackFrame,
  SectionReadout,
  SiteFooter,
  TransportButton,
  rackInner,
} from "@/components/console-ui";
import { StudioAudioDeck } from "@/components/studio-audio-deck";
import {
  FEATURED_PROJECTS,
  TESTIMONIALS,
  VOCAL_CHAIN_DEMOS,
} from "@/lib/portfolio-data";
import {
  bodyClass,
  glowRest,
  labelClass,
  labelDimClass,
  panelHover,
  sectionStack,
} from "@/lib/design-tokens";

function VocalChainDemoCard({
  demo,
}: {
  demo: (typeof VOCAL_CHAIN_DEMOS)[number];
}) {
  return (
    <ModuleCard moduleId={`VOC · ${demo.id.toUpperCase()}`}>
      <div>
        <h3 className="text-lg font-semibold tracking-tight text-white">
          {demo.title}
        </h3>
        <p className={`mt-2 ${labelClass} text-xs-accent-bright/70`}>
          Product · {demo.product}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StudioAudioDeck
          label="Raw Vocal"
          moduleId="IN · DRY"
          src={demo.rawSrc}
          variant="raw"
          clipDurationSeconds={demo.clipDurationSeconds}
        />
        <StudioAudioDeck
          label="Processed Vocal"
          moduleId="OUT · WET"
          src={demo.processedSrc}
          variant="processed"
          clipDurationSeconds={demo.clipDurationSeconds}
        />
      </div>
    </ModuleCard>
  );
}

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
            <div className="flex h-10 items-end gap-[2px]">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[2px] rounded-[1px] bg-gradient-to-t from-[#1e0a3a]/60 to-xs-accent/40 opacity-40"
                  style={{
                    height: `${12 + Math.abs(Math.sin(i * 0.55)) * 28}px`,
                  }}
                />
              ))}
            </div>
            <p className={`${labelDimClass} text-white/25`}>Session slot open</p>
          </div>
        </div>

        <span
          className={`inline-flex w-fit rounded-[2px] border px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest ${categoryColors[project.category]}`}
        >
          {project.category}
        </span>
        <h3 className="mt-3 text-sm font-medium text-white/50">
          {project.title}
        </h3>
        <p className={`mt-auto pt-4 ${labelDimClass} text-white/20`}>
          Featured on launch
        </p>
      </div>
    </article>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof TESTIMONIALS)[number];
}) {
  return (
    <article className="flex h-full flex-col rounded-[2px] border border-xs-border-module bg-xs-surface p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <p className={`flex-1 text-sm leading-relaxed ${bodyClass}`}>
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <footer className="mt-5 border-t border-white/[0.06] pt-4">
        <p className="text-sm font-medium text-white/80">{testimonial.name}</p>
        <p className={`mt-1 ${labelDimClass}`}>{testimonial.role}</p>
        <p className={`mt-2 ${labelClass} text-xs-accent/60`}>
          {testimonial.service}
        </p>
      </footer>
    </article>
  );
}

export function PortfolioPageContent() {
  return (
    <div
      className={`relative text-white ${sectionStack} pb-16 pt-4 md:pb-24 md:pt-6`}
    >
      <PageContainer>
        <PageHeader
          label="Session Archive"
          title="Portfolio"
          note="Before and after demonstrations, featured client work, and session results from the Xsycho Labs rack."
        />
      </PageContainer>

      {/* 1. Vocal Chain Demonstrations */}
      <PageContainer>
        <RackFrame>
          <div className={rackInner}>
            <SectionReadout
              label="Vocal Chain"
              title="Before / After Demonstrations"
              note="Compare raw takes against processed chains. Each demo shows the product used to shape the vocal."
            />
            <div className="flex flex-col gap-6">
              {VOCAL_CHAIN_DEMOS.map((demo) => (
                <VocalChainDemoCard key={demo.id} demo={demo} />
              ))}
            </div>
          </div>
        </RackFrame>
      </PageContainer>

      {/* 2. Featured Work */}
      <PageContainer>
        <RackFrame interactive={false}>
          <div className={rackInner}>
            <SectionReadout
              label="Client Rack"
              title="Featured Work"
              note="Grid reserved for upcoming client projects. Early sessions get spotlight placement on launch."
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {FEATURED_PROJECTS.map((project) => (
                <FeaturedProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </RackFrame>
      </PageContainer>

      {/* 3. Testimonials */}
      <PageContainer>
        <RackFrame interactive={false}>
          <div className={rackInner}>
            <SectionReadout
              label="Session Notes"
              title="Testimonials"
              note="Placeholder feedback from recent sessions. Real client quotes will replace these as projects land."
            />
            <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
              {TESTIMONIALS.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </RackFrame>
      </PageContainer>

      {/* 4. CTA */}
      <PageContainer>
        <RackFrame interactive={false}>
          <ModuleHeader label="OUT · MAIN" />
          <div className={`${rackInner} mx-auto max-w-2xl text-center`}>
            <SectionReadout
              label="Book a Session"
              title="Ready to hear your track on the rack?"
              note="Send stems for mixing and mastering, or browse presets for instant vocal chains."
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <PluginControl href="/services" variant="primary" moduleId="MIX">
                Book Mixing
              </PluginControl>
              <div className="w-full sm:flex-1">
                <TransportButton href="/presets" variant="secondary">
                  Browse Presets
                </TransportButton>
              </div>
            </div>
          </div>
        </RackFrame>
      </PageContainer>

      <SiteFooter />
    </div>
  );
}
