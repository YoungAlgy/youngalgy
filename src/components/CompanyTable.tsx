import { Fragment, useMemo, useState } from "react";
import { Job, JobStatus, STATUS_CONFIG, ALL_STATUSES } from "@/lib/types";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Pencil } from "lucide-react";
import { formatRelativeDate } from "@/lib/dates";
import { aggregateByCompany } from "@/lib/company-aggregate";

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
  onClearFilters?: () => void;
}

export function CompanyTable({ jobs, onEdit, onClearFilters }: Props) {
  const rows = useMemo(() => aggregateByCompany(jobs), [jobs]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(company: string) {
    const next = new Set(expanded);
    if (next.has(company)) next.delete(company);
    else next.add(company);
    setExpanded(next);
  }

  if (rows.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-lg font-medium text-foreground">No companies</p>
        <p className="text-sm text-muted-foreground">Try adjusting or clearing your filters.</p>
        {onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters} className="mt-2">
            Clear filters
          </Button>
        )}
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
            <Fragment key={r.company}>
              <TableRow
                className="cursor-pointer hover:bg-muted/40"
                onClick={() => toggle(r.company)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(r.company); } }}
                tabIndex={0}
                aria-expanded={isOpen}
                role="row"
              >
                <TableCell className="pr-0">
                  {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden /> : <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />}
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
                            <Button size="icon" variant="ghost" className="h-7 w-7" aria-label={`Edit ${j.position} at ${r.company}`} onClick={(e) => { e.stopPropagation(); onEdit(j); }}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
