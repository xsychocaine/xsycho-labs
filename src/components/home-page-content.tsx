import Link from "next/link";
import { CheckoutButton } from "@/components/checkout-button";
import { ConversionCta } from "@/components/conversion-cta";
import {
  ModuleHeader,
  PageContainer,
  PluginControl,
  RackFrame,
  RecessedWell,
  SectionReadout,
  SiteFooter,
  TransportButton,
  glowHover,
  glowRest,
  panelHover,
  rackInner,
} from "@/components/console-ui";
import {
  ARTIST_SPOTLIGHTS,
  CURRENT_OFFERINGS,
  FEATURED_CUSTOM_PRESET,
  PORTFOLIO_TEASER,
  ROADMAP_ITEMS,
  SITE_TAGLINE,
  type CurrentOffering,
} from "@/lib/home-content";
import { bodyClass, labelClass, labelDimClass } from "@/lib/design-tokens";

const homeSectionStack = "flex flex-col gap-10 md:gap-14 lg:gap-16";

function OfferingCard({ offering }: { offering: CurrentOffering }) {
  return (
    <article
      className={`group/offer relative flex h-full flex-col overflow-hidden rounded-[2px] border bg-xs-surface ${glowRest} ${panelHover} ${glowHover} ${
        offering.primary
          ? "border-xs-accent/35"
          : "border-xs-border-module"
      }`}
    >
      <ModuleHeader label={offering.moduleId} />
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold tracking-tight text-white sm:text-lg">
            {offering.title}
          </h3>
          {offering.priceHint && (
            <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-wider text-xs-accent-bright/80">
              {offering.priceHint}
            </span>
          )}
        </div>
        <p className={`flex-1 text-sm leading-relaxed ${bodyClass}`}>
          {offering.description}
        </p>
        <PluginControl
          href={offering.href}
          variant={offering.primary ? "primary" : "secondary"}
          moduleId="OPEN"
        >
          {offering.cta}
        </PluginControl>
      </div>
    </article>
  );
}

function ArtistSpotlightCard({
  spotlight,
}: {
  spotlight: (typeof ARTIST_SPOTLIGHTS)[number];
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[2px] border border-xs-border-module bg-xs-surface">
      <ModuleHeader label={spotlight.slot} />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-sm font-medium text-white/55">{spotlight.artist}</p>
        <p className={`mt-1 ${labelDimClass}`}>{spotlight.projectType}</p>
        <p className={`mt-3 flex-1 text-sm leading-relaxed ${bodyClass}`}>
          Placeholder for a future client feature. Book a preset or service to
          be considered for spotlight placement.
        </p>
        <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-wider text-white/25">
          Social · {spotlight.social}
        </p>
      </div>
    </article>
  );
}

