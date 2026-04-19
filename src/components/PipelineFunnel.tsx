import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { logError } from "@/lib/log";
import { Filter } from "lucide-react";

interface Stage {
  key: string;
  label: string;
  count: number;
  /** Tailwind bg color class for the bar fill. */
  fill: string;
}

interface Props {
  onStageClick?: (status: string | null) => void;
  activeStage?: string | null;
}

const BASE: Omit<Stage, "count">[] = [
  { key: "applied",      label: "Submitted",    fill: "bg-blue-500" },
  { key: "phone_screen", label: "Phone Screen", fill: "bg-cyan-500" },
  { key: "interview",    label: "Interview",    fill: "bg-purple-500" },
  { key: "offer",        label: "Offer",        fill: "bg-green-500" },
  { key: "hired",        label: "Hired",        fill: "bg-emerald-600" },
];

export function PipelineFunnel({ onStageClick, activeStage }: Props) {
  const [stages, setStages] = useState<Stage[]>(BASE.map((s) => ({ ...s, count: 0 })));

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

      if (submittedRes.error || phoneRes.error || oppIntRes.error || intTblRes.error || offerRes.error || hiredRes.error) {
        logError("pipeline funnel");
      }

      setStages([
        { ...BASE[0], count: submittedRes.count ?? 0 },
        { ...BASE[1], count: phoneRes.count ?? 0 },
        { ...BASE[2], count: Math.max(oppIntRes.count ?? 0, intTblRes.count ?? 0) },
        { ...BASE[3], count: offerRes.count ?? 0 },
        { ...BASE[4], count: hiredRes.count ?? 0 },
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

      {/* Vertical stack of horizontal tapering bars (mobile + desktop, reads as a funnel). */}
      <div className="space-y-1.5">
        {stages.map((stage, idx) => {
          // Width tapers down each stage proportionally to its count vs the top stage.
          const pct = Math.max((stage.count / max) * 100, 6);
          const isActive = activeStage === stage.key;
          return (
            <button
              key={stage.key}
              onClick={() => onStageClick?.(isActive ? null : stage.key)}
              className="w-full flex items-center gap-3 group"
              title={`Filter to ${stage.label}`}
            >
              <span className="w-24 sm:w-28 text-xs text-muted-foreground text-right shrink-0">
                {stage.label}
              </span>
              <div className="flex-1 flex items-center justify-center">
                <div
                  className={`${stage.fill} h-7 sm:h-8 rounded transition-all flex items-center justify-end px-3 text-xs font-semibold text-white ${
                    isActive ? "ring-2 ring-foreground" : "group-hover:opacity-90"
                  }`}
                  style={{ width: `${pct}%` }}
                >
                  {stage.count > 0 && stage.count}
                </div>
              </div>
              <span className="w-8 text-xs font-semibold tabular-nums text-right shrink-0">
                {stage.count}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
