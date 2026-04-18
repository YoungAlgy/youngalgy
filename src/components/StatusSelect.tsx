import { useState } from "react";
import { ALL_STATUSES, JobStatus, STATUS_CONFIG } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  id: string;
  value: JobStatus;
  onChanged?: (status: JobStatus) => void;
}

export function StatusSelect({ id, value, onChanged }: Props) {
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
      <SelectTrigger className={`h-8 text-xs w-[140px] border-2 ${STATUS_CONFIG[current].rowTint}`}>
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
