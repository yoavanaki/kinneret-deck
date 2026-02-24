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
  layout: "title" | "text" | "two-column" | "bullets" | "section" | "table" | "big-text" | "dictionary" | "team" | "bar-chart" | "flow" | "stack" | "parallels" | "boxes" | "playbook" | "two-column-boxes" | "vision" | "holdco-org";
  /** Custom HTML content for special layouts */
  customHtml?: string;
  /** Team members for team layout */
  team?: { name: string; role: string; bio: string; imageUrl?: string; logos?: { name: string; imageUrl: string }[] }[];
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
  /** Key stats shown as prominent boxes (e.g. for pipeline slides) */
  stats?: { value: string; label: string }[];
  /** Pie chart segments for inline pie charts */
  pieChart?: { label: string; value: number; color?: string }[];
  /** Optional portrait / headshot image URL */
  imageUrl?: string;
  /** Callout box text — rendered as a highlighted banner */
  callout?: string;
  /** Footnote text — rendered in very small text at slide bottom */
  footnote?: string;
  /** Sticker text — rendered as a tilted ribbon/badge on the slide */
  sticker?: string;
  /** Box cards for boxes layout */
  boxes?: { icon: string; title: string; description: string }[];
  /** Stack diagram layers for stack layout (rendered bottom-to-top) */
  stack?: {
    label: string;
    icon?: string;
    description?: string;
    items?: { label: string; icon?: string; accent?: boolean }[];
    /** If true, items render as a grid of small cards (for "many agents" feel) */
    grid?: boolean;
  }[];
  /** Holdco-level AI agents (shown as a separate diagram alongside stack) */
  holdcoAgents?: { label: string; icon: string; description?: string }[];
  /** Two-column-boxes layout: column titles and box arrays */
  leftColumnTitle?: string;
  rightColumnTitle?: string;
  leftBoxes?: { icon: string; title: string; description: string }[];
  rightBoxes?: { icon: string; title: string; description: string }[];
  /** Holdco org chart for holdco-org layout */
  orgChart?: {
    top: { label: string; items: string[] };
    middle: { labels: string[]; description: string };
    bottom: { groups: number[]; description: string };
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
  customHtml: "A facility or system that produces services at scale through standardized, automated processes — as a factory does for physical goods.",
  note: "",
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
      name: "Yoav Segev",
      role: "Business",
      bio: "Economics @ Oxford University\nConsultant at BCG\nBusiness Services Investor at Charlesbank\nIncubated Compliance Consulting firm\nMBA @ HBS",
      imageUrl: "/team/segev.jpeg",
      logos: [
        { name: "HBS", imageUrl: "/logos/hbs.svg" },
        { name: "BCG", imageUrl: "/logos/bcg.svg" },
        { name: "Charlesbank", imageUrl: "/logos/charlesbank.svg" },
      ],
    },
    {
      name: "Yoav Anaki",
      role: "Business",
      bio: "Computer Science age 13\nCOO at Mad Mimi, acquired by GoDaddy\nIDF Counterterrorism Investigations\nPartner, AI at Fresh Fund\nMBA @ HBS",
      imageUrl: "/team/anaki.jpeg",
      logos: [
        { name: "HBS", imageUrl: "/logos/hbs.svg" },
        { name: "IDF", imageUrl: "/logos/idf.svg" },
        { name: "Fresh Fund", imageUrl: "/logos/freshfund.svg" },
      ],
    },
    {
      name: "Eran Pinhas",
      role: "Tech",
      bio: "CTO & Co-Founder of Ginzi (AI Support Automation)\nPrincipal Software Engineer at Axonius\nFull-stack & AI/ML systems\nOpen-source contributor\nCS @ Ben-Gurion University",
      imageUrl: "/team/pinhas.jpg",
      logos: [
        { name: "IDF 8200", imageUrl: "/logos/idf8200.svg" },
        { name: "Ben Gurion Uni", imageUrl: "/logos/bgu.svg" },
        { name: "Axonius", imageUrl: "/logos/axonius.png" },
      ],
    },
    {
      name: "Jamie Kalamarides",
      role: "Retirement",
      bio: "President, Group Insurance at Prudential Financial\nHead of Institutional Retirement Plan Services\nExpert witness, U.S. Senate (SECURE Act)\nFellow, Bipartisan Policy Center\nMBA @ Tuck",
      imageUrl: "/team/kalamarides.jpg",
      logos: [
        { name: "Dartmouth", imageUrl: "/logos/dartmouth.svg" },
        { name: "US Gov", imageUrl: "/logos/usgov.svg" },
        { name: "Prudential", imageUrl: "/logos/prudential.png" },
      ],
    },
  ],
};

