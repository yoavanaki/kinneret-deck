"use client";

import { useState, useCallback } from "react";

/* ─── data ─────────────────────────────────────────────────────── */

interface Business {
  name: string;
  desc: string;
  revenue: number;   // $K
  ebitda: number;    // $K
  employees: number;
  price: number;     // $K (acquisition cost)
}

interface AITool {
  name: string;
  desc: string;
  ebitdaPct: number;     // % of total revenue added to EBITDA
  cost: number;          // $K
  happinessCost: number; // points
}

const ALL_BUSINESSES: Business[] = [
  { name: "Golden Years Payroll Co.", desc: "Still runs payroll on AS/400. The clients love it anyway.", revenue: 3200, ebitda: 640, employees: 18, price: 1800 },
  { name: "Bob's 401(k) Barn", desc: "Bob personally calls every participant on their birthday.", revenue: 1800, ebitda: 420, employees: 9, price: 1200 },
  { name: "PensionPalooza Inc.", desc: "The largest TPA in central Ohio. They throw great holiday parties.", revenue: 5500, ebitda: 1100, employees: 32, price: 3200 },
  { name: "Ye Olde Benefits Shoppe", desc: "Family-owned since 1987. The fax machine is considered critical infrastructure.", revenue: 2100, ebitda: 380, employees: 12, price: 950 },
  { name: "RetireMint (it's fresh!)", desc: "Rebranded from 'Midwest Benefits Corp' last year. The logo cost $200K.", revenue: 4200, ebitda: 900, employees: 24, price: 2600 },
  { name: "Compliance & Chill LLC", desc: "Founded by two ex-DOL auditors who wanted a more relaxed vibe.", revenue: 1500, ebitda: 310, employees: 7, price: 800 },
  { name: "The Vesting Vest Outlet", desc: "Everyone on staff owns a custom vest. It's a whole thing.", revenue: 2800, ebitda: 520, employees: 15, price: 1500 },
  { name: "Fiduciary Frenzy Corp.", desc: "Premium clients, premium fees. The CEO drives a Tesla with plates 'ERISA'.", revenue: 6100, ebitda: 1300, employees: 38, price: 4000 },
  { name: "Uncle Gary's TPA Hut", desc: "Gary works from his garage. Surprisingly profitable.", revenue: 900, ebitda: 200, employees: 4, price: 500 },
  { name: "Plan Doc in a Box", desc: "Sells pre-packaged plan documents. Has 3 customers but they're very loyal.", revenue: 1200, ebitda: 280, employees: 6, price: 650 },
  { name: "Actuarial Vibes Only", desc: "Hipster actuarial firm. Kombucha on tap. Surprisingly good at math.", revenue: 3800, ebitda: 780, employees: 20, price: 2200 },
  { name: "SafeHarbor Surplus", desc: "Specializes in safe harbor plans. Tagline: 'We harbor no ill will.'", revenue: 2500, ebitda: 450, employees: 14, price: 1300 },
  { name: "Defined Benefit Deli", desc: "Named after the founder's other business. Yes, they serve sandwiches at meetings.", revenue: 1600, ebitda: 340, employees: 8, price: 900 },
  { name: "QNEC & Cheese Co.", desc: "The puns don't stop. Neither does the qualified nonelective contribution processing.", revenue: 2900, ebitda: 560, employees: 16, price: 1600 },
  { name: "The Match Factory", desc: "Not matches. Employer matching contributions. They've heard the joke.", revenue: 3500, ebitda: 720, employees: 22, price: 2100 },
  { name: "Rollover Beethoven Ltd.", desc: "Handles rollovers exclusively. Plays classical music in the waiting room.", revenue: 1100, ebitda: 240, employees: 5, price: 580 },
  { name: "Top Heavy Testing Co.", desc: "Named after the IRS test, not the furniture. OSHA-compliant.", revenue: 2300, ebitda: 410, employees: 11, price: 1100 },
  { name: "Profit Sharing is Caring", desc: "Wholesome name. Ruthless fee structure. Clients don't seem to mind.", revenue: 4800, ebitda: 980, employees: 28, price: 2900 },
];

