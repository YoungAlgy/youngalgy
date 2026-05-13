/**
 * Pure aggregation logic for the "By Company" dashboard view.
 *
 * Extracted from CompanyTable.tsx so the rollup of jobs → company rows
 * can be unit-tested in isolation. CompanyTable.tsx wraps this in useMemo.
 */

import type { Job, JobStatus } from "@/lib/types";
import { ALL_STATUSES } from "@/lib/types";

export interface CompanyRow {
  company: string;
  count: number;
  /** Title of the most-recently-applied job at this company. */
  latestRole: string;
  highestSalary: number;
  /** ISO timestamp of the most recent application at this company. */
  latestDate: string;
  /** True if any job at this company is in phone_screen / interview / offer. */
  hasInterview: boolean;
  mix: Record<JobStatus, number>;
  /** All jobs grouped under this company, in insertion order. */
  jobs: Job[];
}

const PROGRESSED_STATUSES: ReadonlyArray<JobStatus> = ["phone_screen", "interview", "offer"];

/**
 * Build per-company rollup rows from a flat job list. Sort order:
 * 1. Companies with progressed-stage jobs (interview-ish) first
 * 2. By application count (descending)
 * 3. By most-recent latestDate (newest first)
 */
export function aggregateByCompany(jobs: Job[]): CompanyRow[] {
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
        mix: ALL_STATUSES.reduce(
          (acc, s) => ({ ...acc, [s]: 0 }),
          { saved: 0 } as Record<JobStatus, number>,
        ),
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
    if (PROGRESSED_STATUSES.includes(j.status)) {
      row.hasInterview = true;
    }
  }
  return Array.from(map.values()).sort((a, b) => {
    if (a.hasInterview !== b.hasInterview) return a.hasInterview ? -1 : 1;
    if (b.count !== a.count) return b.count - a.count;
    return new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime();
  });
}
