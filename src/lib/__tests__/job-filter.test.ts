/**
 * Tests for the job-filter pure module.
 *
 * Covers the dashboard's most complex code path — the search/filter/sort
 * intersection that runs on every keystroke and filter change. The tests
 * pin `now` so date-relative facets ("last 7 days", "stale >14d") are
 * deterministic without vi.setSystemTime side effects.
 */

import { describe, it, expect } from "vitest";
import { filterJobs, sortJobs, filterAndSortJobs } from "@/lib/job-filter";
import { DEFAULT_FILTERS, type Filters } from "@/lib/url-filters";
import type { Job, JobStatus } from "@/lib/types";

const NOW = new Date("2026-05-08T12:00:00Z").getTime();

/** Build a Job with sensible defaults; override anything per-test. */
function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    id: overrides.id ?? "job-default",
    company: overrides.company ?? "Acme Corp",
    position: overrides.position ?? "Senior Software Engineer",
    location: overrides.location ?? "Remote",
    salary: overrides.salary,
    salaryRaw: overrides.salaryRaw ?? null,
    status: overrides.status ?? "applied",
    appliedDate: overrides.appliedDate ?? "2026-05-01T12:00:00Z",
    notes: overrides.notes,
    url: overrides.url,
    score: overrides.score ?? null,
    source: overrides.source ?? null,
    botType: overrides.botType ?? null,
    coverLetter: overrides.coverLetter ?? null,
    proposal: overrides.proposal ?? null,
    firstReplyAt: overrides.firstReplyAt ?? null,
    replyKind: overrides.replyKind ?? null,
    lane: overrides.lane ?? "OTHER",
  };
}

const baseArgs = {
  search: "",
  filters: DEFAULT_FILTERS,
  funnelStage: null,
  now: NOW,
};

describe("filterJobs — defaults", () => {
  it("returns every job when no filters are set", () => {
    const jobs = [makeJob({ id: "a" }), makeJob({ id: "b" }), makeJob({ id: "c" })];
    expect(filterJobs({ ...baseArgs, jobs })).toHaveLength(3);
  });
});

describe("filterJobs — search", () => {
  const jobs = [
    makeJob({ id: "1", company: "Ava Health", position: "Recruiter" }),
    makeJob({ id: "2", company: "OpenAI", position: "Solutions Engineer" }),
    makeJob({ id: "3", company: "Stripe", position: "Account Executive" }),
  ];

  it("is case-insensitive", () => {
    const r1 = filterJobs({ ...baseArgs, jobs, search: "AVA" });
    const r2 = filterJobs({ ...baseArgs, jobs, search: "ava" });
    expect(r1.map((j) => j.id)).toEqual(["1"]);
    expect(r2.map((j) => j.id)).toEqual(["1"]);
  });

  it("matches the company name", () => {
    expect(filterJobs({ ...baseArgs, jobs, search: "stripe" }).map((j) => j.id)).toEqual(["3"]);
  });

  it("matches the position title", () => {
    expect(filterJobs({ ...baseArgs, jobs, search: "engineer" }).map((j) => j.id))
      .toEqual(["2"]);
  });

  it("returns everything when search is empty", () => {
    expect(filterJobs({ ...baseArgs, jobs, search: "" })).toHaveLength(3);
  });

  it("returns no rows when nothing matches", () => {
    expect(filterJobs({ ...baseArgs, jobs, search: "zzz" })).toHaveLength(0);
  });
});

describe("filterJobs — status", () => {
  const jobs = [
    makeJob({ id: "a", status: "applied" }),
    makeJob({ id: "p", status: "phone_screen" }),
    makeJob({ id: "i", status: "interview" }),
    makeJob({ id: "r", status: "rejected" }),
  ];

  it("empty whitelist matches every status", () => {
    const filters: Filters = { ...DEFAULT_FILTERS, statuses: [] };
    expect(filterJobs({ ...baseArgs, jobs, filters })).toHaveLength(4);
  });

  it("filters to whitelisted statuses only", () => {
    const filters: Filters = { ...DEFAULT_FILTERS, statuses: ["applied", "phone_screen"] };
    const ids = filterJobs({ ...baseArgs, jobs, filters }).map((j) => j.id);
    expect(ids.sort()).toEqual(["a", "p"]);
  });
});

