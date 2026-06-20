export type ProductType =
  | "premade_preset"
  | "custom_preset"
  | "mixing"
  | "mastering"
  | "mix_master";

export function requiresIntake(productType: ProductType) {
  return productType !== "premade_preset";
}

export {
  getProductConfig,
  getProductType,
  productRequiresIntake,
  resolveProductDownloadUrl,
} from "@/lib/products";

export type SuccessContent = {
  title: string;
  headline: string;
  description: string;
  moduleLabel: string;
  steps: readonly string[];
  footerNote: string;
  showIntakeButton: boolean;
  intakeButtonLabel?: string;
};

export const SUCCESS_CONTENT: Record<ProductType, SuccessContent> = {
  premade_preset: {
    title: "Payment Successful",
    headline: "Your preset is on the way",
    description:
      "Payment successful. Your preset is on the way. Your download link was sent to your checkout email and is available below.",
    moduleLabel: "OUT · DELIVER",
    steps: [
      "Download your preset using the link below or from your email",
      "Load the chain in your DAW",
      "Reach out if you need help getting started",
    ],
    footerNote:
      "Premade presets are delivered by email. No file upload is required for this order.",
    showIntakeButton: false,
  },
  custom_preset: {
    title: "Payment Successful",
    headline: "Custom preset order confirmed",
    description:
      "Your payment went through. Complete the intake form so your vocal chain can be built around your voice and setup.",
    moduleLabel: "OUT · CONFIRM",
    steps: [
      "Share your vocal style and available plugins",
      "Add session notes and any reference vocals",
      "Upload files only if you want us to hear your raw takes",
    ],
    footerNote:
      "Custom presets are built to order. Intake helps us match your tone and workflow.",
    showIntakeButton: true,
    intakeButtonLabel: "Complete Preset Intake",
  },
  mixing: {
    title: "Payment Successful",
    headline: "Mixing session confirmed",
    description:
      "Your mix order is locked in. Submit your session intake with stems and notes so we can start.",
    moduleLabel: "OUT · CONFIRM",
    steps: [
      "Confirm your name and email",
      "Upload stems or multitrack files",
      "Add notes and optional references",
    ],
    footerNote: "BPM and key are optional but help speed up the session.",
    showIntakeButton: true,
    intakeButtonLabel: "Submit Mix Intake",
  },
  mastering: {
    title: "Payment Successful",
    headline: "Mastering session confirmed",
    description:
      "Your master order is confirmed. Upload your final mix and any loudness or reference notes.",
    moduleLabel: "OUT · CONFIRM",
    steps: [
      "Confirm your name and email",
      "Upload your final mix file",
      "Add loudness targets or reference notes (optional)",
    ],
    footerNote:
      "Mastering intake only needs your final mix. Stems, BPM, and key are not required.",
    showIntakeButton: true,
    intakeButtonLabel: "Submit Master Intake",
  },
  mix_master: {
    title: "Payment Successful",
    headline: "Mix + Master bundle confirmed",
    description:
      "Your bundle order is confirmed. Submit stems and session notes so mix and master can run as one workflow.",
    moduleLabel: "OUT · CONFIRM",
    steps: [
      "Confirm your name and email",
      "Upload stems or project files",
      "Add notes and optional references",
    ],
    footerNote: "BPM and key are optional. Include as much context as you can.",
    showIntakeButton: true,
    intakeButtonLabel: "Submit Bundle Intake",
  },
};

export type IntakeProfile = {
  showServiceType: boolean;
  showVocalStyle: boolean;
  showPlugins: boolean;
  showBpmKey: boolean;
  showReference: boolean;
  referenceLabel: string;
  referenceHint: string;
  notesLabel: string;
  notesHint: string;
  filesLabel: string;
  filesHint: string;
  filesRequired: boolean;
  submitLabel: string;
  moduleLabel: string;
};

