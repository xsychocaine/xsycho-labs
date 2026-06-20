"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { transitionSmooth } from "@/lib/design-tokens";

const links = [
  { href: "/", label: "Home" },
  { href: "/presets", label: "Presets" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
] as const;

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavSegment({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded-[2px] px-3.5 py-2 text-sm font-medium tracking-tight ${transitionSmooth} ${
        active
          ? "bg-[#14141a] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_16px_-4px_rgba(168,85,247,0.45)]"
          : "text-white/45 hover:bg-[#101014] hover:text-white/85 hover:shadow-[0_0_20px_-10px_rgba(168,85,247,0.25)]"
      }`}
    >
      {label}
    </Link>
  );
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isClient = useIsClient();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/80 bg-xs-nav/95 shadow-[0_4px_24px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md">
      <nav
        className="xs-page-gutter flex h-16 items-center justify-between gap-4"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className={`group flex shrink-0 flex-col gap-0.5 ${transitionSmooth} hover:drop-shadow-[0_0_14px_rgba(168,85,247,0.3)]`}
        >
          <span className="text-sm font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-xs-accent-bright">
            Xsycho Labs
          </span>
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-white/30 transition-colors duration-300 group-hover:text-xs-accent/50">
            Solo · Audio Engineering
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <ul className="flex items-center gap-0.5">
            {links.map((link) => (
              <li key={link.href}>
                <NavSegment
                  href={link.href}
                  label={link.label}
                  active={isClient && isActivePath(pathname, link.href)}
                />
              </li>
            ))}
          </ul>
          <Link
            href="/presets"
            className={`ml-2 inline-flex h-9 items-center rounded-[2px] border border-xs-accent/40 bg-gradient-to-b from-xs-accent/25 to-[#1e0a3a]/50 px-3.5 text-sm font-semibold text-xs-accent-bright ${transitionSmooth} hover:border-xs-accent-bright/50 hover:shadow-[0_0_20px_-8px_rgba(168,85,247,0.5)]`}
          >
            Shop Presets
          </Link>
        </div>

        <button
          type="button"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-[2px] border border-xs-border-control bg-gradient-to-b from-[#141418] to-[#0a0a0e] text-white/80 shadow-[0_2px_0_#030303,inset_0_1px_0_rgba(255,255,255,0.06)] ${transitionSmooth} hover:-translate-y-px hover:border-xs-accent/30 hover:shadow-[0_3px_0_#030303,0_0_16px_-6px_rgba(168,85,247,0.35)] active:translate-y-0 lg:hidden`}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((prev) => !prev)}
        >
          <svg
            aria-hidden
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            )}
          </svg>
        </button>
      </nav>

      <div
        id="mobile-nav"
        className={`border-t border-black/60 bg-[#08080c] lg:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col gap-0.5 p-4">
          {links.map((link) => (
            <li key={link.href}>
              <NavSegment
                href={link.href}
                label={link.label}
                active={isClient && isActivePath(pathname, link.href)}
                onClick={() => setOpen(false)}
              />
            </li>
          ))}
          <li className="pt-2">
            <Link
              href="/presets"
              onClick={() => setOpen(false)}
              className="flex h-11 items-center justify-center rounded-[2px] border border-xs-accent/40 bg-xs-accent/10 text-sm font-semibold text-xs-accent-bright"
            >
              Shop Presets
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