describe("filterJobs — source", () => {
  const jobs = [
    makeJob({ id: "li", source: "linkedin" }),
    makeJob({ id: "wf", source: "wellfound" }),
    makeJob({ id: "none", source: null }),
  ];

  it("empty whitelist matches every source (incl. null)", () => {
    expect(filterJobs({ ...baseArgs, jobs })).toHaveLength(3);
  });

  it("excludes jobs with null source when whitelist is non-empty", () => {
    const filters: Filters = { ...DEFAULT_FILTERS, sources: ["linkedin"] };
    expect(filterJobs({ ...baseArgs, jobs, filters }).map((j) => j.id)).toEqual(["li"]);
  });
});

describe("filterJobs — lane", () => {
  const jobs = [
    makeJob({ id: "crypto",   lane: "CRYPTO" }),
    makeJob({ id: "operator", lane: "OPERATOR" }),
    makeJob({ id: "support",  lane: "SUPPORT" }),
    makeJob({ id: "other",    lane: "OTHER" }),
  ];

  it("empty lane whitelist matches every lane", () => {
    expect(filterJobs({ ...baseArgs, jobs })).toHaveLength(4);
  });

  it("filters to the selected lanes only", () => {
    const filters: Filters = { ...DEFAULT_FILTERS, lanes: ["CRYPTO", "OPERATOR"] };
    expect(filterJobs({ ...baseArgs, jobs, filters }).map((j) => j.id))
      .toEqual(["crypto", "operator"]);
  });
});

describe("filterJobs — date range", () => {
  const dayMs = 86_400_000;
  const jobs = [
    makeJob({ id: "today",     appliedDate: new Date(NOW).toISOString() }),
    makeJob({ id: "5d",        appliedDate: new Date(NOW - 5 * dayMs).toISOString() }),
    makeJob({ id: "20d",       appliedDate: new Date(NOW - 20 * dayMs).toISOString() }),
    makeJob({ id: "60d",       appliedDate: new Date(NOW - 60 * dayMs).toISOString() }),
  ];

  it("'all' returns every job", () => {
    expect(filterJobs({ ...baseArgs, jobs })).toHaveLength(4);
  });

  it("'7' returns jobs from the last 7 days only", () => {
    const filters: Filters = { ...DEFAULT_FILTERS, dateRange: "7" };
    const ids = filterJobs({ ...baseArgs, jobs, filters }).map((j) => j.id);
    expect(ids.sort()).toEqual(["5d", "today"]);
  });

  it("'30' returns jobs from the last 30 days only", () => {
    const filters: Filters = { ...DEFAULT_FILTERS, dateRange: "30" };
    const ids = filterJobs({ ...baseArgs, jobs, filters }).map((j) => j.id);
    expect(ids.sort()).toEqual(["20d", "5d", "today"]);
  });

  it("'custom' applies inclusive `from` and exclusive next-day `to`", () => {
    // From 2026-04-15 to 2026-05-05 (inclusive end → < 2026-05-06)
    const filters: Filters = {
      ...DEFAULT_FILTERS,
      dateRange: "custom",
      customFrom: "2026-04-15",
      customTo: "2026-05-05",
    };
    const ids = filterJobs({ ...baseArgs, jobs, filters }).map((j) => j.id);
    // today (5/8) excluded; 5d (5/3) included; 20d (4/18) included; 60d (3/9) excluded
    expect(ids.sort()).toEqual(["20d", "5d"]);
  });

  it("'custom' with only `from` is open-ended on the right", () => {
    const filters: Filters = {
      ...DEFAULT_FILTERS,
      dateRange: "custom",
      customFrom: "2026-04-15",
    };
    const ids = filterJobs({ ...baseArgs, jobs, filters }).map((j) => j.id);
    expect(ids.sort()).toEqual(["20d", "5d", "today"]);
  });
});