export const INTAKE_PROFILE: Record<ProductType, IntakeProfile | null> = {
  premade_preset: null,
  custom_preset: {
    showServiceType: false,
    showVocalStyle: true,
    showPlugins: true,
    showBpmKey: false,
    showReference: false,
    referenceLabel: "Reference Notes",
    referenceHint: "",
    notesLabel: "Session Notes",
    notesHint: "Tone, genre, delivery style, and anything I should know before building your chain.",
    filesLabel: "Reference Files (optional)",
    filesHint: "Raw vocals or references only if you want us to hear your voice first.",
    filesRequired: false,
    submitLabel: "Submit Preset Intake",
    moduleLabel: "INTAKE · PRESET",
  },
  mixing: {
    showServiceType: true,
    showVocalStyle: false,
    showPlugins: false,
    showBpmKey: true,
    showReference: true,
    referenceLabel: "Reference Track (optional)",
    referenceHint: "Artist, song, link, or sonic direction.",
    notesLabel: "Mix Notes",
    notesHint: "Arrangement notes, focal points, and delivery requests.",
    filesLabel: "Stems / Project Files",
    filesHint: "WAV, MP3, AIFF, or ZIP. Up to 5 files.",
    filesRequired: true,
    submitLabel: "Submit Mix Intake",
    moduleLabel: "INTAKE · MIX",
  },
  mastering: {
    showServiceType: false,
    showVocalStyle: false,
    showPlugins: false,
    showBpmKey: false,
    showReference: true,
    referenceLabel: "Loudness / Reference (optional)",
    referenceHint: "Target loudness, reference track, or platform notes.",
    notesLabel: "Master Notes",
    notesHint: "Anything about the mix I should know before mastering.",
    filesLabel: "Final Mix File",
    filesHint: "Upload your mixed WAV or high-quality file ready for mastering.",
    filesRequired: true,
    submitLabel: "Submit Master Intake",
    moduleLabel: "INTAKE · MASTER",
  },
  mix_master: {
    showServiceType: false,
    showVocalStyle: false,
    showPlugins: false,
    showBpmKey: true,
    showReference: true,
    referenceLabel: "Reference Track (optional)",
    referenceHint: "Artist, song, link, or sonic direction.",
    notesLabel: "Session Notes",
    notesHint: "Full project context for mix and master.",
    filesLabel: "Stems / Project Files",
    filesHint: "WAV, MP3, AIFF, or ZIP. Up to 5 files.",
    filesRequired: true,
    submitLabel: "Submit Bundle Intake",
    moduleLabel: "INTAKE · BUNDLE",
  },
};

export function getIntakeChecklist(productType: ProductType): string[] {
  switch (productType) {
    case "custom_preset":
      return [
        "Name and email",
        "Vocal style and available plugins",
        "Session notes",
        "Optional reference files",
      ];
    case "mastering":
      return [
        "Name and email",
        "Final mix upload",
        "Master notes",
        "Optional loudness or reference notes",
      ];
    case "mix_master":
      return [
        "Name and email",
        "Stems or project files",
        "Session notes",
        "Optional BPM, key, and references",
      ];
    case "mixing":
    default:
      return [
        "Name and email",
        "Stems or multitrack files",
        "Mix notes",
        "Optional BPM, key, and references",
      ];
  }
}

export function getIntakePageCopy(productType: ProductType) {
  switch (productType) {
    case "custom_preset":
      return {
        eyebrow: "Custom Preset Intake",
        title: "Preset Intake Form",
        description:
          "Tell us about your voice, plugins, and style so your custom chain can be built correctly.",
      };
    case "mastering":
      return {
        eyebrow: "Mastering Intake",
        title: "Master Intake Form",
        description:
          "Upload your final mix and any loudness or reference notes. No stems required.",
      };
    case "mix_master":
      return {
        eyebrow: "Bundle Intake",
        title: "Mix + Master Intake",
        description:
          "Submit stems and session notes for your full mix and master workflow.",
      };
    case "mixing":
    default:
      return {
        eyebrow: "Mixing Intake",
        title: "Mix Intake Form",
        description:
          "Upload stems and session notes so your mix can begin without delays.",
      };
  }
}
