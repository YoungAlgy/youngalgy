/**
 * Experience + Projects grid for the Landing page.
 *
 * Edit-here-only. Order in array = render order. Each entry needs a Lucide
 * icon component imported below.
 *
 * Per the 2026-04-29 strategy plan (S10 — Landing Page Standards), every
 * claim here must be verifiable + match the canonical resume PDF.
 */

import {
  Users,
  Sparkles,
  LineChart,
  TrendingUp,
  Utensils,
  HardHat,
  Music,
  Gem,
  type LucideIcon,
} from "lucide-react";

export interface WorkItem {
  readonly title: string;
  readonly role: string;
  readonly description: string;
  readonly bullets: readonly string[];
  readonly highlights: readonly string[];
  readonly icon: LucideIcon;
}

export const work: readonly WorkItem[] = [
  {
    title: "Ava Health — Recruiter + CRM Builder (Current)",
    role: "Contract · 2026–Present",
    description:
      "Place physicians nationwide, and nurses & therapists in Florida. Designed and built Ava Health's entire digital infrastructure: full-stack CRM + public provider directory covering 850K+ verified healthcare professionals across all 50 states.",
    bullets: [
      "Place NPI-verified physicians nationwide + nurses/therapists in FL",
      "Designed and shipped the React + Node + PostgreSQL CRM from scratch",
      "Nationwide NPI data pipeline — 850K+ verified providers",
      "Telnyx 10DLC SMS engine wired into provider cadences",
      "SEO surface across properties: 1,100+ pages, 204 blog posts indexed",
      "Multi-channel outbound: SMS, email, calls — built the tooling + ran the plays",
      "Supabase RLS, view-as roles, billing integrations, internal admin tooling",
    ],
    highlights: ["850K+ Providers", "React + Node", "PostgreSQL", "Supabase", "Telnyx 10DLC", "NPI Verified"],
    icon: Users,
  },
  {
    title: "Money Mitch + Big Gates Records",
    role: "Agent + Road Manager · 2015–Present · 11 yrs",
    description:
      "Manage my younger brother's music career (artist name Money Mitch). Built his fanbase from zero — he signed with Big Gates Records at 17. Road Manager for bookings, social, and label point-of-contact. Also designed and built his website and private content vault.",
    bullets: [
      "Guided career from zero to a Big Gates Records deal at 17",
      '"Flexin\' Like Woah" went viral — hundreds of millions of views, TikTok dance trend',
      '"Stunting" exclusive premiere on Worldstar — millions of views',
      "Built moneymitch.music + private content vault (custom web platform)",
      "Road Manager under Big Gates: bookings, social, label point-of-contact",
      "Handle all SEO and digital presence — landing page, GSC, analytics",
    ],
    highlights: ["Artist Mgmt", "100M+ Views", "Record Deal", "Road Mgr", "Web Platform"],
    icon: Sparkles,
  },
  {
    title: "Universe XYZ — Lobby Lobsters",
    role: "Project Manager (Full-time) · 2021–2022",
    description:
      "Oversaw digital collectible drops and the marketplace build. Program raised $5M+ for charity including the $4.4M Lobby Lobsters drop. Founding-collective member of Bored Ape Yacht Club; seed investor in OpenSea.",
    bullets: [
      "Cross-functional program management: engineering, creative, community, comms",
      "Solidity contracts, marketplace launch, drop choreography",
      "Multiple successful drops — sold out, raised millions in revenue",
      "$4.4M Lobby Lobsters drop, $5M+ total charity raise",
      "Founding collective member of Bored Ape Yacht Club",
      "Seed investor in OpenSea",
    ],
    highlights: ["$5M+ Charity", "Solidity", "Web3", "BAYC Founding", "OpenSea Seed"],
    icon: TrendingUp,
  },
  {
    title: "Angel Investor",
    role: "Private · 2021–Present",
    description:
      "Angel investing through a network of celebrities, traders, and business operators. Constantly scouting innovative teams — tech, crypto, culture — to back early.",
    bullets: [
      "Network-driven deal flow across tech, trading, and culture operators",
      "Seed-stage checks into teams with strong operator-founders",
      "OpenSea seed + BAYC founding collective sit alongside this work",
      "Pattern-match on product, timing, and whether the founder can sell",
    ],
    highlights: ["Seed Stage", "Web3", "Tech", "Network"],
    icon: Gem,
  },
  {
    title: "Toggle Money — Recording Studio",
    role: "Founder · 2015–Present · Tampa, FL",
    description:
      "Founded a Tampa-based recording studio that empowers local artists with resources and opportunities. Engineer and manage sessions, handle mixing and mastering, and connect songwriters, producers, cinematographers, and performers to push each other's work forward.",
    bullets: [
      "Engineer + manage recording sessions for Tampa-area artists",
      "Mix + master tracks in Pro Tools",
      "Connect songwriters, producers, cinematographers, and performers",
      "Offer financial support to help artists thrive",
    ],
    highlights: ["Recording", "Pro Tools", "Mix/Master", "Tampa Music"],
    icon: Music,
  },
  {
    title: "Toggle Town — Trading Bots + Esports",
    role: "Founder · 2019–Present · Trading live since 2026",
    description:
      "Started as an amateur esports channel in 2019 curating community gameplay. Evolved into the home for my algorithmic trading systems, now running on live Alpaca capital.",
    bullets: [
      "Esports channel curating community gameplay (2019 origin)",
      "Kalman filter state estimation for price + volatility",
      "HMM regime detection to gate strategy switches",
      "VWAP bands and sector rotation models",
      "Drawdown controller and risk manager on top",
      "Real-time dashboards, backtesting harness, Python pipelines",
    ],
    highlights: ["Python", "Alpaca", "Backtesting", "Kalman + HMM", "Esports"],
    icon: LineChart,
  },
  {
    title: "Holmes Builders",
    role: "Representative · 2020–Present",
    description:
      "Represent the family-owned construction business. Marketing strategies (social, word-of-mouth), investor pitch deck, participating in land auctions, and hands-on time on-site during project completions.",
    bullets: [
      "Marketing strategies across social and word-of-mouth",
      "Designed and built the company's investor pitch deck",
      "Participate in land auctions for site acquisition",
      "On-site during project completions — real industry reps",
    ],
    highlights: ["Family Business", "Construction", "Marketing", "Tampa"],
    icon: HardHat,
  },
  {
    title: "Server — Charley's Steakhouse",
    role: "Full-time · 2014–2020 · 6 years",
    description:
      "Six years at Tampa's flagship steakhouse. Experience in every position in the restaurant — kitchen, host stand, bussing, checkouts, and serving. Where the service-instincts started.",
    bullets: [
      "Every role in the house: kitchen, host, busser, checkout, server",
      "Ran full sections under pressure — speed, accuracy, presence",
      "Nightly reps with people, money, and operations",
      "Foundation for the sales and client work that came after",
    ],
    highlights: ["6 Years", "Fine Dining", "Service", "Tampa"],
    icon: Utensils,
  },
];
