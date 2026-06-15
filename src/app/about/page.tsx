import type { Metadata } from "next";
import { PluginControl } from "@/components/console-ui";
import { SitePage } from "@/components/site-page";
import { bodyClass, bodyLgClass } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "About | Xsycho Labs",
  description:
    "Producer, artist, engineer, and developer behind Xsycho Labs. Presets, mixing, and mastering from a home setup.",
};

export default function AboutPage() {
  return (
    <SitePage eyebrow="Profile" title="About">
      <div className="flex flex-col gap-10 sm:gap-12">
        <div className="flex flex-col gap-5">
          <p className={`text-pretty ${bodyLgClass} sm:text-lg`}>
            I run Xsycho Labs from a home setup. Most days I&apos;m bouncing
            between producing my own music, engineering other people&apos;s
            tracks, and building the tools that make both easier.
          </p>
          <p className={`text-pretty ${bodyClass} sm:text-base`}>
            I&apos;m a producer, artist, engineer, and developer. I earned an
            associate&apos;s degree in computer science at 17 somewhere in that
            mix. Xsycho Labs is where it all lands: presets, mixing, mastering,
            and whatever I&apos;m working on next.
          </p>
          <p className={`text-pretty ${bodyClass} sm:text-base`}>
            Still building toward my own studio. For now this site is the shop
            and the portfolio in progress.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
          <div className="w-full sm:flex-1">
            <PluginControl href="/presets" variant="secondary" moduleId="SHOP">
              Browse Presets
            </PluginControl>
          </div>
          <div className="w-full sm:flex-1">
            <PluginControl href="/contact" variant="primary" moduleId="BOOK">
              Work With Me
            </PluginControl>
          </div>
        </div>
      </div>
    </SitePage>
  );
}
