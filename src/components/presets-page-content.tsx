"use client";

import { useState } from "react";
import { CheckoutButton } from "@/components/checkout-button";
import {
  ModuleHeader,
  PageContainer,
  PageHeader,
  RackFrame,
  RecessedWell,
  SectionReadout,
  SiteFooter,
  glowHover,
  glowRest,
  panelHover,
  rackInner,
} from "@/components/console-ui";
import { ScrollCue } from "@/components/scroll-cue";
import {
  bodyClass,
  labelClass,
  labelDimClass,
  sectionStack,
  transitionSmooth,
} from "@/lib/design-tokens";
import { getDigitalProduct } from "@/lib/digital-products";
import { getProductConfig } from "@/lib/products";

const VOCAL_CHAIN_LITE = getDigitalProduct("xsycho-vocal-chain-lite")!;
const VOCAL_CHAIN_PRO = getDigitalProduct("xsycho-vocal-chain-pro")!;

type PresetTab = "custom" | "premade";

const CUSTOM_PRESET = {
  name: "Fully Custom Vocal Preset",
  price: 25,
  moduleId: "CUSTOM · VOCAL",
  tagline: "Instant industry ready vocal sound",
  description:
    "Not a generic chain. I sculpt this preset around your voice, your beat, and the exact sound you're going for. EQ, compression, space, and tone are shaped specifically for how you sing or rap.",
  whatItDoes: [
    "Custom vocal chain matched to your voice and genre",
    "EQ, compression, de-essing, and space dialed for your track",
    "Processing choices explained for your setup",
  ],
  whoItsFor: [
    "Independent artists recording at home or in the studio",
    "Engineers who want a repeatable vocal starting point",
    "Producers building consistent vocal tone across projects",
  ],
  chainSlots: [
    { name: "EQ Sculpt", level: 72 },
    { name: "Dynamics", level: 58 },
    { name: "De-Ess", level: 45 },
    { name: "Space", level: 38 },
    { name: "Tone", level: 65 },
  ],
} as const;

const liteIncluded = [
  "Release-ready vocal chain preset",
  "Built for FL Studio workflows",
  "You'll need your own tuner plugin",
  "Instant download after checkout",
  "No intake required",
] as const;

const proIncluded = [
  "My starting-point chain for every song",
  "Meta Tune, FabFilter suite, and Waves suite",
  "Own these plugins before purchasing",
  "Contact me for legal ways to obtain these plugins 👍",
] as const;

const comingSoon = ["Mix Bus Glue", "Trap Vocal Pack", "Genre Vocal Packs"] as const;

const CHAIN_WAVEFORM_HEIGHTS = [
  20, 55, 83, 98, 98, 82, 54, 21, 55, 83, 98, 98, 82, 54, 21, 56, 83, 98, 98,
  81, 53, 22, 57, 84, 98, 97, 81, 52, 23, 57, 84, 99, 97, 81, 52, 23, 58, 85,
  99, 97,
] as const;

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

