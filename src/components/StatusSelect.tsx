import { useState } from "react";
import { ALL_STATUSES, JobStatus, STATUS_CONFIG } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  id: string;
  value: JobStatus;
  onChanged?: (status: JobStatus) => void;
  /** Accessible label for the combobox — e.g. "Status for Acme Corp". */
  label?: string;
}

// Visible solid-color trigger per status. Kept here (not in types.ts) because it's a UI-only concern.
const TRIGGER_CLASS: Record<JobStatus, string> = {
  saved:        "bg-secondary text-secondary-foreground border-border",
  applied:      "bg-info/15 text-foreground border-info/40",
  phone_screen: "bg-screen/15 text-foreground border-screen/50",
  interview:    "bg-stage/15 text-foreground border-stage/50",
  offer:        "bg-success/20 text-foreground border-success/50",
  rejected:     "bg-destructive/15 text-foreground border-destructive/50",
  ghosted:      "bg-muted/60 text-muted-foreground border-muted-foreground/30",
  withdrew:     "bg-warning/15 text-foreground border-warning/50",
};

export function StatusSelect({ id, value, onChanged, label }: Props) {
  const [pending, setPending] = useState(false);
  const [current, setCurrent] = useState<JobStatus>(value);

  async function handleChange(next: string) {
    const status = next as JobStatus;
    if (status === current) return;
    const prev = current;
    setCurrent(status);
    setPending(true);
    onChanged?.(status);
    const { error } = await supabase
      .from("opportunities")
      .update({ status })
      .eq("id", id);
    setPending(false);
    if (error) {
      setCurrent(prev);
      onChanged?.(prev);
      toast.error("Failed to update status");
    } else {
      toast.success(`Status → ${STATUS_CONFIG[status].label}`);
    }
  }

  return (
    <Select value={current} onValueChange={handleChange} disabled={pending}>
      <SelectTrigger
        className={`h-8 text-xs w-[140px] border-2 font-medium ${TRIGGER_CLASS[current]}`}
        aria-label={label ?? "Change status"}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ALL_STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="text-xs">
            <span className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${STATUS_CONFIG[s].className}`} />
              {STATUS_CONFIG[s].label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
