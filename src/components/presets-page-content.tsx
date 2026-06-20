"use client";

import Link from "next/link";
import { CheckoutButton } from "@/components/checkout-button";
import { ConversionCta } from "@/components/conversion-cta";
import {
  ModuleHeader,
  PageContainer,
  PageHeader,
  PluginControl,
  RackFrame,
  RecessedWell,
  SectionReadout,
  SiteFooter,
  glowHover,
  glowRest,
  panelHover,
  rackInner,
} from "@/components/console-ui";
import {
  bodyClass,
  labelClass,
  labelDimClass,
  sectionStack,
} from "@/lib/design-tokens";
import { ROADMAP_ITEMS, SITE_TAGLINE } from "@/lib/home-content";
import { getDigitalProduct } from "@/lib/digital-products";
import { getProductConfig } from "@/lib/products";

const VOCAL_CHAIN_LITE = getDigitalProduct("xsycho-vocal-chain-lite")!;
const VOCAL_CHAIN_PRO = getDigitalProduct("xsycho-vocal-chain-pro")!;

const CUSTOM_PRESET = {
  name: "Fully Custom Vocal Preset",
  price: 30,
  moduleId: "CUSTOM · VOCAL",
  tagline: "Built around your voice, not a template",
  description:
    "I sculpt this chain around your voice, your beat, and the sound you want. EQ, compression, space, and tone are shaped for how you actually perform.",
  whatItDoes: [
    "Custom vocal chain matched to your voice and genre",
    "EQ, compression, sibilance control, and space dialed for your track",
    "Processing choices explained for your setup",
  ],
  whoItsFor: [
    "Independent artists recording at home or in the studio",
    "Engineers who want a repeatable vocal starting point",
    "Producers building consistent vocal tone across projects",
  ],
} as const;

const liteIncluded = [
  "Strictly stock plugins",
  "Built for FL Studio workflows",
  "You'll need your own tuner plugin",
  "Instant download after checkout",
  "No intake required",
] as const;

const proIncluded = [
  "Release ready vocal chain preset",
  "My starting point chain for every song",
  "Meta Tune, FabFilter suite, and Waves suite",
  "Own these plugins before purchasing",
  "Contact me for legal ways to obtain these plugins 👍",
] as const;

const presetRoadmap = ROADMAP_ITEMS.filter((item) =>
  ["preset-packs", "plugins"].includes(item.id),
);

