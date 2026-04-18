import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Filter } from "lucide-react";

interface Stage {
  key: string;
  label: string;
  count: number;
  color: string;
}

interface Props {
  onStageClick?: (status: string | null) => void;
  activeStage?: string | null;
}

export function PipelineFunnel({ onStageClick, activeStage }: Props) {
  const [stages, setStages] = useState<Stage[]>([
    { key: "applied",      label: "Submitted",    count: 0, color: "bg-info" },
    { key: "phone_screen", label: "Phone Screen", count: 0, color: "bg-blue-500" },
    { key: "interview",    label: "Interview",    count: 0, color: "bg-purple-500" },
    { key: "offer",        label: "Offer",        count: 0, color: "bg-success" },
    { key: "hired",        label: "Hired",        count: 0, color: "bg-emerald-600" },
  ]);

  useEffect(() => {
    async function load() {
      const [submittedRes, phoneRes, oppIntRes, intTblRes, offerRes, hiredRes] = await Promise.all([
        supabase.from("opportunities").select("id", { count: "exact", head: true }).eq("bot_type", "manual"),
        supabase.from("opportunities").select("id", { count: "exact", head: true }).eq("bot_type", "manual").eq("status", "phone_screen"),
        supabase.from("opportunities").select("id", { count: "exact", head: true }).eq("bot_type", "manual").eq("status", "interview"),
        supabase.from("interviews").select("id", { count: "exact", head: true }),
        supabase.from("opportunities").select("id", { count: "exact", head: true }).eq("bot_type", "manual").eq("status", "offer"),
        supabase.from("opportunities").select("id", { count: "exact", head: true }).eq("bot_type", "manual").eq("status", "hired"),
      ]);

      setStages([
        { key: "applied",      label: "Submitted",    count: submittedRes.count ?? 0, color: "bg-info" },
        { key: "phone_screen", label: "Phone Screen", count: phoneRes.count ?? 0,     color: "bg-blue-500" },
        { key: "interview",    label: "Interview",    count: Math.max(oppIntRes.count ?? 0, intTblRes.count ?? 0), color: "bg-purple-500" },
        { key: "offer",        label: "Offer",        count: offerRes.count ?? 0,     color: "bg-success" },
        { key: "hired",        label: "Hired",        count: hiredRes.count ?? 0,     color: "bg-emerald-600" },
      ]);
    }
    load();
  }, []);

  const max = Math.max(...stages.map((s) => s.count), 1);

  return (
    <Card className="border shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Pipeline Funnel</h2>
        {activeStage && (
          <button
            onClick={() => onStageClick?.(null)}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground underline"
          >
            Clear filter
          </button>
        )}
      </div>
      <div className="flex items-end gap-2 h-32">
        {stages.map((stage) => {
          const heightPct = (stage.count / max) * 100;
          const widthPct = 100 - (stages.indexOf(stage) * 10);
          const isActive = activeStage === stage.key;
          return (
            <button
              key={stage.key}
              onClick={() => onStageClick?.(isActive ? null : stage.key)}
              className="flex-1 flex flex-col items-center gap-1 group"
              title={`Filter to ${stage.label}`}
            >
              <span className="text-xs font-semibold">{stage.count}</span>
              <div
                className={`${stage.color} rounded-t transition-all ${isActive ? "ring-2 ring-foreground" : "group-hover:opacity-80"}`}
                style={{ height: `${Math.max(heightPct, 8)}%`, width: `${widthPct}%` }}
              />
              <span className="text-[10px] text-muted-foreground text-center">{stage.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
