/**
 * Tests for aggregateByCompany — the rollup powering the "By Company"
 * dashboard view. Covers the grouping logic, latest-role tracking,
 * highest-salary calculation, and the multi-key sort.
 */

import { describe, it, expect } from "vitest";
import { aggregateByCompany } from "@/lib/company-aggregate";
import type { Job } from "@/lib/types";

function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    id: overrides.id ?? `job-${Math.random()}`,
    company: overrides.company ?? "Acme",
    position: overrides.position ?? "Engineer",
    location: overrides.location ?? "Remote",
    salary: overrides.salary,
    salaryRaw: overrides.salaryRaw ?? null,
    status: overrides.status ?? "applied",
    appliedDate: overrides.appliedDate ?? "2026-05-01T00:00:00Z",
    notes: overrides.notes,
    url: overrides.url,
    score: overrides.score ?? null,
    source: overrides.source ?? null,
    botType: overrides.botType ?? null,
    coverLetter: overrides.coverLetter ?? null,
    proposal: overrides.proposal ?? null,
    firstReplyAt: overrides.firstReplyAt ?? null,
    replyKind: overrides.replyKind ?? null,
  };
}

describe("aggregateByCompany — grouping", () => {
  it("returns an empty array for empty input", () => {
    expect(aggregateByCompany([])).toEqual([]);
  });

  it("groups jobs by company name", () => {
    const result = aggregateByCompany([
      makeJob({ company: "Acme" }),
      makeJob({ company: "Acme" }),
      makeJob({ company: "Globex" }),
    ]);
    const acme = result.find((r) => r.company === "Acme");
    const globex = result.find((r) => r.company === "Globex");
    expect(acme?.count).toBe(2);
    expect(globex?.count).toBe(1);
    expect(result).toHaveLength(2);
  });

  it("falls back to 'Unknown' for empty company strings", () => {
    const result = aggregateByCompany([makeJob({ company: "" })]);
    expect(result[0].company).toBe("Unknown");
  });

  it("preserves all jobs in the company's jobs array", () => {
    const result = aggregateByCompany([
      makeJob({ id: "1", company: "Acme" }),
      makeJob({ id: "2", company: "Acme" }),
      makeJob({ id: "3", company: "Acme" }),
    ]);
    expect(result[0].jobs.map((j) => j.id).sort()).toEqual(["1", "2", "3"]);
  });
});

describe("aggregateByCompany — latestRole", () => {
  it("uses the position of the most-recently-applied job", () => {
    const result = aggregateByCompany([
      makeJob({ company: "Acme", position: "Old Title", appliedDate: "2026-01-01T00:00:00Z" }),
      makeJob({ company: "Acme", position: "New Title", appliedDate: "2026-05-01T00:00:00Z" }),
      makeJob({ company: "Acme", position: "Mid Title", appliedDate: "2026-03-01T00:00:00Z" }),
    ]);
    expect(result[0].latestRole).toBe("New Title");
    expect(result[0].latestDate).toBe("2026-05-01T00:00:00Z");
  });
});

describe("aggregateByCompany — highestSalary", () => {
  it("tracks the max salary across all jobs at the company", () => {
    const result = aggregateByCompany([
      makeJob({ company: "Acme", salaryRaw: 100_000 }),
      makeJob({ company: "Acme", salaryRaw: 200_000 }),
      makeJob({ company: "Acme", salaryRaw: 150_000 }),
    ]);
    expect(result[0].highestSalary).toBe(200_000);
  });

  it("treats null/zero salary as 0", () => {
    const result = aggregateByCompany([
      makeJob({ company: "Acme", salaryRaw: null }),
      makeJob({ company: "Acme", salaryRaw: 0 }),
    ]);
    expect(result[0].highestSalary).toBe(0);
  });
});

describe("aggregateByCompany — hasInterview", () => {
  it("flags companies with phone_screen jobs", () => {
    const result = aggregateByCompany([
      makeJob({ company: "Acme", status: "phone_screen" }),
    ]);
    expect(result[0].hasInterview).toBe(true);
  });

  it("flags companies with interview jobs", () => {
    const result = aggregateByCompany([
      makeJob({ company: "Acme", status: "interview" }),
    ]);
    expect(result[0].hasInterview).toBe(true);
  });

  it("flags companies with offer jobs", () => {
    const result = aggregateByCompany([
      makeJob({ company: "Acme", status: "offer" }),
    ]);
    expect(result[0].hasInterview).toBe(true);
  });

  it("does NOT flag companies with only applied/rejected/ghosted/withdrew jobs", () => {
    const result = aggregateByCompany([
      makeJob({ company: "Acme", status: "applied" }),
      makeJob({ company: "Globex", status: "rejected" }),
      makeJob({ company: "Initech", status: "ghosted" }),
      makeJob({ company: "Soylent", status: "withdrew" }),
    ]);
    for (const row of result) {
      expect(row.hasInterview).toBe(false);
    }
  });
});

describe("aggregateByCompany — status mix", () => {
  it("counts each status independently per company", () => {
    const result = aggregateByCompany([
      makeJob({ company: "Acme", status: "applied" }),
      makeJob({ company: "Acme", status: "applied" }),
      makeJob({ company: "Acme", status: "rejected" }),
      makeJob({ company: "Acme", status: "interview" }),
    ]);
    expect(result[0].mix.applied).toBe(2);
    expect(result[0].mix.rejected).toBe(1);
    expect(result[0].mix.interview).toBe(1);
    expect(result[0].mix.phone_screen).toBe(0);
    expect(result[0].mix.offer).toBe(0);
  });
});

describe("aggregateByCompany — sort order", () => {
  it("companies with interview-stage jobs come first", () => {
    const result = aggregateByCompany([
      makeJob({ company: "OnlyApplied", status: "applied" }),
      makeJob({ company: "OnlyApplied", status: "applied" }),
      makeJob({ company: "HasInterview", status: "interview" }),
    ]);
    expect(result[0].company).toBe("HasInterview");
    expect(result[1].company).toBe("OnlyApplied");
  });

  it("ties on hasInterview break by application count (descending)", () => {
    const result = aggregateByCompany([
      makeJob({ company: "Few", status: "applied" }),
      makeJob({ company: "Many", status: "applied" }),
      makeJob({ company: "Many", status: "applied" }),
      makeJob({ company: "Many", status: "applied" }),
    ]);
    expect(result[0].company).toBe("Many");
    expect(result[1].company).toBe("Few");
  });

  it("ties on count break by latestDate (newest first)", () => {
    const result = aggregateByCompany([
      makeJob({ company: "OldOne", appliedDate: "2026-01-01T00:00:00Z" }),
      makeJob({ company: "NewOne", appliedDate: "2026-05-01T00:00:00Z" }),
    ]);
    expect(result[0].company).toBe("NewOne");
    expect(result[1].company).toBe("OldOne");
  });
});