const ALL_AI_TOOLS: AITool[] = [
  { name: "AutoForm-5500-inator", desc: "Auto-generates Form 5500 filings. Replaces Karen from compliance (she's fine with it).", ebitdaPct: 3, cost: 400, happinessCost: 5 },
  { name: "CompliBot 3000", desc: "Monitors regulatory changes 24/7. Sends passive-aggressive Slack alerts.", ebitdaPct: 2.5, cost: 350, happinessCost: 8 },
  { name: "The Enrollment Whisperer", desc: "Onboards new participants with soothing AI voices and zero hold music.", ebitdaPct: 4, cost: 600, happinessCost: 12 },
  { name: "VestingCalc.ai", desc: "It's a spreadsheet with a gradient logo. VC-backed. Works great though.", ebitdaPct: 2, cost: 250, happinessCost: 3 },
  { name: "RoboAuditor", desc: "Never sleeps. Never eats. Finds discrepancies at 3am. Staff finds it unsettling.", ebitdaPct: 3.5, cost: 500, happinessCost: 10 },
  { name: "PlanDocGPT", desc: "Generates plan documents. Hallucination-free*. (*mostly)", ebitdaPct: 3, cost: 380, happinessCost: 7 },
  { name: "BenefitsBot Supreme", desc: "Answers participant questions so your team doesn't have to explain vesting again.", ebitdaPct: 5, cost: 800, happinessCost: 15 },
  { name: "Nondiscrimination Test Zapper", desc: "Runs ADP/ACP tests instantly. No more end-of-year panic.", ebitdaPct: 2.5, cost: 300, happinessCost: 6 },
  { name: "AI Contribution Allocator", desc: "Allocates employer contributions with zero rounding errors. CFOs love it.", ebitdaPct: 3.5, cost: 450, happinessCost: 9 },
  { name: "DeepPension Neural Net", desc: "Nobody knows exactly how it works, but EBITDA goes up. Don't ask questions.", ebitdaPct: 7, cost: 1100, happinessCost: 20 },
  { name: "TerminationBot 9000", desc: "Processes participant terminations. The name was HR's idea, somehow.", ebitdaPct: 2, cost: 320, happinessCost: 4 },
  { name: "LoanTracker Deluxe AI", desc: "Tracks plan loans automatically. No more spreadsheets named 'FINAL_v3_REAL.xlsx'.", ebitdaPct: 1.5, cost: 280, happinessCost: 5 },
  { name: "CensusCleanerPro", desc: "Cleans census data in seconds. Previously required an intern and two weeks.", ebitdaPct: 4, cost: 480, happinessCost: 8 },
  { name: "ERISA-Vision", desc: "Scans documents for ERISA compliance violations using computer vision. Slightly terrifying.", ebitdaPct: 5, cost: 650, happinessCost: 11 },
  { name: "FiduciaryShield AI", desc: "Real-time fiduciary breach detection. Your lawyers will either love or hate it.", ebitdaPct: 6, cost: 900, happinessCost: 16 },
  { name: "AutoRebalancer", desc: "Rebalances participant portfolios overnight. Participants wake up slightly wealthier.", ebitdaPct: 3, cost: 400, happinessCost: 7 },
];

/* ─── helpers ──────────────────────────────────────────────────── */

