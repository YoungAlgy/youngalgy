import { useEffect, useState } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Job, JobStatus, ALL_STATUSES, STATUS_CONFIG, ReplyKind } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const SOURCES = ["linkedin", "indeed", "upwork", "other"];

const REPLY_KIND_OPTIONS: { value: ReplyKind | "none"; label: string }[] = [
  { value: "none",       label: "— none / not yet —" },
  { value: "rejection",  label: "Rejection" },
  { value: "screen",     label: "Phone / recruiter screen" },
  { value: "interview",  label: "Interview" },
  { value: "question",   label: "Question / follow-up" },
  { value: "offer",      label: "Offer" },
  { value: "other",      label: "Other" },
];

interface Draft {
  company: string;
  title: string;
  salary_low: string;
  salary_text: string;
  source: string;
  status: JobStatus;
  notes: string;
  url: string;
  // Reply tracking — see supabase/migrations/20260427_reply_tracking.sql.
  // Stored as datetime-local string ("YYYY-MM-DDTHH:mm") for the input;
  // converted to ISO at save time.
  first_reply_at: string;
  reply_kind: ReplyKind | "none";
}

/** Convert ISO timestamptz to the local-time format datetime-local needs. */
function isoToLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  // datetime-local wants YYYY-MM-DDTHH:mm in *local* time
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function jobToDraft(job: Job): Draft {
  return {
    company: job.company,
    title: job.position,
    salary_low: job.salaryRaw != null ? String(job.salaryRaw) : "",
    salary_text: job.salary ?? "",
    source: job.source ?? "other",
    status: job.status,
    notes: job.notes ?? "",
    url: job.url ?? "",
    first_reply_at: isoToLocalInput(job.firstReplyAt),
    reply_kind: job.replyKind ?? "none",
  };
}

interface Props {
  job: Job | null;
  onClose: () => void;
  onSaved: (id: string, patch: Partial<Job>) => void;
}

export function EditJobDrawer({ job, onClose, onSaved }: Props) {
  const open = job !== null;
  const [draft, setDraft] = useState<Draft | null>(job ? jobToDraft(job) : null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(job ? jobToDraft(job) : null);
  }, [job]);

  if (!draft) return null;

  async function handleSave() {
    if (!job || !draft) return;
    if (!draft.company.trim() || !draft.title.trim()) {
      toast.error("Company and title required");
      return;
    }
    setSaving(true);
    const salaryNum = draft.salary_low ? Number(draft.salary_low) : null;

    // Convert datetime-local back to ISO. Empty input = clear the field.
    const replyIso = draft.first_reply_at ? new Date(draft.first_reply_at).toISOString() : null;
    const replyKind: ReplyKind | null = draft.reply_kind === "none" ? null : draft.reply_kind;

    const baseUpdate = {
      company: draft.company.trim(),
      title: draft.title.trim(),
      salary_low: Number.isFinite(salaryNum) ? salaryNum : null,
      source: draft.source || null,
      status: draft.status,
      notes: draft.notes.trim() || null,
      url: draft.url.trim() || null,
    };
    const fullUpdate = {
      ...baseUpdate,
      first_reply_at: replyIso,
      reply_kind: replyKind,
    };

    let { error } = await supabase.from("opportunities").update(fullUpdate).eq("id", job.id);

    // Graceful fallback: if reply_kind / first_reply_at columns don't
    // exist yet (PostgREST 42703 — migration not applied), retry without
    // them so the rest of the edit still saves. Toast warns the user.
    if (error && (error as { code?: string })?.code === "42703") {
      const retry = await supabase.from("opportunities").update(baseUpdate).eq("id", job.id);
      error = retry.error;
      if (!retry.error && (replyIso || replyKind)) {
        toast.warning(
          "Reply fields skipped — migration not yet applied. Run supabase/migrations/20260427_reply_tracking.sql to enable.",
        );
      }
    }

    setSaving(false);
    if (error) {
      toast.error("Failed to save");
      return;
    }
    onSaved(job.id, {
      company: fullUpdate.company,
      position: fullUpdate.title,
      salaryRaw: fullUpdate.salary_low,
      salary: salaryNum != null ? `$${salaryNum.toLocaleString()}` : undefined,
      source: fullUpdate.source,
      status: fullUpdate.status,
      notes: fullUpdate.notes ?? undefined,
      url: fullUpdate.url ?? undefined,
      firstReplyAt: replyIso,
      replyKind,
    });
    toast.success("Saved");
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit application</SheetTitle>
          <SheetDescription>Updates write to the opportunities table.</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="company">Company</Label>
            <Input id="company" value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="title">Title (role)</Label>
            <Input id="title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="salary_low">Salary low ($)</Label>
              <Input
                id="salary_low" type="number" inputMode="numeric"
                value={draft.salary_low}
                onChange={(e) => setDraft({ ...draft, salary_low: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="salary_text">Salary label</Label>
              <Input
                id="salary_text"
                value={draft.salary_text}
                onChange={(e) => setDraft({ ...draft, salary_text: e.target.value })}
                placeholder="$120K"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Source</Label>
              <Select value={draft.source} onValueChange={(v) => setDraft({ ...draft, source: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SOURCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v as JobStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="url">URL</Label>
            <Input id="url" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} placeholder="https://…" />
          </div>

          {/* Reply tracking — manual override of the auto-stamp trigger.
              If the migration isn't applied yet, save gracefully drops these. */}
          <div className="space-y-1.5 pt-1 border-t">
            <p className="text-xs font-semibold uppercase text-muted-foreground pt-3">Reply tracking</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="first_reply_at">First reply received</Label>
                <Input
                  id="first_reply_at"
                  type="datetime-local"
                  value={draft.first_reply_at}
                  onChange={(e) => setDraft({ ...draft, first_reply_at: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Reply kind</Label>
                <Select
                  value={draft.reply_kind}
                  onValueChange={(v) => setDraft({ ...draft, reply_kind: v as ReplyKind | "none" })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {REPLY_KIND_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Auto-filled when status moves off &ldquo;applied&rdquo; (except to ghosted). Manual override here.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={4} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
          </div>
        </div>

        <SheetFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
