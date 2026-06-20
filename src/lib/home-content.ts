export const SITE_TAGLINE =
  "Custom Vocal Presets & Audio Engineering for Underground Artists";

export type CurrentOffering = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  priceHint?: string;
  primary?: boolean;
};

/** Active products available today */
export const CURRENT_OFFERINGS: CurrentOffering[] = [
  {
    id: "custom-presets",
    moduleId: "CUS · VOC",
    title: "Custom Vocal Presets",
    description:
      "A chain built around your voice, beat, and target sound. Delivered in 3 to 5 days.",
    href: "/presets",
    cta: "Get Custom Preset",
    priceHint: "From $30",
    primary: true,
  },
  {
    id: "mixing",
    moduleId: "MIX · 01",
    title: "Mixing",
    description:
      "Per track mixing with EQ, compression, effects, and balance tuned for release.",
    href: "/services",
    cta: "Book Mixing",
    priceHint: "$15 / track",
  },
  {
    id: "mastering",
    moduleId: "MST · 02",
    title: "Mastering",
    description:
      "Streaming ready loudness and polish with translation across speakers and platforms.",
    href: "/services",
    cta: "Book Mastering",
    priceHint: "$10 / track",
  },
  {
    id: "vocal-processing",
    moduleId: "VOC · 04",
    title: "Vocal Processing",
    description:
      "Tuning, effects, and vocal design shaped to your voice. Scoped and quoted per project.",
    href: "/contact",
    cta: "Request Quote",
    priceHint: "Quote",
  },
];

export type RoadmapItem = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
};

/** Future ecosystem products — not yet for sale */
export const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: "plugins",
    moduleId: "PLG · DEV",
    title: "Plugins",
    description: "In house creative tools built around underground workflows.",
  },
  {
    id: "beats",
    moduleId: "BTS · LIB",
    title: "Beat Store",
    description: "Underground instrumentals and production packs.",
  },
  {
    id: "preset-packs",
    moduleId: "PRE · PKG",
    title: "Preset Packs",
    description: "Genre vocal chains and mix bus tools in curated bundles.",
  },
  {
    id: "sample-packs",
    moduleId: "SMP · LIB",
    title: "Sample Packs",
    description: "One shots, loops, and textures for modern rap and alt sessions.",
  },
];

export const ARTIST_SPOTLIGHTS = [
  {
    id: "spot-01",
    slot: "ART · 01",
    artist: "Artist Slot Open",
    projectType: "Custom Vocal Preset",
    social: "Coming soon",
  },
  {
    id: "spot-02",
    slot: "ART · 02",
    artist: "Artist Slot Open",
    projectType: "Mix + Master",
    social: "Coming soon",
  },
  {
    id: "spot-03",
    slot: "ART · 03",
    artist: "Artist Slot Open",
    projectType: "Vocal Processing",
    social: "Coming soon",
  },
] as const;

export const PORTFOLIO_TEASER = {
  status: "Example Demonstrations",
  headline: "Before and after vocal chain examples",
  description:
    "These demos show what custom and premade chains can do. Client work will replace placeholders as sessions land.",
  href: "/portfolio",
  cta: "View Examples",
} as const;

export const FEATURED_CUSTOM_PRESET = {
  name: "Fully Custom Vocal Preset",
  price: 30,
  moduleId: "CUSTOM · VOCAL",
  bullets: [
    "Built around your voice, beat, and target sound",
    "Delivered in 3 to 5 days with setup notes",
    "EQ, compression, space, and tone shaped for how you perform",
  ],
} as const;
