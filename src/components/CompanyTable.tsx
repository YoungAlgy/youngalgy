import { Job, STATUS_CONFIG } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CompanyRow {
  company: string;
  count: number;
  maxSalary: number;
  latestStatus: Job["status"];
  latestDate: string;
}

function aggregate(jobs: Job[]): CompanyRow[] {
  const map = new Map<string, CompanyRow>();
  for (const j of jobs) {
    const key = j.company || "Unknown";
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        company: key,
        count: 1,
        maxSalary: j.salaryRaw ?? 0,
        latestStatus: j.status,
        latestDate: j.appliedDate,
      });
    } else {
      existing.count += 1;
      existing.maxSalary = Math.max(existing.maxSalary, j.salaryRaw ?? 0);
      if (new Date(j.appliedDate).getTime() > new Date(existing.latestDate).getTime()) {
        existing.latestDate = j.appliedDate;
        existing.latestStatus = j.status;
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function CompanyTable({ jobs }: { jobs: Job[] }) {
  const rows = aggregate(jobs);
  if (rows.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No companies</p>
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Apps</TableHead>
          <TableHead>Max Salary</TableHead>
          <TableHead>Latest Status</TableHead>
          <TableHead>Latest Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.company}>
            <TableCell className="font-medium">{r.company}</TableCell>
            <TableCell>{r.count}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {r.maxSalary > 0 ? `$${r.maxSalary.toLocaleString()}` : "—"}
            </TableCell>
            <TableCell>
              <Badge className={`${STATUS_CONFIG[r.latestStatus].className} text-[11px] border-0`}>
                {STATUS_CONFIG[r.latestStatus].label}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(r.latestDate).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
