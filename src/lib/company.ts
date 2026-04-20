/**
 * Display-only fixes for company names whose stored value drops punctuation
 * (e.g. apostrophes stripped during scraping). Keeps raw DB value intact.
 */
const OVERRIDES: Record<string, string> = {
  "shugarman bath": "Shugarman's Bath",
  "shugarmans bath": "Shugarman's Bath",
};

export function displayCompany(raw: string | null | undefined): string {
  if (!raw) return "";
  const key = raw.trim().toLowerCase();
  return OVERRIDES[key] ?? raw;
}
