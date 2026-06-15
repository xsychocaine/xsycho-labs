import Link from "next/link";
import { CheckoutButton } from "@/components/checkout-button";
import {
  bodyClass,
  borderDefault,
  borderFeatured,
  dividerClass,
  glowEdgeClass,
  glowHover,
  glowRest,
  labelClass,
  labelDimClass,
  ledActive,
  ledInactive,
  moduleCardClass,
  pageGutter,
  panelHover,
  rackFrameClass,
  rackInnerFrameClass,
  recessedClass,
  transitionSmooth,
} from "@/lib/design-tokens";

export {
  easeSmooth,
  glowHover,
  glowRest,
  pageGutter,
  panelHover,
  rackInner,
  sectionStack,
  transitionSmooth,
} from "@/lib/design-tokens";

export function PageContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`${pageGutter} ${className}`}>{children}</div>;
}

export function RackFrame({
  children,
  className = "",
  interactive = true,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`group/rack relative ${rackFrameClass} ${
        interactive
          ? `${panelHover} hover:border-xs-accent/15 hover:shadow-[0_16px_48px_rgba(0,0,0,0.9),0_0_40px_-16px_rgba(168,85,247,0.18),inset_0_1px_0_rgba(255,255,255,0.05)]`
          : ""
      } ${className}`}
    >
      <ScrewCorners />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-xs-accent/40 to-transparent opacity-0 ${transitionSmooth} ${
          interactive ? "group-hover/rack:opacity-100" : ""
        }`}
      />
      <div className={`relative ${rackInnerFrameClass}`}>{children}</div>
    </div>
  );
}

function ScrewCorners() {
  const screw =
    "absolute h-1.5 w-1.5 rounded-full bg-[#1a1a22] shadow-[inset_0_1px_1px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.06)]";
  return (
    <>
      <span aria-hidden className={`${screw} left-2 top-2`} />
      <span aria-hidden className={`${screw} right-2 top-2`} />
      <span aria-hidden className={`${screw} bottom-2 left-2`} />
      <span aria-hidden className={`${screw} bottom-2 right-2`} />
    </>
  );
}

export function ModuleHeader({ label }: { label: string }) {
  return (
    <div className="xs-module-header transition-colors duration-300 group-hover/module:bg-[#101016]">
      <div className="flex items-center gap-1.5" aria-hidden>
        <span
          className={`h-1.5 w-1.5 rounded-full ${ledActive} transition-shadow duration-300 group-hover/module:shadow-[0_0_10px_rgba(168,85,247,1)]`}
        />
        <span className={`h-1.5 w-1.5 rounded-full ${ledInactive}`} />
        <span className={`h-1.5 w-1.5 rounded-full ${ledInactive}`} />
      </div>
      <span className={`${labelDimClass} text-white/35`}>{label}</span>
    </div>
  );
}

export function RecessedWell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`${recessedClass} ${className}`}>{children}</div>;
}

export function SectionReadout({
  label,
  title,
  note,
}: {
  label: string;
  title: string;
  note?: string;
}) {
  return (
    <header className={`mb-5 ${dividerClass} pb-4 lg:mb-6`}>
      <p className={labelClass}>{label}</p>
      <h2 className={`mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl`}>
        {title}
      </h2>
      {note && <p className={`mt-2 max-w-2xl text-sm ${bodyClass}`}>{note}</p>}
    </header>
  );
}

export function PageReadout({
  label,
  title,
  note,
  centered = false,
}: {
  label: string;
  title: string;
  note?: string;
  centered?: boolean;
}) {
  return (
    <PageHeader
      label={label}
      title={title}
      note={note}
      className={centered ? "text-center sm:text-left" : ""}
    />
  );
}

/** Compact page title — no rack frame, minimal vertical space */
export function PageHeader({
  label,
  title,
  note,
  className = "",
}: {
  label: string;
  title: string;
  note?: string;
  className?: string;
}) {
  return (
    <header className={`mb-4 sm:mb-5 ${className}`}>
      <p className={`${labelDimClass} text-xs-accent/60`}>{label}</p>
      <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-white sm:text-[1.75rem]">
        {title}
      </h1>
      {note && (
        <p className={`mt-2 max-w-xl text-sm leading-relaxed ${bodyClass}`}>
          {note}
        </p>
      )}
    </header>
  );
}

/** Generic DAW-style module card for content blocks */
export function ModuleCard({
  children,
  moduleId,
  featured = false,
  className = "",
}: {
  children: React.ReactNode;
  moduleId?: string;
  featured?: boolean;
  className?: string;
}) {
  return (
    <article
      className={`group/module relative flex flex-col overflow-hidden ${moduleCardClass} ${glowRest} ${panelHover} ${glowHover} ${
        featured ? borderFeatured : borderDefault
      } ${className}`}
    >
      <div aria-hidden className={glowEdgeClass} />
      {moduleId && <ModuleHeader label={moduleId} />}
      <div className="flex flex-1 flex-col gap-5 p-5 lg:p-6">{children}</div>
    </article>
  );
}

export function ConsoleLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-sm font-medium text-xs-accent-bright/90 hover:text-xs-accent-bright hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.45)] ${transitionSmooth}`}
    >
      {children}
      <span
        aria-hidden
        className={`${transitionSmooth} group-hover:translate-x-1`}
      >
        →
      </span>
    </Link>
  );
}

