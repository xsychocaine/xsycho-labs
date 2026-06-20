import type { Metadata } from "next";
import { ConversionCta } from "@/components/conversion-cta";
import {
  PageContainer,
  PageHeader,
  PluginControl,
  PricingModule,
  RackFrame,
  RecessedWell,
  SectionReadout,
  SiteFooter,
  rackInner,
} from "@/components/console-ui";
import { SITE_TAGLINE } from "@/lib/home-content";
import { labelClass, sectionStack } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Services | Xsycho Labs",
  description:
    "Per track mixing and mastering, vocal processing quotes, and mix + master bundles for underground artists.",
};

const services = [
  {
    moduleId: "MIX-01",
    title: "Mixing",
    priceRange: "$15 / track",
    description:
      "EQ, compression, effects, and balancing. A clean, industry ready mix tuned for release and streaming playback.",
    product: "mixing_service",
    featured: false,
    badge: undefined,
  },
  {
    moduleId: "MST-02",
    title: "Mastering",
    priceRange: "$10 / track",
    description:
      "Streaming ready loudness and polish. Final detail and translation across speakers, headphones, and platforms.",
    product: "mastering_service",
    featured: false,
    badge: undefined,
  },
  {
    moduleId: "BND-03",
    title: "Mix + Master Bundle",
    priceRange: "$20 / track",
    description:
      "Combined mix and master in one session. Cohesive sound, faster turnaround, and a discounted rate versus booking separately.",
    product: "mix_master_bundle",
    featured: true,
    badge: "Best Value",
  },
  {
    moduleId: "VOC-04",
    title: "Vocal Processing",
    priceRange: "Quote on request",
    description:
      "Tuning, effects, and vocal design shaped to your voice and track. Final price depends on scope and complexity.",
    href: "/contact",
    featured: false,
    badge: "Custom Quote",
  },
] as const;

export default function ServicesPage() {
  return (
    <div
      className={`relative text-white ${sectionStack} pb-16 pt-4 md:pb-20 md:pt-6`}
    >
      <PageContainer>
        <PageHeader
          label="Signal Chain"
          title="Audio Engineering Services"
          note={`${SITE_TAGLINE} Per track pricing with secure checkout and guided intake.`}
          className="mb-5"
        />
      </PageContainer>

      <PageContainer>
        <RecessedWell className="mb-0 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white/75">
                Need a vocal chain first?
              </p>
              <p className="mt-1 text-sm text-white/45">
                Custom and premade presets are the fastest path to a finished vocal tone.
              </p>
            </div>
            <div className="w-full sm:max-w-[11rem]">
              <PluginControl href="/presets" variant="primary" moduleId="SHOP">
                Shop Presets
              </PluginControl>
            </div>
          </div>
        </RecessedWell>
      </PageContainer>

      <PageContainer>
        <RackFrame>
          <div className={rackInner}>
            <SectionReadout
              label="Session Modules"
              title="Book a Session"
              note="Pay securely through Stripe, then submit files on the intake form."
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
              {services.map((service) => (
                <PricingModule
                  key={service.moduleId}
                  moduleId={service.moduleId}
                  title={service.title}
                  priceRange={service.priceRange}
                  description={service.description}
                  ctaLabel={"product" in service ? "Buy Now" : "Request Quote"}
                  product={"product" in service ? service.product : undefined}
                  href={"href" in service ? service.href : undefined}
                  featured={service.featured}
                  badge={service.badge}
                />
              ))}
            </div>
          </div>
        </RackFrame>
      </PageContainer>

      <ConversionCta
        title="Not sure which service fits?"
        note="Send project details and I will confirm scope before you commit."
      />

      <PageContainer>
        <p className={`text-center ${labelClass} text-white/25`}>
          Questions?{" "}
          <a
            href="/contact"
            className="text-xs-accent/70 transition-colors hover:text-xs-accent-bright"
          >
            Contact Xsycho Labs
          </a>
          . Typical response within 48 hours.
        </p>
      </PageContainer>

      <SiteFooter />
    </div>
  );
}
