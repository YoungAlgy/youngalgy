import { useEffect, useState } from "react";
import { Send, CalendarRange, Activity, CalendarClock, XCircle, PercentCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface StatCounts {
  totalSubmitted: number;
  thisWeek: number;
  activePipeline: number;
  interviews: number;
  rejections: number;
  responseRate: number;
}

export function StatsCards() {
  const [counts, setCounts] = useState<StatCounts>({
    totalSubmitted: 0, thisWeek: 0, activePipeline: 0, interviews: 0, rejections: 0, responseRate: 0,
  });

  useEffect(() => {
    async function load() {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const inactive = ["rejected", "ghosted", "withdrew"];

      const [totalRes, weekRes, activeRes, intRes, rejRes] = await Promise.all([
        supabase.from("opportunities").select("id", { count: "exact", head: true }).eq("bot_type", "manual"),
        supabase.from("opportunities").select("id", { count: "exact", head: true })
          .eq("bot_type", "manual").gte("created_at", weekAgo.toISOString()),
        supabase.from("opportunities").select("id", { count: "exact", head: true })
          .eq("bot_type", "manual").not("status", "in", `(${inactive.join(",")})`),
        supabase.from("interviews").select("id", { count: "exact", head: true }),
        supabase.from("opportunities").select("id", { count: "exact", head: true })
          .eq("bot_type", "manual").eq("status", "rejected"),
      ]);

      const total = totalRes.count ?? 0;
      const interviews = intRes.count ?? 0;
      const rejections = rejRes.count ?? 0;
      const responseRate = total > 0 ? ((interviews + rejections) / total) * 100 : 0;

      setCounts({
        totalSubmitted: total,
        thisWeek: weekRes.count ?? 0,
        activePipeline: activeRes.count ?? 0,
        interviews,
        rejections,
        responseRate,
      });
    }
    load();
  }, []);

  const responseRateGood = counts.responseRate > 5;

  const stats = [
    { label: "Total Submitted", value: counts.totalSubmitted, icon: Send, color: "text-primary" },
    { label: "This Week", value: counts.thisWeek, icon: CalendarRange, color: "text-info" },
    { label: "Active Pipeline", value: counts.activePipeline, icon: Activity, color: "text-success" },
    { label: "Interviews", value: counts.interviews, icon: CalendarClock, color: "text-purple-500" },
    { label: "Rejections", value: counts.rejections, icon: XCircle, color: "text-destructive" },
    {
      label: "Response Rate",
      value: `${counts.responseRate.toFixed(1)}%`,
      icon: PercentCircle,
      color: responseRateGood ? "text-success" : "text-muted-foreground",
    },
  ];

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
