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
  layout: "title" | "text" | "two-column" | "bullets" | "section" | "table" | "big-text" | "dictionary" | "team" | "bar-chart" | "flow";
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
  /** Flow diagrams for flow layout: before/after transformation */
  flows?: {
    before: { label: string; icon: string; items: string[] };
    middle: { label: string; icon: string; strikethrough?: boolean };
    after: { label: string; icon: string; items: string[] };
    replacement?: { label: string; icon: string };
  };
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
      imageUrl: "/team/anaki.jpeg",
    },
    {
      name: "Yoav Segev",
      role: "Co-Founder",
      bio: "MBA from Harvard Business School. Former Associate at Charlesbank Capital Partners, BCG, and Morgan Stanley. BA Economics & Management from Oxford.",
      imageUrl: "/team/segev.jpeg",
    },
    {
      name: "Jamie Kalamarides",
      role: "Chairman",
      bio: "20+ years at Prudential Financial. Former President of Group Insurance and Head of Institutional Retirement Plan Services. Tuck MBA.",
      imageUrl: "/team/kalamarides.jpg",
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
  layout: "flow",
  flows: {
    before: { label: "Inputs", icon: "🪵", items: ["Raw Materials", "Natural Resources"] },
    middle: { label: "Artisan Workshop", icon: "🔨", strikethrough: true },
    after: { label: "Outputs", icon: "📦", items: ["Finished Goods", "Physical Products"] },
    replacement: { label: "Factory", icon: "🏭" },
  },
  note: "Mechanized production replaced skilled artisan labor, enabling mass production at dramatically lower cost.",
};

// ============================================================
// SLIDE 4: AI Revolution Transformation
// ============================================================
const slide04: SlideContent = {
  id: "slide-04",
  number: 4,
  title: "AI Revolution: Transformation of Knowledge Work",
  layout: "flow",
  flows: {
    before: { label: "Inputs", icon: "📊", items: ["Data & Information", "Documents & Records"] },
    middle: { label: "White Collar Worker", icon: "👔", strikethrough: true },
    after: { label: "Outputs", icon: "📋", items: ["Decisions & Analysis", "Reports & Content"] },
    replacement: { label: "AI & Automation", icon: "🤖" },
  },
  note: "The middle component — the knowledge worker — is replaced by AI and automation, just as factories replaced artisans.",
};

// ============================================================
// SLIDE 5: Services Economy
// ============================================================
const slide05: SlideContent = {
  id: "slide-05",
  number: 5,
  title: "White collar services dwarf the technology market",
  subtitle: "U.S. Gross Output by Industry (Q3 2025, Bureau of Economic Analysis)",
  layout: "bar-chart",
  note: "Source: U.S. Bureau of Economic Analysis (Jan 2026). White collar services are ~4x larger than the technology sector — and almost none of it runs on automation.",
  bars: [
    { label: "White Collar Services", value: 11.3, highlight: true },
    { label: "Manufacturing", value: 7.3 },
    { label: "Real Estate", value: 6.1 },
    { label: "Government", value: 5.7 },
    { label: "Healthcare", value: 3.9 },
    { label: "Wholesale Trade", value: 3.2 },
    { label: "Retail Trade", value: 3.0 },
    { label: "Technology", value: 2.9 },
    { label: "Construction", value: 2.5 },
    { label: "Transportation", value: 1.9 },
  ],
};

// ============================================================
// SLIDE 6: Generalizability of Service Factories
// ============================================================
const slide06: SlideContent = {
  id: "slide-06",
  number: 6,
  title: "Service factories are highly generalizable",
  subtitle: "Common workstreams across white collar services",
  layout: "table",
  tableHeaders: ["Industry", "Project Mgmt", "Client Comm", "Data Analysis", "Doc Creation", "Invoicing", "Compliance"],
  tableRows: [
    ["Accounting / Finance", "✓", "✓", "✓", "", "✓", "✓"],
    ["Legal Services", "", "✓", "✓", "✓", "✓", ""],
    ["Mgmt Consulting", "✓", "✓", "✓", "✓", "✓", ""],
    ["HR Services", "", "✓", "✓", "✓", "✓", "✓"],
    ["Marketing & Ads", "✓", "✓", "✓", "✓", "✓", "✓"],
    ["IT Services", "✓", "✓", "✓", "✓", "✓", "✓"],
  ],
};

// ============================================================
// SLIDE 7: Mission — Acquire → Automate → Expand
// ============================================================
const slide07: SlideContent = {
  id: "slide-07",
  number: 7,
  title: "Building the world's first services factories",
  layout: "flow",
  flows: {
    before: { label: "Acquire", icon: "🏢", items: ["Buy services firms", "at 4-6x EBITDA"] },
    middle: { label: "Automate", icon: "⚡" },
    after: { label: "Expand", icon: "📈", items: ["End-to-end automation", "Roll up adjacent firms"] },
  },
  note: "Following the industrial revolution playbook: acquire manual processes, automate high-friction components, then scale.",
};

// ============================================================
// SLIDE 8: The Playbook
// ============================================================
const slide08: SlideContent = {
  id: "slide-08",
  number: 8,
  title: "The Playbook",
  layout: "table",
  tableHeaders: ["Phase", "Action", "Outcome"],
  tableRows: [
    ["1. Scout", "Identify high-fragmentation services sector", "Target market selected"],
    ["2. Partner", "Recruit industry executive as operating partner", "Domain expertise secured"],
    ["3. Map", "Map quick-win automation opportunities", "Automation roadmap ready"],
    ["4. Acquire", "Buy 3-5 firms at 4-6x EBITDA", "Initial portfolio built"],
    ["5. Automate", "Deploy AI playbook → expand margins 15-25 pp", "Unit economics proven"],
    ["6. Scale", "Roll up adjacent firms with automation edge", "Platform compounding"],
  ],
};

