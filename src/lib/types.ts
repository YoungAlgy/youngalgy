export type JobStatus = "applied" | "interview" | "offer" | "rejected" | "saved";

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
  created_at: string;
}

export interface Job {
  id: string;
  company: string;
  position: string;
  location: string;
  salary?: string;
  status: JobStatus;
  appliedDate: string;
  notes?: string;
  url?: string;
  score?: number | null;
}

export const STATUS_CONFIG: Record<JobStatus, { label: string; className: string }> = {
  saved: { label: "Saved", className: "bg-secondary text-secondary-foreground" },
  applied: { label: "Applied", className: "bg-info text-info-foreground" },
  interview: { label: "Interview", className: "bg-warning text-warning-foreground" },
  offer: { label: "Offer", className: "bg-success text-success-foreground" },
  rejected: { label: "Rejected", className: "bg-destructive text-destructive-foreground" },
};

const STATUS_MAP: Record<string, JobStatus> = {
  saved: "saved",
  applied: "applied",
  interview: "interview",
  offer: "offer",
  rejected: "rejected",
};

export function mapOpportunityToJob(opp: Opportunity): Job {
  const rawStatus = (opp.status || "saved").toLowerCase();
  const status: JobStatus = STATUS_MAP[rawStatus] || "saved";

  return {
    id: opp.id,
    company: opp.company,
    position: opp.title,
    location: opp.location || "Unknown",
    salary: opp.salary_low ? `$${(opp.salary_low / 1000).toFixed(0)}k` : undefined,
    status,
    appliedDate: opp.created_at,
    url: opp.url || undefined,
    score: opp.score,
    notes: opp.reasoning || undefined,
  };
}