describe("filterJobs — salary minimum", () => {
  const jobs = [
    makeJob({ id: "low",     salaryRaw: 50_000 }),
    makeJob({ id: "mid",     salaryRaw: 90_000 }),
    makeJob({ id: "high",    salaryRaw: 200_000 }),
    makeJob({ id: "unknown", salaryRaw: null }),
  ];

  it("0 matches every job (including unknown salary)", () => {
    expect(filterJobs({ ...baseArgs, jobs })).toHaveLength(4);
  });

  it("excludes unknown-salary jobs when threshold > 0", () => {
    const filters: Filters = { ...DEFAULT_FILTERS, salaryMin: 80_000 };
    const ids = filterJobs({ ...baseArgs, jobs, filters }).map((j) => j.id);
    expect(ids.sort()).toEqual(["high", "mid"]);
  });
});

describe("filterJobs — hasUrl", () => {
  const jobs = [
    makeJob({ id: "with",    url: "https://x.com/jobs/1" }),
    makeJob({ id: "without", url: undefined }),
  ];

  it("false matches both", () => {
    expect(filterJobs({ ...baseArgs, jobs })).toHaveLength(2);
  });

  it("true requires a URL", () => {
    const filters: Filters = { ...DEFAULT_FILTERS, hasUrl: true };
    expect(filterJobs({ ...baseArgs, jobs, filters }).map((j) => j.id)).toEqual(["with"]);
  });
});

describe("filterJobs — funnelStage", () => {
  const jobs = [
    makeJob({ id: "a", status: "applied" }),
    makeJob({ id: "i", status: "interview" }),
  ];

  it("null matches everything", () => {
    expect(filterJobs({ ...baseArgs, jobs, funnelStage: null })).toHaveLength(2);
  });

  it("filters to the exact status", () => {
    expect(filterJobs({ ...baseArgs, jobs, funnelStage: "interview" }).map((j) => j.id))
      .toEqual(["i"]);
  });
});

describe("filterJobs — reply state", () => {
  const dayMs = 86_400_000;
  const recent = new Date(NOW - 5 * dayMs).toISOString();
  const old = new Date(NOW - 20 * dayMs).toISOString();
  const jobs = [
    makeJob({ id: "fresh-applied",   status: "applied",   firstReplyAt: null,                appliedDate: recent }),
    makeJob({ id: "stale-applied",   status: "applied",   firstReplyAt: null,                appliedDate: old }),
    makeJob({ id: "applied-replied", status: "applied",   firstReplyAt: "2026-05-01T00:00:00Z", appliedDate: old }),
    makeJob({ id: "interview-noreply", status: "interview", firstReplyAt: null,              appliedDate: old }),
  ];

  it("'all' matches every job", () => {
    expect(filterJobs({ ...baseArgs, jobs })).toHaveLength(4);
  });

  it("'awaiting' = applied + no reply (regardless of age)", () => {
    const filters: Filters = { ...DEFAULT_FILTERS, replyState: "awaiting" };
    const ids = filterJobs({ ...baseArgs, jobs, filters }).map((j) => j.id);
    expect(ids.sort()).toEqual(["fresh-applied", "stale-applied"]);
  });

  it("'replied' = any job with firstReplyAt set", () => {
    const filters: Filters = { ...DEFAULT_FILTERS, replyState: "replied" };
    const ids = filterJobs({ ...baseArgs, jobs, filters }).map((j) => j.id);
    expect(ids).toEqual(["applied-replied"]);
  });

  it("'stale' = applied + no reply + age ≥14d", () => {
    const filters: Filters = { ...DEFAULT_FILTERS, replyState: "stale" };
    const ids = filterJobs({ ...baseArgs, jobs, filters }).map((j) => j.id);
    expect(ids).toEqual(["stale-applied"]);
  });

  it("'stale' excludes interview rows even when they have no reply", () => {
    const filters: Filters = { ...DEFAULT_FILTERS, replyState: "stale" };
    const ids = filterJobs({ ...baseArgs, jobs, filters }).map((j) => j.id);
    expect(ids).not.toContain("interview-noreply");
  });
});

