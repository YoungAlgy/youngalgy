/**
 * URL <-> Filters serialization for the dashboard.
 *
 * Extracted from src/pages/Index.tsx during the 2026-04-29 cleanup
 * (S9 — youngalgy.vercel.app Code Standards). Lives here so it can be
 * tested in isolation + reused if FilterBar or a future deep-link
 * helper needs it.
 *
 * Default view = "kanban", default sort = "score". Both are omitted
 * from the URL when at default to keep query strings short.
 */

import type { Filters, ReplyStateFilter } from "@/components/FilterBar";
import type { JobStatus } from "@/lib/types";

export type ViewMode = "kanban" | "table" | "company";
export type SortKey = "score" | "date" | "salary" | "days";

export const VALID_REPLY_STATES: ReadonlySet<ReplyStateFilter> = new Set([
  "all",
  "awaiting",
  "stale",
  "replied",
]);

export function filtersFromParams(p: URLSearchParams): Filters {
  const rawReply = p.get("reply") as ReplyStateFilter | null;
  return {
    statuses: (p.get("status")?.split(",").filter(Boolean) as JobStatus[]) ?? [],
    sources: p.get("source")?.split(",").filter(Boolean) ?? [],
    dateRange: (p.get("range") as Filters["dateRange"]) || "all",
    customFrom: p.get("from") ?? undefined,
    customTo: p.get("to") ?? undefined,
    salaryMin: Number(p.get("salaryMin") ?? "0") || 0,
    hasUrl: p.get("hasUrl") === "1",
    replyState: rawReply && VALID_REPLY_STATES.has(rawReply) ? rawReply : "all",
  };
}

export function paramsFromFilters(
  f: Filters,
  search: string,
  view: ViewMode,
  sortBy: SortKey,
): URLSearchParams {
  const p = new URLSearchParams();
  if (f.statuses.length) p.set("status", f.statuses.join(","));
  if (f.sources.length) p.set("source", f.sources.join(","));
  if (f.dateRange !== "all") p.set("range", f.dateRange);
  if (f.customFrom) p.set("from", f.customFrom);
  if (f.customTo) p.set("to", f.customTo);
  if (f.salaryMin > 0) p.set("salaryMin", String(f.salaryMin));
  if (f.hasUrl) p.set("hasUrl", "1");
  if (f.replyState !== "all") p.set("reply", f.replyState);
  if (search) p.set("q", search);
  if (view !== "kanban") p.set("view", view);
  if (sortBy !== "score") p.set("sort", sortBy);
  return p;
}
