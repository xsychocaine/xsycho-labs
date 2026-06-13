import type { Metadata } from "next";
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
import { bodyClass, labelClass, labelDimClass, sectionStack } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Presets | Xsycho Labs",
  description:
    "Fully custom vocal presets from $25, plus Xsycho Vocal Starter Chain editions at $10 to $20. Instant industry ready vocal sound for artists and producers.",
};

const CUSTOM_PRESET = {
  name: "Fully Custom Vocal Preset",
  price: 25,
  moduleId: "CUSTOM · VOCAL",
  tagline: "Instant industry ready vocal sound",
  description:
    "Not a generic chain. I sculpt this preset around your voice, your beat, and the exact sound you're going for. EQ, compression, space, and tone are shaped specifically for how you sing or rap.",
  chainSlots: [
    { name: "EQ Sculpt", level: 72 },
    { name: "Dynamics", level: 58 },
    { name: "De-Ess", level: 45 },
    { name: "Space", level: 38 },
    { name: "Tone", level: 65 },
  ],
  whatItDoes: [
    "Custom vocal chain matched to your voice and genre",
    "EQ, compression, de-essing, and space dialed for your track",
    "Processing choices explained for your setup",
    "Delivered for your DAW with load-in instructions",
  ],
  whoItsFor: [
    "Independent artists recording at home or in the studio",
    "Engineers who want a repeatable vocal starting point",
    "Producers building consistent vocal tone across projects",
  ],
  compatibility: [
    { daw: "FL Studio", status: "Supported" },
    { daw: "Logic Pro", status: "Supported" },
    { daw: "Ableton Live", status: "Supported" },
    { daw: "Pro Tools", status: "On Request" },
  ],
} as const;

const flStockIncluded = [
  "Vocal chain built with stock FL Studio plugins only",
  "Fruity EQ, Compressor, Maximus, Reverb & more",
  "No third party plugins required",
  "FL Studio project file + preset file",
  "Setup guide with input gain staging",
] as const;

const premiumIncluded = [
  "Enhanced chain with premium third party plugins",
  "Pro grade EQ, compression, de ess & space",
  "Deeper tone shaping and polish out of the box",
  "Compatible with FL Studio (plugins required)",
  "Setup guide + alternative stock plugin fallback notes",
] as const;

const flPreviewSlots = [
  { name: "Fruity EQ", level: 70 },
  { name: "Fruity Comp", level: 55 },
  { name: "Maximus", level: 48 },
  { name: "Fruity Reverb", level: 40 },
  { name: "Soft Clip", level: 62 },
];

const premiumPreviewSlots = [
  { name: "Pro-Q", level: 75 },
  { name: "Pro-C", level: 60 },
  { name: "Pro-DS", level: 50 },
  { name: "VintageVerb", level: 42 },
  { name: "Limiter", level: 68 },
];

const comingSoon = [
  "Vocal Pro Chain",
  "Mix Bus Glue",
  "Trap Vocal Pack",
] as const;

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
        {Array.from({ length: 40 }).map((_, i) => {
          const h = 20 + Math.abs(Math.sin(i * 0.45)) * 80;
          return (
            <div
              key={i}
              className="w-[2px] rounded-[1px] bg-gradient-to-t from-[#1e0a3a] to-xs-accent-bright/70"
              style={{ height: `${h}%` }}
            />
          );
        })}
      </div>
    </RecessedWell>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
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
  );
}

