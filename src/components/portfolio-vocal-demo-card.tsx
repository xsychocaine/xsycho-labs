"use client";

import { ModuleCard } from "@/components/console-ui";
import { StudioAudioDeck } from "@/components/studio-audio-deck";
import type { VocalChainDemo } from "@/lib/portfolio-data";
import { labelClass } from "@/lib/design-tokens";

export function VocalChainDemoCard({ demo }: { demo: VocalChainDemo }) {
  return (
    <ModuleCard moduleId={`VOC · ${demo.id.toUpperCase()}`}>
      <div>
        <h3 className="text-lg font-semibold tracking-tight text-white">
          {demo.title}
        </h3>
        <p className={`mt-2 ${labelClass} text-xs-accent-bright/70`}>
          Product · {demo.product}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StudioAudioDeck
          label="Raw Vocal"
          moduleId="IN · DRY"
          src={demo.rawSrc}
          variant="raw"
          clipDurationSeconds={demo.clipDurationSeconds}
        />
        <StudioAudioDeck
          label="Processed Vocal"
          moduleId="OUT · WET"
          src={demo.processedSrc}
          variant="processed"
          clipDurationSeconds={demo.clipDurationSeconds}
        />
      </div>
    </ModuleCard>
  );
}
