import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { logError } from "@/lib/log";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface Interview {
  id: string;
  company: string;
  role: string;
  scheduled_at: string | null;
  prep_notes: string | null;
  status: string;
  created_at: string;
}

type Draft = Omit<Interview, "id" | "created_at">;

const blankDraft = (): Draft => ({
  company: "",
  role: "",
  scheduled_at: null,
  prep_notes: "",
  status: "scheduled",
});

function toLocalInput(v: string | null) {
  if (!v) return "";
  const d = new Date(v);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function InterviewScheduler() {
  const [rows, setRows] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(blankDraft());
  const [adding, setAdding] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      logError("load interviews");
    } else {
      setRows((data as Interview[]) || []);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startEdit(row: Interview) {
    setEditingId(row.id);
    setAdding(false);
    setDraft({
      company: row.company,
      role: row.role,
      scheduled_at: row.scheduled_at,
      prep_notes: row.prep_notes,
      status: row.status,
    });
  }

  function cancel() {
    setEditingId(null);
    setAdding(false);
    setDraft(blankDraft());
  }

  async function save() {
    if (!draft.company.trim() || !draft.role.trim()) {
      toast.error("Company and role required");
      return;
    }
    if (adding) {
      const { data, error } = await supabase
        .from("interviews")
        .insert(draft)
        .select()
        .single();
      if (error) { toast.error("Failed to add"); return; }
      setRows((p) => [data as Interview, ...p]);
      toast.success("Interview added");
    } else if (editingId) {
      const { error } = await supabase
        .from("interviews")
        .update(draft)
        .eq("id", editingId);
      if (error) { toast.error("Failed to save"); return; }
      setRows((p) => p.map((r) => r.id === editingId ? { ...r, ...draft } : r));
      toast.success("Saved");
    }
    cancel();
  }

  async function remove(id: string) {
    const prev = rows;
    setRows((p) => p.filter((r) => r.id !== id));
    const { error } = await supabase.from("interviews").delete().eq("id", id);
    if (error) {
      setRows(prev);
      toast.error("Failed to delete");
    } else {
      toast.success("Deleted");
    }
  }

  return (
    <Card className="border shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Interview Scheduler</h2>
          <Badge variant="secondary" className="text-xs">{rows.length}</Badge>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1"
          onClick={() => { setAdding(true); setEditingId(null); setDraft(blankDraft()); }}
          disabled={adding}
        >
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      <div className="p-4 space-y-2">
        {adding && (
          <DraftRow draft={draft} setDraft={setDraft} onSave={save} onCancel={cancel} />
        )}

        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

        {!loading && rows.length === 0 && !adding && (
          <p className="text-sm text-muted-foreground">No interviews yet.</p>
        )}

        {rows.map((row) => editingId === row.id ? (
          <DraftRow key={row.id} draft={draft} setDraft={setDraft} onSave={save} onCancel={cancel} />
        ) : (
          <div key={row.id} className="grid grid-cols-1 md:grid-cols-[1.2fr_1.2fr_1fr_2fr_auto] gap-2 items-start p-3 rounded-md border bg-card hover:bg-muted/30 transition-colors">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Company</p>
              <p className="font-medium text-sm">{row.company}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Role</p>
              <p className="text-sm">{row.role}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">When</p>
              <p className="text-sm">{row.scheduled_at ? new Date(row.scheduled_at).toLocaleString() : "TBD"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Prep notes</p>
              <p className="text-sm text-muted-foreground">{row.prep_notes || "—"}</p>
            </div>
            <div className="flex gap-1 justify-end">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(row)} aria-label={`Edit interview at ${row.company}`}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => remove(row.id)} aria-label={`Delete interview at ${row.company}`}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DraftRow({ draft, setDraft, onSave, onCancel }: {
  draft: Draft;
  setDraft: (d: Draft) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.2fr_1fr_2fr_auto] gap-2 items-start p-3 rounded-md border-2 border-primary/40 bg-muted/20">
      <Input
        aria-label="Company name"
        placeholder="Company"
        value={draft.company}
        onChange={(e) => setDraft({ ...draft, company: e.target.value })}
        className="h-8 text-sm"
      />
      <Input
        aria-label="Role / position"
        placeholder="Role"
        value={draft.role}
        onChange={(e) => setDraft({ ...draft, role: e.target.value })}
        className="h-8 text-sm"
      />
      <Input
        type="datetime-local"
        aria-label="Scheduled date and time"
        value={toLocalInput(draft.scheduled_at)}
        onChange={(e) => setDraft({ ...draft, scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
        className="h-8 text-sm"
      />
      <Textarea
        aria-label="Prep notes"
        placeholder="Prep notes"
        value={draft.prep_notes ?? ""}
        onChange={(e) => setDraft({ ...draft, prep_notes: e.target.value })}
        className="min-h-[32px] text-sm"
        rows={2}
      />
      <div className="flex gap-1 justify-end">
        <Button size="icon" variant="default" className="h-7 w-7" onClick={onSave} aria-label="Save interview">
          <Save className="h-3.5 w-3.5" />
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onCancel} aria-label="Cancel">
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
