import { useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Job, STATUS_CONFIG } from "@/lib/types";
import { MapPin, ExternalLink, ChevronDown, ChevronRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { StatusSelect } from "./StatusSelect";

const CONTACT_EMAIL = "alex@avahealth.co";

function ScoreBadge({ score }: { score?: number | null }) {
  if (score == null) return <span className="text-muted-foreground">—</span>;
  const color =
    score >= 9 ? "bg-success text-success-foreground" :
    score >= 7 ? "bg-warning text-warning-foreground" :
    "bg-secondary text-secondary-foreground";
  return <Badge className={`${color} text-xs font-semibold`}>{score}</Badge>;
}

function daysSince(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function DaysBadge({ date }: { date: string }) {
  const d = daysSince(date);
  const cls =
    d < 7 ? "bg-success text-success-foreground" :
    d <= 14 ? "bg-warning text-warning-foreground" :
    "bg-destructive text-destructive-foreground";
  return <Badge className={`${cls} text-xs font-semibold`}>{d}d</Badge>;
}

interface JobTableProps {
  jobs: Job[];
  onStatusChange?: (id: string, status: Job["status"]) => void;
  onNotesChange?: (id: string, notes: string) => void;
}

export function JobTable({ jobs, onStatusChange, onNotesChange }: JobTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notesOpenId, setNotesOpenId] = useState<string | null>(null);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      toast.success(`Copied ${CONTACT_EMAIL}`);
    } catch {
      toast.error("Couldn't copy");
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
              <TableHead>Days</TableHead>
              <TableHead className="min-w-[180px]">Notes</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => {
              const isExpanded = expandedId === job.id;
              const hasDetails = job.coverLetter || job.proposal;
              const tint = STATUS_CONFIG[job.status].rowTint;
              return (
                <>
                  <TableRow key={job.id} className={`group ${tint}`}>
                    <TableCell className="pr-0 cursor-pointer" onClick={() => hasDetails && toggle(job.id)}>
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
                    <TableCell>
                      <StatusSelect
                        id={job.id}
                        value={job.status}
                        onChanged={(s) => onStatusChange?.(job.id, s)}
                      />
                    </TableCell>
                    <TableCell><DaysBadge date={job.appliedDate} /></TableCell>
                    <TableCell>
                      <NotesCell
                        job={job}
                        open={notesOpenId === job.id}
                        onOpen={() => setNotesOpenId(job.id)}
                        onClose={() => setNotesOpenId(null)}
                        onSaved={(v) => onNotesChange?.(job.id, v)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {job.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() => window.open(job.url, "_blank")}
                          >
                            Apply <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title={`Copy ${CONTACT_EMAIL}`}
                          onClick={copyEmail}
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {isExpanded && hasDetails && (
                    <TableRow key={`${job.id}-detail`}>
                      <TableCell colSpan={10} className="bg-muted/30 p-4">
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
          const tint = STATUS_CONFIG[job.status].rowTint;
          return (
            <div key={job.id} className={`bg-card border rounded-lg p-4 space-y-2 ${tint}`}>
              <div className="flex items-start justify-between" onClick={() => hasDetails && toggle(job.id)}>
                <div>
                  <p className="font-semibold">{job.company}</p>
                  <p className="text-sm text-muted-foreground">{job.position}</p>
                </div>
                <ScoreBadge score={job.score} />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                <span>{job.salary || ""}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <DaysBadge date={job.appliedDate} />
                <span className="text-muted-foreground">{new Date(job.appliedDate).toLocaleDateString()}</span>
              </div>
              <StatusSelect id={job.id} value={job.status} onChanged={(s) => onStatusChange?.(job.id, s)} />
              <NotesCell
                job={job}
                open={notesOpenId === job.id}
                onOpen={() => setNotesOpenId(job.id)}
                onClose={() => setNotesOpenId(null)}
                onSaved={(v) => onNotesChange?.(job.id, v)}
              />
              <div className="flex items-center justify-end gap-1.5">
                {job.url && (
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => window.open(job.url, "_blank")}>
                    Apply <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyEmail}>
                  <Mail className="h-3.5 w-3.5" />
                </Button>
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
        className="text-left text-xs text-muted-foreground hover:text-foreground w-full min-h-[24px] truncate"
      >
        {preview ? preview + ((job.notes ?? "").length > 80 ? "…" : "") : <span className="italic">Add note…</span>}
      </button>
    );
  }

  return (
    <Textarea
      autoFocus
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