function BulletList({
  items,
  compact = false,
}: {
  items: readonly string[];
  compact?: boolean;
}) {
  return (
    <ul className={compact ? "space-y-2" : "space-y-2.5"}>
      {items.map((item) => (
        <li
          key={item}
          className={`flex gap-2.5 ${compact ? "text-xs leading-relaxed" : "text-sm leading-relaxed"} ${bodyClass}`}
        >
          <span
            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-xs-accent/80"
            aria-hidden
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

function FeaturedCustomPreset() {
  return (
    <article
      className={`relative overflow-hidden rounded-[2px] border border-xs-accent/35 bg-xs-surface ${glowRest} shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_40px_-14px_rgba(168,85,247,0.22),inset_0_1px_0_rgba(255,255,255,0.05)]`}
    >
      <ModuleHeader label={CUSTOM_PRESET.moduleId} />
      <div className="flex flex-col gap-6 p-5 sm:p-8 lg:p-10">
        <div className="max-w-2xl">
          <p className={`${labelClass} text-xs-accent-bright/90`}>
            Best Seller · Custom Order
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {CUSTOM_PRESET.name}
          </h2>
          <p className="mt-2 text-base font-medium text-white/75">
            {CUSTOM_PRESET.tagline}
          </p>
          <p className={`mt-4 ${bodyClass}`}>{CUSTOM_PRESET.description}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className={labelDimClass}>What it does</p>
            <div className="mt-3">
              <BulletList items={CUSTOM_PRESET.whatItDoes} />
            </div>
          </div>
          <div>
            <p className={labelDimClass}>Who it&apos;s for</p>
            <div className="mt-3">
              <BulletList items={CUSTOM_PRESET.whoItsFor} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={labelDimClass}>Starting at</p>
            <p className="mt-1 font-mono text-3xl font-medium tracking-tight text-xs-accent-bright sm:text-4xl">
              ${CUSTOM_PRESET.price}
            </p>
            <p className="mt-1 text-xs text-white/35">
              Intake required · Delivered in 3 to 5 days
            </p>
          </div>
          <div className="w-full sm:max-w-[14rem]">
            <CheckoutButton product="vocal_preset" variant="primary" moduleId="BUY">
              Buy Custom Preset
            </CheckoutButton>
          </div>
        </div>
      </div>
    </article>
  );
}

function PresetTierCard({
  moduleId,
  badge,
  title,
  description,
  included,
  price,
  product,
  featured = false,
}: {
  moduleId: string;
  badge: string;
  title: string;
  description: string;
  included: readonly string[];
  price: number;
  product: string;
  featured?: boolean;
}) {
  const configPrice = getProductConfig(product)?.price ?? price;

  return (
    <article
      className={`group/tier flex h-full flex-col overflow-hidden rounded-[2px] border bg-xs-surface ${glowRest} ${panelHover} ${glowHover} ${
        featured
          ? "border-xs-accent/30 hover:border-xs-accent-bright/40"
          : "border-xs-border-module hover:border-xs-accent/25"
      }`}
    >
      <ModuleHeader label={moduleId} />
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div>
          <p className={`${labelDimClass} text-xs-accent/70`}>{badge}</p>
          <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-white sm:text-xl">
            {title}
          </h2>
          <p className={`mt-2 text-sm leading-relaxed ${bodyClass}`}>
            {description}
          </p>
        </div>
        <div className="flex-1">
          <BulletList items={included} compact />
        </div>
        <div className="flex items-end justify-between gap-4 border-t border-white/[0.06] pt-4">
          <div>
            <p className={labelDimClass}>License</p>
            <p className="mt-0.5 font-mono text-2xl font-medium tracking-tight text-xs-accent-bright/90">
              ${configPrice}
            </p>
            <p className="text-[0.65rem] text-emerald-400/80">Instant delivery</p>
          </div>
          <div className="w-full max-w-[9.5rem]">
            <CheckoutButton
              product={product}
              variant={featured ? "primary" : "secondary"}
              moduleId="BUY"
            >
              Buy Now
            </CheckoutButton>
          </div>
        </div>
      </div>
    </article>
  );
}

export function PresetsPageContent() {
  return (
    <div
      className={`relative text-white ${sectionStack} pb-12 pt-4 md:pb-16 md:pt-6`}
    >
      <PageContainer>
        <PageHeader
          label="Primary Storefront"
          title="Vocal Presets"
          note={`${SITE_TAGLINE} Custom chains and instant downloads from $15.`}
        />
      </PageContainer>

      <PageContainer>
        <FeaturedCustomPreset />
      </PageContainer>

      <PageContainer>
        <RackFrame>
          <ModuleHeader label="INST · DELIVER" />
          <div className={`${rackInner} flex flex-col gap-5`}>
            <SectionReadout
              label="Instant Delivery"
              title="Premade Vocal Chains"
              note="Download immediately after checkout. No intake, no waiting."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
              <PresetTierCard
                moduleId="LITE"
                badge={`Instant Download · $${VOCAL_CHAIN_LITE.price}`}
                title={VOCAL_CHAIN_LITE.name}
                description="A streamlined vocal chain you can load and go. Pro tone without a custom build."
                included={liteIncluded}
                price={VOCAL_CHAIN_LITE.price}
                product={VOCAL_CHAIN_LITE.id}
              />
              <PresetTierCard
                moduleId="PRO"
                badge={`Instant Download · $${VOCAL_CHAIN_PRO.price}`}
                title={VOCAL_CHAIN_PRO.name}
                description="The starting point for every song I make. Meta Tune, FabFilter, and Waves. Own those plugins before purchasing."
                included={proIncluded}
                price={VOCAL_CHAIN_PRO.price}
                product={VOCAL_CHAIN_PRO.id}
                featured
              />
            </div>
          </div>
        </RackFrame>
      </PageContainer>

      <PageContainer>
        <RecessedWell className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg">
              <p className={labelDimClass}>Also available</p>
              <h3 className="mt-1 text-base font-semibold text-white sm:text-lg">
                Mixing, mastering, and vocal processing
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${bodyClass}`}>
                Need a full session after your preset? Book per track engineering
                or request a vocal processing quote.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:max-w-[14rem]">
              <PluginControl href="/services" variant="primary" moduleId="SERV">
                View Services
              </PluginControl>
              <PluginControl href="/contact" variant="secondary" moduleId="BOOK">
                Contact
              </PluginControl>
            </div>
          </div>
        </RecessedWell>
      </PageContainer>

      <PageContainer>
        <RackFrame interactive={false}>
          <div className={`${rackInner} py-2`}>
            <SectionReadout
              label="Roadmap"
              title="More Preset Products Coming"
              note="Genre packs and plugin tools are in development. Not available for purchase yet."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {presetRoadmap.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[2px] border border-xs-border-module bg-xs-surface/50 p-4"
                >
                  <p className="font-mono text-[0.55rem] uppercase tracking-wider text-white/30">
                    {item.moduleId} · Roadmap
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/65">
                    {item.title}
                  </p>
                  <p className={`mt-1 text-xs leading-relaxed ${bodyClass}`}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            <p className={`mt-4 text-sm ${bodyClass}`}>
              Questions about custom work?{" "}
              <Link
                href="/contact"
                className="text-xs-accent-bright/90 hover:text-xs-accent-bright"
              >
                Reach out
              </Link>
              .
            </p>
          </div>
        </RackFrame>
      </PageContainer>

      <ConversionCta
        title="Not sure which preset fits?"
        note="Start with a custom chain or grab a premade download. I can also point you to the right service."
      />

      <SiteFooter />
    </div>
  );
}
