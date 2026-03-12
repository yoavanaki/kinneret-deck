// ============================================================
// THEME SYSTEM - AIPAC dark (default) and AIPAC light variant.
// ============================================================

export interface Theme {
  id: string;
  name: string;
  description: string;
  slideClass: string;
  headingFont: string;
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
  aipac: {
    id: "aipac",
    name: "Dark",
    description: "Dark navy, warm brown accent, elegant serif headings",
    slideClass: "theme-aipac",
    headingFont: "'Instrument Serif', serif",
    bodyFont: "'DM Sans', sans-serif",
    colors: {
      bg: "#0e1117",
      text: "#e6edf3",
      heading: "#e6edf3",
      subtitle: "#8b949e",
      accent: "#c9856b",
      cardBg: "#151921",
      tableBorder: "#30363d",
      tableHeaderBg: "#161b22",
      noteBg: "#1c1510",
      noteText: "#c9856b",
    },
  },

  "aipac-light": {
    id: "aipac-light",
    name: "Light",
    description: "Light variant with warm brown accent, elegant serif headings",
    slideClass: "theme-aipac-light",
    headingFont: "'Instrument Serif', serif",
    bodyFont: "'DM Sans', sans-serif",
    colors: {
      bg: "#faf9f7",
      text: "#3d3d3d",
      heading: "#1a1a1a",
      subtitle: "#6b6b6b",
      accent: "#c9856b",
      cardBg: "#f0edea",
      tableBorder: "#ddd8d3",
      tableHeaderBg: "#eae5e0",
      noteBg: "#f5ece5",
      noteText: "#8b5e3c",
    },
  },
};

export const themeIds = Object.keys(themes) as Array<keyof typeof themes>;
