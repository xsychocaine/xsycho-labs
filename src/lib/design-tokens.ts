/**
 * Xsycho Labs design tokens — shared class strings for Tailwind composition.
 * Source of truth for colors/spacing lives in globals.css CSS variables.
 */

export const easeSmooth = "ease-[cubic-bezier(0.22,1,0.36,1)]";
export const transitionSmooth = `transition-all duration-300 ${easeSmooth}`;

export const panelHover = `transition-[transform,box-shadow,border-color] duration-300 ${easeSmooth} hover:-translate-y-1`;

export const glowRest =
  "shadow-[0_6px_20px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)]";

export const glowHover =
  "hover:shadow-[0_14px_36px_rgba(0,0,0,0.65),0_0_36px_-10px_rgba(168,85,247,0.32),inset_0_1px_0_rgba(255,255,255,0.06)]";

/** Page layout */
export const pageGutter = "xs-page-gutter";
export const rackInner = "xs-rack-inner";
export const sectionStack = "xs-section-stack";

/** Typography */
export const labelClass = "xs-label";
export const labelDimClass = "xs-label-dim";
export const headingPageClass = "xs-heading-page";
export const headingSectionClass = "xs-heading-section";
export const bodyClass = "xs-body";
export const bodyLgClass = "xs-body-lg";

/** Surfaces */
export const rackFrameClass = "xs-rack-frame";
export const rackInnerFrameClass = "xs-rack-inner-frame";
export const moduleCardClass = "xs-module-card";
export const recessedClass = "xs-recessed";
export const dividerClass = "xs-divider";
export const glowEdgeClass = "xs-glow-edge";

/** Accent LED dot */
export const ledActive =
  "bg-xs-accent-bright shadow-[0_0_8px_rgba(168,85,247,0.9)]";
export const ledInactive = "bg-xs-border-control";

/** Module borders */
export const borderModule = "border-xs-border-module";
export const borderFeatured = "border-xs-accent/30 hover:border-xs-accent-bright/40";
export const borderDefault = "border-xs-border-module hover:border-xs-accent/25";
