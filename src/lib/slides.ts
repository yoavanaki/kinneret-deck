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
  /** Summary paragraph shown as a styled box */
  summary?: string;
  /** Body text - supports multiple paragraphs */
  body?: string;
  /** Bullet points as an array of strings */
  bullets?: string[];
  /** Layout type determines how the slide renders */
  layout: "title" | "text" | "two-column" | "bullets" | "section" | "table" | "big-text" | "dictionary" | "team" | "bar-chart" | "flow" | "stack" | "parallels" | "boxes" | "playbook" | "two-column-boxes" | "vision" | "holdco-org" | "rollup-model" | "exec-summary" | "cognitory";
  /** Custom HTML content for special layouts */
  customHtml?: string;
  /** Team members for team layout */
  team?: { name: string; role: string; bio: string; imageUrl?: string; linkedIn?: string; logos?: { name: string; imageUrl: string }[] }[];
  /** Footer banner for team slide - additional hires with logos */
  teamFooter?: { text: string; logos: { name: string; imageUrl: string }[] };
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
  /** Logos to display (e.g. company/institution logos) */
  logos?: { name: string; imageUrl: string }[];
  /** Callout box text - rendered as a highlighted banner */
  callout?: string;
  /** Footnote text - rendered in very small text at slide bottom */
  footnote?: string;
  /** Sticker text - rendered as a tilted ribbon/badge on the slide */
  sticker?: string;
  /** Box cards for boxes layout */
  boxes?: { icon: string; title: string; description: string; highlights?: { value: string; label: string }[] }[];
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
  /** Rollup model for rollup-model layout */
  rollupModel?: {
    targets: { name: string; revenue: string; ebitda: string; margin: string; highlight?: boolean; buyNote?: string }[];
    steps: string[];
    result: { name: string; revenue: string; highlights: string[] };
    dealStructure: string[];
  };
  /** Holdco org chart for holdco-org layout */
  orgChart?: {
    top: { label: string; items: string[] };
    middle: { labels: string[]; description: string };
    bottom: { groups: number[]; description: string };
  };
  /** Cognitory anatomy diagram for cognitory layout */
  cognitoryDiagram?: {
    clientNote: string;
    humanItems: { icon: string; label: string }[];
    humanNote: string;
    agents: { icon: string; label: string }[];
    agentNote: string;
    oversightItems: { icon: string; label: string }[];
    oversightNote: string;
  };
}

