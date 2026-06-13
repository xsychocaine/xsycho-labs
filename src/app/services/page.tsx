import type { Metadata } from "next";
import {
  PageContainer,
  PageHeader,
  PluginControl,
  PricingModule,
  RackFrame,
  SectionReadout,
  SiteFooter,
  rackInner,
} from "@/components/console-ui";
import { labelClass, sectionStack } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Services | Xsycho Labs",
  description:
    "Mixing, mastering, bundles, and vocal processing for independent artists. Studio grade audio engineering with clear per track pricing.",
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
      "Optional add on. Tuning, effects, and vocal design shaped to your voice and track. Final price depends on scope and complexity.",
    href: "/contact",
    featured: false,
    badge: "Optional",
  },
] as const;

export default function ServicesPage() {
  return (
    <div
      className={`relative text-white ${sectionStack} pb-16 pt-6 md:pb-24 md:pt-8`}
    >
      <PageContainer>
        <PageHeader label="Signal Chain" title="Services" />
      </PageContainer>

      <PageContainer>
        <RackFrame>
          <div className={rackInner}>
            <SectionReadout
              label="Session Modules"
              title="Mixing & Mastering"
              note="Per track pricing. Pay securely, then submit your files on the next step."
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
              {services.map((service) => (
                <PricingModule
                  key={service.moduleId}
                  moduleId={service.moduleId}
                  title={service.title}
                  priceRange={service.priceRange}
                  description={service.description}
                  ctaLabel={"product" in service ? "Buy Now" : "Book Service"}
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

      <PageContainer>
        <RackFrame interactive={false}>
          <div className={`${rackInner} mx-auto max-w-xl text-center`}>
            <SectionReadout
              label="Next Step"
              title="Need something custom?"
              note="Vocal processing quotes and complex projects — reach out and I'll confirm scope before we start."
            />
            <div className="mx-auto max-w-xs">
              <PluginControl href="/contact" variant="primary" moduleId="BOOK">
                Get in Touch
              </PluginControl>
            </div>
          </div>
        </RackFrame>
      </PageContainer>

      <PageContainer>
        <p className={`text-center ${labelClass} text-white/25`}>
          Questions about your project?{" "}
          <a
            href="/contact"
            className="text-xs-accent/70 transition-colors hover:text-xs-accent-bright"
          >
            Get in touch
          </a>
          . I typically respond within 48 hours.
        </p>
      </PageContainer>

      <SiteFooter />
    </div>
  );
}
