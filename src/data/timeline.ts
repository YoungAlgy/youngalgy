/**
 * Career-timeline entries rendered in the Landing page Timeline section.
 *
 * Edit-here-only. Sort order is chronological (oldest first); the component
 * renders in array order. Year strings can be ranges ("2014–2020") or single
 * years ("2021"); they're displayed as-is.
 *
 * Per the 2026-04-29 strategy plan (S10 — Landing Page Standards), every
 * claim here must be verifiable + match the canonical resume PDF.
 */

export interface TimelineEntry {
  readonly year: string;
  readonly title: string;
  readonly detail: string;
}

export const timeline: readonly TimelineEntry[] = [
  {
    year: "2014–2020",
    title: "Server, Charley's Steakhouse",
    detail:
      "Six years across every role in the restaurant — kitchen, host, busser, checkout, server. Where I learned to read a room, carry pressure, and hit a rhythm under load.",
  },
  {
    year: "2014–2017",
    title: "A.A. Psychology, St. Petersburg College",
    detail:
      "Dual enrolled my senior year of high school; finished the associate's before transferring.",
  },
  {
    year: "2015",
    title: "Music agent + Toggle Money founder",
    detail:
      "Started managing my brother Money Mitch and founded Toggle Money recording studio in Tampa. He signed with Big Gates Records at 17 on the back of that work.",
  },
  {
    year: "2017–2020",
    title: "B.A. Psychology, USF",
    detail:
      "Transferred to the University of South Florida. Focused on decision-making, motivation, and team dynamics — the foundation for everything that came after.",
  },
  {
    year: "2019",
    title: "Road Manager, Big Gates Records + Toggle Town",
    detail:
      "Bookings, social, point of contact for Mitch under Big Gates. Separately founded Toggle Town — amateur esports channel curating community gameplay.",
  },
  {
    year: "2020",
    title: "Holmes Builders Representative",
    detail:
      "Family construction business — marketing, investor pitch deck, land auctions, and on-site project experience.",
  },
  {
    year: "2021",
    title: "Angel investor",
    detail:
      "Started angel-investing through my network of celebrities, traders, and operators. Constantly scouting innovative teams to back early.",
  },
  {
    year: "2021–2022",
    title: "Project Manager, Universe XYZ",
    detail:
      "Led digital collectible drops and the marketplace build. Program raised $5M+ for charity including the $4.4M Lobby Lobsters drop. Founding-collective member of BAYC; seed investor in OpenSea.",
  },
  {
    year: "2026",
    title: "Toggle Town trading bots go live",
    detail:
      "Algorithmic trading on live Alpaca capital — Kalman filter state estimation, HMM regime detection, VWAP bands, drawdown controller. Markets are another system to read and time.",
  },
  {
    year: "2026",
    title: "Healthcare Recruiter + CRM Builder, Ava Health",
    detail:
      "Joined Ava Health on contract placing physicians nationwide + nurses/therapists in FL. Designed and built Ava's entire digital infrastructure: CRM + public provider directory covering 850K+ verified healthcare professionals across all 50 states.",
  },
];