// ============================================================
// SLIDE 3: Industrial → AI Revolution Parallels
// ============================================================
const slideParallels: SlideContent = {
  id: "slide-parallels",
  number: 3,
  title: "History doesn't repeat, but it rhymes",
  subtitle: "The AI revolution follows the same playbook as the industrial revolution",
  layout: "parallels",
  tableHeaders: ["", "Industrial Revolution", "AI Revolution"],
  tableRows: [
    ["Scarce Resource", "Energy", "Intelligence"],
    ["Breakthrough", "Steam Engine", "Large Language Models"],
    ["Infrastructure", "Railroads & Factories", "Cloud & Data Centers"],
    ["Disrupts", "Manual Labor", "Knowledge Work"],
    ["Economics", "Cost per widget → $0", "Cost per decision → $0"],
    ["New Entity", "🏭 The Factory", "The Cognitory 🤖"],
  ],
  note: "Every industrial revolution replaces an expensive, variable human input with cheap, scalable infrastructure. Services are next.",
};

// ============================================================
// SLIDE 4: Industrial Revolution Transformation
// ============================================================
const slide03: SlideContent = {
  id: "slide-03",
  number: 4,
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
// SLIDE 5: AI Revolution Transformation
// ============================================================
const slide04: SlideContent = {
  id: "slide-04",
  number: 5,
  title: "AI Revolution: Transformation of Knowledge Work",
  layout: "flow",
  flows: {
    before: { label: "Inputs", icon: "📊", items: ["Data & Information", "Documents & Records"] },
    middle: { label: "White Collar Worker", icon: "👔", strikethrough: true },
    after: { label: "Outputs", icon: "📋", items: ["Decisions & Analysis", "Reports & Content"] },
    replacement: { label: "Cognitory", icon: "🤖" },
  },
  note: "The middle component — the knowledge worker — is replaced by AI and automation, just as factories replaced artisans.",
};

// ============================================================
// SLIDE 6: Services Economy
// ============================================================
const slide05: SlideContent = {
  id: "slide-05",
  number: 6,
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
// SLIDE 7: Generalizability of Service Factories
// ============================================================
const slide06: SlideContent = {
  id: "slide-06",
  number: 7,
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
// SLIDE 8: Platform Architecture — Stack Diagram
// ============================================================
const slideStack: SlideContent = {
  id: "slide-stack",
  number: 7,
  title: "The Cognitory platform",
  subtitle: "AI-native software that automates any services business",
  layout: "stack",
  stack: [
    // Layer 1 (bottom): AI Model
    {
      label: "AI Model Layer",
      icon: "🧠",
      description: "Foundation models powering all automation",
      items: [
        { label: "LLM Reasoning", icon: "💬" },
        { label: "Document Understanding", icon: "📄" },
        { label: "Data Extraction", icon: "🔍" },
        { label: "Classification", icon: "🏷️" },
      ],
    },
    // Layer 2 (middle): Agentic Layer
    {
      label: "Agentic Layer",
      icon: "⚡",
      description: "Autonomous agents with general and domain-specific skills",
      items: [
        { label: "Scheduling" },
        { label: "Cron Jobs" },
        { label: "Notifications" },
        { label: "Data Pipelines" },
        { label: "Client Intake" },
        { label: "Doc Generation" },
        { label: "Compliance Testing", accent: true },
        { label: "Form 5500 Filing", accent: true },
        { label: "Plan Doc Drafting", accent: true },
        { label: "Contribution Calcs", accent: true },
        { label: "Error Corrections", accent: true },
      ],
    },
    // Layer 3 (top): Monitoring & Control
    {
      label: "Monitoring & Control Center",
      icon: "📡",
      description: "Observe, manage, and intervene across all running agents",
      grid: true,
      items: [
        { label: "TPA-A Agent 1", accent: true },
        { label: "TPA-A Agent 2", accent: true },
        { label: "TPA-A Agent 3", accent: true },
        { label: "TPA-B Agent 1", accent: true },
        { label: "TPA-B Agent 2", accent: true },
        { label: "Payroll Agent", icon: "🔵" },
        { label: "Benefits Agent", icon: "🔵" },
        { label: "Insurance Agent", icon: "🔵" },
        { label: "Agent N ...", icon: "🔵" },
      ],
    },
  ],
  holdcoAgents: [
    { label: "Sourcing Agent", icon: "🔎", description: "Scans broker listings, databases & networks to identify acquisition targets" },
    { label: "Outreach Agent", icon: "📧", description: "Personalized multi-channel outreach to owner-operators" },
    { label: "Diligence Agent", icon: "📊", description: "Analyzes financials, client lists, compliance history & automation fit" },
    { label: "Integration Agent", icon: "🔗", description: "Onboards acquired firms onto the Cognitory platform" },
  ],
  note: "Left: the platform deployed inside each acquired firm. Right: AI agents that power the holdco's acquisition engine.",
};

// ============================================================
// SLIDE 9: Technology Opportunities (AI Agents)
// ============================================================
const slideTechOpps: SlideContent = {
  id: "slide-tech-opps",
  number: 8,
  title: "Technology Opportunities",
  subtitle: "Proactive AI agents that handle both general and domain-specific work",
  layout: "two-column-boxes",
  leftColumnTitle: "Portfolio Agent",
  leftBoxes: [
    { icon: "📧", title: "Email & Communications", description: "Reads, drafts, and sends client correspondence autonomously" },
    { icon: "📅", title: "Scheduling & Coordination", description: "Manages calendars, meetings, and follow-ups" },
    { icon: "✅", title: "Compliance Testing", description: "Runs ADP/ACP, coverage, and top-heavy tests" },
    { icon: "🏛️", title: "Government Filings", description: "Prepares Form 5500, 5558 extensions, and SARs" },
  ],
  rightColumnTitle: "Holdco Agents",
  rightBoxes: [
    { icon: "🔎", title: "Sourcing", description: "Identifies acquisition targets across broker networks and databases" },
    { icon: "📧", title: "Outreach", description: "Personalized multi-channel outreach to owner-operators" },
    { icon: "📊", title: "Diligence", description: "Analyzes financials, compliance history, and automation fit" },
    { icon: "🔗", title: "Integration", description: "Onboards acquired firms onto the Cognitory platform" },
  ],
};

// ============================================================
// SLIDE 10: Mission — Acquire → Automate → Expand
// ============================================================
const slide08: SlideContent = {
  id: "slide-08",
  number: 9,
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
// SLIDE 10: The Playbook
// ============================================================
const slide09: SlideContent = {
  id: "slide-09",
  number: 8,
  title: "The Playbook",
  layout: "playbook",
  boxes: [
    { icon: "🔍", title: "Scout", description: "Identify high-fragmentation services sector" },
    { icon: "🤝", title: "Partner", description: "Recruit industry executive as operating partner" },
    { icon: "🗺️", title: "Map", description: "Map quick-win automation opportunities" },
    { icon: "🏢", title: "Acquire", description: "Buy 3-5 firms at 4-6x EBITDA" },
    { icon: "⚡", title: "Automate", description: "Deploy AI playbook, expand margins 15-25 pp" },
    { icon: "📈", title: "Scale", description: "Roll up adjacent firms with automation edge" },
  ],
};

// ============================================================
// SLIDE 11: Candidate Industries
// ============================================================
const slide10: SlideContent = {
  id: "slide-10",
  number: 9,
  title: "Initial Candidate Industries",
  subtitle: "We've analyzed 20+ service sectors — Retirement TPA is our first target to disrupt",
  layout: "table",
  bullets: [
    "High fragmentation",
    "Recurring revenue",
    "Large market",
    "Rule-based & automatable",
    "Trust or regulatory moat",
    "Low technology adoption",
  ],
  tableHeaders: ["Sector", "Market Size", "Fragmentation", "Automation Potential", "Trust / Regulatory Moat"],
  tableRows: [
    ["⭐ Retirement TPA", "$8B+", "High — 5,000+ firms", "Very High", "Strong (ERISA/IRS)"],
    ["Financial Services Compliance", "$12B+", "High", "Very High", "Strong (SEC/FINRA)"],
    ["IT Services", "$450B+", "Very High", "High", "Moderate"],
    ["Home Owner Services", "$100B+", "High — mostly local", "High", "Moderate"],
    ["Medical Billing", "$15B+", "High", "Very High", "Strong (HIPAA/CMS)"],
    ["Benefits Administration", "$15B+", "High", "High", "Strong (ERISA/ACA)"],
    ["Insurance Brokerage", "$60B+", "Very High", "High", "Strong"],
    ["Legal Services", "$350B+", "Extreme", "Medium-High", "Strong (Bar/Court)"],
    ["Environmental Services", "$60B+", "High", "High", "Strong (EPA)"],
  ],
};

// ============================================================
// SLIDE 12: First Bet - Retirement TPA
// ============================================================
const slide11: SlideContent = {
  id: "slide-11",
  number: 10,
  title: "Our first bet: Retirement TPA",
  subtitle: "Every business needs a retirement TPA to help set up, manage and audit their employees' retirement plans.",
  layout: "two-column-boxes",
  stats: [
    { value: "$8B+", label: "Market Size" },
    { value: "5,000+", label: "TPA Firms" },
    { value: "700K+", label: "Plans Administered" },
    { value: "4–6×", label: "Acquisition Multiples" },
  ],
  leftColumnTitle: "What is a Retirement TPA?",
  leftBoxes: [
    { icon: "📋", title: "Plan Administration", description: "Manages 401(k) and pension plans on behalf of employers — enrollment, distributions, loans" },
    { icon: "⚖️", title: "Compliance & Testing", description: "Runs IRS-mandated nondiscrimination tests (ADP/ACP, top-heavy) to keep plans legal" },
    { icon: "🏛️", title: "Government Filings", description: "Prepares Form 5500, 5558 extensions, and Summary Annual Reports for every plan" },
    { icon: "🔒", title: "Mandatory & Sticky", description: "Federal law requires professional administration — employers can't DIY, and switching is painful" },
  ],
  rightColumnTitle: "Why we like it",
  rightBoxes: [
    { icon: "💰", title: "Recurring Revenue", description: "Clients pay annually, year after year —\npredictable, compounding cash flows" },
    { icon: "🧩", title: "Fragmented Market", description: "5,000+ independent TPAs, most under $5M revenue — cheap to acquire at 4-6x EBITDA" },
    { icon: "🤖", title: "Automation Ready", description: "80%+ of workflows are rule-based and repetitive — AI can cut cost-to-serve by 50%+" },
    { icon: "📜", title: "SECURE Act 2.0", description: "New legislation expanding plan coverage to millions — growing demand, same supply" },
  ],
};

// ============================================================
// SLIDE 13: What does a TPA do?
// ============================================================
const slide12: SlideContent = {
  id: "slide-12",
  number: 11,
  title: "What does a TPA do?",
  subtitle: "A Retirement TPA handles the complex administrative and compliance work between the employer and the government.",
  layout: "boxes",
  boxes: [
    { icon: "📝", title: "Plan Design & Documentation", description: "Draft plan documents, amendments, summary plan descriptions" },
    { icon: "✅", title: "Compliance Testing", description: "ADP/ACP, top-heavy, 415 limits, coverage tests" },
    { icon: "🏛️", title: "Government Filings", description: "Form 5500, SAR, PBGC premiums, 5558 extensions" },
    { icon: "🧮", title: "Contribution Calculations", description: "Allocation formulas, true-ups, forfeitures, match calcs" },
    { icon: "📬", title: "Participant Communications", description: "Enrollment, disclosures, benefit statements, notices" },
    { icon: "🔧", title: "Plan Corrections", description: "EPCRS / VCP filings for operational errors" },
  ],
  note: "Most of this work is document-heavy, rule-based, and repetitive — exactly the profile AI excels at automating.",
};

// ============================================================
// SLIDE 14: Chairman
// ============================================================
const slide13: SlideContent = {
  id: "slide-13",
  number: 12,
  title: "Jamie Kalamarides — Chairman",
  layout: "text",
  imageUrl: "/team/kalamarides.jpg",
  body: "Jamie brings 20+ years of senior leadership at Prudential Financial, where he served as President of Group Insurance and Head of Institutional Retirement Plan Services, overseeing billions in plan assets.\n\nHe was a key expert to the SECURE Act, testifying before the U.S. Senate Finance, HELP, and Aging Committees on retirement policy. He is a nonresident fellow at the Bipartisan Policy Center.\n\nJamie's deep domain expertise in retirement services — combined with his relationships across the industry — gives Cognitory a unique advantage in building trust with acquisition targets and navigating the regulatory landscape.",
};

// ============================================================
// SLIDE 15: Why this space
// ============================================================
const slide14: SlideContent = {
  id: "slide-14",
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
const slide15: SlideContent = {
  id: "slide-15",
  number: 13,
  title: "Current M&A Pipeline",
  layout: "table",
  subtitle: "Active acquisition pipeline across the U.S.",
  stats: [
    { value: "27", label: "Total Targets" },
    { value: "24", label: "Active" },
    { value: "~$74M", label: "Pipeline Revenue" },
    { value: "~$5M", label: "EBITDA in DD" },
    { value: "6", label: "In Pre-LOI Diligence" },
    { value: "13", label: "States" },
  ],
  pieChart: [
    { label: "Warm Intros", value: 46 },
    { label: "Cold Outreach", value: 33 },
    { label: "Banker-Sourced", value: 21 },
  ],
  tableHeaders: ["Target", "Revenue", "EBITDA", "Region", "Stage"],
  tableRows: [
    ['"Liberty Benefits Admin"', "$1.8M", "$810K", "Mid-Atlantic", "Pre-LOI Diligence"],
    ['"Atlantic Retirement Group"', "$2.0M", "$800K", "Northeast", "Pre-LOI Diligence"],
    ['"Pacific Pension Services"', "$2.0M", "$600K", "West Coast", "Pre-LOI Diligence"],
    ['"Evergreen Plan Services"', "$1.7M", "$425K", "Pacific NW", "Pre-LOI Diligence"],
    ['"Summit Trust Services"', "$5.0M", "—", "Pacific NW", "First Meeting"],
    ['"Lone Star Admin"', "$10.0M", "—", "Southwest", "First Meeting"],
    ["+ 18 additional targets", "$750K–$10M", "", "Nationwide", "Various"],
  ],
};

// ============================================================
// SLIDE 17: Industry Overview
// ============================================================
const slide16: SlideContent = {
  id: "slide-16",
  number: 14,
  title: "Retirement TPA Industry Overview",
  layout: "two-column",
  leftText: "MARKET STRUCTURE\n\n• $8B+ total addressable market\n• 5,000+ TPA firms in the U.S.\n• Top 10 firms hold <15% market share\n• Average firm: 10-50 employees\n• 700,000+ retirement plans need administration",
  rightText: "KEY DYNAMICS\n\n• Owner-operators are 55-65 years old on average\n• Succession crisis — limited buyer pool\n• SECURE Act 2.0 expanding plan coverage to millions of new participants\n• Technology adoption is 10+ years behind\n• Margins today: 15-25%. Post-automation target: 40-50%",
  note: "The retirement TPA industry is at an inflection point: regulatory expansion is driving demand while the supply side is consolidating.",
};

// ============================================================
// SLIDE 18: Competitive Landscape
// ============================================================
const slideCompetitive: SlideContent = {
  id: "slide-competitive",
  number: 15,
  title: "Competitive Landscape",
  subtitle: "No one is combining acquisitions with AI-native automation",
  layout: "table",
  tableHeaders: ["Player", "Model", "AI Automation", "M&A Strategy", "Threat Level"],
  tableRows: [
    ["Large Recordkeepers\n(Fidelity, Vanguard, Empower)", "Bundled plan services", "Internal tools only", "Acquire large RKs", "Low — don't serve small plans"],
    ["National TPAs\n(ASC, Pinnacle)", "Traditional TPA", "Minimal", "Organic growth", "Low — no tech DNA"],
    ["Regional / Local TPAs", "Owner-operated", "None", "None — aging owners", "None — these are targets"],
    ["Tech Platforms\n(Vestwell, Human Interest)", "Software for advisors", "Workflow tooling", "Not acquiring TPAs", "Medium — different segment"],
    ["PE Rollups\n(Hub, NFP, CBIZ)", "Buy & integrate", "Limited", "Acquire for revenue", "Medium — no automation edge"],
    ["Cognitory", "Acquire + Automate", "AI-native platform", "Buy at 4-6x, automate", "We play to win"],
  ],
  callout: "Most competitors are either technology companies that don't acquire, or acquirers that don't automate. Cognitory is uniquely positioned to do both.",
};

// ============================================================
// SLIDE 19: Automation Opportunities
// ============================================================
const slide17: SlideContent = {
  id: "slide-17",
  number: 16,
  title: "Automation Opportunities",
  subtitle: "Process inventory mapped across partner TPAs",
  layout: "table",
  stats: [
    { value: "144", label: "Processes Mapped" },
    { value: "62", label: "Quick Wins" },
    { value: "12,000+", label: "Hours Saved / Year" },
    { value: "$419K", label: "EBITDA Expansion" },
  ],
  tableHeaders: [
    "Process",
    "Hrs / Plan / Yr",
    "Staff",
    "Cost / Hr",
    "AI Reduction",
    "Annual Savings (500 plans)",
  ],
  tableRows: [
    ["Census Collection & Scrubbing", "10", "Bangladesh + Admin", "$25", "85%", "$106,250"],
    ["Form 5500 & 5558 Filing", "6", "Admin", "$40", "90%", "$108,000"],
    ["Trust Reconciliation", "4", "Admin", "$40", "80%", "$64,000"],
    ["Compliance Test Data Entry", "4", "Admin", "$40", "85%", "$68,000"],
    ["Plan Document Generation", "3", "Admin", "$40", "75%", "$45,000"],
    ["Required Notices & Disclosures", "2", "Admin", "$35", "80%", "$28,000"],
  ],
  footnote: 'Source: 144-process inventory mapped at partner TPA (230 plans). 62 of 144 processes rated "Easy" automation. Census: offshore team averages 3 plans/day vs. 8-10 target. 5558 extensions: "nearly zero judgment — prime batch candidate." Trust reconciliation: #1 identified target.',
};

// ============================================================
// SLIDE: What does the business of the future look like?
// ============================================================
const slideFutureBusiness: SlideContent = {
  id: "slide-future-business",
  number: 6,
  title: "What does the business of the future look like?",
  subtitle: "AI collapses the cost of intelligence — the winners will be the ones who redesign the firm around it",
  layout: "vision",
  boxes: [
    { icon: "📧", title: "People, Email & Spreadsheets", description: "Most service firms still run on manual processes and human labor" },
    { icon: "🔄", title: "End-to-End Replacement", description: "AI doesn't just assist workers — it replaces entire workflows" },
    { icon: "🏗️", title: "Thin Management Layer", description: "The business of the future is a small team on top of autonomous AI agents" },
  ],
};

// ============================================================
// SLIDE: What we're building — a Holding Company
// ============================================================
const slideHoldco: SlideContent = {
  id: "slide-holdco",
  number: 7,
  title: "What we're building: a Holding Company",
  subtitle: "We acquire traditional service firms and transform them into AI-native operations",
  layout: "holdco-org",
  orgChart: {
    top: {
      label: "Cognitory",
      items: [
        "Identifies target sectors",
        "Leverages platform scale to attract top-tier R&D and M&A talent",
        "Builds tech that is deployable across end markets",
        "Finances M&A transactions",
        "Key synergies across legal, accounting, etc. — much of which is automated",
      ],
    },
    middle: {
      labels: ["OpCo 1", "OpCo 2", "OpCo 3"],
      description: "Repeatable playbook to build high-margin businesses in fragmented service sectors",
    },
    bottom: {
      groups: [2, 3, 2],
      description: "Companies acquired through M&A in target services industries",
    },
  },
  note: "Vision: hold acquired companies indefinitely given their strategic value and differentiated performance — but each is managed as independently separable. As EBITDA aggregators, there is a built-in put option to PE, industry aggregators, or strategic buyers.",
};

// ============================================================
// SLIDE 20: Growth Potential
// ============================================================
const slideGrowth: SlideContent = {
  id: "slide-growth",
  number: 18,
  title: "How big can this be?",
  subtitle: "The playbook scales from one vertical to an entire economy of services",
  layout: "boxes",
  stats: [
    { value: "$8B", label: "Phase 1: Retirement TPA" },
    { value: "$51B", label: "Phase 2: Adjacent Verticals" },
    { value: "$400B+", label: "Phase 3: All White Collar Services" },
  ],
  boxes: [
    { icon: "🏁", title: "Year 1–3: Prove the Model", description: "Acquire 5-10 TPAs, deploy automation, expand margins from ~20% to 40-50%" },
    { icon: "🔁", title: "Year 3–5: Replicate", description: "Enter payroll ($25B), benefits admin ($15B), and IRA services ($3B) using the same playbook" },
    { icon: "🌐", title: "Year 5–10: Platform Play", description: "License the Cognitory platform to PE rollups and service firms across insurance, accounting, legal, and beyond" },
    { icon: "📐", title: "The Math", description: "10 verticals × $500M revenue each = $5B revenue platform at 50%+ margins. Every vertical we enter compounds the automation advantage." },
  ],
  note: "The Cognitory platform is vertical-agnostic by design. Every new vertical reuses 80% of the existing infrastructure — only the domain-specific agents change.",
};

// ============================================================
// SLIDE 21: Fundraise
// ============================================================
const slide18: SlideContent = {
  id: "slide-18",
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
  slide01,                // 1. Title slide
  slideParallels,         // 2. History doesn't repeat itself
  slide03,                // 3. Industrial Revolution
  slide04,                // 4. AI Revolution
  slide05,                // 5. White collar services market size
  slideFutureBusiness,    // 6. What does the business of the future look like
  slideHoldco,            // 7. What we're building: a Holding Company
  slide09,                // 8. Our playbook
  slide10,                // 9. Target industries
  slide11,                // 10. Our first bet: Retirement TPA
  slideCompetitive,       // 11. Competitive landscape
  slide13,                // 12. Jamie slide
  slide17,                // 13. Automation opps
  slideGrowth,            // 14. How big can this be
  /* --- commented out slides ---
  slide14,                // Why Retirement TPA? (merged into first bet slide)
  slide02,                // Team
  slideStack,             // Cognitory platform (stack diagram)
  slideTechOpps,          // Technology Opportunities (two-column-boxes)
  slide08,                // Building the world's first services factories
  slide06,                // Service factories are highly generalizable
  slide12,                // What does a TPA do?
  slide15,                // Current M&A Pipeline
  slide16,                // Retirement TPA Industry Overview
  slide18,                // Raising $10M
  */
];

// ============================================================
// APPLY EDITS — merges server-stored field overrides onto slides
// ============================================================
export function applyEdits(
  baseSlides: SlideContent[],
  edits: { slide_id: string; field: string; value: string }[]
): SlideContent[] {
  if (edits.length === 0) return baseSlides;

  // Group edits by slide_id
  const editMap: Record<string, { field: string; value: string }[]> = {};
  for (const e of edits) {
    if (!editMap[e.slide_id]) editMap[e.slide_id] = [];
    editMap[e.slide_id].push(e);
  }

  return baseSlides.map((slide) => {
    const slideEdits = editMap[slide.id];
    if (!slideEdits) return slide;

    const updated = JSON.parse(JSON.stringify(slide));
    for (const { field, value } of slideEdits) {
      const parts = field.split(".");
      if (parts.length === 1) {
        updated[field] = value;
      } else {
        let target: any = updated;
        for (let i = 0; i < parts.length - 1; i++) {
          const key = /^\d+$/.test(parts[i]) ? parseInt(parts[i]) : parts[i];
          target = target[key];
        }
        const lastKey = /^\d+$/.test(parts[parts.length - 1])
          ? parseInt(parts[parts.length - 1])
          : parts[parts.length - 1];
        target[lastKey] = value;
      }
    }
    return updated;
  });
}
