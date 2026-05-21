import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { Job } from "@/lib/types";
import { ALL_LANES, LANE_COLOR, type Lane } from "@/lib/lane";

interface Props {
  jobs: Job[];
}

interface Row {
  lane: Lane;
  total: number;
  awaiting: number;
  replied: number;
  positive: number; // phone_screen / interview / offer
  rejected: number;
  /** Reply rate = replied / total. 0 when no apps. */
  replyPct: number;
  /** Positive rate = (phone_screen+interview+offer) / total. */
  positivePct: number;
}

/**
 * Per-lane breakdown showing where Algy is spending apply effort and which
 * lanes actually generate responses. Surfacing this makes the overclaim trap
 * visible — e.g. "RECRUITING: 60 apps, 4% replied, 0% positive" tells the
 * story that fired the 2026-05-16 strategic reframe.
 *
 * Lanes with zero apps are hidden so the table stays compact.
 */
export function LaneBreakdown({ jobs }: Props) {
  const rows = useMemo<Row[]>(() => {
    const acc: Record<Lane, Row> = {} as Record<Lane, Row>;
    for (const lane of ALL_LANES) {
      acc[lane] = { lane, total: 0, awaiting: 0, replied: 0, positive: 0, rejected: 0, replyPct: 0, positivePct: 0 };
    }
    for (const j of jobs) {
      const r = acc[j.lane];
      r.total += 1;
      if (j.status === "applied" && !j.firstReplyAt) r.awaiting += 1;
      if (j.firstReplyAt) r.replied += 1;
      if (j.status === "phone_screen" || j.status === "interview" || j.status === "offer") r.positive += 1;
      if (j.status === "rejected") r.rejected += 1;
    }
    return ALL_LANES
      .map((lane) => {
        const r = acc[lane];
        r.replyPct = r.total > 0 ? (r.replied / r.total) * 100 : 0;
        r.positivePct = r.total > 0 ? (r.positive / r.total) * 100 : 0;
        return r;
      })
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [jobs]);

  return (
    <Card className="border shadow-sm">
      <div className="flex items-center gap-2 p-4 border-b">
        <Layers className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">By Lane</h2>
        <span className="text-xs text-muted-foreground">where the apps go vs where the replies come from</span>
      </div>
      <div className="overflow-x-auto">
        {rows.length === 0 ? (
          <p className="text-xs text-muted-foreground p-4">No data yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b">
                <th className="text-left font-medium px-4 py-2">Lane</th>
                <th className="text-right font-medium px-2 py-2">Total</th>
                <th className="text-right font-medium px-2 py-2">Awaiting</th>
                <th className="text-right font-medium px-2 py-2">Replied</th>
                <th className="text-right font-medium px-2 py-2">Reply %</th>
                <th className="text-right font-medium px-2 py-2">Positive %</th>
                <th className="text-right font-medium px-4 py-2">Rejected</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const color = LANE_COLOR[r.lane];
                // Reply rate good if >10%, positive rate good if >2%.
                const replyClass = r.replyPct > 10 ? "text-success" : r.replyPct > 5 ? "text-info" : "text-muted-foreground";
                const positiveClass = r.positivePct > 2 ? "text-success" : "text-muted-foreground";
                return (
                  <tr key={r.lane} className="border-b last:border-b-0 hover:bg-accent/20">
                    <td className="px-4 py-2">
                      <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${color.chip}`}>
                        {r.lane}
                      </span>
                    </td>
                    <td className="text-right tabular-nums px-2 py-2 font-medium">{r.total}</td>
                    <td className="text-right tabular-nums px-2 py-2 text-muted-foreground">{r.awaiting}</td>
                    <td className="text-right tabular-nums px-2 py-2 text-muted-foreground">{r.replied}</td>
                    <td className={`text-right tabular-nums px-2 py-2 font-medium ${replyClass}`}>
                      {r.replyPct.toFixed(1)}%
                    </td>
                    <td className={`text-right tabular-nums px-2 py-2 font-medium ${positiveClass}`}>
                      {r.positivePct.toFixed(1)}%
                    </td>
                    <td className="text-right tabular-nums px-4 py-2 text-muted-foreground">{r.rejected}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
