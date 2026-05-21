import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Crosshair, ExternalLink } from "lucide-react";
import { Job } from "@/lib/types";
import { LANE_COLOR } from "@/lib/lane";
import { daysSince } from "@/lib/dates";
import { displayCompany } from "@/lib/company";

interface Props {
  jobs: Job[];
  onEdit?: (job: Job) => void;
  /** Score threshold for "best shot" (inclusive). Default 7. */
  scoreFloor?: number;
  /** How many to show. Default 5. */
  limit?: number;
}

/**
 * Surfaces the highest-score apps that are still awaiting a reply.
 * These are Algy's best 2026 bets — Anchorage Digital (score 9), etc.
 * Without this they're buried in the kanban; with this they're front-of-mind.
 *
 * "Awaiting" = status='applied' AND no first_reply_at logged.
 */
export function BestShots({ jobs, onEdit, scoreFloor = 7, limit = 5 }: Props) {
  const picks = useMemo(() => {
    return jobs
      .filter((j) =>
        (j.score ?? 0) >= scoreFloor &&
        j.status === "applied" &&
        !j.firstReplyAt,
      )
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, limit);
  }, [jobs, scoreFloor, limit]);

  return (
    <Card className="border shadow-sm">
      <div className="flex items-center gap-2 p-4 border-b">
        <Crosshair className="h-4 w-4 text-success" />
        <h2 className="text-sm font-semibold">Best Shots</h2>
        <span className="text-xs text-muted-foreground">awaiting reply · score ≥ {scoreFloor}</span>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">{picks.length}</span>
      </div>
      <div className="p-3">
        {picks.length === 0 ? (
          <p className="text-xs text-muted-foreground p-2">
            No high-score apps in flight. Time to fire one.
          </p>
        ) : (
          <ul className="divide-y">
            {picks.map((j) => {
              const laneColor = LANE_COLOR[j.lane];
              const days = daysSince(j.appliedDate);
              return (
                <li
                  key={j.id}
                  className="flex items-center gap-3 py-2 px-1 text-sm hover:bg-accent/30 rounded transition-colors"
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full shrink-0 ${laneColor.dot}`}
                    aria-hidden
                    title={j.lane}
                  />
                  <button
                    type="button"
                    onClick={() => onEdit?.(j)}
                    className="flex-1 min-w-0 text-left"
                    aria-label={`Open ${displayCompany(j.company)} — ${j.position}`}
                  >
                    <span className="block font-medium truncate">{displayCompany(j.company)}</span>
                    <span className="block text-xs text-muted-foreground truncate">{j.position}</span>
                  </button>
                  <span
                    className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${laneColor.chip}`}
                    aria-label={`Lane ${j.lane}`}
                  >
                    {j.lane}
                  </span>
                  <span className="text-xs font-semibold tabular-nums shrink-0 w-6 text-right">
                    {j.score ?? "—"}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0 w-12 text-right">
                    {days}d out
                  </span>
                  {j.url && (
                    <a
                      href={j.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground shrink-0"
                      aria-label="Open job posting"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}
