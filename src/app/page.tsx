import { CheckoutButton } from "@/components/checkout-button";
import {
  ConsoleLink,
  ModuleHeader,
  PageContainer,
  PluginControl,
  RackFrame,
  RecessedWell,
  SectionReadout,
  SiteFooter,
  glowHover,
  glowRest,
  panelHover,
  rackInner,
  sectionStack,
  transitionSmooth,
} from "@/components/console-ui";
import { CommunityLinks } from "@/components/community-links";
import { PortfolioSpotlightSectionOverlay } from "@/components/portfolio-wip-overlay";
import { ScrollCue } from "@/components/scroll-cue";
import { bodyClass, labelClass, labelDimClass } from "@/lib/design-tokens";

const FEATURED_PRODUCT = {
  name: "Fully Custom Vocal Preset",
  price: 30,
  moduleId: "CUSTOM · VOCAL",
  description:
    "Not a generic chain. I sculpt this preset around your voice, your beat, and the sound you're going for. EQ, compression, space, and tone are shaped specifically for how you sing or rap, so the chain reacts to your voice instead of a one size fits all template.",
  chainSlots: [
    { name: "EQ Sculpt", level: 72 },
    { name: "Dynamics", level: 58 },
    { name: "De-Ess", level: 45 },
    { name: "Space", level: 38 },
    { name: "Tone", level: 65 },
  ],
} as const;

const services = [
  {
    id: "MIX-01",
    title: "Mixing",
    description:
      "Balanced, punchy mixes with clarity, depth, and competitive loudness. Tuned for streaming and release ready playback.",
  },
  {
    id: "MST-02",
    title: "Mastering",
    description:
      "Final polish and translation across speakers, headphones, and platforms. Ready for distribution.",
  },
  {
    id: "VOC-03",
    title: "Vocal Processing",
    description:
      "Custom vocal chains for clarity, presence, and character. From subtle polish to aggressive underground tone.",
  },
] as const;

const projects = [
  { name: "Midnight Drive", type: "Mix" as const },
  { name: "Neon Prayer", type: "Master" as const },
  { name: "Static Bloom", type: "Beat" as const },
  { name: "Low Light", type: "Mix" as const },
  { name: "Violet Room", type: "Master" as const },
  { name: "Pressure", type: "Beat" as const },
] as const;

const CHAIN_WAVEFORM_HEIGHTS = Array.from({ length: 40 }, (_, i) =>
  Math.round(20 + Math.abs(Math.sin(i * 0.45)) * 80),
);

const TRACK_WAVEFORM_HEIGHTS = [0, 1, 2, 3, 4, 5].map((seed) =>
  Array.from({ length: 36 }, (_, i) =>
    Math.round(18 + Math.abs(Math.sin(i * 0.5 + seed)) * 82),
  ),
);