describe("filterJobs — combined facets (AND semantics)", () => {
  const jobs = [
    makeJob({ id: "match",        company: "Stripe", position: "AE", status: "applied",      source: "linkedin", salaryRaw: 120_000, url: "https://x.com" }),
    makeJob({ id: "wrong-status", company: "Stripe", position: "AE", status: "rejected",     source: "linkedin", salaryRaw: 120_000, url: "https://x.com" }),
    makeJob({ id: "no-url",       company: "Stripe", position: "AE", status: "applied",      source: "linkedin", salaryRaw: 120_000, url: undefined }),
    makeJob({ id: "low-pay",      company: "Stripe", position: "AE", status: "applied",      source: "linkedin", salaryRaw: 50_000,  url: "https://x.com" }),
    makeJob({ id: "wrong-search", company: "Acme",   position: "AE", status: "applied",      source: "linkedin", salaryRaw: 120_000, url: "https://x.com" }),
  ];

  it("only the row that satisfies every facet survives", () => {
    const filters: Filters = {
      ...DEFAULT_FILTERS,
      statuses: ["applied"],
      sources: ["linkedin"],
      salaryMin: 100_000,
      hasUrl: true,
    };
    const ids = filterJobs({ ...baseArgs, jobs, search: "stripe", filters }).map((j) => j.id);
    expect(ids).toEqual(["match"]);
  });
});

describe("sortJobs", () => {
  it("score: highest first; ties break by newest applied", () => {
    const jobs = [
      makeJob({ id: "low9-old",   score: 9, appliedDate: "2026-04-01T00:00:00Z" }),
      makeJob({ id: "high10",     score: 10, appliedDate: "2026-04-15T00:00:00Z" }),
      makeJob({ id: "low9-new",   score: 9, appliedDate: "2026-05-01T00:00:00Z" }),
      makeJob({ id: "no-score",   score: null, appliedDate: "2026-05-08T00:00:00Z" }),
    ];
    const sorted = sortJobs([...jobs], "score").map((j) => j.id);
    expect(sorted).toEqual(["high10", "low9-new", "low9-old", "no-score"]);
  });

  it("salary: highest first; ties break by newest", () => {
    const jobs = [
      makeJob({ id: "100k-old", salaryRaw: 100_000, appliedDate: "2026-04-01T00:00:00Z" }),
      makeJob({ id: "200k",     salaryRaw: 200_000, appliedDate: "2026-04-15T00:00:00Z" }),
      makeJob({ id: "100k-new", salaryRaw: 100_000, appliedDate: "2026-05-01T00:00:00Z" }),
      makeJob({ id: "no-sal",   salaryRaw: null,    appliedDate: "2026-05-08T00:00:00Z" }),
    ];
    const sorted = sortJobs([...jobs], "salary").map((j) => j.id);
    expect(sorted).toEqual(["200k", "100k-new", "100k-old", "no-sal"]);
  });

  it("date: newest applied first", () => {
    const jobs = [
      makeJob({ id: "old", appliedDate: "2026-01-01T00:00:00Z" }),
      makeJob({ id: "mid", appliedDate: "2026-03-01T00:00:00Z" }),
      makeJob({ id: "new", appliedDate: "2026-05-01T00:00:00Z" }),
    ];
    expect(sortJobs([...jobs], "date").map((j) => j.id)).toEqual(["new", "mid", "old"]);
  });

  it("days: oldest applied first (most days since applied)", () => {
    const jobs = [
      makeJob({ id: "old", appliedDate: "2026-01-01T00:00:00Z" }),
      makeJob({ id: "mid", appliedDate: "2026-03-01T00:00:00Z" }),
      makeJob({ id: "new", appliedDate: "2026-05-01T00:00:00Z" }),
    ];
    expect(sortJobs([...jobs], "days").map((j) => j.id)).toEqual(["old", "mid", "new"]);
  });
});

describe("filterAndSortJobs", () => {
  it("filters first, then sorts", () => {
    const jobs = [
      makeJob({ id: "rej", status: "rejected",  score: 10, appliedDate: "2026-04-01T00:00:00Z" }),
      makeJob({ id: "a1",  status: "applied",   score: 8,  appliedDate: "2026-05-01T00:00:00Z" }),
      makeJob({ id: "a2",  status: "applied",   score: 9,  appliedDate: "2026-04-15T00:00:00Z" }),
    ];
    const result = filterAndSortJobs({
      jobs,
      search: "",
      filters: { ...DEFAULT_FILTERS, statuses: ["applied" as JobStatus] },
      funnelStage: null,
      sortBy: "score",
      now: NOW,
    });
    expect(result.map((j) => j.id)).toEqual(["a2", "a1"]);
  });
});
