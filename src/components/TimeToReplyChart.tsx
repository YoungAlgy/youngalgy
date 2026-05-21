import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Clock } from "lucide-react";
import { Job } from "@/lib/types";

const DAY_MS = 24 * 60 * 60 * 1000;

interface Props {
  jobs: Job[];
}

interface Bucket {
  range: string;
  count: number;
  /** Tailwind/HSL color signal for the bar. */
  color: string;
  /** Long-form description for tooltip. */
  description: string;
}

/**
 * Distribution of time-from-submission-to-first-reply.
 *
 * Buckets:
 *   0–3d   → mostly algorithmic auto-filter (destructive red)
 *   4–7d   → quick human review (info blue)
 *   8–14d  → slow human review (warning amber)
 *   15+d   → late-arriving response or backfill artifact (muted)
 *
 * Diagnoses the funnel: a tall 0-3d bar means most rejections are auto-bin
 * filters firing on years-in-role gates. A tall 4-7d bar means real humans
 * are reading the apps. Use this to know whether to keep firing the current
 * lane or pivot.
 *
 * Ignores apps that never got a reply (those live in the awaiting tile + the
 * stale-sweep card). Only counts rows with first_reply_at set.
 */
export function TimeToReplyChart({ jobs }: Props) {
  const buckets = useMemo<Bucket[]>(() => {
    const counts = { auto: 0, quickHuman: 0, slowHuman: 0, late: 0 };
    for (const j of jobs) {
      if (!j.firstReplyAt) continue;
      const submittedMs = new Date(j.appliedDate).getTime();
      const repliedMs = new Date(j.firstReplyAt).getTime();
      const days = Math.max(0, Math.round((repliedMs - submittedMs) / DAY_MS));
      if (days <= 3) counts.auto += 1;
      else if (days <= 7) counts.quickHuman += 1;
      else if (days <= 14) counts.slowHuman += 1;
      else counts.late += 1;
    }
    return [
      { range: "0–3d",  count: counts.auto,       color: "hsl(0 72% 51%)",   description: "Mostly algorithmic auto-filter — years-in-role / location gates firing in under a workday." },
      { range: "4–7d",  count: counts.quickHuman, color: "hsl(217 91% 50%)", description: "Quick human review — a real recruiter read the app." },
      { range: "8–14d", count: counts.slowHuman,  color: "hsl(38 92% 50%)",  description: "Slow human review — late but real." },
      { range: "15d+",  count: counts.late,       color: "hsl(220 9% 46%)",  description: "Late reply or backfill artifact (rows stamped at created_at by the 2026-04-27 migration land at 0d, not here)." },
    ];
  }, [jobs]);

  const total = buckets.reduce((sum, b) => sum + b.count, 0);

  return (
    <Card className="border shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Time to First Reply</h2>
        <span className="text-xs text-muted-foreground">distribution across {total} replies</span>
      </div>
      <div className="h-[200px] w-full">
        {total === 0 ? (
          <p className="text-sm text-muted-foreground text-center pt-12">No replies yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={buckets} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
              <XAxis
                dataKey="range"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
                width={28}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                  maxWidth: 280,
                }}
                formatter={(v: number, _name, payload) => [
                  `${v} repl${v === 1 ? "y" : "ies"} · ${total > 0 ? ((v / total) * 100).toFixed(0) : 0}%`,
                  (payload?.payload as Bucket | undefined)?.description ?? "",
                ]}
                labelFormatter={(label) => `Replied in ${label}`}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {buckets.map((b) => (
                  <Cell key={b.range} fill={b.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