// ============================================================
// SLIDE 1: Title Slide - Dictionary Entry
// ============================================================
const slide01: SlideContent = {
  id: "slide-01",
  number: 1,
  title: "Cognitory",
  layout: "dictionary",
  subtitle: "/ˈkɒɡ.nɪ.tər.i/",
  body: "noun",
  customHtml: "A facility or system that produces knowledge services at scale through standardized, automated processes: as a factory does for physical goods.",
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
      role: "",
      bio: "Computer Science age 13\nCOO @ Yala by Mad Mimi, acq. GoDaddy\nIDF Counterterrorism Investigations\nPartner, AI at Fresh Fund\nMBA @ HBS",
      imageUrl: "/team/anaki.jpeg",
      linkedIn: "https://www.linkedin.com/in/yoavanaki/",
      logos: [
        { name: "HBS", imageUrl: "/logos/hbs.svg" },
        { name: "IDF", imageUrl: "/logos/idf.svg" },
        { name: "Fresh Fund", imageUrl: "/logos/freshfund.svg" },
      ],
    },
    {
      name: "Yoav Segev",
      role: "",
      bio: "Economics @ Oxford University\nConsultant at BCG\nBusiness Services Investor at Charlesbank\nIncubated $20M ARR compliance firm\nMBA @ HBS",
      imageUrl: "/team/segev.jpeg",
      linkedIn: "https://www.linkedin.com/in/ysegev/",
      logos: [
        { name: "HBS", imageUrl: "/logos/hbs.svg" },
        { name: "BCG", imageUrl: "/logos/bcg.svg" },
        { name: "Charlesbank", imageUrl: "/logos/charlesbank.svg" },
      ],
    },
    {
      name: "Eran Pinhas",
      role: "",
      bio: "CTO & Co-Founder of Ginzi (AI Support Automation)\nPrincipal Software Engineer at Axonius\nIDF Intelligence Team Lead\nCS M.Sc @ Ben-Gurion University",
      imageUrl: "/team/pinhas.jpg",
      linkedIn: "https://www.linkedin.com/in/eran-pinhas-915041149/",
      logos: [
        { name: "IDF 8200", imageUrl: "/logos/idf8200.svg" },
        { name: "Ben Gurion Uni", imageUrl: "/logos/bgu.svg" },
        { name: "Axonius", imageUrl: "/logos/axonius.png" },
      ],
    },
    {
      name: "Jamie Kalamarides",
      role: "",
      bio: "Head of Retirement Services, Prudential\nExpert witness, U.S. Senate (SECURE Act)\nFellow, Bipartisan Policy Center\nMBA @ Tuck",
      imageUrl: "/team/kalamarides.png",
      linkedIn: "https://www.linkedin.com/in/kalamarides/",
      logos: [
        { name: "Dartmouth", imageUrl: "/logos/dartmouth.svg" },
        { name: "US Gov", imageUrl: "/logos/usgov.svg" },
        { name: "Prudential", imageUrl: "/logos/prudential.png" },
      ],
    },
  ],
  teamFooter: {
    text: "+3 founding team hires across technology and operations",
    logos: [
      { name: "McKinsey", imageUrl: "/logos/mckinsey.svg" },
      { name: "Palo Alto Net.", imageUrl: "/logos/paloalto.svg" },
      { name: "Cyera", imageUrl: "/logos/cyera.svg" },
      { name: "Unit 81", imageUrl: "/logos/unit81.svg" },
      { name: "8200", imageUrl: "/logos/idf8200.svg" },
    ],
  },
};

// ============================================================
// SLIDE 3: Industrial → AI Revolution Parallels
// ============================================================
const slideParallels: SlideContent = {
  id: "slide-parallels",
  number: 3,
  title: "History doesn't repeat, but it rhymes",
  subtitle: "Every industrial revolution replaces an expensive, variable human input with cheap, scalable infrastructure. Services are next.",
  layout: "parallels",
  tableHeaders: ["", "Industrial Revolution", "AI Revolution"],
  tableRows: [
    ["Scarce Resource", "Energy", "Intelligence"],
    ["Breakthrough", "Steam Engine", "Large Language Models"],
    ["Infrastructure", "Railroads & Power Grid", "Cloud & Data Centers"],
    ["Disrupts", "Manual Labor", "Knowledge Work"],
    ["Economics", "Cost per widget → inputs + energy", "Cost per decision → compute + energy"],
    ["New Entity", "🏭 The Factory", "The Cognitory 🤖"],
  ],
};

// ============================================================
// SLIDE 4: Industrial Revolution Transformation
// ============================================================
const slide03: SlideContent = {
  id: "slide-03",
  number: 4,
  title: "Industrial Revolution: Transformation of Production",
  subtitle: "Mechanized production replaced skilled artisan labor, enabling mass production at dramatically lower cost.",
  layout: "flow",
  flows: {
    before: { label: "Inputs", icon: "🪵", items: ["Raw Materials", "Natural Resources"] },
    middle: { label: "Artisan Workshop", icon: "🔨", strikethrough: true },
    after: { label: "Outputs", icon: "📦", items: ["Finished Goods", "Physical Products"] },
    replacement: { label: "Factory", icon: "🏭" },
  },
};

// ============================================================
// SLIDE 5: AI Revolution Transformation
// ============================================================
const slide04: SlideContent = {
  id: "slide-04",
  number: 5,
  title: "AI Revolution: Transformation of Knowledge Work",
  subtitle: "The middle component - the knowledge worker - is replaced by AI and automation, just as factories replaced artisans.",
  layout: "flow",
  flows: {
    before: { label: "Inputs", icon: "📊", items: ["Data & Information", "Documents & Records"] },
    middle: { label: "White Collar Worker", icon: "👔", strikethrough: true },
    after: { label: "Outputs", icon: "📋", items: ["Decisions & Analysis", "Reports & Content"] },
    replacement: { label: "Cognitory", icon: "🤖" },
  },
};

