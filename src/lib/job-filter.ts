/**
 * Pure filter + sort logic for the job dashboard.
 *
 * Extracted from src/pages/Index.tsx so the most complex part of the
 * dashboard — the user-facing search/filter/sort intersection — is
 * unit-testable in isolation. Index.tsx just wraps this in useMemo.
 *
 * Time-aware logic ("last 7 days", "stale >14d") takes a `now` parameter
 * instead of calling Date.now() so tests can pin the clock without using
 * vi.setSystemTime() side effects.
 */

import type { Job, JobStatus } from "@/lib/types";
import type { Filters, SortKey } from "@/lib/url-filters";

const DAY_MS = 86_400_000;
const STALE_MS = 14 * DAY_MS;

export interface FilterArgs {
  jobs: Job[];
  search: string;
  filters: Filters;
  /** A status used by the funnel-click highlight; "" or null = no funnel filter. */
  funnelStage?: string | null;
  /** Wall-clock anchor — defaults to Date.now() but tests pin it explicitly. */
  now?: number;
}

/**
 * Returns the subset of `jobs` that satisfies search + every filter facet.
 *
 * Facets ANDed together:
 *   - text search across company + position (case-insensitive)
 *   - status whitelist
 *   - source whitelist
 *   - date range (7 / 30 / all / custom from–to)
 *   - minimum salary
 *   - "has Apply URL" flag
 *   - funnel-stage highlight (Stats card click)
 *   - reply-state derived facet (awaiting / replied / stale)
 */
export function filterJobs(args: FilterArgs): Job[] {
  const { jobs, search, filters, funnelStage = null, now = Date.now() } = args;

  let cutoff: number | null = null;
  if (filters.dateRange === "7") cutoff = now - 7 * DAY_MS;
  else if (filters.dateRange === "30") cutoff = now - 30 * DAY_MS;
  const customFromMs = filters.customFrom ? new Date(filters.customFrom).getTime() : null;
  const customToMs = filters.customTo ? new Date(filters.customTo).getTime() + DAY_MS : null;

  const q = search.toLowerCase();

  return jobs.filter((j) => {
    const matchesSearch =
      !q ||
      j.company.toLowerCase().includes(q) ||
      j.position.toLowerCase().includes(q);
    const matchesStatus =
      filters.statuses.length === 0 || filters.statuses.includes(j.status);
    const matchesSource =
      filters.sources.length === 0 ||
      (j.source ? filters.sources.includes(j.source) : false);

    const t = new Date(j.appliedDate).getTime();
    let matchesDate = true;
    if (cutoff !== null) matchesDate = t >= cutoff;
    else if (filters.dateRange === "custom") {
      matchesDate =
        (customFromMs === null || t >= customFromMs) &&
        (customToMs === null || t < customToMs);
    }

    const matchesSalary =
      filters.salaryMin === 0 || (j.salaryRaw ?? 0) >= filters.salaryMin;
    const matchesUrl = !filters.hasUrl || !!j.url;
    const matchesFunnel = !funnelStage || j.status === funnelStage;

    let matchesReplyState = true;
    if (filters.replyState !== "all") {
      const isApplied = j.status === "applied";
      const hasReply = !!j.firstReplyAt;
      if (filters.replyState === "awaiting") {
        matchesReplyState = isApplied && !hasReply;
      } else if (filters.replyState === "replied") {
        matchesReplyState = hasReply;
      } else if (filters.replyState === "stale") {
        const ageMs = now - t;
        matchesReplyState = isApplied && !hasReply && ageMs >= STALE_MS;
      }
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesSource &&
      matchesDate &&
      matchesSalary &&
      matchesUrl &&
      matchesFunnel &&
      matchesReplyState
    );
  });
}

/**
 * Sorts a job array in-place by the given sort key. Returns the same array
 * for ergonomics. All sort keys break ties by date-desc (newest first).
 */
export function sortJobs(jobs: Job[], sortBy: SortKey): Job[] {
  const byDateDesc = (a: Job, b: Job) =>
    new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
  jobs.sort((a, b) => {
    if (sortBy === "score") {
      const diff = (b.score ?? -1) - (a.score ?? -1);
      return diff !== 0 ? diff : byDateDesc(a, b);
    }
    if (sortBy === "salary") {
      const diff = (b.salaryRaw ?? 0) - (a.salaryRaw ?? 0);
      return diff !== 0 ? diff : byDateDesc(a, b);
    }
    // "days" = oldest first (most days since applied)
    if (sortBy === "days") return byDateDesc(b, a);
    // "date" = newest first (default tie-break)
    return byDateDesc(a, b);
  });
  return jobs;
}

/** Convenience: filter then sort. Returns a fresh array. */
export function filterAndSortJobs(
  args: FilterArgs & { sortBy: SortKey },
): Job[] {
  return sortJobs(filterJobs(args), args.sortBy);
}

// Re-export the JobStatus type for downstream callers that only import
// from this module.
export type { JobStatus };
