// ============================================================
// SLIDE DATA - Each slide is an independent object.
// To edit a slide, find it by its `id` and modify its fields.
// Styling is controlled by the theme system, not per-slide.
// ============================================================

export interface SlideContent {
  id: string;
  /** Slide number (1-indexed) */
  number: number;
  /** Main heading / title of the slide */
  title: string;
  /** Subtitle or secondary text */
  subtitle?: string;
  /** Body text - supports multiple paragraphs */
  body?: string;
  /** Bullet points as an array of strings */
  bullets?: string[];
  /** Layout type determines how the slide renders */
  layout: "title" | "text" | "two-column" | "bullets" | "section" | "table" | "big-text" | "dictionary" | "team" | "bar-chart";
  /** Custom HTML content for special layouts */
  customHtml?: string;
  /** Team members for team layout */
  team?: { name: string; role: string; bio: string; imageUrl?: string }[];
  /** Bar chart data for bar-chart layout */
  bars?: { label: string; value: number; highlight?: boolean }[];
  /** Optional note/annotation shown in a different style */
  note?: string;
  /** Table data: headers and rows */
  tableHeaders?: string[];
  tableRows?: string[][];
  /** Left column text (for two-column layout) */
  leftText?: string;
  /** Right column text (for two-column layout) */
  rightText?: string;
}

// ============================================================
// SLIDE 1: Title Slide — Dictionary Entry
// ============================================================
const slide01: SlideContent = {
  id: "slide-01",
  number: 1,
  title: "Cognitory",
  layout: "dictionary",
  subtitle: "/ˈkɒɡ.nɪ.tər.i/",
  body: "noun",
};

// ============================================================
// SLIDE 2: Team
// ============================================================
const slide02: SlideContent = {
  id: "slide-02",
  number: 2,
  title: "The Team",
  layout: "team",
  team: [
    {
      name: "Yoav Anaki",
      role: "Co-Founder",
      bio: "Junior Partner at fresh.fund, Israel's most active pre-seed VC. Background in CS, previously founded Yodel and the Layoffs Project.",
    },
    {
      name: "Yoav Segev",
      role: "Co-Founder",
      bio: "MBA from Harvard Business School. Former Associate at Charlesbank Capital Partners, BCG, and Morgan Stanley. BA Economics & Management from Oxford.",
    },
    {
      name: "Jamie Kalamarides",
      role: "Chairman",
      bio: "20+ years at Prudential Financial. Former President of Group Insurance and Head of Institutional Retirement Plan Services. Tuck MBA.",
    },
  ],
};

// ============================================================
// SLIDE 3: Industrial Revolution Transformation
// ============================================================
const slide03: SlideContent = {
  id: "slide-03",
  number: 3,
  title: "Industrial Revolution: Transformation of Production",
  layout: "two-column",
  leftText: "BEFORE INDUSTRIALIZATION\n\nInputs (Raw Materials) → Artisan Tools (Skilled Labor) → Outputs (Finished Goods)",
  rightText: "AFTER INDUSTRIALIZATION\n\nInputs (Raw Materials) → Factory (Mechanized Production) → Outputs (Finished Goods)",
};

// ============================================================
// SLIDE 4: AI Revolution Transformation
// ============================================================
const slide04: SlideContent = {
  id: "slide-04",
  number: 4,
  title: "AI Revolution: Transformation of Knowledge Work",
  layout: "two-column",
  leftText: "BEFORE AI REVOLUTION\n\nInputs (Data & Information) → White Collar Worker (Knowledge Labor) → Outputs (Decisions, Analysis, Content)",
  rightText: "AFTER AI REVOLUTION\n\nInputs (Data & Information) → AI & Automation (Cognitive Processing) → Outputs (Decisions, Analysis, Content)",
  note: "The middle component, the white collar worker, is replaced by AI and automation.",
};

// ============================================================
// SLIDE 5: Services Economy
// ============================================================
const slide05: SlideContent = {
  id: "slide-05",
  number: 5,
  title: "Services dominate every major economy",
  subtitle: "Services sector as % of GDP",
  layout: "bar-chart",
  note: "Source: World Bank, StatisticsTimes (2024). The U.S. services sector alone is worth ~$18T — and almost none of it runs on automation.",
  bars: [
    { label: "United States", value: 77.6, highlight: true },
    { label: "United Kingdom", value: 72.5 },
    { label: "France", value: 70.9 },
    { label: "Japan", value: 69.8 },
    { label: "Canada", value: 66.4 },
    { label: "Australia", value: 66.1 },
    { label: "Germany", value: 64.1 },
    { label: "Brazil", value: 59.2 },
    { label: "China", value: 56.8 },
    { label: "India", value: 49.9 },
  ],
};

// ============================================================
// SLIDE 6: Speed of Revolution
// ============================================================
const slide06: SlideContent = {
  id: "slide-06",
  number: 6,
  title: "The industrial revolution took place over 100+ years.",
  layout: "two-column",
  leftText: "The industrial revolution took place over 100+ years.",
  rightText: "The AI revolution will be much faster due to global information highways",
};

