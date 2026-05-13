/**
 * Landing-page content. Edit here, no component edits.
 * v7 dual-theme (Miami/Pirate) — content is theme-agnostic; the visual
 * layer (palette, type, glow) flips via [data-mode] on <html>.
 *
 * Per S10 standards, every claim here must match the canonical resume PDF
 * and LinkedIn profile. Plain-English labels for non-insider audiences.
 */

export const CONTACT_EMAIL = "youngalgy@gmail.com";
export const TOGGLE_TOWN_URL = "https://toggle.town";

export type TimelineEntry = {
  year: string;
  title: string;
  tag: string;
};

export const timeline: readonly TimelineEntry[] = [
  { year: "2015", title: "Mitch signs to Big Gates Records", tag: "MUSIC / AGENT" },
  { year: "2017", title: "USF · B.A. Psychology (begins)", tag: "EDUCATION" },
  { year: "2019", title: "Toggle Town founded (esports origin)", tag: "MEDIA" },
  { year: "2020", title: "B.A. Psychology · USF", tag: "GRADUATED" },
  { year: "2020", title: "Holmes Builders", tag: "CONSTRUCTION / FAMILY" },
  { year: "2021", title: "Universe XYZ · PM, $4.4M Lobby Lobsters drop", tag: "WEB3" },
  { year: "2021", title: "BAYC founding collective", tag: "ART" },
  { year: "2022", title: "$5M+ raised across charity drops", tag: "CHARITY" },
  { year: "2025", title: "OpenSea seed", tag: "INVESTING" },
  { year: "2026", title: "Quant trading bots go live · Alpaca + Kalshi", tag: "QUANT" },
  { year: "2026", title: "Ava Health · Recruiter → Builder", tag: "HEALTHCARE" },
  { year: "2026", title: "850K healthcare platform, rolling to 1M", tag: "NOW" },
];

export type LoadoutRow = {
  label: string;
  chips: readonly string[];
};

export const loadout: readonly LoadoutRow[] = [
  {
    label: "SALES & RECRUITING",
    chips: [
      "Closing",
      "Cold outreach",
      "Pipeline design",
      "Recruiting",
      "Talent mgmt",
      "A&R",
      "Negotiation",
      "Account mgmt",
      "GTM strategy",
      "Storytelling",
      "Customer success",
    ],
  },
  {
    label: "SOFTWARE",
    chips: [
      "React",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Supabase",
      "Python",
      "Pandas / NumPy",
      "Scikit-learn",
      "SQL",
      "Tailwind",
    ],
  },
  {
    label: "MUSIC & A&R",
    chips: [
      "Studio engineering",
      "Mix / master",
      "Catalog strategy",
      "Artist development",
      "Pro Tools",
      "Distribution",
      "Roster building",
    ],
  },
  {
    label: "WEB3 / ON-CHAIN",
    chips: [
      "NFT drops",
      "Smart contracts (read)",
      "Solidity (read)",
      "OpenSea / EVM",
      "Community + comms",
      "Drop choreography",
    ],
  },
  {
    label: "MARKETS & QUANT",
    chips: [
      "Algorithmic trading",
      "Kalman filter",
      "HMM regime detection",
      "Backtesting",
      "Risk management",
      "Drawdown control",
      "Alpaca API",
      "Kalshi",
    ],
  },
  {
    label: "BRAND & MARKETING",
    chips: [
      "SEO",
      "Content strategy",
      "Landing pages",
      "Webflow",
      "Figma",
      "Copywriting",
      "Social rollouts",
    ],
  },
];

export type Case = {
  number: string;
  category: string;
  period: string;
  spineLabel: string;
  title: string;
  body: string;
  stats: ReadonlyArray<{ value: string; label: string; sub: string }>;
  illustration: "ava-map" | "nft-frame" | "cassette" | "quant-chart";
  flip?: boolean;
};