// ============================================================
// SLIDE 6: Services Economy
// ============================================================
const slide05: SlideContent = {
  id: "slide-05",
  number: 6,
  title: "Knowledge services dwarf the technology market",
  subtitle: "Knowledge services are ~4x larger than the technology sector. Almost none of it runs on automation.",
  layout: "bar-chart",
  footnote: "Source: U.S. Bureau of Economic Analysis, U.S. Gross Output by Industry (Q3 2025, Jan 2026)",
  bars: [
    { label: "Knowledge Services", value: 11.3, highlight: true },
    { label: "Manufacturing", value: 7.3 },
    { label: "Real Estate", value: 6.1 },
    { label: "Government", value: 5.7 },
    { label: "Healthcare", value: 3.9 },
    { label: "Wholesale Trade", value: 3.2 },
    { label: "Retail Trade", value: 3.0 },
    { label: "Technology", value: 2.9, highlight: true },
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
  subtitle: "Common workstreams across knowledge services",
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
// SLIDE 8: Platform Architecture - Stack Diagram
// ============================================================
const slideStack: SlideContent = {
  id: "slide-stack",
  number: 7,
  title: "The Cognitory Platform",
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
// SLIDE: Why HoldCo is the Right Model
// ============================================================
const slideWhyNow: SlideContent = {
  id: "slide-why-now",
  number: 8,
  title: "Appendix: Why HoldCo Is the Right Model",
  layout: "boxes",
  boxes: [
    { icon: "1️⃣", title: "Acquire Distribution Cheaply", description: "Buy existing customer bases at 4-6x EBITDA instead of spending years and millions on sales & marketing to build from scratch" },
    { icon: "2️⃣", title: "Speed to Economic Value", description: "Efficiency gains from AI hit the P&L immediately. No need to wait for product-market fit or long sales cycles" },
    { icon: "3️⃣", title: "Real Businesses to Experiment In", description: "Acquired firms are live environments to deploy, test, and iterate on AI: real clients, real workflows, and real data" },
    { icon: "4️⃣", title: "Compounding Platform", description: "Each acquisition makes the next one faster and cheaper: shared tech, shared ops, shared playbook. The platform compounds with every deal." },
  ],
};

// ============================================================
// SLIDE 10: Mission - Acquire → Automate → Expand
// ============================================================
const slide08: SlideContent = {
  id: "slide-08",
  number: 9,
  title: "Building the world's first services factories",
  layout: "flow",
  flows: {
    before: { label: "Acquire", icon: "🏢", items: ["Buy Services Firms", "At 4–6x EBITDA"] },
    middle: { label: "Automate", icon: "⚡" },
    after: { label: "Expand", icon: "📈", items: ["End-to-End Automation", "Roll Up Adjacent Firms"] },
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
    { icon: "", title: "Select Sector", description: "Identify a fragmented services vertical with sticky, recurring revenue" },
    { icon: "", title: "Map Workflows", description: "Deeply study operational workflows; identify highest-leverage automation opportunities" },
    { icon: "", title: "Build Pipeline", description: "Source and qualify acquisition targets; rank by fit, margin, and integration ease" },
    { icon: "", title: "Acquire Platform", description: "Acquire one well-run firm as the operating foundation" },
    { icon: "", title: "Deploy Autopilot", description: "Automate operational workflows: compliance, reporting, onboarding" },
    { icon: "", title: "Expand Capacity", description: "Use AI to grow workforce output ~50% without proportional headcount" },
    { icon: "", title: "Roll Up", description: "Acquire 3–5 adjacent firms at 4–6× EBITDA; integrate onto platform" },
    { icon: "", title: "Scale the Vertical", description: "Accelerate acquisition cadence and compound organic growth" },
  ],
};

// ============================================================
// SLIDE: How Acquisitions Work - Rollup Model
// ============================================================
const slideRollupModel: SlideContent = {
  id: "slide-rollup-model",
  number: 9,
  title: "How Acquisitions Work",
  subtitle: "Buy adjacent firms, roll up operations, expand margins with AI",
  layout: "rollup-model",
  rollupModel: {
    targets: [
      { name: "TPA 1 - Platform", revenue: "$2.0M", ebitda: "$700K", margin: "35%", highlight: true, buyNote: "Buy at 4.5× EBITDA ($3.2M) · 12 employees" },
      { name: "TPA 2 - Tuck-in", revenue: "$1.8M", ebitda: "$250K", margin: "14%", buyNote: "Buy at 4.4× EBITDA ($1.1M) · 10 employees" },
    ],
    steps: [
      "Deploy AI to expand TPA 1 capacity",
      "Gradually roll TPA 2 clients into TPA 1",
      "Gradually wind down TPA 2 operations",
    ],
    result: {
      name: "Combined Entity",
      revenue: "$3.8M",
      highlights: [
        "EBITDA: ~$2.0M (53% margin)",
        "Headcount: ~14 (from 22)",
        "AI handles volume expansion",
        "TPA 2 cost structure eliminated",
      ],
    },
    dealStructure: [
      "Seller-financed over 3 years",
      "Performance-based compensation incentives",
      "Minimal upfront capital required",
      "In some cases, equity rolls into Cognitory",
    ],
  },
};

// ============================================================
// SLIDE 11: Candidate Industries
// ============================================================
const slide10: SlideContent = {
  id: "slide-10",
  number: 9,
  title: "Appendix: Initial Candidate Industries",
  subtitle: "We've analyzed 20+ service sectors. Retirement TPA is our first target to disrupt",
  layout: "table",
  bullets: [
    "High fragmentation",
    "Recurring revenue",
    "Large market",
    "Rule-based & automatable",
    "Trust or regulatory moat",
    "Low technology adoption",
    "End-market growth above GDP (sector tailwinds)",
    "Capital light",
  ],
  tableHeaders: ["Sector", "Market Size", "Fragmentation", "Automation Potential", "Trust / Regulatory Moat"],
  tableRows: [
    ["⭐ Retirement TPA", "$24B", "Very High - 18,000+ firms", "Very High", "Strong (ERISA/IRS)"],
    ["Financial Services Compliance", "$12B+", "High", "Very High", "Moderate"],
    ["IT Services", "$450B+", "Very High", "High", "Moderate"],
    ["Home Owner Services", "$100B+", "High - mostly local", "High", "Moderate"],
    ["Medical Billing", "$15B+", "High", "Very High", "Strong (HIPAA/CMS)"],
    ["Benefits Administration", "$15B+", "High", "High", "Strong (ERISA/ACA)"],
    ["Insurance Brokerage", "$60B+", "Very High", "High", "Strong"],
    ["Legal Services", "$350B+", "Extreme", "Medium-High", "Strong (Bar/Court)"],
  ],
};

// ============================================================
// SLIDE 12: First Bet - Retirement TPA
// ============================================================
const slide11: SlideContent = {
  id: "slide-11",
  number: 10,
  title: "Our first vertical and proving ground: Retirement TPA",
  subtitle: "Federal law requires professional administration for retirement plans. 18,000+ service providers fill that critical role for 700K+ plans nationwide.",
  layout: "two-column-boxes",
  stats: [
    { value: "$24B", label: "Market Size" },
    { value: "18,000+", label: "Service Providers" },
    { value: "700K+", label: "Plans Administered" },
    { value: "3–6×", label: "Acquisition Multiples" },
  ],
  leftColumnTitle: "What Is a Retirement TPA?",
  leftBoxes: [
    { icon: "📋", title: "Plan Administration", description: "Manages 401(k) and pension plans on behalf of employers: enrollment, distributions, loans" },
    { icon: "⚖️", title: "Compliance & Testing", description: "Runs IRS-mandated nondiscrimination tests (ADP/ACP, top-heavy) to keep plans legal" },
    { icon: "🏛️", title: "Government Filings", description: "Prepares Form 5500, 5558 extensions, and Summary Annual Reports for every plan" },
    { icon: "🔒", title: "Mandatory & Sticky", description: "Federal law requires professional administration. Employers can't DIY, and switching is painful" },
  ],
  rightColumnTitle: "Why We Like It",
  rightBoxes: [
    { icon: "🛡️", title: "Regulatory Moat", description: "TPAs are required by federal law for compliance testing. Employers can't opt out, creating a durable, protected demand base" },
    { icon: "💰", title: "Sticky Revenue", description: "Clients pay annually and rarely switch. High switching costs generate predictable, compounding cash flows" },
    { icon: "🤖", title: "Highly Automatable", description: "80%+ of workflows are rule-based and repetitive. AI can cut cost-to-serve by 50%+" },
    { icon: "🧩", title: "Fragmented Market", description: "18,000+ independent service providers, most under $5M revenue. Cheap to acquire at 3-6x EBITDA, with a wave of owners lacking succession plans" },
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
  note: "Most of this work is document-heavy, rule-based, and repetitive. Exactly the profile AI excels at automating.",
};

// ============================================================
// SLIDE 14: Chairman
// ============================================================
const slide13: SlideContent = {
  id: "slide-13",
  number: 12,
  title: "Partnered with top-tier retirement professional",
  subtitle: "Jamie Kalamarides",
  layout: "text",
  imageUrl: "/team/kalamarides.png",
  stats: [
    { value: "$5T", label: "Life Insurance Managed" },
    { value: "$285B", label: "Retirement Assets" },
    { value: "Top 10", label: "U.S. Financial Institution" },
  ],
  body: "Jamie brings 20+ years of senior leadership at Prudential Financial, where he served as President of Group Insurance and Head of Institutional Retirement Plan Services, overseeing billions in plan assets.\n\nHe was a key expert to the SECURE Act, testifying before the U.S. Senate Finance, HELP, and Aging Committees on retirement policy. He is a nonresident fellow at the Bipartisan Policy Center.\n\nJamie's deep domain expertise in retirement services - combined with his relationships across the industry - gives Cognitory a unique advantage in building trust with acquisition targets and navigating the regulatory landscape.",
  logos: [
    { name: "Prudential", imageUrl: "/logos/prudential.png" },
    { name: "US Gov", imageUrl: "/logos/usgov.svg" },
    { name: "Dartmouth", imageUrl: "/logos/dartmouth.svg" },
  ],
};

// ============================================================
// SLIDE 15: Why this space
// ============================================================
const slide14: SlideContent = {
  id: "slide-14",
  number: 15,
  title: "Why Retirement TPA?",
  layout: "two-column",
  leftText: "STRUCTURAL ADVANTAGES\n\n• Regulatory mandate creates guaranteed demand\n• Extreme fragmentation - no dominant player\n• Owner-operators aging out, looking to sell\n• Acquisition multiples are low (3-6x EBITDA)\n• Recurring, contract-based revenue",
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
    { value: "42", label: "Total Targets" },
    { value: "6", label: "In Diligence / LOI" },
    { value: "~$12M", label: "Revenue in Adv. / LOI" },
  ],
  pieChart: [
    { label: "Warm Intros", value: 78 },
    { label: "Banker-Sourced", value: 12 },
    { label: "Cold Outreach", value: 10 },
  ],
  tableHeaders: ["Target", "Revenue", "EBITDA", "Stage"],
  tableRows: [
    ['"Liberty Benefits Admin"', "$1.8M", "$230K", "LOI Sent"],
    ['"Redwood Pension Services"', "$1.8M", "$810K", "Pre-LOI Diligence"],
    ['"Atlantic Retirement Group"', "$2.0M", "$800K", "Pre-LOI Diligence"],
    ['"Pacific Plan Consultants"', "$2.0M", "$600K", "Pre-LOI Diligence"],
    ['"Evergreen Plan Services"', "$1.7M", "$425K", "Pre-LOI Diligence"],
    ['"Summit Benefit Advisors"', "$750K", "$200K", "Pre-LOI Diligence"],
    ["+ 34 additional targets", "$300K–$25M", "", "Various"],
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
  leftText: "MARKET STRUCTURE\n\n• $24B total addressable market\n• 18,000+ service providers in the U.S.\n• Top 10 firms hold <15% market share\n• Average firm: 10-50 employees\n• 700,000+ retirement plans need administration",
  rightText: "KEY DYNAMICS\n\n• Owner-operators are 55-65 years old on average\n• Succession crisis - limited buyer pool\n• SECURE Act 2.0 expanding plan coverage to millions of new participants\n• Technology adoption is 10+ years behind\n• Margins today: 15-25%. Post-automation target: 40-50%",
  note: "The retirement TPA industry is at an inflection point: regulatory expansion is driving demand while the supply side is consolidating.",
};

// ============================================================
// SLIDE 18: Competitive Landscape
// ============================================================
const slideCompetitive: SlideContent = {
  id: "slide-competitive",
  number: 15,
  title: "Competitive Landscape",
  subtitle: "Cognitory is the only player providing AI-native bespoke retirement administration services",
  layout: "table",
  tableHeaders: ["Player", "Model", "Bespoke Service", "AI Automation", "M&A Strategy", "Threat Level"],
  tableRows: [
    ["Large Recordkeepers\n(Fidelity, Vanguard, Empower)", "Bundled plan services", "One-size-fits-all", "Internal tools only", "Acquire large RKs", "Low - don't serve small plans"],
    ["National TPAs\n(TRA, Pinnacle)", "Traditional TPA", "Moderate - standardized processes", "Minimal", "Organic growth", "Low - no tech DNA"],
    ["Regional / Local TPAs", "Owner-operated", "High - but doesn't scale", "None", "None - aging owners", "None - these are targets"],
    ["Tech Platforms\n(Vestwell, Human Interest)", "Software for advisors", "Low - self-serve tooling", "Workflow tooling", "Not acquiring TPAs", "Medium - different segment"],
    ["PE Rollups\n(Definiti, Strongpoint)", "Buy & integrate", "Erodes post-acquisition", "Limited", "Acquire for revenue", "Medium - no automation edge"],
    ["Cognitory", "Acquire + Automate", "High - AI scales the personal touch", "AI-native platform", "Buy at 3-6x, automate", "Unique - both acquire & automate"],
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
  subtitle: "Low-hanging fruit from 144-process inventory mapped across partner TPAs",
  layout: "table",
  stats: [
    { value: "144", label: "Processes Mapped" },
    { value: "62", label: "Quick Wins" },
    { value: "11,550", label: "Hours Saved / Year" },
    { value: "+20%", label: "Margin Expansion" },
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
    ["Census Collection & Scrubbing", "10", "Outsource + Admin", "$25", "75%", "$93,750"],
    ["Form 5500 & 5558 Filing", "6", "Admin", "$40", "90%", "$108,000"],
    ["Trust Reconciliation", "4", "Admin", "$40", "75%", "$60,000"],
    ["Compliance Test Data Entry", "4", "Admin", "$40", "75%", "$60,000"],
    ["Plan Document Generation", "3", "Admin", "$40", "90%", "$54,000"],
    ["Required Notices & Disclosures", "2", "Admin", "$35", "75%", "$26,250"],
  ],
  callout: "Implied margin expansion: ~20 percentage points ($400K savings on $2M revenue across ~500 plans). Combined with tuck-in rollups, margins reach 50%+.",
  footnote: 'Source: 144-process inventory mapped at partner TPA.',
};

// ============================================================
// SLIDE: What does the business of the future look like?
// ============================================================
const slideFutureBusiness: SlideContent = {
  id: "slide-future-business",
  number: 6,
  title: "What does the business of the future look like?",
  subtitle: "AI collapses the cost of intelligence. The winners will be the ones who redesign the firm around it",
  layout: "vision",
  boxes: [
    { icon: "📧", title: "People, Email & Spreadsheets", description: "Most service firms still run on manual processes and human labor" },
    { icon: "🔄", title: "End-to-End Replacement", description: "AI doesn't just assist workers. It replaces entire workflows" },
    { icon: "🏗️", title: "Thin Management Layer", description: "The business of the future is a small team on top of autonomous AI agents" },
  ],
};

// ============================================================
// SLIDE: What we're building - a Holding Company
// ============================================================
const slideHoldco: SlideContent = {
  id: "slide-holdco",
  number: 7,
  title: "Appendix: Cognitory Structure",
  subtitle: "We acquire sub-scale, traditional, knowledge service firms and transform them into AI-native, high-margin businesses",
  layout: "holdco-org",
  orgChart: {
    top: {
      label: "Cognitory",
      items: [
        "Identifies target sectors",
        "Leverages platform scale to attract top-tier R&D and M&A talent",
        "Builds tech that is deployable across end markets",
        "Finances M&A transactions",
        "Centralizes and automates back-office functions (legal, accounting, HR)",
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
  note: "Each OpCo is managed as independently separable, creating strategic optionality as the portfolio grows. The platform compounds: every new vertical reuses 80% of existing infrastructure.",
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
    { value: "$24B", label: "Phase 1: Retirement TPA" },
    { value: "$51B", label: "Phase 2: Adjacent Verticals" },
    { value: "$400B+", label: "Phase 3: All Knowledge Services" },
  ],
  boxes: [
    { icon: "🏁", title: "Year 1–3: Prove the Model", description: "Acquire 5-10 TPAs, deploy automation, expand margins from ~20% to 40-50%" },
    { icon: "🔁", title: "Year 3–5: Replicate", description: "Enter payroll ($25B), benefits admin ($15B), and IRA services ($3B) using the same playbook" },
    { icon: "🌐", title: "Year 5–10: Platform Play", description: "License the Cognitory platform to PE rollups and service firms across insurance, accounting, legal, and beyond" },
    { icon: "📐", title: "The Math", description: "10 verticals × $500M revenue each = $5B revenue platform at 50%+ margins. Every vertical we enter compounds the automation advantage." },
  ],
  note: "The Cognitory platform is vertical-agnostic by design. Every new vertical reuses 80% of the existing infrastructure. Only the domain-specific agents change.",
};

// ============================================================
// SLIDE 21: Fundraise
// ============================================================
const slide18: SlideContent = {
  id: "slide-18",
  number: 17,
  title: "Thank You",
  layout: "title",
};


// ============================================================
// SLIDE: TLDR (vision-first)
// ============================================================
const slideTldr: SlideContent = {
  id: "slide-tldr",
  number: 2,
  title: "Overview",
  layout: "exec-summary",
  stats: [
    { value: "42", label: "Firm Pipeline" },
    { value: "~$12M", label: "ARR in Adv. / LOI Stage" },
  ],
  boxes: [
    { icon: "🏭", title: "Factories for Knowledge Services", description: "Building AI-native \"cognitories\" that acquire and automate labor-intensive service businesses, replacing manual workflows with intelligent systems at scale" },
    { icon: "🎯", title: "Starting with Retirement Admin", description: "Our first vertical: a hyper-fragmented, $24B market with sticky recurring revenue, high automation potential, and attractive 3–6x EBITDA acquisition multiples" },
    { icon: "🧠", title: "Purpose-Built Team", description: "M&A, AI, and deep industry expertise under one roof. From PE deal sourcing and production AI systems to retirement operations and compliance" },
  ],
};

// ============================================================
// SLIDE: TLDR (TPA-focused, original)
// ============================================================
const slideTldrTpa: SlideContent = {
  id: "slide-tldr-tpa",
  number: 0,
  title: "Executive Summary",
  subtitle: "Building factories for knowledge services in highly regulated industries",
  layout: "exec-summary",
  stats: [
    { value: "42", label: "Pipeline Targets" },
    { value: "5", label: "Active LOIs" },
    { value: "$5M", label: "ARR at Close" },
    { value: "50%+", label: "Target EBITDA Margin" },
  ],
  boxes: [
    { icon: "🏢", title: "Roll Up Retirement Admin", description: "Acquiring businesses in a hyper-fragmented, $24B market with sticky, recurring revenue at 3–6x EBITDA" },
    { icon: "⚡", title: "Automate with AI", description: "Deploying AI to automate 80%+ of rule-based workflows, expanding margins from ~25% blended to 50%+" },
    { icon: "📐", title: "Replicate Across Verticals", description: "Proven playbook scales to adjacent service sectors, building a multi-industry AI-native holding company" },
  ],
};

// ============================================================
// SLIDE: We're Building Cognitories
// ============================================================
const slideCognitories: SlideContent = {
  id: "slide-cognitories",
  number: 0, // auto-numbered below
  title: "Building cognitories for highly regulated industries",
  subtitle: "A better way to organize capital, labor, and technology to produce knowledge services at much lower cost and higher volume",
  layout: "cognitory",
  cognitoryDiagram: {
    clientNote: "Industries that require a high degree of trust and white glove support",
    humanItems: [
      { icon: "🤝", label: "Client Relationships" },
      { icon: "💼", label: "Sales & Advisory" },
      { icon: "📞", label: "Trust & Support" },
    ],
    humanNote: "Cognitories maintain the human interfaces. The client-facing layer stays personal",
    agents: [
      { icon: "📅", label: "Scheduling" },
      { icon: "💰", label: "Billing" },
      { icon: "📧", label: "Communications" },
      { icon: "📊", label: "Data Gathering" },
      { icon: "📋", label: "Report Generation" },
      { icon: "🏛️", label: "Form Filing" },
      { icon: "✅", label: "Compliance" },
      { icon: "📝", label: "Document Drafting" },
      { icon: "🔧", label: "Error Corrections" },
      { icon: "📬", label: "Notices" },
    ],
    agentNote: "AI agents replace the backend: scheduling, billing, data gathering, report production, and form filing",
    oversightItems: [
      { icon: "📡", label: "Monitoring" },
      { icon: "🎛️", label: "Remote Intervention" },
      { icon: "⛏️", label: "Process Mining" },
      { icon: "⚙️", label: "Process Automation" },
    ],
    oversightNote: "Centralized oversight of all agents across all cognitories ensures quality, compliance, and continuous improvement",
  },
};

// ============================================================
// ALL SLIDES - exported as a single array
// ============================================================
const _slides: SlideContent[] = [
  // === ACT 1: Context ===
  slide01,                // 1. Cognitory (title)
  slideTldr,              // 2. Executive Summary
  slide02,                // 3. Team
  slideParallels,         // 4. History doesn't repeat
  slide05,                // 5. Knowledge services dwarf tech market

  // === ACT 2: The Thesis ===
  slideCognitories,       // 6. We're building cognitories
  slide09,                // 7. The Playbook

  // === ACT 3: The Business - TPA as proof ===
  slide11,                // 8. Our first bet: Retirement TPA
  slide13,                // 9. Jamie
  slideRollupModel,       // 10. How Acquisitions Work
  slide17,                // 11. Automation Opportunities
  slide15,                // 12. M&A Pipeline
  slideCompetitive,       // 13. Competitive Landscape

  // === ACT 4: The Close ===
  slide18,                // 14. Thank You

  /* === Appendix ===
  slideHoldco,            // A1. Cognitory Structure
  slideWhyNow,            // A2. Why HoldCo is the Right Model
  slide10,                // A3. Candidate Industries
  */

  /* --- commented out slides ---
  slideGrowth,            // How big can this be
  slide14,                // Why Retirement TPA? (merged into first bet slide)
  slideStack,             // Cognitory platform (stack diagram)
  slideTechOpps,          // Technology Opportunities (two-column-boxes)
  slide08,                // Building the world's first services factories
  slideFutureBusiness,    // What does the business of the future look like
  slide06,                // Service factories are highly generalizable
  slide12,                // What does a TPA do?
  slide16,                // Retirement TPA Industry Overview
  slide03,                // Industrial Revolution flow (redundant with parallels)
  slide04,                // AI Revolution flow (redundant with parallels)
  */
];

// Auto-number slides based on array position
export const slides: SlideContent[] = _slides.map((s, i) => ({ ...s, number: i + 1 }));

// ============================================================
// APPLY EDITS - merges server-stored field overrides onto slides
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