function MeterBridge({ bars = 12 }: { bars?: number }) {
  return (
    <RecessedWell className="flex h-10 items-end gap-[3px] px-3 py-2.5 transition-shadow duration-300 group-hover/module:shadow-[inset_0_3px_14px_rgba(0,0,0,0.95),inset_0_0_20px_-8px_rgba(168,85,247,0.15)]">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-[1px] bg-gradient-to-t from-xs-accent-deep/80 to-xs-accent-bright/70 ${transitionSmooth} group-hover/module:from-xs-accent-deep/90 group-hover/module:to-xs-accent-bright/90`}
          style={{ height: `${8 + ((i * 5) % 22)}px` }}
        />
      ))}
    </RecessedWell>
  );
}

function ChainPreview({
  slots,
  label,
}: {
  slots: readonly { name: string; level: number }[];
  label: string;
}) {
  return (
    <RecessedWell className="overflow-hidden p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <span className={labelDimClass}>{label}</span>
        <span className="flex gap-1" aria-hidden>
          <span className="h-1.5 w-1.5 rounded-full bg-xs-accent-bright shadow-[0_0_8px_rgba(168,85,247,0.9)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#252530]" />
        </span>
      </div>
      <div className="space-y-2">
        {slots.map((slot) => (
          <div
            key={slot.name}
            className="flex items-center gap-3 rounded-[2px] border border-white/[0.05] bg-xs-inset px-3 py-2"
          >
            <span className="w-24 shrink-0 truncate font-mono text-[0.55rem] uppercase tracking-wider text-white/40">
              {slot.name}
            </span>
            <div className="relative h-2 flex-1 overflow-hidden rounded-[1px] bg-black/60">
              <div
                className="absolute inset-y-0 left-0 rounded-[1px] bg-gradient-to-r from-xs-accent-deep to-xs-accent-bright"
                style={{ width: `${slot.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex h-12 items-end justify-center gap-[2px] border-t border-white/[0.04] pt-3">
        {CHAIN_WAVEFORM_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="w-[2px] rounded-[1px] bg-gradient-to-t from-[#1e0a3a] to-xs-accent-bright/70"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </RecessedWell>
  );
}

function FeaturedProductPanel() {
  return (
    <article
      className={`group/featured relative overflow-hidden rounded-[2px] border border-xs-accent/35 bg-xs-surface ${glowRest} shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_48px_-12px_rgba(168,85,247,0.25),inset_0_1px_0_rgba(255,255,255,0.05)]`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-xs-accent-bright/70 to-transparent"
      />
      <ModuleHeader label={FEATURED_PRODUCT.moduleId} />

      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10">
        <div className="flex flex-col gap-6">
          <div>
            <p className={`${labelClass} text-xs-accent-bright/90`}>
              Featured Product
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {FEATURED_PRODUCT.name}
            </h2>
            <p className={`mt-4 ${bodyClass}`}>
              {FEATURED_PRODUCT.description}
            </p>
          </div>

          <ul className="space-y-2">
            {[
              "Built from your raw vocals, beat, and target sound",
              "Processing choices explained for your setup",
            ].map((item) => (
              <li
                key={item}
                className={`flex gap-2.5 text-sm leading-relaxed ${bodyClass}`}
              >
                <span
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-xs-accent/80"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={labelDimClass}>Starting at</p>
              <p className="mt-1 font-mono text-3xl font-medium tracking-tight text-xs-accent-bright sm:text-4xl">
                ${FEATURED_PRODUCT.price}
              </p>
              <p className="mt-1 text-xs text-white/35">
                One-time purchase · Delivered in 3 to 5 days
              </p>
            </div>
            <div className="w-full sm:max-w-[14rem]">
              <CheckoutButton product="vocal_preset" variant="primary" moduleId="BUY">
                Buy Now
              </CheckoutButton>
            </div>
          </div>
        </div>

        <ChainPreview
          slots={FEATURED_PRODUCT.chainSlots}
          label="Your Custom Chain"
        />
      </div>
    </article>
  );
}

function ServiceModule({
  id,
  title,
  description,
}: (typeof services)[number]) {
  return (
    <article
      className={`group/module relative flex h-full flex-col overflow-hidden rounded-[2px] border border-xs-border-module bg-xs-surface ${glowRest} ${panelHover} ${glowHover} hover:border-xs-accent/30`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-xs-accent-bright/60 to-transparent opacity-0 ${transitionSmooth} group-hover/module:opacity-100`}
      />
      <ModuleHeader label={id} />
      <div className="flex flex-1 flex-col gap-5 p-5 lg:p-6">
        <div className="space-y-2">
          <p
            className={`${labelDimClass} ${transitionSmooth} group-hover/module:text-xs-accent/50`}
          >
            Channel Strip
          </p>
          <h3
            className={`text-lg font-semibold tracking-tight text-white ${transitionSmooth} group-hover/module:text-xs-accent-bright/90`}
          >
            {title}
          </h3>
        </div>
        <p
          className={`flex-1 text-sm leading-relaxed ${bodyClass} ${transitionSmooth} group-hover/module:text-white/55`}
        >
          {description}
        </p>
        <MeterBridge />
      </div>
    </article>
  );
}

function WaveformDisplay({ seed = 0 }: { seed?: number }) {
  return (
    <RecessedWell
      className={`flex h-[4.5rem] items-end justify-center gap-[2px] px-3 py-2.5 ${transitionSmooth} group-hover/track:shadow-[inset_0_3px_14px_rgba(0,0,0,0.95),inset_0_0_24px_-10px_rgba(168,85,247,0.2)]`}
    >
      {(TRACK_WAVEFORM_HEIGHTS[seed] ?? TRACK_WAVEFORM_HEIGHTS[0]).map(
        (h, i) => (
          <div
            key={i}
            className={`w-[2px] rounded-[1px] bg-gradient-to-t from-[#1e0a3a] to-xs-accent-bright/80 ${transitionSmooth} group-hover/track:from-xs-accent-deep group-hover/track:to-xs-accent-bright`}
            style={{ height: `${h}%` }}
          />
        ),
      )}
    </RecessedWell>
  );
}

function TrackPanel({
  name,
  type,
  index,
}: (typeof projects)[number] & { index: number }) {
  const typeStyle = {
    Mix: "border-xs-accent/35 text-xs-accent-bright/90 bg-[#1e0a3a]/30",
    Master:
      "border-xs-accent-bright/30 text-xs-accent-bright/80 bg-[#1e0a3a]/20",
    Beat: "border-white/15 text-white/45 bg-black/40",
  };

  return (
    <article
      className={`group/track relative flex h-full flex-col overflow-hidden rounded-[2px] border border-xs-border-module bg-xs-surface shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.03)] ${panelHover} hover:border-xs-accent/25 hover:shadow-[0_12px_32px_rgba(0,0,0,0.6),0_0_32px_-10px_rgba(168,85,247,0.28),inset_0_1px_0_rgba(255,255,255,0.05)]`}
    >
      <div className="flex items-center justify-between border-b border-black/50 bg-xs-header px-4 py-2">
        <span className="font-mono text-[0.6rem] tracking-wider text-white/30">
          TRK.{String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`rounded-[2px] border px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest ${typeStyle[type]}`}
        >
          {type}
        </span>
      </div>
      <div className="flex-1 p-3">
        <WaveformDisplay seed={index} />
      </div>
      <div className="flex items-center justify-between border-t border-black/50 bg-[#08080c] px-4 py-3">
        <p
          className={`truncate text-sm font-medium text-white/85 ${transitionSmooth} group-hover/track:text-white`}
        >
          {name}
        </p>
        <div className="flex shrink-0 gap-1.5" aria-hidden>
          <span
            className={`h-1.5 w-1.5 rounded-full bg-xs-accent shadow-[0_0_5px_rgba(168,85,247,0.9)] ${transitionSmooth} group-hover/track:shadow-[0_0_10px_rgba(168,85,247,1)]`}
          />
          <span className="h-1.5 w-1.5 rounded-full bg-[#252530]" />
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <div
      className={`relative isolate text-white ${sectionStack} pb-16 md:pb-24`}
    >
      {/* 1. Hero */}
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center pb-32 pt-8 md:pb-36 md:pt-12">
        <PageContainer className="w-full">
          <RackFrame>
            <ModuleHeader label="XSYC · MAIN" />
            <div className="px-6 py-10 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
              <div className="mx-auto max-w-2xl">
                <p className={`text-center ${labelClass} text-xs-accent/75`}>
                  Audio Engineering & Custom Vocal Presets
                </p>

                <h1 className="mt-4 text-center text-[clamp(2.5rem,7.5vw,4rem)] font-semibold leading-[1.05] tracking-tight text-white">
                  Xsycho Labs
                </h1>

                <p className={`mx-auto mt-5 max-w-lg text-pretty text-center ${bodyClass}`}>
                  High-quality vocal chains, mixing tools, and production
                  presets for modern underground artists.
                </p>

                <RecessedWell className="mx-auto mt-10 max-w-lg p-4 sm:p-5">
                  <p className={`mb-4 text-center ${labelDimClass}`}>
                    Session Controls
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row sm:gap-3">
                    <PluginControl
                      href="/presets"
                      variant="primary"
                      moduleId="SHOP"
                    >
                      Buy Presets
                    </PluginControl>
                    <PluginControl
                      href="/services"
                      variant="secondary"
                      moduleId="SERV"
                    >
                      View Services
                    </PluginControl>
                  </div>
                </RecessedWell>

                <p
                  className={`mt-6 text-center ${labelDimClass} text-white/25`}
                >
                  Presets · Mixing · Mastering · Production Tools
                </p>
              </div>
            </div>
          </RackFrame>
        </PageContainer>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-xs-bg via-xs-bg/80 to-transparent"
        />

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <ScrollCue href="#featured" />
        </div>
      </section>

      {/* 2. Featured Product */}
      <section id="featured" className="relative z-10 -mt-20 scroll-mt-24 sm:-mt-24">
        <PageContainer>
          <p className={`mb-4 ${labelDimClass} text-xs-accent/50`}>
            Up next · Featured preset
          </p>
          <FeaturedProductPanel />
        </PageContainer>
      </section>

      {/* 3. About */}
      <section id="about" className="scroll-mt-24">
        <PageContainer>
          <RackFrame>
            <ModuleHeader label="PROFILE · DEV" />
            <div className={rackInner}>
              <SectionReadout label="About" title="Who's behind the desk" />
              <p className={`max-w-2xl ${bodyClass} sm:text-base`}>
                Xsycho Labs is my home base for presets, mixes, and whatever
                I&apos;m building next. I produce, record, engineer, and write
                code, and I finished an associate&apos;s degree in computer
                science at 17 along the way. Still working toward my own studio, but this is where the
                work lives for now.
              </p>
              <div className="mt-6">
                <ConsoleLink href="/about">More about me</ConsoleLink>
              </div>
            </div>
          </RackFrame>
        </PageContainer>
      </section>

      {/* 4. Services Preview */}
      <section id="services" className="scroll-mt-24">
        <PageContainer>
          <RackFrame>
            <div className={rackInner}>
              <SectionReadout
                label="Signal Chain"
                title="Services"
                note="Studio grade mixing, mastering, and vocal processing for independent artists who need release ready sound."
              />
              <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
                {services.map((service) => (
                  <ServiceModule key={service.id} {...service} />
                ))}
              </div>
              <div className="mt-10 border-t border-white/[0.06] pt-8 lg:mt-12">
                <ConsoleLink href="/services">Full service details</ConsoleLink>
              </div>
            </div>
          </RackFrame>
        </PageContainer>
      </section>

      {/* 5. Portfolio Preview */}
      <section id="portfolio" className="scroll-mt-24">
        <PageContainer>
          <RackFrame interactive={false}>
            <div className={`${rackInner} relative`}>
              <div className="pointer-events-none select-none opacity-30 blur-[2px]">
                <SectionReadout
                  label="Session Files"
                  title="Portfolio"
                  note="Selected mixes, masters, and productions from recent client sessions."
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  {projects.map((project, index) => (
                    <TrackPanel
                      key={project.name}
                      {...project}
                      index={index}
                    />
                  ))}
                </div>
                <div className="mt-10 border-t border-white/[0.06] pt-8 lg:mt-12">
                  <ConsoleLink href="/portfolio">
                    View full portfolio
                  </ConsoleLink>
                </div>
              </div>

              <PortfolioSpotlightSectionOverlay />
            </div>
          </RackFrame>
        </PageContainer>
      </section>

      {/* 6. Community */}
      <section id="community" className="scroll-mt-24">
        <PageContainer>
          <RackFrame>
            <ModuleHeader label="I/O · ROUTING" />
            <div className={rackInner}>
              <SectionReadout
                label="Connect"
                title="Community & Links"
                note="Follow releases, stream latest work, and join the Discord for updates."
              />
              <CommunityLinks />
            </div>
          </RackFrame>
        </PageContainer>
      </section>

      {/* 7. Final CTA */}
      <section id="contact" className="scroll-mt-24">
        <PageContainer>
          <RackFrame interactive={false}>
            <ModuleHeader label="OUT · MAIN" />
            <div className={`${rackInner} mx-auto max-w-xl text-center`}>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Build your sound with Xsycho Labs
              </h2>
              <p className={`mx-auto mt-4 max-w-md ${bodyClass}`}>
                Presets, mixing, and mastering built for underground artists
                who want a polished, industry ready sound.
              </p>
              <div className="mx-auto mt-8 max-w-xs">
                <PluginControl
                  href="/contact"
                  variant="primary"
                  moduleId="START"
                >
                  Get Started
                </PluginControl>
              </div>
            </div>
          </RackFrame>
        </PageContainer>
      </section>

      <SiteFooter />
    </div>
  );
}
