export type JobStatus =
  | "saved"
  | "applied"
  | "phone_screen"
  | "interview"
  | "offer"
  | "rejected"
  | "ghosted"
  | "withdrew";

export const ALL_STATUSES: JobStatus[] = [
  "applied",
  "phone_screen",
  "interview",
  "offer",
  "rejected",
  "ghosted",
  "withdrew",
];

export interface Opportunity {
  id: string;
  bot_type: string | null;
  title: string;
  company: string;
  url: string | null;
  source: string | null;
  location: string | null;
  score: number | null;
  salary_low: number | null;
  status: string | null;
  reasoning: string | null;
  cover_letter: string | null;
  proposal: string | null;
  notes: string | null;
  created_at: string;
}

export interface Job {
  id: string;
  company: string;
  position: string;
  location: string;
  salary?: string;
  salaryRaw?: number | null;
  status: JobStatus;
  appliedDate: string;
  notes?: string;
  url?: string;
  score?: number | null;
  source?: string | null;
  botType?: string | null;
  coverLetter?: string | null;
  proposal?: string | null;
}

export const STATUS_CONFIG: Record<JobStatus, { label: string; className: string; rowTint: string }> = {
  saved:        { label: "Saved",        className: "bg-secondary text-secondary-foreground",     rowTint: "" },
  applied:      { label: "Applied",      className: "bg-info text-info-foreground",               rowTint: "" },
  phone_screen: { label: "Phone Screen", className: "bg-blue-500 text-white",                     rowTint: "bg-blue-500/10" },
  interview:    { label: "Interview",    className: "bg-purple-500 text-white",                   rowTint: "bg-purple-500/10" },
  offer:        { label: "Offer",        className: "bg-success text-success-foreground",         rowTint: "bg-green-500/10" },
  rejected:     { label: "Rejected",     className: "bg-destructive text-destructive-foreground", rowTint: "bg-red-500/10" },
  ghosted:      { label: "Ghosted",      className: "bg-gray-500 text-white",                     rowTint: "bg-gray-500/10" },
  withdrew:     { label: "Withdrew",     className: "bg-amber-500 text-white",                    rowTint: "bg-amber-500/10" },
};

const STATUS_MAP: Record<string, JobStatus> = {
  saved: "saved",
  applied: "applied",
  phone_screen: "phone_screen",
  "phone screen": "phone_screen",
  phonescreen: "phone_screen",
  interview: "interview",
  offer: "offer",
  rejected: "rejected",
  ghosted: "ghosted",
  withdrew: "withdrew",
  withdrawn: "withdrew",
};

export function normalizeStatus(raw: string | null | undefined): JobStatus {
  if (!raw) return "applied";
  return STATUS_MAP[raw.toLowerCase()] || "applied";
}

export function formatSalary(value: number | null | undefined): string | undefined {
  if (value == null) return undefined;
  return `$${value.toLocaleString("en-US")}`;
}

export function mapOpportunityToJob(opp: Opportunity): Job {
  return {
    id: opp.id,
    company: opp.company,
    position: opp.title,
    location: opp.location || "Unknown",
    salary: formatSalary(opp.salary_low),
    salaryRaw: opp.salary_low,
    status: normalizeStatus(opp.status),
    appliedDate: opp.created_at,
    url: opp.url || undefined,
    score: opp.score,
    notes: opp.notes ?? opp.reasoning ?? undefined,
    source: opp.source,
    botType: opp.bot_type,
    coverLetter: opp.cover_letter,
    proposal: opp.proposal,
  };
}
