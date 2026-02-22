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
  title: "Initial Candidate Industries",
  layout: "table",
  subtitle: "Sectors scored on fragmentation, process repeatability, and regulatory tailwind",
  tableHeaders: ["Sector", "Market Size", "Fragmentation", "Automation Potential", "Regulatory Moat"],
  tableRows: [
    ["Retirement TPA", "$8B+", "High — 5,000+ firms", "Very High", "Strong (ERISA/IRS)"],
    ["Property Management", "$100B+", "High — mostly local", "High", "Moderate"],
    ["Insurance Brokerage", "$60B+", "Very High", "High", "Strong"],
    ["Accounting / Bookkeeping", "$150B+", "Extreme — 90k+ firms", "Medium-High", "Moderate (CPA)"],
    ["Staffing / Recruiting", "$200B+", "High", "Medium", "Low"],
  ],
  note: "We start where fragmentation is highest, automation potential is clearest, and regulatory complexity creates a natural moat.",
};

// ============================================================
// SLIDE 12: First Bet - Retirement TPA
// ============================================================
const slide12: SlideContent = {
  id: "slide-12",
  number: 12,
  title: "Our first bet: Retirement TPA",
  layout: "bullets",
  body: "Every business with a 401(k) or pension plan needs a Third Party Administrator to handle compliance, testing, and government filings. They can't do it themselves — and they can't stop.",
  bullets: [
    "Highly recurring revenue — clients pay annually, year after year",
    "Near-zero churn — switching costs are high and plans are sticky",
    "Regulatory mandate — ERISA and IRS rules require professional administration",
    "Fragmented market — 5,000+ independent TPAs, most sub-$5M revenue",
    "Labor-intensive workflows — ripe for AI-driven automation",
    "SECURE Act 2.0 tailwind — new legislation expanding retirement plan coverage",
  ],
};

// ============================================================
// SLIDE 13: What does a TPA do?
// ============================================================
const slide13: SlideContent = {
  id: "slide-13",
  number: 13,
  title: "What does a TPA do?",
  layout: "bullets",
  body: "A Retirement TPA handles the complex administrative and compliance work that sits between the plan sponsor (employer) and the government.",
  bullets: [
    "Plan design & documentation — draft plan documents, amendments, SPDs",
    "Compliance testing — ADP/ACP, top-heavy, 415 limits, coverage tests",
    "Government filings — Form 5500, SAR, PBGC premiums",
    "Contribution calculations — allocation formulas, true-ups, forfeitures",
    "Participant communications — enrollment, disclosures, benefit statements",
    "Plan corrections — EPCRS/VCP filings for operational errors",
  ],
  note: "Most of this work is document-heavy, rule-based, and repetitive — exactly the profile AI excels at automating.",
};

// ============================================================
// SLIDE 14: Chairman
// ============================================================
const slide14: SlideContent = {
  id: "slide-14",
  number: 14,
  title: "Jamie Kalamarides — Chairman",
  layout: "text",
  body: "Jamie brings 20+ years of senior leadership at Prudential Financial, where he served as President of Group Insurance and Head of Institutional Retirement Plan Services, overseeing billions in plan assets.\n\nHe was a key expert to the SECURE Act, testifying before the U.S. Senate Finance, HELP, and Aging Committees on retirement policy. He is a nonresident fellow at the Bipartisan Policy Center.\n\nJamie's deep domain expertise in retirement services — combined with his relationships across the industry — gives Cognitory a unique advantage in building trust with acquisition targets and navigating the regulatory landscape.",
};

// ============================================================
// SLIDE 15: Why this space
// ============================================================
const slide15: SlideContent = {
  id: "slide-15",
  number: 15,
  title: "Why Retirement TPA?",
  layout: "two-column",
  leftText: "STRUCTURAL ADVANTAGES\n\n• Regulatory mandate creates guaranteed demand\n• Extreme fragmentation — no dominant player\n• Owner-operators aging out, looking to sell\n• Acquisition multiples are low (4-6x EBITDA)\n• Recurring, contract-based revenue",
  rightText: "AUTOMATION OPPORTUNITY\n\n• 80%+ of workflows are rule-based\n• Document generation is templated\n• Compliance testing follows fixed algorithms\n• Government filings are standardized\n• AI can reduce cost-to-serve by 50%+",
  note: "The combination of cheap acquisitions and dramatic margin expansion through automation creates a powerful economic engine.",
};

