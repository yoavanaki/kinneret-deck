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
  layout: "title" | "text" | "two-column" | "bullets" | "section" | "table" | "big-text";
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
// SLIDE 1: Title Slide
// ============================================================
const slide01: SlideContent = {
  id: "slide-01",
  number: 1,
  title: "Kinneret",
  subtitle: "Factories for white collar services",
  layout: "title",
};

// ============================================================
// SLIDE 2: Team Bios (placeholder - original has images)
// ============================================================
const slide02: SlideContent = {
  id: "slide-02",
  number: 2,
  title: "The Devil's Team Bios",
  layout: "text",
  body: "The Devil — Leader. Master of deception and soul collection. Loves gambling and jazz.\n\nKing Dice — Right-Hand Man. Casino manager and sly trickster. Loyal to a fault.\n\nThe Imps — Minions. Agents of mischief and mayhem. Always plotting pranks.",
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
  title: "Services is the biggest sector of the U.S. economy, accounting for XX% of GDP",
  layout: "two-column",
  leftText: "Services is the biggest sector of the U.S. economy, accounting for XX% of GDP",
  rightText: "We're on the threshold of a massive transformation, with AI resetting the services economy",
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
    "Identify Sector",
    "Recruit Industry Executive(s)",
    "Identify quick-win automation opportunities",
    "Find 3-5 'early believer' firms to acquire",
  ],
  note: "... cashflow? This is missing what happens after the initial few steps",
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
