/**
 * Landing-page content. Edit here, no component edits.
 * v7 dual-theme (Miami/Pirate) — content is theme-agnostic; the visual
 * layer (palette, type, glow) flips via [data-mode] on <html>.
 *
 * Per S10 standards, every claim here must match the canonical resume PDF
 * and LinkedIn profile. Plain-English labels for non-insider audiences.
 */

export const CONTACT_EMAIL = "alex@avahealth.co";
// UTM-tagged 2026-06-01 (cross-promo engine) so toggle.town's analytics
// attributes portfolio traffic — closes the youngalgy → hub loop. Used as
// the href on the two portfolio CTAs that point at the hub.
export const TOGGLE_TOWN_URL = "https://toggle.town/?utm_source=youngalgy&utm_medium=backlink";
export const MONEY_MITCH_URL = "https://moneymitch.music";
export const ALPHA_URL = "/alpha";
export const ALPHA_SAMPLE_URL = "/alpha/sample";
export const FACEBOOK_URL = "https://facebook.com/youngalgy";
export const LINKEDIN_URL = "https://linkedin.com/in/youngalgy";
export const GITHUB_URL = "https://github.com/youngalgy";

export type TimelineEntry = {
  year: string;
  title: string;
  tag: string;
};

export const timeline: readonly TimelineEntry[] = [
  { year: "2015", title: "Toggle Money recording studio opens", tag: "MUSIC / STUDIO" },
  { year: "2018", title: "Mitch signs to Big Gates Records", tag: "MUSIC / AGENT" },
  { year: "2019", title: "Toggle Town · esports", tag: "MEDIA" },
  { year: "2020", title: "B.A. Psychology · USF", tag: "GRADUATED" },
  { year: "2020", title: "Holmes Builders", tag: "CONSTRUCTION / FAMILY" },
  { year: "2021", title: "Universe XYZ · PM, $4.4M Lobby Lobsters drop", tag: "WEB3" },
  { year: "2021", title: "Futureverse core contributor · Fluf World, ASM, The Root Network", tag: "WEB3 / METAVERSE" },
  { year: "2021", title: "BAYC founding collective", tag: "ART" },
  { year: "2022", title: "$5M+ raised across charity drops", tag: "CHARITY" },
  { year: "2022", title: "Advisor + seed · Floor/Rally + 5 more Web3 projects + 100s of founders", tag: "WEB3 / ADVISING" },
  { year: "2025", title: "Floor / Rally acquired by OpenSea · received equity allocation", tag: "EXIT" },
  { year: "2026", title: "Ava Health + Beacon · healthcare CRM + recruiter outreach", tag: "HEALTHCARE" },
  { year: "2026", title: "Money Mitch Vault + Studio + Toggle Town hub · music + audio + game", tag: "MUSIC / GAME" },
  { year: "2026", title: "Alpha + FreeJobPost + FreeResumePost + Mitchmark + The Downs + Bay Bite + Job-seeker dashboard · personal SaaS + dashboards", tag: "SAAS / DASHBOARDS" },
  { year: "2026", title: "Quant trading bots go live · Alpaca + Kalshi", tag: "QUANT" },
];

export type LoadoutRow = {
  label: string;
  chips: readonly string[];
};

export const loadout: readonly LoadoutRow[] = [
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
    label: "WEB3 / ON-CHAIN",
    chips: [
      "NFT drops",
      "Smart contracts (read)",
      "Solidity (read)",
      "OpenSea / EVM",
      "Metaverse / L1",
      "Advisory + seed",
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
];

export type Case = {
  number: string;
  category: string;
  period: string;
  title: string;
  body: string;
  stats: ReadonlyArray<{ value: string; label: string; sub: string }>;
  illustration: "ava-map" | "nft-frame" | "cassette" | "quant-chart";
  flip?: boolean;
  link?: { url: string; label: string };
};

export const cases: readonly Case[] = [
  {
    number: "01",
    category: "HEALTHCARE",
    period: "2026 — NOW",
    title: "Ava Health.",
    body: "Hired as a recruiter. Built the platform. A 1.4M+ provider directory spun up from raw federal data, wired into a full-stack CRM that places physicians nationwide and ships nurses & therapists across Florida. React, Node, PostgreSQL, Supabase.",
    stats: [],
    illustration: "ava-map",
  },
  {
    number: "02",
    category: "INTERNET ART",
    period: "2021 — 2025",
    title: "Futureverse. Universe XYZ. BAYC.",
    body: "Core contributor at Futureverse — minted the first NFT from Pixel Of The Apes, then helped steer Fluf World, Altered State Machines, and The Root Network (an L1 chain). Project-managed Universe XYZ's $5M+ in charity drops (Lobby Lobsters alone hit $4.4M) and shipped Polymorphs — the first changeable-outfit character NFTs on Ethereum. Founding-collective member of Bored Ape Yacht Club. Advisor + seed investor in Floor (later Rally) — acquired by OpenSea in 2025, received an equity allocation — plus 5 more Web3 projects and hundreds of founders pro bono.",
    stats: [],
    illustration: "nft-frame",
    flip: true,
  },
  {
    number: "03",
    category: "MUSIC",
    period: "2018 — PRESENT",
    title: "Money Mitch. Big Gates Records.",
    body: "Connected his younger brother to Big Gates Records — stepped in as agent and road manager. \"Flexin' Like Woah\" went viral with its own TikTok dance trend. He builds the catalog, runs the rollouts, and ships moneymitch.music — private vault, fan tiers, content drops.",
    stats: [],
    illustration: "cassette",
    link: { url: MONEY_MITCH_URL, label: "moneymitch.music" },
  },
  {
    number: "04",
    category: "QUANT",
    period: "PARALLEL · ALWAYS",
    title: "Quant Trading. Live capital.",
    body: "Built in Python on his own time: backtesting harness, regime detection (Kalman filter + HMM), VWAP bands, drawdown controller. Trades on Alpaca (equities) and Kalshi (prediction markets) with real capital.",
    stats: [],
    illustration: "quant-chart",
    flip: true,
  },
];