export const cases: readonly Case[] = [
  {
    number: "01",
    category: "HEALTHCARE",
    period: "2026 — NOW",
    spineLabel: "HEALTHCARE / OPERATIONS",
    title: "Ava Health. From spreadsheet to fifty-state CRM.",
    body: "Hired as a recruiter. Built the platform. An 850K-provider directory spun up from raw federal data, wired into a full-stack CRM that places physicians nationwide and ships nurses & therapists across Florida. React, Node, PostgreSQL, Supabase.",
    stats: [
      {
        value: "850K",
        label: "Providers indexed",
        sub: "All 50 states, searchable in milliseconds.",
      },
      {
        value: "CRM",
        label: "Built from scratch",
        sub: "Directory, dashboards, outreach pipelines.",
      },
      {
        value: "FL→US",
        label: "Therapist + nurse placement",
        sub: "Statewide first; national rollout this year.",
      },
    ],
    illustration: "ava-map",
  },
  {
    number: "02",
    category: "INTERNET ART",
    period: "2021 — 2022",
    spineLabel: "WEB3 / DROPS",
    title: "Universe XYZ. BAYC. OpenSea. The good era.",
    body: "Project-managed the $4.4M Lobby Lobsters charity drop end-to-end — artist coordination, smart-contract timeline, the mint, the proceeds routing. Founding-collective member of Bored Ape Yacht Club. Seed investor in OpenSea.",
    stats: [
      {
        value: "$4.4M",
        label: "Lobby Lobsters drop",
        sub: "Managed PM, artists, mint, charity routing.",
      },
      {
        value: "$5M+",
        label: "Total raised for charity",
        sub: "Across Web3 drops, 2021—2022.",
      },
      {
        value: "1/100",
        label: "BAYC founding collective",
        sub: "In early, contributed early.",
      },
      {
        value: "SEED",
        label: "OpenSea",
        sub: "Investor before the eight-figure rounds.",
      },
    ],
    illustration: "nft-frame",
    flip: true,
  },
  {
    number: "03",
    category: "MUSIC",
    period: "2015 — PRESENT",
    spineLabel: "MUSIC / TALENT MANAGEMENT",
    title: "Money Mitch. Big Gates Records. Flexin' Like Woah.",
    body: "Connected his younger brother to Big Gates Records — stepped in as agent and road manager. \"Flexin' Like Woah\" went viral with its own TikTok dance trend. He builds the catalog, runs the rollouts, and ships moneymitch.music — private vault, fan tiers, content drops.",
    stats: [
      {
        value: "VIRAL",
        label: "Flexin' Like Woah",
        sub: "Broke organically across TikTok's dance-trend wave.",
      },
      {
        value: ".MUSIC",
        label: "Built moneymitch.music",
        sub: "Private vault, fan tiers, content drops.",
      },
    ],
    illustration: "cassette",
  },
  {
    number: "04",
    category: "QUANT",
    period: "PARALLEL · ALWAYS",
    spineLabel: "QUANT",
    title: "Quant Trading. Live capital, systematic.",
    body: "Built in Python on his own time: backtesting harness, regime detection (Kalman filter + HMM), VWAP bands, drawdown controller. Trades on Alpaca (equities) and Kalshi (prediction markets) with real capital.",
    stats: [
      {
        value: "PY",
        label: "Backtest harness",
        sub: "Vectorized, walk-forward, slippage modeled.",
      },
      {
        value: "HMM",
        label: "Regime detection",
        sub: "Trend / chop / shock states gate the strategy.",
      },
      {
        value: "VWAP",
        label: "Entry bands + Kalman smoothing",
        sub: "Tuned for live fills.",
      },
      {
        value: "−DD",
        label: "Drawdown controller",
        sub: "Cuts size before the stop hits.",
      },
      {
        value: "KALSHI",
        label: "Prediction markets",
        sub: "Event contracts traded systematically.",
      },
    ],
    illustration: "quant-chart",
    flip: true,
  },
];
