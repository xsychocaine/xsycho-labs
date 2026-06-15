export type VocalChainDemo = {
  id: string;
  title: string;
  product: string;
  rawSrc: string;
  processedSrc: string;
  /** Optional cap on playable length in seconds (e.g. 15 for short demos). */
  clipDurationSeconds?: number;
};

export type MixMasterDemo = {
  id: string;
  title: string;
  genre: string;
  beforeSrc: string;
  afterSrc: string;
  clipDurationSeconds?: number;
};

export type FeaturedProject = {
  id: string;
  slot: string;
  category: "Mix" | "Master" | "Preset" | "Production";
  title: string;
  artist?: string;
  status: "open" | "coming";
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  service: string;
};

/** Drop MP3/WAV files into public/portfolio/demos/ using these filenames. */
export const VOCAL_CHAIN_DEMOS: VocalChainDemo[] = [
  {
    id: "vocal-01",
    title: "Underground Rap Vocal",
    product: "Fully Custom Vocal Preset",
    rawSrc: "/portfolio/demos/vocal-01-raw.mp3",
    processedSrc: "/portfolio/demos/vocal-01-processed.mp3",
    clipDurationSeconds: 30,
  },
  {
    id: "vocal-02",
    title: "Melodic Hook Take",
    product: "Xsycho Vocal Chain Pro",
    rawSrc: "/portfolio/demos/vocal-02-raw.mp3",
    processedSrc: "/portfolio/demos/vocal-02-processed.mp3",
    clipDurationSeconds: 30,
  },
];

export const MIX_MASTER_DEMOS: MixMasterDemo[] = [
  {
    id: "mix-01",
    title: "Low-End Trap Session",
    genre: "Trap · Underground",
    beforeSrc: "/portfolio/demos/mix-01-before.mp3",
    afterSrc: "/portfolio/demos/mix-01-after.mp3",
  },
  {
    id: "mix-02",
    title: "Atmospheric R&B Cut",
    genre: "R&B · Alternative",
    beforeSrc: "/portfolio/demos/mix-02-before.mp3",
    afterSrc: "/portfolio/demos/mix-02-after.mp3",
  },
];

export const FEATURED_PROJECTS: FeaturedProject[] = [
  { id: "fp-01", slot: "CH-01", category: "Mix", title: "Client Project", status: "open" },
  { id: "fp-02", slot: "CH-02", category: "Master", title: "Client Release", status: "open" },
  { id: "fp-03", slot: "CH-03", category: "Preset", title: "Custom Chain", status: "open" },
  { id: "fp-04", slot: "CH-04", category: "Mix", title: "Session Slot", status: "open" },
  { id: "fp-05", slot: "CH-05", category: "Production", title: "Beat Session", status: "open" },
  { id: "fp-06", slot: "CH-06", category: "Master", title: "Final Master", status: "open" },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-01",
    quote:
      "The vocal chain sat perfectly on the first listen. Clear, present, and still gritty — exactly the underground tone I was chasing.",
    name: "Independent Artist",
    role: "Rap · Vocal Session",
    service: "Custom Vocal Preset",
  },
  {
    id: "t-02",
    quote:
      "Mix came back balanced and loud without losing the low end. Translation on headphones and car speakers was on point.",
    name: "Producer Client",
    role: "Trap · Full Mix",
    service: "Mixing",
  },
  {
    id: "t-03",
    quote:
      "Fast turnaround, clear communication, and a master that felt ready for distribution the same day I got the files back.",
    name: "Release Artist",
    role: "Single · Mastering",
    service: "Mastering",
  },
];
