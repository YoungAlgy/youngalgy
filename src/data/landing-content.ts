/**
 * Landing-page content. Edit here, no component edits.
 * v8 dual-theme (Alpha/Money Mitch) — content is theme-agnostic; the visual
 * layer (palette, type, glow) flips via [data-mode] on <html>.
 *
 * Current operating decisions and live product state control these claims.
 * Resume and profile text should be updated from this same fact set.
 */

export const CONTACT_EMAIL = "youngalgy@gmail.com";
// UTM-tagged 2026-06-01 (cross-promo engine) so toggle.town's analytics
// attributes portfolio traffic — closes the youngalgy → hub loop. Used as
// the href on the two portfolio CTAs that point at the hub.
export const TOGGLE_TOWN_URL = "https://toggle.town/?utm_source=youngalgy&utm_medium=backlink";
export const MONEY_MITCH_URL = "https://moneymitch.music";
export const AVA_STAFFING_URL = "https://providers.avahealth.co";
// alpha. lives on its own domain now — link straight there instead of
// bouncing through the /alpha 308 redirect this site keeps for old links.
export const ALPHA_URL = "https://alpha.everyday.report";
export const ALPHA_SAMPLE_URL = "https://alpha.everyday.report/sample";
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
  { year: "2016", title: "Pinellas Safe Harbor · facilitated support groups, SPC psych internship", tag: "PSYCH / SERVICE" },
  { year: "2019", title: "Toggle Town starts as esports media", tag: "MEDIA" },
  { year: "2020", title: "B.A. Psychology · USF", tag: "GRADUATED" },
  { year: "2021", title: "Core contributor at Futureverse", tag: "WEB3" },
  { year: "2021", title: "Project manager at Universe XYZ", tag: "WEB3" },
  { year: "2021", title: "Founding member of Bored Ape Yacht Club", tag: "ART" },
  { year: "2022", title: "Project-managed more than $5M in charity fundraising", tag: "CHARITY" },
  { year: "2025", title: "Floor, later Rally, acquired by OpenSea", tag: "EXIT" },
  { year: "2026", title: "Co-founded Ava Health and built its recruiting software", tag: "HEALTHCARE" },
  { year: "2026", title: "Joined MASC Medical in recruiting and project management", tag: "HEALTHCARE" },
  { year: "2026", title: "Shipped Alpha and expanded Toggle Town", tag: "PRODUCTS" },
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
      "FastAPI",
      "Cloudflare",
      "Stripe",
      "Tailwind",
    ],
  },
  {
    label: "HEALTHCARE RECRUITING",
    chips: [
      "Physician recruiting",
      "Nurse recruiting",
      "Allied health",
      "Candidate sourcing",
      "Candidate qualification",
      "Multi-channel outreach",
      "Pipeline operations",
      "Offer process",
    ],
  },
  {
    label: "PRODUCT & OPERATIONS",
    chips: [
      "Project management",
      "Workflow design",
      "Requirements",
      "QA",
      "Launch planning",
      "Customer support",
      "Data pipelines",
      "Reporting",
      "Mobile-first design",
    ],
  },
  {
    label: "WEB3 / ON-CHAIN",
    chips: [
      "NFT drops",
      "Project management",
      "Community",
      "On-chain products",
      "Advisor + seed",
    ],
  },
  {
    label: "MUSIC",
    chips: [
      "Artist bookings",
      "Socials",
      "Studio engineering",
      "Mix / master",
      "Social rollouts",
    ],
  },
  {
    label: "MARKETING & SALES",
    chips: [
      "SEO",
      "Content strategy",
      "Landing pages",
      "Copywriting",
      "Sales",
      "Closing",
      "Account management",
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
  illustration: "ava-platform" | "masc-badge" | "nft-frame" | "cassette" | "toggle-hub";
  flip?: boolean;
  link?: { url: string; label: string };
};

export const cases: readonly Case[] = [
  {
    number: "01",
    category: "HEALTHCARE",
    period: "2026 - NOW",
    title: "Ava Health.",
    body: "I co-founded Ava Health and built the software behind the operation. That includes the CRM, candidate database, NPPES enrichment, outreach tools, plus the FreeJobPost and FreeResumePost tools. I also recruit nurses and allied health professionals across Florida.",
    stats: [],
    illustration: "ava-platform",
    link: { url: AVA_STAFFING_URL, label: "providers.avahealth.co" },
  },
  {
    number: "02",
    category: "HEALTHCARE",
    period: "2026 - NOW",
    title: "MASC Medical.",
    body: "At MASC Medical, I recruit physicians nationwide. I own the search from first outreach through a signed offer. I also project manage a new outreach tool being built in-house.",
    stats: [],
    illustration: "masc-badge",
    flip: true,
  },
  {
    number: "03",
    category: "INTERNET ART",
    period: "2021 - 2025",
    title: "Web3 work.",
    body: "I was a core contributor at Futureverse and a project manager at Universe XYZ. I helped project manage more than $5M in charity fundraising. I was a founding member of Bored Ape Yacht Club. I also advised and seed-invested in Floor, later Rally, before OpenSea acquired it in 2025.",
    stats: [],
    illustration: "nft-frame",
  },
  {
    number: "04",
    category: "MUSIC",
    period: "CURRENT",
    title: "Money Mitch. Big Gates Records.",
    body: "Money Mitch is my younger brother. He signed to Big Gates Records at 17. I work as his agent. I handle bookings and socials. I also built moneymitch.music.",
    stats: [],
    illustration: "cassette",
    flip: true,
    link: { url: MONEY_MITCH_URL, label: "moneymitch.music" },
  },
  {
    number: "05",
    category: "PRODUCTS",
    period: "2019 - PRESENT",
    title: "Toggle Town.",
    body: "Toggle Town brings my consumer apps under one roof. It covers sports research, horse racing, poker and blackjack tools, prediction-market research, collectibles, fishing forecasts, and a free opportunities board. I built and run the product, payments, data, and releases.",
    stats: [],
    illustration: "toggle-hub",
    link: { url: TOGGLE_TOWN_URL, label: "toggle.town" },
  },
];
