"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { transitionSmooth } from "@/lib/design-tokens";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/presets", label: "Presets" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
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
        className="xs-page-gutter flex h-16 items-center justify-between gap-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className={`group flex flex-col gap-0.5 ${transitionSmooth} hover:drop-shadow-[0_0_14px_rgba(168,85,247,0.3)]`}
        >
          <span className="text-sm font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-xs-accent-bright">
            Xsycho Labs
          </span>
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-white/30 transition-colors duration-300 group-hover:text-xs-accent/50">
            Solo · Audio Engineering
          </span>
        </Link>

        <ul className="hidden items-center gap-0.5 md:flex">
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

        <button
          type="button"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-[2px] border border-xs-border-control bg-gradient-to-b from-[#141418] to-[#0a0a0e] text-white/80 shadow-[0_2px_0_#030303,inset_0_1px_0_rgba(255,255,255,0.06)] ${transitionSmooth} hover:-translate-y-px hover:border-xs-accent/30 hover:shadow-[0_3px_0_#030303,0_0_16px_-6px_rgba(168,85,247,0.35)] active:translate-y-0 md:hidden`}
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
        className={`border-t border-black/60 bg-[#08080c] md:hidden ${
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
        </ul>
      </div>
    </header>
  );
}
