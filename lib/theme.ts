// FanTrip design system — "Premium travel/lifestyle" direction.
//
// Replaces the old dark (#0D0D0D) + red/orange sports-brand look with a
// sober, editorial travel-magazine palette: warm ivory paper, ink-navy
// text, a single terracotta accent (evokes clay pitches + warm travel),
// and a deep forest green as a secondary accent for premium/featured tags
// (e.g. Champions League). Large photography + a serif display face for
// headlines is the intended direction once real photography is available;
// until then, gradients approximate that mood.
//
// Import these tokens instead of hardcoding hex values so the look stays
// consistent as more pages get redesigned.

export const theme = {
  color: {
    ink: "#1C1B18", // primary text, dark surfaces (nav, footer)
    inkSoft: "rgba(28,27,24,0.62)",
    paper: "#F7F4EE", // page background — warm ivory, not stark white
    surface: "#FFFFFF", // cards
    border: "#E8E2D4",
    muted: "#8B8377", // secondary/meta text, warm gray (not cold gray)
    accent: "#B0492E", // terracotta — primary CTA, prices, highlights
    accentDeep: "#7C2F1C",
    accentSoft: "#F3E3DA",
    forest: "#2B4239", // secondary accent — Champions League / premium tags
    forestSoft: "#E3E9E2",
    gold: "#C79A4B", // small premium accents (ratings, dividers)
    success: "#39603F",
    successSoft: "#E7EFE6",
  },
  font: {
    // 'Fraunces' is the intended serif display face for headlines (warm,
    // editorial, not a generic geometric sans). Falls back gracefully
    // until next/font/google is wired up per page.
    display: "'Fraunces', Georgia, 'Times New Roman', serif",
    sans: "'Inter','Helvetica Neue',sans-serif",
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
} as const;
