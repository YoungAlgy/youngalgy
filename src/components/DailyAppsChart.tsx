import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import { Job } from "@/lib/types";

interface Point { date: string; label: string; count: number; }

interface Props {
  /** Already-fetched jobs from Index.tsx — derive client-side. */
  jobs: Job[];
}

/**
 * 14-day applications chart derived from the jobs prop instead of firing
 * a fresh SELECT created_at, status FROM opportunities. Part of the
 * 2026-04-27 disk-IO cleanup.
 */
export function DailyAppsChart({ jobs }: Props) {
  const data = useMemo<Point[]>(() => {
    const since = new Date();
    since.setDate(since.getDate() - 13);
    since.setHours(0, 0, 0, 0);
    const sinceMs = since.getTime();

    const buckets: Record<string, number> = {};
    const points: Point[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const key = d.toISOString().slice(0, 10);
      buckets[key] = 0;
      points.push({
        date: key,
        label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        count: 0,
      });
    }

    for (const j of jobs) {
      if (j.status !== "applied") continue;
      const t = new Date(j.appliedDate).getTime();
      if (t < sinceMs) continue;
      const key = j.appliedDate.slice(0, 10);
      if (key in buckets) buckets[key] += 1;
    }
    points.forEach((p) => { p.count = buckets[p.date]; });
    return points;
  }, [jobs]);

  return (
    <Card className="border shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Applications · last 14 days</h2>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3, fill: "hsl(var(--primary))" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
