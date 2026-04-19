import { useMemo, useState } from "react";
import { Job, JobStatus, STATUS_CONFIG, ALL_STATUSES } from "@/lib/types";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Pencil } from "lucide-react";
import { formatRelativeDate } from "@/lib/dates";

interface CompanyRow {
  company: string;
  count: number;
  latestRole: string;
  highestSalary: number;
  latestDate: string;
  hasInterview: boolean;
  mix: Record<JobStatus, number>;
  jobs: Job[];
}

function aggregate(jobs: Job[]): CompanyRow[] {
  const map = new Map<string, CompanyRow>();
  for (const j of jobs) {
    const key = j.company || "Unknown";
    let row = map.get(key);
    if (!row) {
      row = {
        company: key,
        count: 0,
        latestRole: j.position,
        highestSalary: 0,
        latestDate: j.appliedDate,
        hasInterview: false,
        mix: ALL_STATUSES.reduce((acc, s) => ({ ...acc, [s]: 0 }), { saved: 0 } as Record<JobStatus, number>),
        jobs: [],
      };
      map.set(key, row);
    }
    row.count += 1;
    row.jobs.push(j);
    row.mix[j.status] = (row.mix[j.status] || 0) + 1;
    if ((j.salaryRaw ?? 0) > row.highestSalary) row.highestSalary = j.salaryRaw ?? 0;
    if (new Date(j.appliedDate).getTime() > new Date(row.latestDate).getTime()) {
      row.latestDate = j.appliedDate;
      row.latestRole = j.position;
    }
    if (j.status === "interview" || j.status === "phone_screen" || j.status === "offer") {
      row.hasInterview = true;
    }
  }
  // Sort: companies with interview-ish progress first, then most apps, then newest
  return Array.from(map.values()).sort((a, b) => {
    if (a.hasInterview !== b.hasInterview) return a.hasInterview ? -1 : 1;
    if (b.count !== a.count) return b.count - a.count;
    return new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime();
  });
}

function StatusMixBar({ mix, total }: { mix: Record<JobStatus, number>; total: number }) {
  const segments = ALL_STATUSES
    .map((s) => ({ s, n: mix[s] || 0 }))
    .filter((seg) => seg.n > 0);
  if (segments.length === 0) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <div className="flex h-2 w-32 rounded overflow-hidden bg-muted" title={segments.map((s) => `${STATUS_CONFIG[s.s].label}: ${s.n}`).join(" · ")}>
      {segments.map((seg) => (
        <div
          key={seg.s}
          className={STATUS_CONFIG[seg.s].className.split(" ")[0]}
          style={{ width: `${(seg.n / total) * 100}%` }}
        />
      ))}
    </div>
  );
}

interface Props {
  jobs: Job[];
  onEdit?: (job: Job) => void;
}

export function CompanyTable({ jobs, onEdit }: Props) {
  const rows = useMemo(() => aggregate(jobs), [jobs]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(company: string) {
    const next = new Set(expanded);
    if (next.has(company)) next.delete(company);
    else next.add(company);
    setExpanded(next);
  }

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
          <TableHead className="w-8" />
          <TableHead>Company</TableHead>
          <TableHead className="w-16">Apps</TableHead>
          <TableHead>Latest Role</TableHead>
          <TableHead>Highest Salary</TableHead>
          <TableHead>Status Mix</TableHead>
          <TableHead>Last Applied</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => {
          const isOpen = expanded.has(r.company);
          return (
            <>
              <TableRow key={r.company} className="cursor-pointer hover:bg-muted/40" onClick={() => toggle(r.company)}>
                <TableCell className="pr-0">
                  {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </TableCell>
                <TableCell className="font-medium">{r.company}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">{r.count}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[280px] truncate">{r.latestRole}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {r.highestSalary > 0 ? `$${r.highestSalary.toLocaleString()}` : "—"}
                </TableCell>
                <TableCell><StatusMixBar mix={r.mix} total={r.count} /></TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatRelativeDate(r.latestDate)}</TableCell>
              </TableRow>
              {isOpen && (
                <TableRow key={`${r.company}-detail`}>
                  <TableCell colSpan={7} className="bg-muted/30 p-0">
                    <div className="p-4 space-y-2">
                      {r.jobs.map((j) => (
                        <div key={j.id} className="flex items-center justify-between gap-3 p-2 rounded border bg-card">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{j.position}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatRelativeDate(j.appliedDate)} · {j.salary || "—"}
                            </p>
                          </div>
                          <Badge className={`${STATUS_CONFIG[j.status].className} text-[10px] border-0`}>
                            {STATUS_CONFIG[j.status].label}
                          </Badge>
                          {onEdit && (
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onEdit(j); }}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          );
        })}
      </TableBody>
    </Table>
  );
}
