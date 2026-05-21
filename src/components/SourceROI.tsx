import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Radar } from "lucide-react";
import { Job } from "@/lib/types";

interface Props {
  jobs: Job[];
  /** Hide sources that don't meet this minimum-volume bar so noise doesn't crowd signal. */
  minVolume?: number;
}

interface Row {
  source: string;
  total: number;
  replied: number;
  positive: number; // phone_screen / interview / offer
  replyPct: number;
  positivePct: number;
}

/**
 * Source ROI table — counts AND reply-rate per source.
 *
 * The existing SourcePieChart shows volume only ("Indeed Match = 80% of my
 * apps"), which is fine but doesn't answer "which source actually generates
 * signal?" This table answers it: total apps, replies, reply%, positive%.
 * Sorted by reply% so the highest-signal source bubbles to the top — your
 * apply effort should follow the signal, not the volume habit.
 */
export function SourceROI({ jobs, minVolume = 1 }: Props) {
  const rows = useMemo<Row[]>(() => {
    const acc: Record<string, Row> = {};
    for (const j of jobs) {
      const k = (j.source || "(none)").toLowerCase();
      if (!acc[k]) {
        acc[k] = { source: k, total: 0, replied: 0, positive: 0, replyPct: 0, positivePct: 0 };
      }
      acc[k].total += 1;
      if (j.firstReplyAt) acc[k].replied += 1;
      if (j.status === "phone_screen" || j.status === "interview" || j.status === "offer") {
        acc[k].positive += 1;
      }
    }
    return Object.values(acc)
      .filter((r) => r.total >= minVolume)
      .map((r) => ({
        ...r,
        replyPct: r.total > 0 ? (r.replied / r.total) * 100 : 0,
        positivePct: r.total > 0 ? (r.positive / r.total) * 100 : 0,
      }))
      // Reply rate first, then volume as tie-breaker.
      .sort((a, b) => {
        const diff = b.replyPct - a.replyPct;
        return diff !== 0 ? diff : b.total - a.total;
      });
  }, [jobs, minVolume]);

  return (
    <Card className="border shadow-sm">
      <div className="flex items-center gap-2 p-4 border-b">
        <Radar className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Source ROI</h2>
        <span className="text-xs text-muted-foreground">which sources actually reply</span>
      </div>
      <div className="overflow-x-auto">
        {rows.length === 0 ? (
          <p className="text-xs text-muted-foreground p-4">No data yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b">
                <th className="text-left font-medium px-4 py-2">Source</th>
                <th className="text-right font-medium px-2 py-2">Apps</th>
                <th className="text-right font-medium px-2 py-2">Replied</th>
                <th className="text-right font-medium px-2 py-2">Reply %</th>
                <th className="text-right font-medium px-4 py-2">Positive %</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const replyClass = r.replyPct > 15 ? "text-success" : r.replyPct > 5 ? "text-info" : "text-muted-foreground";
                const positiveClass = r.positivePct > 2 ? "text-success" : "text-muted-foreground";
                return (
                  <tr key={r.source} className="border-b last:border-b-0 hover:bg-accent/20">
                    <td className="px-4 py-2 font-medium truncate max-w-[14rem]">{r.source}</td>
                    <td className="text-right tabular-nums px-2 py-2">{r.total}</td>
                    <td className="text-right tabular-nums px-2 py-2 text-muted-foreground">{r.replied}</td>
                    <td className={`text-right tabular-nums px-2 py-2 font-medium ${replyClass}`}>
                      {r.replyPct.toFixed(1)}%
                    </td>
                    <td className={`text-right tabular-nums px-4 py-2 font-medium ${positiveClass}`}>
                      {r.positivePct.toFixed(1)}%
                    </td>
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