type PluginButtonVariant = "primary" | "secondary";

function pluginButtonShellClass(isPrimary: boolean) {
  return isPrimary
    ? "border-xs-accent/35 bg-gradient-to-b from-xs-accent/30 to-[#1e0a3a]/40 group-hover/control:border-xs-accent-bright/50 group-hover/control:shadow-[0_5px_0_#1e0a3a,0_10px_28px_rgba(147,51,234,0.35),0_0_28px_-8px_rgba(168,85,247,0.4)]"
    : "border-xs-border-control bg-[#121218] group-hover/control:border-xs-accent/25 group-hover/control:shadow-[0_5px_0_#030303,0_8px_24px_rgba(0,0,0,0.45),0_0_20px_-10px_rgba(168,85,247,0.2)]";
}

function pluginButtonFaceClass(isPrimary: boolean) {
  return isPrimary
    ? "bg-gradient-to-b from-xs-accent to-xs-accent-deep text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] group-active/control:shadow-[inset_0_2px_10px_rgba(59,7,100,0.7)]"
    : "bg-gradient-to-b from-[#1c1c24] to-[#0c0c10] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] group-active/control:shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]";
}

export function PluginButtonShell({
  children,
  variant = "primary",
  moduleId,
  disabled = false,
}: {
  children: React.ReactNode;
  variant?: PluginButtonVariant;
  moduleId?: string;
  disabled?: boolean;
}) {
  const isPrimary = variant === "primary";

  return (
    <>
      <div className="flex items-center justify-between px-0.5">
        <span className={`${labelDimClass} text-white/30`}>
          {moduleId ?? (isPrimary ? "MIX.IN" : "PRE.SET")}
        </span>
        <span
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full ${transitionSmooth} ${
            isPrimary
              ? `${ledActive} group-hover/control:shadow-[0_0_12px_rgba(168,85,247,1)]`
              : `${ledInactive} group-hover/control:bg-xs-accent/80 group-hover/control:shadow-[0_0_8px_rgba(168,85,247,0.6)]`
          }`}
        />
      </div>
      <div
        className={`overflow-hidden rounded-[3px] border p-px shadow-[0_4px_0_#030303,0_8px_20px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] ${transitionSmooth} ${
          disabled ? "" : "group-hover/control:-translate-y-0.5 group-active/control:translate-y-px"
        } ${pluginButtonShellClass(isPrimary)}`}
      >
        <span
          className={`flex h-12 items-center justify-center rounded-[2px] px-5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] sm:h-[3.25rem] ${pluginButtonFaceClass(isPrimary)}`}
        >
          {children}
        </span>
      </div>
    </>
  );
}

/** Premium plugin-style control for hero CTAs */
export function PluginControl({
  href,
  children,
  variant = "primary",
  moduleId,
}: {
  href: string;
  children: React.ReactNode;
  variant?: PluginButtonVariant;
  moduleId?: string;
}) {
  return (
    <Link
      href={href}
      className={`group/control flex w-full flex-col gap-1.5 sm:min-w-[11rem] sm:flex-1 ${transitionSmooth}`}
    >
      <PluginButtonShell variant={variant} moduleId={moduleId}>
        {children}
      </PluginButtonShell>
    </Link>
  );
}

export function TransportButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: PluginButtonVariant;
}) {
  const base = `relative inline-flex h-11 w-full items-center justify-center px-7 text-sm font-semibold tracking-tight sm:h-12 sm:px-8 ${transitionSmooth} hover:-translate-y-0.5 active:translate-y-0`;

  if (variant === "secondary") {
    return (
      <Link
        href={href}
        className={`${base} rounded-[3px] border border-xs-border-control bg-gradient-to-b from-[#16161c] to-[#0a0a0e] text-white/90 shadow-[0_3px_0_#050505,0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-xs-accent/35 hover:shadow-[0_6px_0_#050505,0_8px_24px_rgba(0,0,0,0.5),0_0_24px_-8px_rgba(168,85,247,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] active:shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]`}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} rounded-[3px] border border-xs-accent/40 bg-gradient-to-b from-xs-accent to-xs-accent-deep text-white shadow-[0_3px_0_#3b0764,0_4px_16px_rgba(147,51,234,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] hover:from-xs-accent-bright hover:to-xs-accent hover:shadow-[0_5px_0_#3b0764,0_8px_28px_rgba(147,51,234,0.45),0_0_32px_-6px_rgba(192,132,252,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] active:shadow-[inset_0_2px_10px_rgba(59,7,100,0.8)]`}
    >
      {children}
    </Link>
  );
}

