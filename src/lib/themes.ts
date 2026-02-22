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
};

export const themeIds = Object.keys(themes) as Array<keyof typeof themes>;
