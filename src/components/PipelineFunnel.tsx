import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { Job } from "@/lib/types";

interface Stage {
  key: string;
  label: string;
  count: number;
  /** Tailwind bg color class for the bar fill. */
  fill: string;
}

interface Props {
  /** Already-fetched jobs from Index.tsx — derive everything client-side. */
  jobs: Job[];
  /** Interview-table row count, fetched alongside jobs. */
  interviewCount: number;
  onStageClick?: (status: string | null) => void;
  activeStage?: string | null;
}

const BASE: Omit<Stage, "count">[] = [
  { key: "applied",      label: "Submitted",    fill: "bg-info" },
  { key: "phone_screen", label: "Phone Screen", fill: "bg-screen" },
  { key: "interview",    label: "Interview",    fill: "bg-stage" },
  { key: "offer",        label: "Offer",        fill: "bg-success" },
  { key: "hired",        label: "Hired",        fill: "bg-success" },
];

/**
 * Stage counts are derived from the jobs prop instead of firing 6 round-trip
 * count queries. Part of the 2026-04-27 disk-IO cleanup.
 */
export function PipelineFunnel({ jobs, interviewCount, onStageClick, activeStage }: Props) {
  const stages: Stage[] = useMemo(() => {
    let submitted = 0;
    let phoneScreen = 0;
    let interview = 0;
    let offer = 0;
    const hired = 0;

    for (const j of jobs) {
      submitted += 1; // total ever submitted == count in opportunities table (manual)
      switch (j.status) {
        case "phone_screen": phoneScreen += 1; break;
        case "interview":    interview += 1; break;
        case "offer":        offer += 1; break;
      }
      // hired isn't in the JobStatus union as a distinct value; left at 0
      // unless we add it. Keeping the bar so the funnel shape is stable.
    }

    return [
      { ...BASE[0], count: submitted },
      { ...BASE[1], count: phoneScreen },
      // Interview count = max of opportunity-status==interview vs separate
      // interviews-table row count (whichever is larger captures both
      // pre-interview-scheduled and actually-scheduled).
      { ...BASE[2], count: Math.max(interview, interviewCount) },
      { ...BASE[3], count: offer },
      { ...BASE[4], count: hired },
    ];
  }, [jobs, interviewCount]);

  const max = Math.max(...stages.map((s) => s.count), 1);

  return (
    <Card className="border shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Pipeline Funnel</h2>
        {activeStage && (
          <button
            type="button"
            onClick={() => onStageClick?.(null)}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground underline"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Vertical stack of horizontal tapering bars (mobile + desktop, reads as a funnel). */}
      <div className="space-y-1.5">
        {stages.map((stage) => {
          // Width tapers down each stage proportionally to its count vs the top stage.
          const pct = Math.max((stage.count / max) * 100, 6);
          const isActive = activeStage === stage.key;
          return (
            <button
              key={stage.key}
              type="button"
              aria-pressed={isActive}
              aria-label={`Filter to ${stage.label} (${stage.count})`}
              onClick={() => onStageClick?.(isActive ? null : stage.key)}
              className="w-full flex items-center gap-3 group"
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
