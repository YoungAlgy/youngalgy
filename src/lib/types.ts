import { deriveLane, type Lane } from "./lane";

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

export type ReplyKind = "rejection" | "screen" | "interview" | "question" | "offer" | "other";

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
  // Reply tracking — see supabase/migrations/20260427_reply_tracking.sql.
  // Both fields are nullable; auto-stamped by trigger when status moves
  // off 'applied' to anything besides 'applied'/'ghosted'.
  first_reply_at?: string | null;
  reply_kind?: ReplyKind | null;
}

/** True when the row is `applied` and we haven't logged a company response yet. */
export function isAwaitingReply(opp: Pick<Opportunity, "status" | "first_reply_at">): boolean {
  return (opp.status ?? "applied") === "applied" && !opp.first_reply_at;
}

/** True when awaiting + over `daysStale` since `created_at`. */
export function isStale(
  opp: Pick<Opportunity, "status" | "first_reply_at" | "created_at">,
  daysStale = 14,
): boolean {
  if (!isAwaitingReply(opp)) return false;
  const ageMs = Date.now() - new Date(opp.created_at).getTime();
  return ageMs >= daysStale * 24 * 60 * 60 * 1000;
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
  firstReplyAt?: string | null;
  replyKind?: ReplyKind | null;
  /** Derived client-side from title + source. See src/lib/lane.ts. */
  lane: Lane;
}

// Per the 2026-04-29 cleanup plan (S9) + 2026-05-08 full-tokenization pass:
// All statuses now use semantic tokens defined in tailwind.config.ts and
// src/index.css — light/dark mode flips automatically for every status.
// screen = phone screen (blue); stage = interview (purple).
export const STATUS_CONFIG: Record<JobStatus, { label: string; className: string; rowTint: string }> = {
  saved:        { label: "Saved",        className: "bg-secondary text-secondary-foreground",     rowTint: "bg-secondary/30" },
  applied:      { label: "Applied",      className: "bg-info text-info-foreground",               rowTint: "bg-info/10" },
  phone_screen: { label: "Phone Screen", className: "bg-screen text-screen-foreground",           rowTint: "bg-screen/10" },
  interview:    { label: "Interview",    className: "bg-stage text-stage-foreground",             rowTint: "bg-stage/10" },
  offer:        { label: "Offer",        className: "bg-success text-success-foreground",         rowTint: "bg-success/10" },
  rejected:     { label: "Rejected",     className: "bg-destructive text-destructive-foreground", rowTint: "bg-destructive/10" },
  ghosted:      { label: "Ghosted",      className: "bg-muted text-muted-foreground",             rowTint: "bg-muted/40" },
  withdrew:     { label: "Withdrew",     className: "bg-warning text-warning-foreground",         rowTint: "bg-warning/10" },
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
  if (value == null || value === 0) return undefined;
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
    firstReplyAt: opp.first_reply_at ?? null,
    replyKind: opp.reply_kind ?? null,
    lane: deriveLane({ title: opp.title, company: opp.company, source: opp.source, url: opp.url }),
  };
}