function FeaturedCustomPreset() {
  return (
    <article
      className={`group/featured relative overflow-hidden rounded-[2px] border border-xs-accent/35 bg-xs-surface ${glowRest} shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_48px_-12px_rgba(168,85,247,0.25),inset_0_1px_0_rgba(255,255,255,0.05)]`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-xs-accent-bright/70 to-transparent"
      />
      <ModuleHeader label={CUSTOM_PRESET.moduleId} />

      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10">
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

          <div>
            <p className={labelDimClass}>Compatibility</p>
            <RecessedWell className="mt-3 space-y-2 p-4">
              {CUSTOM_PRESET.compatibility.map((row) => (
                <div
                  key={row.daw}
                  className="flex items-center justify-between rounded-[2px] border border-white/[0.05] bg-xs-inset px-3 py-2"
                >
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-white/45">
                    {row.daw}
                  </span>
                  <span className="font-mono text-[0.55rem] uppercase tracking-widest text-xs-accent/70">
                    {row.status}
                  </span>
                </div>
              ))}
              <p className="pt-1 text-center font-mono text-[0.55rem] uppercase tracking-[0.12em] text-white/25">
                More DAWs available on request
              </p>
            </RecessedWell>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={labelDimClass}>Starting at</p>
              <p className="mt-1 font-mono text-3xl font-medium tracking-tight text-xs-accent-bright sm:text-4xl">
                ${CUSTOM_PRESET.price}
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
          slots={CUSTOM_PRESET.chainSlots}
          label="Your Custom Chain"
        />
      </div>
    </article>
  );
}

function PresetPreviewMock({
  label,
  slots,
  variant = "stock",
}: {
  label: string;
  slots: { name: string; level: number }[];
  variant?: "stock" | "premium";
}) {
  const barClass =
    variant === "premium"
      ? "bg-gradient-to-r from-xs-accent-deep to-xs-accent-bright"
      : "bg-gradient-to-r from-[#1e0a3a] to-xs-accent/70";

  return (
    <RecessedWell className="overflow-hidden p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <span className={labelDimClass}>{label}</span>
        <span className="flex gap-1" aria-hidden>
          <span
            className={`h-1.5 w-1.5 rounded-full ${variant === "premium" ? "bg-xs-accent-bright shadow-[0_0_8px_rgba(168,85,247,0.9)]" : "bg-xs-accent/70 shadow-[0_0_4px_rgba(168,85,247,0.5)]"}`}
          />
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
                className={`absolute inset-y-0 left-0 rounded-[1px] ${barClass}`}
                style={{ width: `${slot.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex h-10 items-end justify-center gap-[2px] border-t border-white/[0.04] pt-3">
        {Array.from({ length: 32 }).map((_, i) => {
          const h = 20 + Math.abs(Math.sin(i * 0.5)) * 80;
          return (
            <div
              key={i}
              className="w-[2px] rounded-[1px] bg-gradient-to-t from-[#1e0a3a] to-xs-accent-bright/70"
              style={{ height: `${h}%` }}
            />
          );
        })}
      </div>
    </RecessedWell>
  );
}

function PresetTierCard({
  moduleId,
  edition,
  title,
  description,
  included,
  price,
  product,
  previewLabel,
  previewSlots,
  previewVariant,
  featured = false,
}: {
  moduleId: string;
  edition: string;
  title: string;
  description: string;
  included: readonly string[];
  price: number;
  product: string;
  previewLabel: string;
  previewSlots: { name: string; level: number }[];
  previewVariant: "stock" | "premium";
  featured?: boolean;
}) {
  return (
    <article
      className={`group/tier group/module flex h-full flex-col overflow-hidden rounded-[2px] border bg-xs-surface ${glowRest} ${panelHover} ${glowHover} ${
        featured
          ? "border-xs-accent/30 hover:border-xs-accent-bright/40"
          : "border-xs-border-module hover:border-xs-accent/25"
      }`}
    >
      <ModuleHeader label={moduleId} />
      <div className="flex flex-1 flex-col gap-5 p-5 lg:p-6">
        <div>
          <p className={`${labelDimClass} text-xs-accent/70`}>{edition}</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {title}
          </h2>
          <p className={`mt-3 text-sm leading-relaxed ${bodyClass}`}>
            {description}
          </p>
        </div>

        <PresetPreviewMock
          label={previewLabel}
          slots={previewSlots}
          variant={previewVariant}
        />

        <div>
          <p className={labelDimClass}>What&apos;s Included</p>
          <ul className="mt-3 space-y-2">
            {included.map((item) => (
              <li
                key={item}
                className={`flex gap-2 text-sm leading-relaxed ${bodyClass}`}
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

        <div className="mt-auto space-y-4 border-t border-white/[0.06] pt-5">
          <div>
            <p className={labelDimClass}>License</p>
            <p className="mt-1 font-mono text-2xl font-medium tracking-tight text-xs-accent-bright/90">
              ${price}
            </p>
            <p className="mt-1 text-xs text-white/35">
              One-time purchase · Instant delivery
            </p>
          </div>
          <CheckoutButton
            product={product}
            variant={featured ? "primary" : "secondary"}
            moduleId="BUY"
          >
            Buy Now
          </CheckoutButton>
        </div>
      </div>
    </article>
  );
}

export default function PresetsPage() {
  return (
    <div
      className={`relative text-white ${sectionStack} pb-16 pt-6 md:pb-24 md:pt-8`}
    >
      <PageContainer>
        <PageHeader label="Digital Products" title="Presets" />
      </PageContainer>

      {/* Featured: Fully Custom Vocal Preset */}
      <PageContainer>
        <FeaturedCustomPreset />
      </PageContainer>

      {/* Entry products: Starter Chain */}
      <PageContainer>
        <RackFrame>
          <ModuleHeader label="PRESET · VOCAL CHAIN" />
          <div className={rackInner}>
            <SectionReadout
              label="Xsycho Vocal Starter Chain"
              title="Entry Editions"
              note="Low-cost entry points at $10 to $20. Same release ready workflow. Choose stock FL plugins or my premium third party edition."
            />

            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <PresetTierCard
                moduleId="FL-STK"
                edition="FL Stock · Built-in Plugins"
                title="Stock FL Edition"
                description="The full vocal chain using only stock FL Studio plugins. No extra purchases required. Pro results inside the box you already own."
                included={flStockIncluded}
                price={10}
                product="vocal_preset_starter_fl"
                previewLabel="FL Stock Chain"
                previewSlots={flPreviewSlots}
                previewVariant="stock"
              />
              <PresetTierCard
                moduleId="PRE-PLG"
                edition="Premium · Third Party"
                title="Premium Plugin Edition"
                description="Upgraded chain with premium third party plugins for tighter control, richer tone, and a more polished vocal sound straight off the preset."
                included={premiumIncluded}
                price={20}
                product="vocal_preset_starter_premium"
                previewLabel="Premium Chain"
                previewSlots={premiumPreviewSlots}
                previewVariant="premium"
                featured
              />
            </div>
          </div>
        </RackFrame>
      </PageContainer>

      {/* Coming soon */}
      <PageContainer>
        <RackFrame interactive={false}>
          <div className={rackInner}>
            <SectionReadout
              label="Pipeline"
              title="More Presets Coming Soon"
              note="Additional vocal chains, mix bus tools, and genre-specific packs in development. Follow on socials or join the Discord for launch updates."
            />
            <div className="grid gap-4 sm:grid-cols-3">
              {comingSoon.map((name, i) => (
                <article
                  key={name}
                  className={`flex flex-col gap-3 rounded-[2px] border border-xs-border-module bg-xs-surface p-5 opacity-60 ${glowRest} ${panelHover} ${glowHover}`}
                >
                  <span className="font-mono text-[0.55rem] uppercase tracking-widest text-white/25">
                    TBA · 0{i + 2}
                  </span>
                  <h3 className="text-sm font-medium text-white/50">{name}</h3>
                  <p className="font-mono text-[0.6rem] uppercase tracking-wider text-xs-accent/40">
                    Coming Soon
                  </p>
                </article>
              ))}
            </div>
          </div>
        </RackFrame>
      </PageContainer>

      <SiteFooter />
    </div>
  );
}