// ============================================================
// SLIDE 7: Generalizability of Service Factories
// ============================================================
const slide07: SlideContent = {
  id: "slide-07",
  number: 7,
  title: "While industrial factories require highly specialized machines, service factories are highly generalizable",
  subtitle: "80% Generalizability: Common Workstreams Across White Collar Services",
  layout: "table",
  note: "High similarity in core business processes creates opportunities for standardization.",
  tableHeaders: ["Industry", "Project Mgmt", "Client Comm", "Data Analysis", "Doc Creation", "Invoicing", "Talent Acq", "Compliance"],
  tableRows: [
    ["Accounting / Finance", "✓", "✓", "✓", "", "✓", "✓", "✓"],
    ["Legal Services", "", "✓", "✓", "✓", "✓", "✓", ""],
    ["Management Consulting", "✓", "✓", "✓", "✓", "✓", "✓", ""],
    ["HR Services", "", "✓", "✓", "✓", "✓", "✓", "✓"],
    ["Marketing & Advertising", "✓", "✓", "✓", "✓", "✓", "", "✓"],
    ["IT Services", "✓", "✓", "✓", "✓", "✓", "✓", "✓"],
  ],
};

// ============================================================
// SLIDE 8: Mission
// ============================================================
const slide08: SlideContent = {
  id: "slide-08",
  number: 8,
  title: "We are on a mission to build the world's first services factories.",
  layout: "bullets",
  body: "The best way to do that is similar to how the industrial revolution played out. Rather than automating entire businesses at once, entrepreneurs would:",
  bullets: [
    "Take existing manual process (textile production)",
    "Automate high-friction components (cotton spinning)",
    "Expand towards end-to-end automation (cotton gin, power loom)",
  ],
};

// ============================================================
// SLIDE 9: Strategy
// ============================================================
const slide09: SlideContent = {
  id: "slide-09",
  number: 9,
  title: "We intend to:",
  layout: "bullets",
  bullets: [
    "Acquire services businesses",
    "Automate discrete processes",
    "Expand towards end-to-end automation",
  ],
};

// ============================================================
// SLIDE 10: The Playbook
// ============================================================
const slide10: SlideContent = {
  id: "slide-10",
  number: 10,
  title: "The Playbook",
  layout: "bullets",
  bullets: [
    "Identify a high-fragmentation services sector",
    "Recruit an industry executive as operating partner",
    "Map quick-win automation opportunities across core workflows",
    "Acquire 3-5 'early believer' firms at 4-6x EBITDA",
    "Deploy automation playbook → expand margins 15-25 pp",
    "Roll up adjacent firms using proven automation as due diligence edge",
  ],
};

// ============================================================
// SLIDE 11: Candidate Industries
// ============================================================
const slide11: SlideContent = {
  id: "slide-11",
  number: 11,
  title: "What are our initial candidate industries?",
  layout: "big-text",
};

// ============================================================
// SLIDE 12: First Bet - Retirement TPA
// ============================================================
const slide12: SlideContent = {
  id: "slide-12",
  number: 12,
  title: "Our first bet: Retirement TPA",
  layout: "bullets",
  body: "Businesses need retirement TPAs to set up, manage and audit their employees' retirement plans",
  bullets: [
    "Highly recurring revenue",
    "Low churn",
    "..",
  ],
};

// ============================================================
// SLIDE 13: What does a TPA do?
// ============================================================
const slide13: SlideContent = {
  id: "slide-13",
  number: 13,
  title: "What does a TPA do?",
  layout: "big-text",
};

// ============================================================
// SLIDE 14: Chairman
// ============================================================
const slide14: SlideContent = {
  id: "slide-14",
  number: 14,
  title: "Who is our chairman?",
  layout: "big-text",
};

// ============================================================
// SLIDE 15: Why this space
// ============================================================
const slide15: SlideContent = {
  id: "slide-15",
  number: 15,
  title: "Why do we like this space?",
  layout: "big-text",
};

// ============================================================
// SLIDE 16: M&A Pipeline
// ============================================================
const slide16: SlideContent = {
  id: "slide-16",
  number: 16,
  title: "Current M&A pipeline",
  layout: "big-text",
};

// ============================================================
// SLIDE 17: Industry Overview
// ============================================================
const slide17: SlideContent = {
  id: "slide-17",
  number: 17,
  title: "Industry Overview",
  layout: "big-text",
};

// ============================================================
// SLIDE 18: Automation Opportunities
// ============================================================
const slide18: SlideContent = {
  id: "slide-18",
  number: 18,
  title: "What automation opportunities are there?",
  subtitle: "Implied Margin Impact",
  layout: "table",
  tableHeaders: ["Activity", "Current Time Per Client", "Current Owner", "Cost / Hr", "Annual Savings"],
  tableRows: [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ],
};

// ============================================================
// SLIDE 19: Fundraise
// ============================================================
const slide19: SlideContent = {
  id: "slide-19",
  number: 19,
  title: "Raising $10M",
  layout: "big-text",
};


// ============================================================
// ALL SLIDES - exported as a single array
// ============================================================
export const slides: SlideContent[] = [
  slide01, slide02, slide03, slide04, slide05,
  slide06, slide07, slide08, slide09, slide10,
  slide11, slide12, slide13, slide14, slide15,
  slide16, slide17, slide18, slide19,
];
