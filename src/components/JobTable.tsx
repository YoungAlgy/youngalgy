import { Fragment, useEffect, useRef, useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Job, STATUS_CONFIG } from "@/lib/types";
import { MapPin, ExternalLink, ChevronDown, ChevronRight, Info, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { StatusSelect } from "./StatusSelect";
import { daysSince, hoursSince, formatRelativeDate } from "@/lib/dates";

const SCORE_TOOLTIP =
  "Score 10 = perfect fit (strategy + salary + role + remote). 9 = strong fit with one soft constraint. 8 = decent fit, worth applying. Lower scores = weaker alignment.";

// Strategy pivot — anything older than this with a "senior/sr/enterprise AE" title is pre-pivot.
const PIVOT_DATE = new Date("2026-04-18T00:00:00Z").getTime();
const PRE_PIVOT_RX = /\b(senior|sr\.?|enterprise ae)\b/i;

function isPrePivot(job: Job): boolean {
  return new Date(job.appliedDate).getTime() < PIVOT_DATE && PRE_PIVOT_RX.test(job.position);
}

function ScoreBadge({ score }: { score?: number | null }) {
  if (score == null) return <span className="text-muted-foreground">—</span>;
  const color =
    score >= 9 ? "bg-success text-success-foreground" :
    score >= 7 ? "bg-warning text-warning-foreground" :
    "bg-secondary text-secondary-foreground";
  return <Badge className={`${color} text-xs font-semibold`}>{score}</Badge>;
}

function DaysBadge({ date }: { date: string }) {
  const d = daysSince(date);
  const cls =
    d < 7 ? "bg-success text-success-foreground" :
    d <= 14 ? "bg-warning text-warning-foreground" :
    "bg-destructive text-destructive-foreground";
  return <Badge className={`${cls} text-xs font-semibold whitespace-nowrap`}>{formatRelativeDate(date)}</Badge>;
}

interface JobTableProps {
  jobs: Job[];
  onStatusChange?: (id: string, status: Job["status"]) => void;
  onNotesChange?: (id: string, notes: string) => void;
  onEdit?: (job: Job) => void;
  onClearFilters?: () => void;
}

export function JobTable({ jobs, onStatusChange, onNotesChange, onEdit, onClearFilters }: JobTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notesOpenId, setNotesOpenId] = useState<string | null>(null);

  // Hide Location column when every visible row is Remote. On-site rows keep it visible.
  const allRemote = useMemo(
    () => jobs.length > 0 && jobs.every((j) => /remote/i.test(j.location ?? "")),
    [jobs],
  );

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-lg font-medium text-foreground">No jobs found</p>
        <p className="text-sm text-muted-foreground">Try adjusting or clearing your filters.</p>
        {onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters} className="mt-2">
            Clear filters
          </Button>
        )}
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
              {!allRemote && <TableHead>Location</TableHead>}
              <TableHead>Salary</TableHead>
              <TableHead>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1 cursor-help">
                      Score <Info className="h-3 w-3 text-muted-foreground" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">{SCORE_TOOLTIP}</TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Days</TableHead>
              <TableHead className="min-w-[180px]">Notes</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => {
              const isExpanded = expandedId === job.id;
              const hasDetails = job.coverLetter || job.proposal;
              const tint = STATUS_CONFIG[job.status].rowTint;
              const fresh = hoursSince(job.appliedDate) < 4;
              const prePivot = isPrePivot(job);
              const remoteOnly = /remote/i.test(job.location ?? "");
              return (
                <Fragment key={job.id}>
                  <TableRow className={`group ${tint}`}>
                    <TableCell className="pr-0 cursor-pointer" onClick={() => hasDetails && toggle(job.id)}>
                      {hasDetails && (isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />)}
                    </TableCell>
                    <TableCell className="font-medium">
                      <span className="inline-flex items-center gap-2">
                        {fresh && (
                          <span
                            className="inline-block h-2 w-2 rounded-full bg-success animate-pulse"
                            title="New this session"
                          />
                        )}
                        {job.company}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span>{job.position}</span>
                        {allRemote ? null : remoteOnly ? (
                          <Badge variant="secondary" className="text-[10px] w-fit">Remote</Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    {!allRemote && (
                      <TableCell>
                        <span className="flex items-center gap-1 text-muted-foreground text-sm">
                          <MapPin className="h-3 w-3" /> {job.location}
                        </span>
                      </TableCell>
                    )}
                    <TableCell className="text-sm text-muted-foreground">{job.salary || "—"}</TableCell>
                    <TableCell><ScoreBadge score={job.score} /></TableCell>
                    <TableCell>
                      <StatusSelect
                        id={job.id}
                        value={job.status}
                        onChanged={(s) => onStatusChange?.(job.id, s)}
                        label={`Status for ${job.position} at ${job.company}`}
                      />
                    </TableCell>
                    <TableCell><DaysBadge date={job.appliedDate} /></TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {prePivot && (
                          <Badge variant="secondary" className="text-[10px] w-fit bg-muted text-muted-foreground">
                            Pre-pivot
                          </Badge>
                        )}
                        <NotesCell
                          job={job}
                          open={notesOpenId === job.id}
                          onOpen={() => setNotesOpenId(job.id)}
                          onClose={() => setNotesOpenId(null)}
                          onSaved={(v) => onNotesChange?.(job.id, v)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {job.url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => { if (/^https?:\/\//i.test(job.url ?? "")) window.open(job.url, "_blank", "noopener,noreferrer"); }}
                            aria-label="Open job posting"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onEdit(job)}
                            aria-label="Edit job"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  {isExpanded && hasDetails && (
                    <TableRow key={`${job.id}-detail`}>
                      <TableCell colSpan={allRemote ? 9 : 10} className="bg-muted/30 p-4">
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
                </Fragment>
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
          const tint = STATUS_CONFIG[job.status].rowTint;
          const fresh = hoursSince(job.appliedDate) < 4;
          const prePivot = isPrePivot(job);
          const remoteOnly = /remote/i.test(job.location ?? "");
          return (
            <div key={job.id} className={`bg-card border rounded-lg p-4 space-y-2 ${tint}`}>
              <div className="flex items-start justify-between" onClick={() => hasDetails && toggle(job.id)}>
                <div className="min-w-0">
                  <p className="font-semibold flex items-center gap-2">
                    {fresh && <span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse" />}
                    {job.company}
                  </p>
                  <p className="text-sm text-muted-foreground">{job.position}</p>
                </div>
                <ScoreBadge score={job.score} />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                {!allRemote && (
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                )}
                {allRemote && remoteOnly && <span />}
                <span>{job.salary || "—"}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <DaysBadge date={job.appliedDate} />
                {prePivot && <Badge variant="secondary" className="text-[10px] bg-muted text-muted-foreground">Pre-pivot</Badge>}
              </div>
              <StatusSelect id={job.id} value={job.status} onChanged={(s) => onStatusChange?.(job.id, s)} label={`Status for ${job.position} at ${job.company}`} />
              <NotesCell
                job={job}
                open={notesOpenId === job.id}
                onOpen={() => setNotesOpenId(job.id)}
                onClose={() => setNotesOpenId(null)}
                onSaved={(v) => onNotesChange?.(job.id, v)}
              />
              <div className="flex items-center justify-end gap-1.5">
                {job.url && (
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { if (/^https?:\/\//i.test(job.url ?? "")) window.open(job.url, "_blank", "noopener,noreferrer"); }} aria-label="Open job posting">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                )}
                {onEdit && (
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(job)} aria-label="Edit job">
                    <Pencil className="h-3.5 w-3.5" />
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

function NotesCell({
  job,
  open,
  onOpen,
  onClose,
  onSaved,
}: {
  job: Job;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSaved: (v: string) => void;
}) {
  const [value, setValue] = useState(job.notes ?? "");
  const original = useRef(job.notes ?? "");

  useEffect(() => {
    setValue(job.notes ?? "");
    original.current = job.notes ?? "";
  }, [job.notes]);

  async function commit() {
    const trimmed = value;
    if (trimmed === original.current) { onClose(); return; }
    const { error } = await supabase
      .from("opportunities")
      .update({ notes: trimmed || null })
      .eq("id", job.id);
    if (error) {
      toast.error("Failed to save notes");
      setValue(original.current);
    } else {
      original.current = trimmed;
      onSaved(trimmed);
      toast.success("Notes saved");
    }
    onClose();
  }

  if (!open) {
    const preview = (job.notes ?? "").slice(0, 80);
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Notes for ${job.company} — click to edit`}
        className="text-left text-xs text-muted-foreground hover:text-foreground w-full min-h-[24px] truncate"
      >
        {preview ? preview + ((job.notes ?? "").length > 80 ? "…" : "") : <span className="italic">Add note…</span>}
      </button>
    );
  }

  return (
    <Textarea
      autoFocus
      aria-label={`Notes for ${job.company}`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === "Escape") { setValue(original.current); onClose(); } }}
      rows={3}
      className="text-xs min-h-[60px]"
      placeholder="Notes…"
    />
  );
}
