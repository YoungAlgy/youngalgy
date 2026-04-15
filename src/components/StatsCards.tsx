import { Briefcase, PhoneCall, Trophy, XCircle, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Job } from "@/lib/types";

interface StatsCardsProps {
  jobs: Job[];
}

export function StatsCards({ jobs }: StatsCardsProps) {
  const stats = [
    { label: "Total", value: jobs.length, icon: Briefcase, color: "text-primary" },
    { label: "Applied", value: jobs.filter(j => j.status === "applied").length, icon: Bookmark, color: "text-info" },
    { label: "Interviews", value: jobs.filter(j => j.status === "interview").length, icon: PhoneCall, color: "text-warning" },
    { label: "Offers", value: jobs.filter(j => j.status === "offer").length, icon: Trophy, color: "text-success" },
    { label: "Rejected", value: jobs.filter(j => j.status === "rejected").length, icon: XCircle, color: "text-destructive" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`${stat.color} shrink-0`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold leading-none">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