export function HomePageContent() {
  return (
    <div className={`relative isolate text-white ${homeSectionStack} pb-12 md:pb-16`}>
      {/* Hero + current offerings */}
      <section className="relative pt-4 pb-6 md:pt-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[min(50vh,480px)] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(168,85,247,0.14),transparent_70%)]"
        />
        <PageContainer className="relative">
          <RackFrame className="overflow-hidden">
            <ModuleHeader label="XSYC · HUB" />
            <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
              <div className="mx-auto max-w-3xl text-center">
                <p className={`${labelClass} text-xs-accent-bright/80`}>
                  Xsycho Labs
                </p>
                <h1 className="mt-4 text-[clamp(1.75rem,5vw,3.25rem)] font-semibold leading-[1.08] tracking-tight text-white">
                  {SITE_TAGLINE}
                </h1>
                <p className={`mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed sm:text-base ${bodyClass}`}>
                  Underground focused presets and engineering you can book today.
                  More tools and packs are on the roadmap.
                </p>
                <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
                  <div className="w-full sm:flex-1">
                    <PluginControl href="/presets" variant="primary" moduleId="SHOP">
                      Shop Presets
                    </PluginControl>
                  </div>
                  <div className="w-full sm:flex-1">
                    <TransportButton href="/services" variant="secondary">
                      Book a Service
                    </TransportButton>
                  </div>
                </div>
              </div>

              <div
                id="offerings"
                className="mt-8 grid gap-4 scroll-mt-24 sm:grid-cols-2 lg:mt-10 lg:gap-5"
              >
                {CURRENT_OFFERINGS.map((offering) => (
                  <OfferingCard key={offering.id} offering={offering} />
                ))}
              </div>
            </div>
          </RackFrame>
        </PageContainer>
      </section>

      {/* Featured custom preset */}
      <section id="featured" className="scroll-mt-24">
        <PageContainer>
          <article className="overflow-hidden rounded-[2px] border border-xs-accent/35 bg-xs-surface">
            <ModuleHeader label={FEATURED_CUSTOM_PRESET.moduleId} />
            <div className="flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between lg:p-8">
              <div className="max-w-xl">
                <p className={`${labelClass} text-xs-accent-bright/90`}>
                  Primary Offer
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {FEATURED_CUSTOM_PRESET.name}
                </h2>
                <ul className="mt-4 space-y-2">
                  {FEATURED_CUSTOM_PRESET.bullets.map((item) => (
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
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-end lg:flex-col lg:items-stretch">
                <div>
                  <p className={labelDimClass}>Starting at</p>
                  <p className="font-mono text-2xl font-medium tracking-tight text-xs-accent-bright sm:text-3xl">
                    ${FEATURED_CUSTOM_PRESET.price}
                  </p>
                </div>
                <div className="w-full sm:min-w-[12rem]">
                  <CheckoutButton
                    product="vocal_preset"
                    variant="primary"
                    moduleId="START"
                  >
                    Start Custom Preset
                  </CheckoutButton>
                </div>
              </div>
            </div>
          </article>
        </PageContainer>
      </section>

      {/* Artist spotlight */}
      <section id="spotlight" className="scroll-mt-24">
        <PageContainer>
          <RackFrame interactive={false}>
            <div className={rackInner}>
              <SectionReadout
                label="Client Rack"
                title="Artist Spotlight"
                note="Placeholder slots for future clients. Song links, socials, and credits will appear here as projects complete."
              />
              <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
                {ARTIST_SPOTLIGHTS.map((spotlight) => (
                  <ArtistSpotlightCard key={spotlight.id} spotlight={spotlight} />
                ))}
              </div>
            </div>
          </RackFrame>
        </PageContainer>
      </section>

      {/* Portfolio teaser */}
      <section id="portfolio" className="scroll-mt-24">
        <PageContainer>
          <RecessedWell className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl space-y-2">
                <span className="inline-block rounded-[2px] border border-white/12 bg-white/[0.03] px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest text-white/45">
                  {PORTFOLIO_TEASER.status}
                </span>
                <h3 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                  {PORTFOLIO_TEASER.headline}
                </h3>
                <p className={`text-sm leading-relaxed ${bodyClass}`}>
                  {PORTFOLIO_TEASER.description}
                </p>
              </div>
              <div className="w-full shrink-0 sm:max-w-[11rem]">
                <PluginControl
                  href={PORTFOLIO_TEASER.href}
                  variant="secondary"
                  moduleId="VIEW"
                >
                  {PORTFOLIO_TEASER.cta}
                </PluginControl>
              </div>
            </div>
          </RecessedWell>
        </PageContainer>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="scroll-mt-24">
        <PageContainer>
          <RackFrame interactive={false}>
            <div className={rackInner}>
              <SectionReadout
                label="Pipeline"
                title="Growing Into a Full Ecosystem"
                note="These products are in development. Today, book presets and engineering services."
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {ROADMAP_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[2px] border border-xs-border-module bg-xs-surface/60 p-4"
                  >
                    <p className="font-mono text-[0.55rem] uppercase tracking-wider text-white/30">
                      {item.moduleId}
                    </p>
                    <p className="mt-2 text-sm font-medium text-white/70">
                      {item.title}
                    </p>
                    <p className={`mt-1.5 text-xs leading-relaxed ${bodyClass}`}>
                      {item.description}
                    </p>
                    <p className="mt-3 font-mono text-[0.55rem] uppercase tracking-wider text-white/25">
                      Roadmap
                    </p>
                  </div>
                ))}
              </div>
              <p className={`mt-5 text-sm ${bodyClass}`}>
                Want early access?{" "}
                <Link
                  href="/contact"
                  className="text-xs-accent-bright/90 transition-colors hover:text-xs-accent-bright"
                >
                  Get in touch
                </Link>
                .
              </p>
            </div>
          </RackFrame>
        </PageContainer>
      </section>

      <ConversionCta
        title="Start with a preset or book a session"
        note="Underground focused engineering from a working artist. Clear pricing, secure checkout."
      />

      <SiteFooter />
    </div>
  );
}