// ============================================================
// SLIDE 9: Candidate Industries
// ============================================================
const slide09: SlideContent = {
  id: "slide-09",
  number: 9,
  title: "Initial Candidate Industries",
  subtitle: "Fragmented, rule-based, and ripe for automation",
  layout: "table",
  tableHeaders: ["Sector", "Market Size", "Fragmentation", "Automation Potential", "Regulatory Moat"],
  tableRows: [
    ["Retirement TPA", "$8B+", "High — 5,000+ firms", "Very High", "Strong (ERISA/IRS)"],
    ["Payroll Services", "$25B+", "High — 10,000+ firms", "Very High", "Strong (IRS/DOL)"],
    ["IRA Administration", "$3B+", "High", "High", "Strong (IRS)"],
    ["Property Management", "$100B+", "High — mostly local", "High", "Moderate"],
    ["Insurance Brokerage", "$60B+", "Very High", "High", "Strong"],
    ["Accounting / Bookkeeping", "$150B+", "Extreme — 90k+ firms", "Medium-High", "Moderate (CPA)"],
    ["Benefits Administration", "$15B+", "High", "High", "Strong (ERISA/ACA)"],
    ["Staffing / Recruiting", "$200B+", "High", "Medium", "Low"],
  ],
};

// ============================================================
// SLIDE 10: First Bet - Retirement TPA
// ============================================================
const slide10: SlideContent = {
  id: "slide-10",
  number: 10,
  title: "Our first bet: Retirement TPA",
  subtitle: "Every business with a 401(k) needs a TPA. They can't do it themselves — and they can't stop.",
  layout: "table",
  tableHeaders: ["Why Retirement TPA?", "Detail"],
  tableRows: [
    ["💰 Recurring Revenue", "Clients pay annually, year after year"],
    ["🔒 Near-Zero Churn", "High switching costs — plans are sticky"],
    ["⚖️ Regulatory Mandate", "ERISA & IRS rules require professional administration"],
    ["🧩 Fragmented Market", "5,000+ independent TPAs, most sub-$5M revenue"],
    ["🤖 Automation Ready", "80%+ of workflows are rule-based and repetitive"],
    ["📜 SECURE Act 2.0", "New legislation expanding plan coverage to millions"],
  ],
};

// ============================================================
// SLIDE 11: What does a TPA do?
// ============================================================
const slide11: SlideContent = {
  id: "slide-11",
  number: 11,
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
// SLIDE 12: Chairman
// ============================================================
const slide12: SlideContent = {
  id: "slide-12",
  number: 12,
  title: "Jamie Kalamarides — Chairman",
  layout: "text",
  body: "Jamie brings 20+ years of senior leadership at Prudential Financial, where he served as President of Group Insurance and Head of Institutional Retirement Plan Services, overseeing billions in plan assets.\n\nHe was a key expert to the SECURE Act, testifying before the U.S. Senate Finance, HELP, and Aging Committees on retirement policy. He is a nonresident fellow at the Bipartisan Policy Center.\n\nJamie's deep domain expertise in retirement services — combined with his relationships across the industry — gives Cognitory a unique advantage in building trust with acquisition targets and navigating the regulatory landscape.",
};

// ============================================================
// SLIDE 13: Why this space
// ============================================================
const slide13: SlideContent = {
  id: "slide-13",
  number: 13,
  title: "Why Retirement TPA?",
  layout: "two-column",
  leftText: "STRUCTURAL ADVANTAGES\n\n• Regulatory mandate creates guaranteed demand\n• Extreme fragmentation — no dominant player\n• Owner-operators aging out, looking to sell\n• Acquisition multiples are low (4-6x EBITDA)\n• Recurring, contract-based revenue",
  rightText: "AUTOMATION OPPORTUNITY\n\n• 80%+ of workflows are rule-based\n• Document generation is templated\n• Compliance testing follows fixed algorithms\n• Government filings are standardized\n• AI can reduce cost-to-serve by 50%+",
  note: "The combination of cheap acquisitions and dramatic margin expansion through automation creates a powerful economic engine.",
};

// ============================================================
// SLIDE 14: M&A Pipeline
// ============================================================
const slide14: SlideContent = {
  id: "slide-14",
  number: 14,
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
// SLIDE 15: Industry Overview
// ============================================================
const slide15: SlideContent = {
  id: "slide-15",
  number: 15,
  title: "Retirement TPA Industry Overview",
  layout: "two-column",
  leftText: "MARKET STRUCTURE\n\n• $8B+ total addressable market\n• 5,000+ TPA firms in the U.S.\n• Top 10 firms hold <15% market share\n• Average firm: 10-50 employees\n• 700,000+ retirement plans need administration",
  rightText: "KEY DYNAMICS\n\n• Owner-operators are 55-65 years old on average\n• Succession crisis — limited buyer pool\n• SECURE Act 2.0 expanding plan coverage to millions of new participants\n• Technology adoption is 10+ years behind\n• Margins today: 15-25%. Post-automation target: 40-50%",
  note: "The retirement TPA industry is at an inflection point: regulatory expansion is driving demand while the supply side is consolidating.",
};

// ============================================================
// SLIDE 16: Automation Opportunities
// ============================================================
const slide16: SlideContent = {
  id: "slide-16",
  number: 16,
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
// SLIDE 17: Fundraise
// ============================================================
const slide17: SlideContent = {
  id: "slide-17",
  number: 17,
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
  slide16, slide17,
];
