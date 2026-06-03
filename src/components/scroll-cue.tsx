import Link from "next/link";
import { labelDimClass } from "@/lib/design-tokens";

export function ScrollCue({ href = "#featured" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-2 text-white/35 transition-colors hover:text-xs-accent-bright/80"
    >
      <span className={`${labelDimClass} text-white/30 group-hover:text-xs-accent/60`}>
        Keep scrolling
      </span>
      <svg
        aria-hidden
        className="xs-scroll-cue h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </Link>
  );
}
