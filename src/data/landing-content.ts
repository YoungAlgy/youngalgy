/**
 * Landing-page content that doesn't fit the timeline/work data models.
 * Edit here, no component code changes needed.
 *
 * Per the 2026-04-29 strategy plan (S9 — youngalgy.vercel.app Code Standards),
 * keeping content data-driven lets us version + audit copy independently of layout.
 */

export const CONTACT_EMAIL = "youngalgy@gmail.com";

/**
 * Identity chips below the hero — replaced the older numbered "01–05" stat grid.
 * Hero body copy already says "12 years placing + shipping" — chips skip restating
 * that and instead anchor the worlds Algy operates in.
 */
export const heroChips: readonly string[] = [
  "Healthcare Recruiter",
  "CRM Builder",
  "Trader / Quant",
  "Music Industry",
  "Web3 Founding Member",
];

/**
 * Recruiter-intent strip above the hero. First entry gets a pulse dot;
 * the rest are separated by middle-dot pseudo-elements.
 */
export const recruiterTags: readonly string[] = [
  "Tampa, FL",
  "Open to roles",
  "Sales / CS / Product / Ops",
  "Fortune 1000 ready",
];

export const salesSkills: readonly string[] = [
  "CRM",
  "Outreach",
  "SMS / Telnyx",
  "Recruiting",
  "Healthcare",
  "Customer Success",
  "Prospecting",
  "Cold Outreach",
  "Account Management",
];

export const techSkills: readonly string[] = [
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "Supabase",
  "PostgreSQL",
  "AI / ML",
  "SEO",
  "Vite",
  "Tailwind",
  "Solidity",
];

export interface NavSection {
  readonly id: string;
  readonly label: string;
}

export const navSections: readonly NavSection[] = [
  { id: "story", label: "Story" },
  { id: "timeline", label: "Timeline" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];
