import { Briefcase, Star, FileText, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Job } from "@/lib/types";

interface StatsCardsProps {
  jobs: Job[];
}

export function StatsCards({ jobs }: StatsCardsProps) {
  const stats = [
    { label: "Total Opportunities", value: jobs.length, icon: Briefcase, color: "text-primary" },
    { label: "Score 7+", value: jobs.filter(j => j.score != null && j.score >= 7).length, icon: Star, color: "text-warning" },
    { label: "Cover Letters", value: jobs.filter(j => j.coverLetter).length, icon: FileText, color: "text-success" },
    { label: "Applied", value: jobs.filter(j => j.status === "applied").length, icon: Send, color: "text-info" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
