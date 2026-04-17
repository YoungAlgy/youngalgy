import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { Job, JobStatus } from "@/lib/types";
import { MapPin, ExternalLink, ChevronDown, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

function ScoreBadge({ score }: { score?: number | null }) {
  if (score == null) return <span className="text-muted-foreground">—</span>;
  const color =
    score >= 9 ? "bg-success text-success-foreground" :
    score >= 7 ? "bg-warning text-warning-foreground" :
    "bg-secondary text-secondary-foreground";
  return <Badge className={`${color} text-xs font-semibold`}>{score}</Badge>;
}

interface JobTableProps {
  jobs: Job[];
  onStatusChange?: (id: string, status: JobStatus) => void;
}

export function JobTable({ jobs, onStatusChange }: JobTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function markApplied(job: Job) {
    if (job.status === "applied" || updatingId === job.id) return;
    setUpdatingId(job.id);
    const previous = job.status;
    onStatusChange?.(job.id, "applied");
    const { error } = await supabase
      .from("opportunities")
      .update({ status: "applied" })
      .eq("id", job.id);
    setUpdatingId(null);
    if (error) {
      onStatusChange?.(job.id, previous);
      toast.error("Failed to mark as applied");
    } else {
      toast.success(`Marked ${job.company} as applied`);
    }
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No jobs found</p>
        <p className="text-sm mt-1">Adjust your filters.</p>
      </div>
    );
  }

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-20">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => {
              const isExpanded = expandedId === job.id;
              const hasDetails = job.coverLetter || job.proposal;
              return (
                <>
                  <TableRow key={job.id} className="group cursor-pointer" onClick={() => hasDetails && toggle(job.id)}>
                    <TableCell className="pr-0">
                      {hasDetails && (isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />)}
                    </TableCell>
                    <TableCell className="font-medium">{job.company}</TableCell>
                    <TableCell>{job.position}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin className="h-3 w-3" /> {job.location}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{job.salary || "—"}</TableCell>
                    <TableCell><ScoreBadge score={job.score} /></TableCell>
                    <TableCell><StatusBadge status={job.status} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(job.appliedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {job.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={(e) => { e.stopPropagation(); window.open(job.url, "_blank"); }}
                        >
                          Apply <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  {isExpanded && hasDetails && (
                    <TableRow key={`${job.id}-detail`}>
                      <TableCell colSpan={9} className="bg-muted/30 p-4">
                        <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
                          {job.coverLetter && (
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cover Letter</p>
                              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">{job.coverLetter}</p>
                            </div>
                          )}
                          {job.proposal && (
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Proposal</p>
                              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">{job.proposal}</p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {jobs.map((job) => {
          const isExpanded = expandedId === job.id;
          const hasDetails = job.coverLetter || job.proposal;
          return (
            <div key={job.id} className="bg-card border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between" onClick={() => hasDetails && toggle(job.id)}>
                <div>
                  <p className="font-semibold">{job.company}</p>
                  <p className="text-sm text-muted-foreground">{job.position}</p>
                </div>
                <div className="flex items-center gap-2">
                  <ScoreBadge score={job.score} />
                  <StatusBadge status={job.status} />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                <span>{job.salary || ""}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{new Date(job.appliedDate).toLocaleDateString()}</span>
                {job.url && (
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => window.open(job.url, "_blank")}>
                    Apply <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {isExpanded && hasDetails && (
                <div className="pt-2 border-t space-y-3">
                  {job.coverLetter && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Cover Letter</p>
                      <p className="text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">{job.coverLetter}</p>
                    </div>
                  )}
                  {job.proposal && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Proposal</p>
                      <p className="text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">{job.proposal}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
