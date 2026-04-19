import { useEffect, useState } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Job, JobStatus, ALL_STATUSES, STATUS_CONFIG } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const SOURCES = ["linkedin", "indeed", "upwork", "other"];

interface Draft {
  company: string;
  title: string;
  salary_low: string;
  salary_text: string;
  source: string;
  status: JobStatus;
  notes: string;
  url: string;
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
    const update = {
      company: draft.company.trim(),
      title: draft.title.trim(),
      salary_low: Number.isFinite(salaryNum) ? salaryNum : null,
      source: draft.source || null,
      status: draft.status,
      notes: draft.notes.trim() || null,
      url: draft.url.trim() || null,
    };
    const { error } = await supabase.from("opportunities").update(update).eq("id", job.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to save");
      return;
    }
    onSaved(job.id, {
      company: update.company,
      position: update.title,
      salaryRaw: update.salary_low,
      salary: salaryNum != null ? `$${salaryNum.toLocaleString()}` : undefined,
      source: update.source,
      status: update.status,
      notes: update.notes ?? undefined,
      url: update.url ?? undefined,
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
