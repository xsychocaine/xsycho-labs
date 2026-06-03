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
    priceRange: "$15 to $50 / track",
    description:
      "EQ, compression, effects, and balancing. A clean, industry ready mix tuned for release and streaming playback.",
    href: "/contact",
    featured: false,
    badge: undefined,
  },
  {
    moduleId: "MST-02",
    title: "Mastering",
    priceRange: "$10 to $50 / track",
    description:
      "Streaming ready loudness and polish. Final detail and translation across speakers, headphones, and platforms.",
    href: "/contact",
    featured: false,
    badge: undefined,
  },
  {
    moduleId: "BND-03",
    title: "Mix + Master Bundle",
    priceRange: "$20 to $75 / track",
    description:
      "Combined mix and master in one session. Cohesive sound, faster turnaround, and a discounted rate versus booking separately.",
    href: "/contact",
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
              note="Per track pricing. I confirm your quote before the session starts."
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
              {services.map((service) => (
                <PricingModule
                  key={service.moduleId}
                  moduleId={service.moduleId}
                  title={service.title}
                  priceRange={service.priceRange}
                  description={service.description}
                  ctaLabel="Book Service"
                  href={service.href}
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
              title="Ready to book?"
              note="Share your project, references, and timeline. I'll respond with a quote and turnaround estimate."
            />
            <div className="mx-auto max-w-xs">
              <PluginControl href="/contact" variant="primary" moduleId="BOOK">
                Get Started
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
