"use client";

import {
  ModuleHeader,
  PluginControl,
  RackFrame,
  RecessedWell,
  TransportButton,
  rackInner,
} from "@/components/console-ui";
import { labelClass, labelDimClass } from "@/lib/design-tokens";

/** First N client projects featured in the portfolio with social tags */
export const PORTFOLIO_LAUNCH_SLOTS = 10;

const spotlightBullets = [
  "Featured portfolio slot on xsycholabs.com",
  "Credit with your artist / project name",
  "Linked social tags (Instagram, Spotify, etc.)",
  "Priority placement while I launch the showcase",
] as const;

export function EarlyClientSpotlight({
  showFooter = true,
}: {
  showFooter?: boolean;
}) {
  return (
    <RecessedWell className="space-y-4 p-5">
      <p className={`${labelDimClass} text-xs-accent-bright/80`}>
        Early Client Spotlight
      </p>
      <p className="text-sm leading-relaxed text-white/55">
        I&apos;m just getting started, and the{" "}
        <span className="font-medium text-white/80">
          first {PORTFOLIO_LAUNCH_SLOTS} completed orders
        </span>{" "}
        I take on get featured right here on the site. Your project promoted
        with your artist name, track title, and social tags so new visitors
        can find you.
      </p>
      <ul className="space-y-2 text-sm text-white/45">
        {spotlightBullets.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span
              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-xs-accent/80"
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
      {showFooter && (
        <p className="border-t border-white/[0.06] pt-3 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-white/30">
          {PORTFOLIO_LAUNCH_SLOTS} spots · Limited launch offer
        </p>
      )}
    </RecessedWell>
  );
}

export function PortfolioSpotlightPanel({
  showIntro = true,
  showActions = true,
}: {
  showIntro?: boolean;
  showActions?: boolean;
}) {
  return (
    <RackFrame interactive={false}>
      <ModuleHeader label="PORT · BUILD" />
      <div className={`${rackInner} flex flex-col gap-6`}>
        {showIntro && (
          <div>
            <p className={labelClass}>Work in Progress</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Portfolio Coming Soon
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/50 sm:text-[0.9375rem] sm:leading-7">
              I&apos;m building out my portfolio showcase. Real client work,
              session breakdowns, and before/after clips. The rack is being
              wired up now.
            </p>
          </div>
        )}

        <EarlyClientSpotlight />

        {showActions && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <PluginControl href="/contact" variant="primary" moduleId="BOOK">
              Book a Session
            </PluginControl>
            <div className="w-full sm:flex-1">
              <TransportButton href="/services" variant="secondary">
                View Services
              </TransportButton>
            </div>
          </div>
        )}
      </div>
    </RackFrame>
  );
}

export function PortfolioWipOverlay() {
  return (
    <div className="fixed inset-0 top-16 z-40 flex items-center justify-center bg-xs-bg/85 px-6 py-10 backdrop-blur-md">
      <div className="w-full max-w-xl">
        <PortfolioSpotlightPanel />
      </div>
    </div>
  );
}

export function PortfolioSpotlightSectionOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-xs-bg/55 px-4 py-8 backdrop-blur-[3px] sm:px-6 sm:py-10">
      <div className="pointer-events-auto w-full max-w-xl">
        <PortfolioSpotlightPanel showIntro />
      </div>
    </div>
  );
}
