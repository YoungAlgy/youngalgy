import { useMemo } from "react";
import {
  Send, CalendarRange, CalendarClock, PercentCircle,
  HourglassIcon, AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Job, isStale } from "@/lib/types";

const STALE_DAYS = 14;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

interface Props {
  /** Already-fetched jobs from Index.tsx — derive everything client-side. */
  jobs: Job[];
  /** Interview-table row count, fetched alongside jobs. */
  interviewCount: number;
}

/**
 * Stats are derived from the jobs prop instead of firing 6 round-trip count
 * queries on mount. This is part of the 2026-04-27 disk-IO budget cleanup
 * (Supabase warned the project was about to deplete its IO quota).
 */
export function StatsCards({ jobs, interviewCount }: Props) {
  const counts = useMemo(() => {
    const now = Date.now();
    const weekAgoMs = now - WEEK_MS;

    let totalSubmitted = 0;
    let thisWeek = 0;
    let awaitingReply = 0;
    let stale = 0;
    let rejections = 0;

    for (const j of jobs) {
      totalSubmitted += 1;
      const t = new Date(j.appliedDate).getTime();
      if (t >= weekAgoMs) thisWeek += 1;
      if (j.status === "applied") {
        if (!j.firstReplyAt) {
          awaitingReply += 1;
          if (isStale({
            status: j.status,
            first_reply_at: j.firstReplyAt ?? null,
            created_at: j.appliedDate,
          })) stale += 1;
        }
      }
      if (j.status === "rejected") rejections += 1;
    }

    const responded = interviewCount + rejections;
    const responseRate = totalSubmitted > 0 ? (responded / totalSubmitted) * 100 : 0;

    return {
      totalSubmitted,
      thisWeek,
      awaitingReply,
      interviews: interviewCount,
      stale,
      responseRate,
    };
  }, [jobs, interviewCount]);

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