export function HardwareToggle({
  label,
  href,
  sub,
  led,
}: {
  label: string;
  href: string;
  sub?: string;
  led?: boolean;
}) {
  return (
    <a
      href={href}
      className={`group relative flex min-h-[4.5rem] flex-col items-center justify-center gap-1 rounded-[3px] border border-[#252530] bg-gradient-to-b from-[#18181f] to-[#0c0c10] px-5 py-4 shadow-[0_3px_0_#030303,0_6px_16px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)] ${panelHover} hover:border-xs-accent/40 hover:shadow-[0_5px_0_#030303,0_10px_28px_rgba(0,0,0,0.5),0_0_28px_-6px_rgba(168,85,247,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] active:translate-y-0 active:shadow-[inset_0_2px_10px_rgba(0,0,0,0.85)]`}
    >
      {led && (
        <span
          aria-hidden
          className={`absolute right-3 top-3 h-1.5 w-1.5 rounded-full ${ledActive} ${transitionSmooth} group-hover:shadow-[0_0_14px_rgba(168,85,247,1)]`}
        />
      )}
      <span
        className={`text-sm font-semibold text-white/90 group-hover:text-white ${transitionSmooth}`}
      >
        {label}
      </span>
      {sub && (
        <span
          className={`font-mono text-[0.6rem] uppercase tracking-wider text-white/35 group-hover:text-xs-accent-bright/55 ${transitionSmooth}`}
        >
          {sub}
        </span>
      )}
    </a>
  );
}

/** Pricing / license-style module card */
export function PricingModule({
  moduleId,
  title,
  priceRange,
  description,
  ctaLabel,
  href,
  product,
  featured = false,
  badge,
}: {
  moduleId: string;
  title: string;
  priceRange: string;
  description: string;
  ctaLabel: string;
  href?: string;
  product?: string;
  featured?: boolean;
  badge?: string;
}) {
  return (
    <article
      className={`group/plan group/module relative flex h-full flex-col overflow-hidden rounded-[2px] border bg-xs-surface ${glowRest} ${panelHover} ${glowHover} ${
        featured ? borderFeatured : borderDefault
      }`}
    >
      {badge && (
        <div className="absolute right-3 top-11 z-10">
          <span className="rounded-[2px] border border-xs-accent/40 bg-[#1e0a3a]/50 px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest text-xs-accent-bright/90">
            {badge}
          </span>
        </div>
      )}
      <div aria-hidden className={`${glowEdgeClass} group-hover/plan:opacity-100`} />
      <ModuleHeader label={moduleId} />
      <div className="flex flex-1 flex-col gap-5 p-5 lg:p-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold tracking-tight text-white">
            {title}
          </h3>
          <p className="font-mono text-2xl font-medium tracking-tight text-xs-accent-bright/90 sm:text-[1.65rem]">
            {priceRange}
          </p>
          <p className={`text-sm leading-relaxed ${bodyClass}`}>{description}</p>
        </div>
        <div className="mt-auto pt-2">
          {product ? (
            <CheckoutButton
              product={product}
              variant={featured ? "primary" : "secondary"}
              moduleId="BUY"
            >
              {ctaLabel}
            </CheckoutButton>
          ) : (
            <PluginControl
              href={href ?? "/contact"}
              variant={featured ? "primary" : "secondary"}
              moduleId={featured ? "BOOK" : "SELECT"}
            >
              {ctaLabel}
            </PluginControl>
          )}
        </div>
      </div>
    </article>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <PageContainer>
        <div
          className={`flex flex-col items-start justify-between gap-4 rounded-[2px] border border-[#1a1a22] bg-xs-rack px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:flex-row sm:items-center ${transitionSmooth} hover:border-xs-accent/15 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_24px_-14px_rgba(168,85,247,0.12)]`}
        >
          <p className="text-sm text-white/40">
            © 2026 Xsycho Labs
          </p>
          <p className={`${labelDimClass} text-white/30`}>
            Solo Audio Engineering & Creative Tools
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