function fmt(n: number): string {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}M`;
  return `$${n}K`;
}

type LogEntry = { turn: number; text: string; type?: "acquire" | "ai" | "turn" | "system" | "error" };

/* ─── component ────────────────────────────────────────────────── */

export default function GamePage() {
  const [started, setStarted] = useState(false);
  const [cash, setCash] = useState(7000);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalEbitda, setTotalEbitda] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [happiness, setHappiness] = useState(100);
  const [turn, setTurn] = useState(1);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [bizQueue, setBizQueue] = useState(ALL_BUSINESSES);
  const [aiQueue, setAiQueue] = useState(ALL_AI_TOOLS);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [flashStat, setFlashStat] = useState<string | null>(null);

  const addLog = useCallback((t: number, text: string, type: LogEntry["type"] = "system") => {
    setLog((prev) => [{ turn: t, text, type }, ...prev]);
  }, []);

  const flash = useCallback((stat: string) => {
    setFlashStat(stat);
    setTimeout(() => setFlashStat(null), 600);
  }, []);

  const endTurn = useCallback(
    (newCash: number, newEbitda: number, newEmployees: number, newHappiness: number, currentTurn: number, newBizQueue: Business[], newAiQueue: AITool[]) => {
      const income = newEbitda;
      const payroll = newEmployees * 100;
      const net = income - payroll;
      const updatedCash = newCash + net;

      setCash(updatedCash);
      const nextTurn = currentTurn + 1;
      setTurn(nextTurn);
      flash("cash");

      addLog(
        currentTurn,
        `Collected ${fmt(income)} EBITDA, paid ${fmt(payroll)} payroll (${newEmployees} staff). Cash ${net >= 0 ? "+" : ""}${fmt(net)} -> ${fmt(updatedCash)}`,
        "turn"
      );

      if (newEbitda >= 10000) {
        setWon(true);
        addLog(nextTurn, "CONGRATULATIONS! You've hit $10M EBITDA — you've reached the Series A!", "system");
        return;
      }

      // Check if happiness dropped below 50
      if (newHappiness < 50) {
        setLost(true);
        addLog(nextTurn, `Happiness hit ${newHappiness}. Your entire team just quit. They left a Glassdoor review.`, "error");
        return;
      }

      // Check if player is broke
      if (updatedCash < 0) {
        setLost(true);
        addLog(nextTurn, `Cash is ${fmt(updatedCash)}. You're in the red. The bank called.`, "error");
        return;
      }

      // Check if player can afford anything
      const visibleBiz = newBizQueue.slice(0, 3);
      const visibleAI = newAiQueue.slice(0, 3);
      const cheapestBiz = visibleBiz.length > 0 ? Math.min(...visibleBiz.map(b => b.price)) : Infinity;
      const cheapestAI = visibleAI.length > 0 ? Math.min(...visibleAI.map(a => a.cost)) : Infinity;
      const cheapest = Math.min(cheapestBiz, cheapestAI);

      if (cheapest !== Infinity && updatedCash < cheapest) {
        setLost(true);
        addLog(nextTurn, `You have ${fmt(updatedCash)} but the cheapest option costs ${fmt(cheapest)}. The money's gone.`, "error");
        return;
      }

      // No options left and haven't won
      if (visibleBiz.length === 0 && visibleAI.length === 0) {
        setLost(true);
        addLog(nextTurn, `Nothing left to buy or deploy, and EBITDA is only ${fmt(newEbitda)}. So close.`, "error");
      }
    },
    [addLog, flash]
  );

  const buyBusiness = useCallback(
    (idx: number) => {
      if (won || lost) return;
      const biz = bizQueue[idx];
      if (cash < biz.price) {
        addLog(turn, `Can't afford ${biz.name} (need ${fmt(biz.price)}, have ${fmt(cash)})`, "error");
        return;
      }

      const newCash = cash - biz.price;
      const newRev = totalRevenue + biz.revenue;
      const newEbitda = totalEbitda + biz.ebitda;
      const newEmps = totalEmployees + biz.employees;
      const newBizQueue = bizQueue.filter((_, i) => i !== idx);

      setCash(newCash);
      setTotalRevenue(newRev);
      setTotalEbitda(newEbitda);
      setTotalEmployees(newEmps);
      setBizQueue(newBizQueue);

      addLog(turn, `Acquired "${biz.name}" for ${fmt(biz.price)}`, "acquire");
      endTurn(newCash, newEbitda, newEmps, happiness, turn, newBizQueue, aiQueue);
    },
    [won, lost, bizQueue, aiQueue, cash, totalRevenue, totalEbitda, totalEmployees, turn, addLog, endTurn]
  );

  const deployAI = useCallback(
    (idx: number) => {
      if (won || lost) return;
      const tool = aiQueue[idx];
      if (cash < tool.cost) {
        addLog(turn, `Can't afford ${tool.name} (need ${fmt(tool.cost)}, have ${fmt(cash)})`, "error");
        return;
      }

      const newCash = cash - tool.cost;
      const boost = Math.round(totalRevenue * tool.ebitdaPct / 100);
      const newEbitda = totalEbitda + boost;
      const newHappy = Math.max(0, happiness - tool.happinessCost);
      const newAiQueue = aiQueue.filter((_, i) => i !== idx);

      setCash(newCash);
      setTotalEbitda(newEbitda);
      setHappiness(newHappy);
      setAiQueue(newAiQueue);

      addLog(turn, `Deployed "${tool.name}" — ${tool.ebitdaPct}% of ${fmt(totalRevenue)} rev = +${fmt(boost)} EBITDA`, "ai");
      endTurn(newCash, newEbitda, totalEmployees, newHappy, turn, bizQueue, newAiQueue);
    },
    [won, lost, bizQueue, aiQueue, cash, totalEbitda, happiness, totalEmployees, turn, addLog, endTurn]
  );

  const restart = () => {
    setStarted(false);
    setCash(7000);
    setTotalRevenue(0);
    setTotalEbitda(0);
    setTotalEmployees(0);
    setHappiness(100);
    setTurn(1);
    setLog([]);
    setBizQueue(ALL_BUSINESSES);
    setAiQueue(ALL_AI_TOOLS);
    setWon(false);
    setLost(false);
  };

  const visibleBiz = bizQueue.slice(0, 3);
  const visibleAI = aiQueue.slice(0, 3);

  const happinessColor = happiness > 60 ? "#4ade80" : happiness > 30 ? "#facc15" : "#f87171";
  const ebitdaProgress = Math.min(100, (totalEbitda / 10000) * 100);

  /* ─── splash screen ─────────────────────────────────────────── */

  if (!started) {
    return (
      <div className="min-h-screen bg-[#0e1117] flex items-center justify-center p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* radial glow behind card */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[120px]"
            style={{ width: 600, height: 600, background: "radial-gradient(circle, #c9856b 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative max-w-lg w-full text-center">
          {/* decorative top line */}
          <div className="mx-auto mb-8 w-16 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #c9856b, transparent)" }} />

          <h1
            className="text-4xl sm:text-5xl font-bold mb-3 leading-tight"
            style={{ fontFamily: "'Instrument Serif', serif", color: "#e6edf3" }}
          >
            TPA Tycoon
          </h1>

          <p className="text-[#8b949e] text-sm uppercase tracking-[0.2em] mb-10">
            A game of acquisitions &amp; automation
          </p>

          {/* funding card */}
          <div className="mx-auto max-w-sm rounded-2xl border border-[#30363d] bg-[#151921]/80 backdrop-blur-sm p-8 mb-10 shadow-2xl">
            <div className="text-xs uppercase tracking-[0.15em] text-[#c9856b] mb-4 font-semibold">
              Seed Round Closed
            </div>
            <div className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
              $7M
            </div>
            <p className="text-[#8b949e] text-sm leading-relaxed">
              Congrats! You just raised a $7M Seed round for your retirement autopilot startup!
            </p>
          </div>

          <button
            onClick={() => {
              setStarted(true);
              addLog(0, "Your $7M seed round just hit the bank. Time to build an empire.", "system");
            }}
            className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#c9856b]/20"
            style={{ background: "linear-gradient(135deg, #c9856b, #a06a54)" }}
          >
            Get Started
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <p className="mt-6 text-[11px] text-[#484f58]">
            Buy TPAs. Deploy AI. Hit $10M EBITDA to reach Series A.
          </p>
        </div>
      </div>
    );
  }

  /* ─── game UI ────────────────────────────────────────────────── */

  const logColor = (type?: LogEntry["type"]) => {
    switch (type) {
      case "acquire": return "#c9856b";
      case "ai": return "#a78bfa";
      case "turn": return "#60a5fa";
      case "error": return "#f87171";
      default: return "#8b949e";
    }
  };

  const logIcon = (type?: LogEntry["type"]) => {
    switch (type) {
      case "acquire": return "+";
      case "ai": return "~";
      case "turn": return ">";
      case "error": return "x";
      default: return "-";
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1117] text-[#e6edf3] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[100px]" style={{ background: "#c9856b" }} />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-[0.03] blur-[100px]" style={{ background: "#a78bfa" }} />
      </div>

      {/* header */}
      <div className="relative z-10 border-b border-[#1c2028] px-6 py-3 flex items-center justify-between bg-[#0e1117]/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <a href="/" className="text-xs text-[#484f58] hover:text-[#8b949e] transition-colors tracking-wide uppercase">
            Back
          </a>
          <div className="w-px h-4 bg-[#30363d]" />
          <h1 className="text-lg font-bold" style={{ fontFamily: "'Instrument Serif', serif" }}>
            TPA Tycoon
          </h1>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-[#484f58]">Turn <span className="text-[#8b949e] font-mono">{turn}</span></span>
          <button onClick={restart} className="px-3 py-1.5 rounded-md bg-[#1c2028] border border-[#30363d] hover:border-[#484f58] text-[#8b949e] hover:text-white text-xs transition-all">
            Restart
          </button>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row">
        {/* left: stats + actions */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
            <StatCard label="Cash" value={fmt(cash)} color="#60a5fa" flash={flashStat === "cash"} />
            <StatCard label="Revenue" value={fmt(totalRevenue)} color="#a78bfa" />
            <StatCard label="EBITDA" value={fmt(totalEbitda)} color="#c9856b" />
            <StatCard label="Employees" value={totalEmployees.toString()} color="#8b949e" />
            <StatCard label="Happiness" value={`${happiness}`} color={happinessColor} />
          </div>

          {/* EBITDA progress */}
          <div className="mb-6 p-4 rounded-xl bg-[#151921]/60 border border-[#1c2028]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#8b949e] font-medium">Series A Target</span>
              <span className="font-mono text-[#c9856b]">{fmt(totalEbitda)} <span className="text-[#484f58]">/</span> $10M EBITDA</span>
            </div>
            <div className="h-2 bg-[#0e1117] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${ebitdaProgress}%`,
                  background: ebitdaProgress < 50
                    ? "linear-gradient(90deg, #c9856b, #d4976e)"
                    : ebitdaProgress < 80
                    ? "linear-gradient(90deg, #c9856b, #e6a88a)"
                    : "linear-gradient(90deg, #c9856b, #4ade80)",
                  boxShadow: `0 0 12px ${ebitdaProgress > 80 ? "#4ade80" : "#c9856b"}40`,
                }}
              />
            </div>
          </div>

          {/* win / lose banner */}
          {won && (
            <div className="mb-6 p-8 rounded-xl text-center border" style={{ background: "linear-gradient(135deg, rgba(74,222,128,0.08), rgba(74,222,128,0.02))", borderColor: "rgba(74,222,128,0.3)" }}>
              <div className="text-3xl mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>Series A Unlocked</div>
              <p className="text-green-400/80 text-sm mb-4">You did it. The retirement empire is real. Investors are lining up.</p>
              <button
                onClick={restart}
                className="px-6 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)" }}
              >
                Play Again
              </button>
            </div>
          )}
          {lost && (
            <div className="mb-6 p-8 rounded-xl text-center border" style={{ background: "linear-gradient(135deg, rgba(248,113,113,0.08), rgba(248,113,113,0.02))", borderColor: "rgba(248,113,113,0.3)" }}>
              <div className="text-3xl mb-3 text-red-400" style={{ fontFamily: "'Instrument Serif', serif" }}>You&apos;re Fired</div>
              <p className="text-red-400/70 text-sm mb-1">You ran out of money. Like, completely.</p>
              <p className="text-red-400/50 text-xs mb-5">The board held an emergency meeting. It lasted 4 minutes. Security will escort you out. They said you can keep the lanyard.</p>
              <button
                onClick={restart}
                className="px-6 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #c9856b, #a06a54)" }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* two columns: businesses + AI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* businesses */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#c9856b]" />
                <h2 className="text-xs font-semibold text-[#8b949e] uppercase tracking-[0.15em]">
                  Acquire a Business
                </h2>
              </div>
              {visibleBiz.length === 0 && (
                <div className="p-6 rounded-xl bg-[#151921]/40 border border-[#1c2028] text-center">
                  <p className="text-sm text-[#484f58] italic">No more businesses on the market.</p>
                </div>
              )}
              {visibleBiz.map((biz, i) => {
                const canAfford = cash >= biz.price;
                return (
                  <button
                    key={biz.name}
                    onClick={() => buyBusiness(i)}
                    disabled={won || lost}
                    className={`w-full text-left mb-3 p-4 rounded-xl border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
                      canAfford
                        ? "bg-[#151921] border-[#1c2028] hover:border-[#c9856b]/60 hover:bg-[#1a1f29] hover:shadow-lg hover:shadow-[#c9856b]/5 cursor-pointer"
                        : "bg-[#151921]/40 border-[#1c2028] opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-semibold text-sm text-white leading-tight pr-2">{biz.name}</div>
                      <div className="text-xs font-mono font-bold text-[#60a5fa] whitespace-nowrap">{fmt(biz.price)}</div>
                    </div>
                    <div className="text-[11px] text-[#6e7681] mb-2 leading-relaxed">{biz.desc}</div>
                    <div className="flex gap-3 text-[11px]">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] inline-block" />
                        <span className="text-[#8b949e]">{fmt(biz.revenue)} rev</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c9856b] inline-block" />
                        <span className="text-[#8b949e]">{fmt(biz.ebitda)} EBITDA</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8b949e] inline-block" />
                        <span className="text-[#8b949e]">{biz.employees} ppl</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* AI tools */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#a78bfa]" />
                <h2 className="text-xs font-semibold text-[#8b949e] uppercase tracking-[0.15em]">
                  Deploy AI
                </h2>
              </div>
              {visibleAI.length === 0 && (
                <div className="p-6 rounded-xl bg-[#151921]/40 border border-[#1c2028] text-center">
                  <p className="text-sm text-[#484f58] italic">No more AI tools available.</p>
                </div>
              )}
              {visibleAI.map((tool, i) => {
                const canAfford = cash >= tool.cost;
                return (
                  <button
                    key={tool.name}
                    onClick={() => deployAI(i)}
                    disabled={won || lost}
                    className={`w-full text-left mb-3 p-4 rounded-xl border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
                      canAfford
                        ? "bg-[#151921] border-[#1c2028] hover:border-[#a78bfa]/60 hover:bg-[#1a1f29] hover:shadow-lg hover:shadow-[#a78bfa]/5 cursor-pointer"
                        : "bg-[#151921]/40 border-[#1c2028] opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-semibold text-sm text-white leading-tight pr-2">{tool.name}</div>
                      <div className="text-xs font-mono font-bold text-[#60a5fa] whitespace-nowrap">{fmt(tool.cost)}</div>
                    </div>
                    <div className="text-[11px] text-[#6e7681] mb-2 leading-relaxed">{tool.desc}</div>
                    <div className="flex gap-3 text-[11px] flex-wrap">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c9856b] inline-block" />
                        <span className="text-[#8b949e]">+{tool.ebitdaPct}% rev as EBITDA</span>
                      </span>
                      {totalRevenue > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="text-[#c9856b]">(+{fmt(Math.round(totalRevenue * tool.ebitdaPct / 100))})</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f87171] inline-block" />
                        <span className="text-[#8b949e]">-{tool.happinessCost} happy</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* right: event log */}
        <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-[#1c2028] bg-[#0a0d12]/80 backdrop-blur-sm overflow-y-auto max-h-[300px] lg:max-h-none">
          <div className="p-4">
            <h2 className="text-[10px] font-semibold text-[#484f58] uppercase tracking-[0.2em] mb-4">Event Log</h2>
            <div className="space-y-1.5">
              {log.map((entry, i) => (
                <div
                  key={i}
                  className="text-[11px] leading-relaxed flex gap-2 py-1 border-b border-[#1c2028]/50 last:border-0"
                  style={{ animation: i === 0 ? "fadeIn 0.3s ease-out" : undefined }}
                >
                  <span className="flex-shrink-0 w-4 text-center" style={{ color: logColor(entry.type) }}>{logIcon(entry.type)}</span>
                  <span className="text-[#6e7681]">{entry.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

function StatCard({ label, value, color, flash }: { label: string; value: string; color: string; flash?: boolean }) {
  return (
    <div
      className="relative p-3 rounded-xl border transition-all duration-300"
      style={{
        background: flash ? `linear-gradient(135deg, ${color}10, ${color}05)` : "#151921",
        borderColor: flash ? `${color}40` : "#1c2028",
      }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, opacity: 0.6 }} />
        <span className="text-[10px] uppercase tracking-[0.15em] text-[#484f58] font-medium">{label}</span>
      </div>
      <div
        className="text-xl font-bold tabular-nums"
        style={{
          color,
          animation: flash ? "pulse 0.6s ease-out" : undefined,
        }}
      >
        {value}
      </div>
    </div>
  );
}
