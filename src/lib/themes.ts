// ============================================================
// THEME SYSTEM - Controls visual style for ALL slides uniformly.
// Each theme defines colors, typography, and spacing.
// To add a new theme, add an entry to the `themes` object.
// ============================================================

export interface Theme {
  id: string;
  name: string;
  description: string;
  /** CSS class applied to the slide container */
  slideClass: string;
  /** Font family for headings */
  headingFont: string;
  /** Font family for body text */
  bodyFont: string;
  colors: {
    bg: string;
    text: string;
    heading: string;
    subtitle: string;
    accent: string;
    cardBg: string;
    tableBorder: string;
    tableHeaderBg: string;
    noteBg: string;
    noteText: string;
  };
}

export const themes: Record<string, Theme> = {
  // ----------------------------------------------------------
  // THEME 1: Minimal — Clean white with sharp typography
  // ----------------------------------------------------------
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Clean, modern, lots of whitespace",
    slideClass: "theme-minimal",
    headingFont: "'Inter', sans-serif",
    bodyFont: "'Inter', sans-serif",
    colors: {
      bg: "#ffffff",
      text: "#374151",
      heading: "#111827",
      subtitle: "#6b7280",
      accent: "#2563eb",
      cardBg: "#f9fafb",
      tableBorder: "#e5e7eb",
      tableHeaderBg: "#f3f4f6",
      noteBg: "#fef3c7",
      noteText: "#92400e",
    },
  },

  // ----------------------------------------------------------
  // THEME 2: Dark — Sophisticated dark mode
  // ----------------------------------------------------------
  dark: {
    id: "dark",
    name: "Midnight",
    description: "Dark, bold, high contrast",
    slideClass: "theme-dark",
    headingFont: "'Space Grotesk', sans-serif",
    bodyFont: "'Inter', sans-serif",
    colors: {
      bg: "#0f172a",
      text: "#cbd5e1",
      heading: "#f1f5f9",
      subtitle: "#94a3b8",
      accent: "#38bdf8",
      cardBg: "#1e293b",
      tableBorder: "#334155",
      tableHeaderBg: "#1e293b",
      noteBg: "#422006",
      noteText: "#fbbf24",
    },
  },

  // ----------------------------------------------------------
  // THEME 3: Editorial — Elegant serif typography
  // ----------------------------------------------------------
  editorial: {
    id: "editorial",
    name: "Editorial",
    description: "Elegant serif type, warm tones",
    slideClass: "theme-editorial",
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Inter', sans-serif",
    colors: {
      bg: "#faf7f2",
      text: "#44403c",
      heading: "#1c1917",
      subtitle: "#78716c",
      accent: "#b45309",
      cardBg: "#f5f0e8",
      tableBorder: "#d6d3d1",
      tableHeaderBg: "#ede8df",
      noteBg: "#fef3c7",
      noteText: "#78350f",
    },
  },

  // ----------------------------------------------------------
  // THEME 4: Neon — Vibrant dark with electric accents
  // ----------------------------------------------------------
  neon: {
    id: "neon",
    name: "Neon",
    description: "Electric colors on dark canvas",
    slideClass: "theme-neon",
    headingFont: "'Space Grotesk', sans-serif",
    bodyFont: "'Inter', sans-serif",
    colors: {
      bg: "#0a0a0a",
      text: "#d4d4d8",
      heading: "#f0abfc",
      subtitle: "#a78bfa",
      accent: "#22d3ee",
      cardBg: "#18181b",
      tableBorder: "#3f3f46",
      tableHeaderBg: "#27272a",
      noteBg: "#1e1b4b",
      noteText: "#c4b5fd",
    },
  },

  // ----------------------------------------------------------
  // THEME 5: Glass — Soft translucent modern feel
  // ----------------------------------------------------------
  glass: {
    id: "glass",
    name: "Glass",
    description: "Soft pastels, airy and light",
    slideClass: "theme-glass",
    headingFont: "'DM Sans', sans-serif",
    bodyFont: "'DM Sans', sans-serif",
    colors: {
      bg: "#f0f4ff",
      text: "#475569",
      heading: "#1e293b",
      subtitle: "#64748b",
      accent: "#6366f1",
      cardBg: "#e8eeff",
      tableBorder: "#c7d2fe",
      tableHeaderBg: "#e0e7ff",
      noteBg: "#fef9c3",
      noteText: "#854d0e",
    },
  },

  // ----------------------------------------------------------
  // THEME 6: Arcane — Medieval warmth meets AI aesthetics
  // ----------------------------------------------------------
  arcane: {
    id: "arcane",
    name: "Arcane",
    description: "Medieval gold meets modern AI — refined and bold",
    slideClass: "theme-arcane",
    headingFont: "'Cinzel', serif",
    bodyFont: "'IBM Plex Sans', sans-serif",
    colors: {
      bg: "#0c0e17",
      text: "#a8a49b",
      heading: "#c9a84c",
      subtitle: "#7a7265",
      accent: "#2fbfbf",
      cardBg: "#121521",
      tableBorder: "#252838",
      tableHeaderBg: "#181b2a",
      noteBg: "#18160d",
      noteText: "#c9a84c",
    },
  },

  // ----------------------------------------------------------
  // THEME 7: Medieval — Parchment & blackletter
  // ----------------------------------------------------------
  medieval: {
    id: "medieval",
    name: "Medieval",
    description: "Parchment, ink, and old-world script",
    slideClass: "theme-medieval",
    headingFont: "'UnifrakturMaguntia', cursive",
    bodyFont: "'Crimson Text', serif",
    colors: {
      bg: "#f5eed6",
      text: "#3e2f1c",
      heading: "#2c1a0e",
      subtitle: "#6b4f36",
      accent: "#8b1a1a",
      cardBg: "#ebe3c8",
      tableBorder: "#c4b494",
      tableHeaderBg: "#ddd4b6",
      noteBg: "#d4c9a8",
      noteText: "#4a3520",
    },
  },
};

export const themeIds = Object.keys(themes) as Array<keyof typeof themes>;