function PresetTabBar({
  active,
  onChange,
}: {
  active: PresetTab;
  onChange: (tab: PresetTab) => void;
}) {
  const tabs: { id: PresetTab; label: string; featured?: boolean }[] = [
    { id: "custom", label: "Fully Custom", featured: true },
    { id: "premade", label: "Premade" },
  ];

  return (
    <div className="flex justify-center">
      <div
        className="inline-flex rounded-[2px] border border-white/[0.08] bg-xs-inset p-1"
        role="tablist"
        aria-label="Preset categories"
      >
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`relative rounded-[2px] px-5 py-2.5 font-mono text-[0.65rem] uppercase tracking-wider ${transitionSmooth} ${
                isActive
                  ? tab.featured
                    ? "border border-xs-accent/50 bg-xs-accent/15 text-xs-accent-bright shadow-[0_0_24px_-4px_rgba(168,85,247,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]"
                    : "border border-white/[0.1] bg-xs-surface text-white"
                  : "border border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
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

function FeaturedCustomPreset() {
  return (
    <article
      className={`group/featured relative overflow-hidden rounded-[2px] border border-xs-accent/35 bg-xs-surface ${glowRest} shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_48px_-12px_rgba(168,85,247,0.28),inset_0_1px_0_rgba(255,255,255,0.05)]`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-xs-accent-bright/70 to-transparent"
      />
      <ModuleHeader label={CUSTOM_PRESET.moduleId} />

      <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10">
        <div className="flex flex-col gap-6">
          <div>
            <p className={`${labelClass} text-xs-accent-bright/90`}>
              Featured Product
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {CUSTOM_PRESET.name}
            </h2>
            <p className="mt-2 text-base font-medium text-white/75">
              {CUSTOM_PRESET.tagline}
            </p>
            <p className={`mt-4 ${bodyClass}`}>{CUSTOM_PRESET.description}</p>
          </div>

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

          <div className="flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={labelDimClass}>Starting at</p>
              <p className="mt-1 font-mono text-3xl font-medium tracking-tight text-xs-accent-bright sm:text-4xl">
                ${CUSTOM_PRESET.price}
              </p>
              <p className="mt-1 text-xs text-white/35">
                Intake required · Delivered in 3–5 days
              </p>
            </div>
            <div className="w-full sm:max-w-[14rem]">
              <CheckoutButton product="vocal_preset" variant="primary" moduleId="BUY">
                Buy Now
              </CheckoutButton>
            </div>
          </div>
        </div>

        <ChainPreview slots={CUSTOM_PRESET.chainSlots} label="Your Custom Chain" />
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
          <div className="mt-1">
            <BulletList items={included} compact />
          </div>
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

function PremadeSection() {
  return (
    <RackFrame>
      <ModuleHeader label="INST · DELIVER" />
      <div className={`${rackInner} flex flex-col gap-5`}>
        <SectionReadout
          label="Instant Delivery"
          title="Premade Vocal Chains"
          note="Download immediately after checkout. No intake form, no waiting."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
          <PresetTierCard
            moduleId="LITE"
            badge="Instant Download · $10"
            title={VOCAL_CHAIN_LITE.name}
            description="A streamlined vocal chain you can load and go — pro tone without a custom build."
            included={liteIncluded}
            price={VOCAL_CHAIN_LITE.price}
            product={VOCAL_CHAIN_LITE.id}
          />
          <PresetTierCard
            moduleId="PRO"
            badge="Instant Download · $20"
            title={VOCAL_CHAIN_PRO.name}
            description="The starting point for every song I make — Meta Tune, FabFilter, and Waves. Own those plugins before purchasing."
            included={proIncluded}
            price={VOCAL_CHAIN_PRO.price}
            product={VOCAL_CHAIN_PRO.id}
            featured
          />
        </div>
      </div>
    </RackFrame>
  );
}

function ComingSoonSection() {
  return (
    <RackFrame interactive={false}>
      <div className={`${rackInner} py-4 sm:py-5`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionReadout
            label="Pipeline"
            title="More Coming Soon"
            note="Mix bus tools and genre packs in development."
          />
          <div className="flex flex-wrap gap-2">
            {comingSoon.map((name) => (
              <span
                key={name}
                className="rounded-[2px] border border-xs-border-module bg-xs-surface px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-wider text-white/40"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </RackFrame>
  );
}

export function PresetsPageContent() {
  const [tab, setTab] = useState<PresetTab>("custom");

  return (
    <div
      className={`relative text-white ${sectionStack} gap-8 pb-12 pt-6 md:gap-10 md:pb-16 md:pt-8`}
    >
      <PageContainer>
        <PageHeader label="Digital Products" title="Presets" />
        <div className="mt-6">
          <PresetTabBar active={tab} onChange={setTab} />
        </div>
      </PageContainer>

      {tab === "custom" ? (
        <>
          <PageContainer>
            <FeaturedCustomPreset />
          </PageContainer>

          <PageContainer className="flex justify-center py-2">
            <ScrollCue href="#coming-soon" />
          </PageContainer>

          <div id="coming-soon" className="scroll-mt-24">
            <PageContainer>
              <ComingSoonSection />
            </PageContainer>
          </div>
        </>
      ) : (
        <>
          <PageContainer>
            <PremadeSection />
          </PageContainer>

          <PageContainer className="flex justify-center py-2">
            <ScrollCue href="#coming-soon" />
          </PageContainer>

          <div id="coming-soon" className="scroll-mt-24">
            <PageContainer>
              <ComingSoonSection />
            </PageContainer>
          </div>
        </>
      )}

      <SiteFooter />
    </div>
  );
}
