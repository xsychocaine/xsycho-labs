"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ModuleHeader,
  PluginButtonShell,
  RackFrame,
  rackInner,
  transitionSmooth,
} from "@/components/console-ui";
import { labelClass, labelDimClass } from "@/lib/design-tokens";

const communityLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/xsychocaine/",
    moduleId: "IG · OUT",
    sub: undefined,
    external: true,
  },
  {
    label: "Music",
    href: "https://open.spotify.com/artist/3gZeAm2Mx3DcRXyR7OsMCK",
    moduleId: "PLAY · OUT",
    sub: "Spotify / SoundCloud",
    external: true,
  },
  {
    label: "Discord",
    href: undefined,
    moduleId: "DISC · OUT",
    sub: "Community",
    wip: true,
  },
] as const;

function CommunityLinkButton({
  label,
  moduleId,
  onClick,
  href,
  external,
}: {
  label: string;
  moduleId: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
}) {
  const shellClass = `group/control flex w-full flex-col gap-1.5 sm:min-w-[11rem] sm:flex-1 ${transitionSmooth}`;

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={shellClass}
      >
        <PluginButtonShell variant="secondary" moduleId={moduleId}>
          {label}
        </PluginButtonShell>
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${shellClass} text-left`}>
      <PluginButtonShell variant="secondary" moduleId={moduleId}>
        {label}
      </PluginButtonShell>
    </button>
  );
}

function DiscordWipOverlay({ onClose }: { onClose: () => void }) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-xs-bg/80 px-6 py-10 backdrop-blur-md"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`pointer-events-auto w-full max-w-sm ${transitionSmooth}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="discord-wip-title"
      >
        <RackFrame interactive={false}>
          <ModuleHeader label="DISC · OUT" />
          <div className={`${rackInner} space-y-5 text-center`}>
            <div>
              <p className={labelClass}>Signal Pending</p>
              <h2
                id="discord-wip-title"
                className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl"
              >
                Work in Progress
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/45">
                Discord community is being wired up. Check back soon.
              </p>
            </div>
            <div className="flex justify-center border-t border-white/[0.06] pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex h-11 w-full max-w-[10rem] items-center justify-center rounded-[3px] border border-xs-border-control bg-gradient-to-b from-[#16161c] to-[#0a0a0e] px-7 text-sm font-semibold tracking-tight text-white/90 shadow-[0_3px_0_#050505,0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.07)] hover:-translate-y-0.5 hover:border-xs-accent/35 hover:shadow-[0_6px_0_#050505,0_8px_24px_rgba(0,0,0,0.5),0_0_24px_-8px_rgba(168,85,247,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] active:translate-y-0 active:shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] sm:h-12 ${transitionSmooth}`}
              >
                Dismiss
              </button>
            </div>
          </div>
        </RackFrame>
      </div>
    </div>
  );
}

export function CommunityLinks() {
  const [discordWipOpen, setDiscordWipOpen] = useState(false);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        {communityLinks.map((link) => (
          <div key={link.label} className="flex flex-col gap-1.5">
            <CommunityLinkButton
              label={link.label}
              moduleId={link.moduleId}
              href={"href" in link ? link.href : undefined}
              external={"external" in link ? link.external : undefined}
              onClick={
                "wip" in link && link.wip
                  ? () => setDiscordWipOpen(true)
                  : undefined
              }
            />
            {link.sub && (
              <p className={`text-center ${labelDimClass} text-white/25`}>
                {link.sub}
              </p>
            )}
          </div>
        ))}
      </div>
      {discordWipOpen && (
        <DiscordWipOverlay onClose={() => setDiscordWipOpen(false)} />
      )}
    </>
  );
}
