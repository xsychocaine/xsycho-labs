import {
  PageContainer,
  PluginControl,
  RackFrame,
  TransportButton,
  rackInner,
} from "@/components/console-ui";
import { bodyClass } from "@/lib/design-tokens";

type ConversionCtaProps = {
  title?: string;
  note?: string;
  moduleLabel?: string;
};

export function ConversionCta({
  title = "Ready to start?",
  note = "Shop presets, book a session, or reach out with questions.",
  moduleLabel = "OUT · MAIN",
}: ConversionCtaProps) {
  return (
    <PageContainer>
      <RackFrame interactive={false}>
        <div className={`${rackInner} mx-auto max-w-2xl text-center`}>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-xs-accent-bright/70">
            {moduleLabel}
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {title}
          </h2>
          <p className={`mx-auto mt-3 max-w-md text-sm ${bodyClass}`}>{note}</p>
          <div className="mx-auto mt-6 flex max-w-lg flex-col gap-3 sm:flex-row">
            <div className="w-full sm:flex-1">
              <PluginControl href="/presets" variant="primary" moduleId="SHOP">
                Shop Presets
              </PluginControl>
            </div>
            <div className="w-full sm:flex-1">
              <TransportButton href="/services" variant="secondary">
                Book a Service
              </TransportButton>
            </div>
            <div className="w-full sm:flex-1">
              <TransportButton href="/contact" variant="secondary">
                Contact
              </TransportButton>
            </div>
          </div>
        </div>
      </RackFrame>
    </PageContainer>
  );
}