// ============================================================
// SLIDE 16: M&A Pipeline
// ============================================================
const slide16: SlideContent = {
  id: "slide-16",
  number: 16,
  title: "Current M&A Pipeline",
  layout: "table",
  subtitle: "Active conversations with owner-operators",
  tableHeaders: ["Target", "Revenue", "Plans Administered", "EBITDA Multiple", "Stage"],
  tableRows: [
    ["Target A (Midwest)", "$2.5M", "~800", "5.0x", "LOI Signed"],
    ["Target B (Southeast)", "$1.8M", "~500", "4.5x", "Due Diligence"],
    ["Target C (Northeast)", "$3.2M", "~1,100", "5.5x", "Negotiation"],
    ["Target D (West Coast)", "$1.2M", "~350", "4.0x", "Initial Talks"],
    ["Target E (Southwest)", "$2.0M", "~600", "4.8x", "Initial Talks"],
  ],
  note: "Combined pipeline: ~$10.7M revenue, ~3,350 plans. Targeting first 2-3 closings within 6 months of funding.",
};

// ============================================================
// SLIDE 17: Industry Overview
// ============================================================
const slide17: SlideContent = {
  id: "slide-17",
  number: 17,
  title: "Retirement TPA Industry Overview",
  layout: "two-column",
  leftText: "MARKET STRUCTURE\n\n• $8B+ total addressable market\n• 5,000+ TPA firms in the U.S.\n• Top 10 firms hold <15% market share\n• Average firm: 10-50 employees\n• 700,000+ retirement plans need administration",
  rightText: "KEY DYNAMICS\n\n• Owner-operators are 55-65 years old on average\n• Succession crisis — limited buyer pool\n• SECURE Act 2.0 expanding plan coverage to millions of new participants\n• Technology adoption is 10+ years behind\n• Margins today: 15-25%. Post-automation target: 40-50%",
  note: "The retirement TPA industry is at an inflection point: regulatory expansion is driving demand while the supply side is consolidating.",
};

// ============================================================
// SLIDE 18: Automation Opportunities
// ============================================================
const slide18: SlideContent = {
  id: "slide-18",
  number: 18,
  title: "Automation Opportunities",
  subtitle: "Implied margin impact per 500-plan TPA ($2M revenue)",
  layout: "table",
  tableHeaders: ["Activity", "Hrs / Plan / Yr", "Staff", "Cost / Hr", "AI Reduction", "Annual Savings"],
  tableRows: [
    ["Compliance Testing", "8", "Analyst", "$45", "80%", "$144,000"],
    ["Form 5500 Prep", "4", "Analyst", "$45", "90%", "$81,000"],
    ["Plan Doc Drafting", "3", "Admin", "$35", "85%", "$44,625"],
    ["Contribution Calcs", "6", "Analyst", "$45", "75%", "$101,250"],
    ["Participant Comms", "2", "Admin", "$35", "70%", "$24,500"],
    ["Error Corrections", "2", "Sr. Analyst", "$60", "60%", "$36,000"],
  ],
  note: "Total estimated savings: ~$431K/year per 500-plan firm → margin expansion from ~20% to ~42%. These are conservative estimates based on current AI capabilities.",
};

// ============================================================
// SLIDE 19: Fundraise
// ============================================================
const slide19: SlideContent = {
  id: "slide-19",
  number: 19,
  title: "Raising $10M",
  layout: "bullets",
  body: "Seed round to acquire initial TPA portfolio and deploy the automation playbook.",
  bullets: [
    "Acquisitions (60%) — acquire 2-3 TPAs at 4-6x EBITDA",
    "Automation build (25%) — AI/ML pipeline for compliance, filings, and document generation",
    "Operations & team (15%) — integration playbook, operating partners, G&A",
  ],
  note: "Target returns: 3-5x over 5 years through margin expansion + revenue growth + multiple re-rating at exit. First acquisitions expected within 6 months of close.",
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
