// ============================================================
// KYCH v2 design system — ported from NEW_KYCH/*.dc.html specs.
// Brutalist: hard corners (0 radius), offset hard-edge shadows,
// navy/green/cream palette. Font stays Montserrat (var(--font-display)
// etc.) per instruction — NOT the Space Grotesk/Manrope/Space Mono
// used in the original design files.
// ============================================================

export const NK = {
  bg: "#F6F8F4",
  ink: "#101C33",
  navyDeep: "#0B1424",
  panelNavy: "#16243F",
  borderNavy: "#23304C",
  dividerNavy: "#1C2942",
  green: "#4CB82C",
  greenAlt: "#3A9A20",
  muted: "#5A6472",
  mutedLabel: "#6E7A88",
  mutedOnDark: "#9BA6B4",
  linkMuted: "#B4BECB",
  faint: "#76818F",
  tintGreen: "#EBF1E7",
  offWhiteOnDark: "#E8EEE4",
  white: "#FFFFFF",
} as const;

/** Signature hard-offset "brutalist" shadow — 0 blur, 0 spread. */
export function nkShadow(color: string, size = 7) {
  return `${size}px ${size}px 0 ${color}`;
}

export const nkCard = {
  background: NK.white,
  border: `2px solid ${NK.ink}`,
  boxShadow: nkShadow(NK.ink),
};

export const nkCardHover = {
  boxShadow: nkShadow(NK.green),
  transform: "translateY(-4px)",
};

/** Badge 3-way color rotation used across card grids (events/opportunities/news/library). */
export const NK_BADGE_VARIANTS = [
  { bg: NK.green, fg: NK.navyDeep },
  { bg: NK.ink, fg: NK.green },
  { bg: NK.greenAlt, fg: NK.white },
] as const;

export function nkBadge(index: number) {
  return NK_BADGE_VARIANTS[index % NK_BADGE_VARIANTS.length];
}

/** Deterministic badge color for a category name (stable across renders/pages). */
export function nkBadgeForKey(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return nkBadge(hash);
}
