import { useEffect, useState } from "react";
import {
  Send, CalendarRange, Activity, CalendarClock, XCircle, PercentCircle,
  HourglassIcon, AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface StatCounts {
  totalSubmitted: number;
  thisWeek: number;
  awaitingReply: number;
  interviews: number;
  stale: number;
  responseRate: number;
}

const STALE_DAYS = 14;

export function StatsCards() {
  const [counts, setCounts] = useState<StatCounts>({
    totalSubmitted: 0, thisWeek: 0, awaitingReply: 0, interviews: 0, stale: 0, responseRate: 0,
  });

  useEffect(() => {
    async function load() {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const staleCutoff = new Date();
      staleCutoff.setDate(staleCutoff.getDate() - STALE_DAYS);

      const [totalRes, weekRes, awaitingRes, intRes, staleRes, rejRes] = await Promise.all([
        // Total ever submitted
        supabase.from("opportunities")
          .select("id", { count: "exact", head: true })
          .eq("bot_type", "manual"),
        // Submitted in the last 7 days
        supabase.from("opportunities")
          .select("id", { count: "exact", head: true })
          .eq("bot_type", "manual")
          .gte("created_at", weekAgo.toISOString()),
        // Awaiting reply: still 'applied' (no movement off the column yet)
        supabase.from("opportunities")
          .select("id", { count: "exact", head: true })
          .eq("bot_type", "manual")
          .eq("status", "applied"),
        // Interviews on the books
        supabase.from("interviews")
          .select("id", { count: "exact", head: true }),
        // Stale: applied AND created_at older than the cutoff
        supabase.from("opportunities")
          .select("id", { count: "exact", head: true })
          .eq("bot_type", "manual")
          .eq("status", "applied")
          .lt("created_at", staleCutoff.toISOString()),
        // Rejected (used for response-rate denominator only — not its own card anymore)
        supabase.from("opportunities")
          .select("id", { count: "exact", head: true })
          .eq("bot_type", "manual")
          .eq("status", "rejected"),
      ]);

      const total = totalRes.count ?? 0;
      const interviews = intRes.count ?? 0;
      const rejections = rejRes.count ?? 0;
      const responseRate = total > 0 ? ((interviews + rejections) / total) * 100 : 0;

      setCounts({
        totalSubmitted: total,
        thisWeek: weekRes.count ?? 0,
        awaitingReply: awaitingRes.count ?? 0,
        interviews,
        stale: staleRes.count ?? 0,
        responseRate,
      });
    }
    load();
  }, []);

  const responseRateGood = counts.responseRate > 5;

  const stats = [
    { label: "Total Submitted", value: counts.totalSubmitted, icon: Send, color: "text-primary" },
    { label: "This Week",       value: counts.thisWeek,       icon: CalendarRange, color: "text-info" },
    { label: "Awaiting Reply",  value: counts.awaitingReply,  icon: HourglassIcon, color: "text-amber-500" },
    { label: "Interviews",      value: counts.interviews,     icon: CalendarClock, color: "text-purple-500" },
    {
      label: `Stale (>${STALE_DAYS}d)`,
      value: counts.stale,
      icon: AlertTriangle,
      color: counts.stale > 0 ? "text-destructive" : "text-muted-foreground",
    },
    {
      label: "Response Rate",
      value: `${counts.responseRate.toFixed(1)}%`,
      icon: PercentCircle,
      color: responseRateGood ? "text-success" : "text-muted-foreground",
    },
  ];

  // Mobile: 2 cols × 3 rows. ≥sm: 3 cols. ≥lg: 6 cols.
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`${stat.color} shrink-0`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-semibold leading-none truncate">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
