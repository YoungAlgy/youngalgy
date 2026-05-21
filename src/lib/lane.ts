/**
 * Lane derivation — pure, deterministic, client-side.
 *
 * Per the 2026-05-16 strategic reframe, Algy's actual lanes are:
 *   CRYPTO     — crypto-native employers (Anchorage, Coinbase, OpenSea, etc.)
 *   OPERATOR   — founding/early-stage operator + builder roles
 *   SUPPORT    — async customer support / CX at AI/dev/SaaS co's
 *   RECRUITING — recruiter / TA / sourcer / onboarding coordinator (the overclaim trap)
 *   CSM        — customer success / account management (commission-light)
 *   MARKETING  — growth / content / community
 *   ENGINEERING— SWE / FE / BE (rare for Algy — overclaim risk if pursued)
 *   OTHER      — couldn't classify
 *
 * Lane is used for filtering, breakdown reporting, and signal-vs-overclaim
 * triage. NOT stored in the DB (yet) — derived from title + source on every
 * fetch so we can iterate the classifier without a migration.
 */

export type Lane =
  | "CRYPTO"
  | "OPERATOR"
  | "SUPPORT"
  | "RECRUITING"
  | "CSM"
  | "MARKETING"
  | "ENGINEERING"
  | "OTHER";

export const ALL_LANES: readonly Lane[] = [
  "CRYPTO",
  "OPERATOR",
  "SUPPORT",
  "RECRUITING",
  "CSM",
  "MARKETING",
  "ENGINEERING",
  "OTHER",
];

/** Tailwind/css color hooks per lane. Subtle, not loud. */
export const LANE_COLOR: Record<Lane, { chip: string; dot: string }> = {
  CRYPTO:      { chip: "bg-info/15 text-foreground border-info/40",          dot: "bg-info" },
  OPERATOR:    { chip: "bg-success/15 text-foreground border-success/40",    dot: "bg-success" },
  SUPPORT:     { chip: "bg-screen/15 text-foreground border-screen/40",      dot: "bg-screen" },
  RECRUITING:  { chip: "bg-warning/15 text-foreground border-warning/40",    dot: "bg-warning" },
  CSM:         { chip: "bg-stage/15 text-foreground border-stage/40",        dot: "bg-stage" },
  MARKETING:   { chip: "bg-primary/15 text-foreground border-primary/40",    dot: "bg-primary" },
  ENGINEERING: { chip: "bg-destructive/15 text-foreground border-destructive/40", dot: "bg-destructive" },
  OTHER:       { chip: "bg-muted text-muted-foreground border-muted-foreground/30", dot: "bg-muted-foreground" },
};

/** Sources known to be crypto-native job boards / ATSes. */
const CRYPTO_SOURCES = new Set([
  "cryptocurrencyjobs.co",
  "wellfound-crypto",
  "cryptojobslist",
  "web3career",
]);

/** Companies known to be crypto-native (case-insensitive substring match). */
const CRYPTO_COMPANY_HINTS = [
  "anchorage",
  "coinbase",
  "opensea",
  "magic eden",
  "phantom",
  "metamask",
  "uniswap",
  "alchemy",
  "chainalysis",
  "circle",
  "bitpay",
  "kraken",
  "binance",
  "ripple",
  "solana",
  "polygon",
  "consensys",
  "yuga",
  "bored ape",
  "ledger",
  "fireblocks",
  "wintermute",
  "stratosphere",
  "nexo",
  "okx",
  "bitmart",
  "bingx",
  "bybit",
  "bitwise",
  "galaxy",
  "moonpay",
  "talos",
  "0x",
  "ondo",
  "ether.fi",
  "tempo",
  "ethena",
  "morpho",
  "polymarket",
  "monad",
  "mysten",
  "layerzero",
  "chainlink",
  "lido",
  "mantle",
  "aave",
];

/**
 * Match the lane for a single opportunity. Order matters: more specific
 * signals (crypto source, explicit "founding" titles) beat title-keyword
 * fallbacks.
 */
export function deriveLane(opp: {
  title?: string | null;
  company?: string | null;
  source?: string | null;
  url?: string | null;
}): Lane {
  const title = (opp.title ?? "").toLowerCase();
  const company = (opp.company ?? "").toLowerCase();
  const source = (opp.source ?? "").toLowerCase();
  const url = (opp.url ?? "").toLowerCase();

  // CRYPTO — strongest signal: crypto-native source/URL or known company
  if (CRYPTO_SOURCES.has(source)) return "CRYPTO";
  if (url.includes("cryptocurrencyjobs") || url.includes("lever.co/anchorage") || url.includes("greenhouse.io/coinbase")) return "CRYPTO";
  for (const hint of CRYPTO_COMPANY_HINTS) {
    if (company.includes(hint)) return "CRYPTO";
  }
  // Title keywords that signal web3/crypto regardless of source
  if (/\b(web3|crypto|blockchain|defi|nft|on[- ]chain|protocol)\b/i.test(title)) return "CRYPTO";

  // OPERATOR — founder, early-stage operator, chief of staff, founding
  if (/\b(founding|founder|chief of staff|operator|product operator|head of operations|biz ops|business operations)\b/i.test(title)) return "OPERATOR";

  // SUPPORT — customer support, technical support, product support, helpdesk
  if (/\b(support specialist|product support|customer support|technical support|customer experience|cx|client experience|helpdesk|help desk)\b/i.test(title)) return "SUPPORT";

  // RECRUITING — the overclaim trap lane
  if (/\b(recruit(er|ing)|talent acquisition|sourcer|talent partner|onboarding coordinator|hr coordinator|people operations|people partner)\b/i.test(title)) return "RECRUITING";

  // CSM — customer success / account management
  if (/\b(customer success|account manager|account executive|relationship manager|partner manager)\b/i.test(title)) return "CSM";

  // MARKETING — growth, content, social, marketing, community
  if (/\b(marketing|growth|content|copywriter|social media|community manager|brand|evangelist|devrel|developer relations)\b/i.test(title)) return "MARKETING";

  // ENGINEERING — SWE/FE/BE (overclaim risk for Algy, but classify for visibility)
  if (/\b(software engineer|developer|frontend|front-end|backend|back-end|full[- ]stack|swe|engineer|sre|devops|data engineer|ml engineer)\b/i.test(title)) return "ENGINEERING";

  return "OTHER";
}
