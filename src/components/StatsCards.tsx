import { useEffect, useState } from "react";
import { Briefcase, Star, FileText, Send, CalendarRange, PercentCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface StatCounts {
  total: number;
  scoreSeven: number;
  coverLetters: number;
  applied: number;
  thisWeek: number;
  responded: number;
}

export function StatsCards() {
  const [counts, setCounts] = useState<StatCounts>({
    total: 0, scoreSeven: 0, coverLetters: 0, applied: 0, thisWeek: 0, responded: 0,
  });

  useEffect(() => {
    async function loadCounts() {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [totalRes, scoreRes, clRes, appliedRes, weekRes, respRes] = await Promise.all([
        supabase.from("opportunities").select("id", { count: "exact", head: true }),
        supabase.from("opportunities").select("id", { count: "exact", head: true }).gte("score", 7),
        supabase.from("opportunities").select("id", { count: "exact", head: true }).not("cover_letter", "is", null),
        supabase.from("opportunities").select("id", { count: "exact", head: true }).eq("status", "applied"),
        supabase.from("opportunities").select("id", { count: "exact", head: true }).gte("created_at", weekAgo.toISOString()),
        supabase.from("opportunities").select("id", { count: "exact", head: true }).in("status", ["replied", "interviewing", "offered"]),
      ]);
      setCounts({
        total: totalRes.count ?? 0,
        scoreSeven: scoreRes.count ?? 0,
        coverLetters: clRes.count ?? 0,
        applied: appliedRes.count ?? 0,
        thisWeek: weekRes.count ?? 0,
        responded: respRes.count ?? 0,
      });
    }
    loadCounts();
  }, []);

  const responseRate = counts.applied > 0 ? (counts.responded / counts.applied) * 100 : 0;
  const responseRateGood = responseRate > 5;

  const stats = [
    { label: "Total Opportunities", value: counts.total, icon: Briefcase, color: "text-primary" },
    { label: "Score 7+", value: counts.scoreSeven, icon: Star, color: "text-warning" },
    { label: "Cover Letters", value: counts.coverLetters, icon: FileText, color: "text-success" },
    { label: "Applied", value: counts.applied, icon: Send, color: "text-info" },
    { label: "This Week", value: counts.thisWeek, icon: CalendarRange, color: "text-primary" },
    {
      label: "Response Rate",
      value: `${responseRate.toFixed(1)}%`,
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
