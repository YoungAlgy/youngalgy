import { useMemo } from "react";
import {
  Send, CalendarRange, CalendarClock, CalendarCheck, PercentCircle,
  HourglassIcon, Timer, Flame,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Job } from "@/lib/types";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

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
    // Local midnight — "Today" is the user's calendar day, not a 24h window.
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayStartMs = todayStart.getTime();

    let totalSubmitted = 0;
    let today = 0;
    let thisWeek = 0;
    let awaitingReply = 0;
    let rejections = 0;
    let lastApplyMs = 0;
    const replyDays: number[] = [];

    for (const j of jobs) {
      totalSubmitted += 1;
      const submittedMs = new Date(j.appliedDate).getTime();
      if (submittedMs >= todayStartMs) today += 1;
      if (submittedMs >= weekAgoMs) thisWeek += 1;
      if (j.status === "applied" && !j.firstReplyAt) awaitingReply += 1;
      if (j.status === "rejected") rejections += 1;
      if (submittedMs > lastApplyMs) lastApplyMs = submittedMs;
      // Days from submission to first reply — only counted when a real reply
      // landed (not for status='applied' awaiting rows). Pre-trigger backfill
      // rows that got stamped to created_at land as 0 days, which still tells
      // the algorithmic-auto-filter story honestly.
      if (j.firstReplyAt) {
        const days = Math.max(
          0,
          Math.round((new Date(j.firstReplyAt).getTime() - submittedMs) / DAY_MS),
        );
        replyDays.push(days);
      }
    }

    // Days since the most recent application. Null when there are no apps yet.
    const daysSinceLastApply = lastApplyMs > 0
      ? Math.max(0, Math.floor((now - lastApplyMs) / DAY_MS))
      : null;

    // Median days to first reply across all rows that ever got a response.
    replyDays.sort((a, b) => a - b);
    let medianDaysToReply: number | null = null;
    if (replyDays.length > 0) {
      const mid = Math.floor(replyDays.length / 2);
      medianDaysToReply = replyDays.length % 2 === 1
        ? replyDays[mid]
        : Math.round((replyDays[mid - 1] + replyDays[mid]) / 2);
    }

    const responded = interviewCount + rejections;
    const responseRate = totalSubmitted > 0 ? (responded / totalSubmitted) * 100 : 0;

    return {
      totalSubmitted,
      today,
      thisWeek,
      awaitingReply,
      interviews: interviewCount,
      medianDaysToReply,
      daysSinceLastApply,
      responseRate,
    };
  }, [jobs, interviewCount]);

  const responseRateGood = counts.responseRate > 5;
  // Sub-4d median = mostly algorithmic auto-filter (warning signal).
  // 7d+ median = mostly human review (decent signal).
  const medianFast = counts.medianDaysToReply !== null && counts.medianDaysToReply < 4;
  // Cadence color ramp: 0d green, 1-3d info, 4-7d warning, 8+d destructive.
  const cadenceColor = counts.daysSinceLastApply === null
    ? "text-muted-foreground"
    : counts.daysSinceLastApply === 0
      ? "text-success"
      : counts.daysSinceLastApply <= 3
        ? "text-info"
        : counts.daysSinceLastApply <= 7
          ? "text-warning"
          : "text-destructive";

  const stats = [
    { label: "Total Submitted", value: counts.totalSubmitted, icon: Send, color: "text-primary" },
    { label: "Today",           value: counts.today,          icon: CalendarCheck, color: counts.today > 0 ? "text-success" : "text-muted-foreground" },
    { label: "This Week",       value: counts.thisWeek,       icon: CalendarRange, color: "text-info" },
    {
      label: "Days Since Last",
      value: counts.daysSinceLastApply === null ? "—" : `${counts.daysSinceLastApply}d`,
      icon: Flame,
      color: cadenceColor,
    },
    { label: "Awaiting Reply",  value: counts.awaitingReply,  icon: HourglassIcon, color: "text-warning" },
    { label: "Interviews",      value: counts.interviews,     icon: CalendarClock, color: "text-stage" },
    {
      label: "Median Days to Reply",
      value: counts.medianDaysToReply === null ? "—" : `${counts.medianDaysToReply}d`,
      icon: Timer,
      // Fast median = auto-filter rejection-bots fired; lean toward warning color.
      color: counts.medianDaysToReply === null
        ? "text-muted-foreground"
        : medianFast
          ? "text-destructive"
          : "text-info",
    },
    {
      label: "Response Rate",
      value: `${counts.responseRate.toFixed(1)}%`,
      icon: PercentCircle,
      color: responseRateGood ? "text-success" : "text-muted-foreground",
    },
  ];

  // Mobile: 2 cols × 4 rows. ≥sm: 4 cols × 2 rows. ≥lg: 8 cols × 1 row.
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
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
