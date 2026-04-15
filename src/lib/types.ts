export type JobStatus = "applied" | "interview" | "offer" | "rejected" | "saved";

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
}

export const STATUS_CONFIG: Record<JobStatus, { label: string; className: string }> = {
  saved: { label: "Saved", className: "bg-secondary text-secondary-foreground" },
  applied: { label: "Applied", className: "bg-info text-info-foreground" },
  interview: { label: "Interview", className: "bg-warning text-warning-foreground" },
  offer: { label: "Offer", className: "bg-success text-success-foreground" },
  rejected: { label: "Rejected", className: "bg-destructive text-destructive-foreground" },
};
