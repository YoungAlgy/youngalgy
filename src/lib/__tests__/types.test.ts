import { describe, it, expect } from "vitest";
import {
  normalizeStatus,
  formatSalary,
  isAwaitingReply,
  isStale,
  mapOpportunityToJob,
  type Opportunity,
} from "@/lib/types";

describe("normalizeStatus", () => {
  it("returns 'applied' for null/undefined/empty", () => {
    expect(normalizeStatus(null)).toBe("applied");
    expect(normalizeStatus(undefined)).toBe("applied");
    expect(normalizeStatus("")).toBe("applied");
  });

  it("maps known status strings to canonical enum", () => {
    expect(normalizeStatus("saved")).toBe("saved");
    expect(normalizeStatus("applied")).toBe("applied");
    expect(normalizeStatus("interview")).toBe("interview");
    expect(normalizeStatus("offer")).toBe("offer");
    expect(normalizeStatus("rejected")).toBe("rejected");
    expect(normalizeStatus("ghosted")).toBe("ghosted");
    expect(normalizeStatus("withdrew")).toBe("withdrew");
  });

  it("normalizes phone-screen variants", () => {
    expect(normalizeStatus("phone_screen")).toBe("phone_screen");
    expect(normalizeStatus("phone screen")).toBe("phone_screen");
    expect(normalizeStatus("phonescreen")).toBe("phone_screen");
    expect(normalizeStatus("PHONE_SCREEN")).toBe("phone_screen");
    expect(normalizeStatus("Phone Screen")).toBe("phone_screen");
  });

  it("treats 'withdrawn' as 'withdrew'", () => {
    expect(normalizeStatus("withdrawn")).toBe("withdrew");
    expect(normalizeStatus("Withdrawn")).toBe("withdrew");
  });

  it("falls back to 'applied' for unknown strings", () => {
    expect(normalizeStatus("interviewing")).toBe("applied");
    expect(normalizeStatus("xyz")).toBe("applied");
  });
});

describe("formatSalary", () => {
  it("returns undefined for null/undefined/zero", () => {
    expect(formatSalary(null)).toBeUndefined();
    expect(formatSalary(undefined)).toBeUndefined();
    expect(formatSalary(0)).toBeUndefined();
  });

  it("formats positive numbers with USD locale separators", () => {
    expect(formatSalary(50000)).toBe("$50,000");
    expect(formatSalary(125000)).toBe("$125,000");
    expect(formatSalary(1500000)).toBe("$1,500,000");
  });

  it("handles small values", () => {
    expect(formatSalary(1)).toBe("$1");
    expect(formatSalary(20)).toBe("$20"); // a $20/hr min ask in our funnel
  });
});

describe("isAwaitingReply", () => {
  it("true when status is 'applied' (or null) and no first_reply_at", () => {
    expect(isAwaitingReply({ status: "applied", first_reply_at: null })).toBe(true);
    expect(isAwaitingReply({ status: null, first_reply_at: null })).toBe(true);
  });

  it("false once first_reply_at is set", () => {
    expect(
      isAwaitingReply({ status: "applied", first_reply_at: "2026-04-29T00:00:00Z" }),
    ).toBe(false);
  });

  it("false for terminal statuses regardless of first_reply_at", () => {
    expect(isAwaitingReply({ status: "rejected", first_reply_at: null })).toBe(false);
    expect(isAwaitingReply({ status: "interview", first_reply_at: null })).toBe(false);
    expect(isAwaitingReply({ status: "offer", first_reply_at: null })).toBe(false);
  });
});

describe("isStale", () => {
  it("false when not awaiting (terminal status)", () => {
    expect(
      isStale({
        status: "rejected",
        first_reply_at: null,
        created_at: new Date(0).toISOString(),
      }),
    ).toBe(false);
  });

  it("false when awaiting but younger than threshold", () => {
    const recent = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    expect(
      isStale({ status: "applied", first_reply_at: null, created_at: recent }, 14),
    ).toBe(false);
  });

  it("true when awaiting and older than threshold", () => {
    const old = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    expect(
      isStale({ status: "applied", first_reply_at: null, created_at: old }, 14),
    ).toBe(true);
  });

  it("default threshold is 14 days", () => {
    const fifteenDays = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();
    expect(
      isStale({ status: "applied", first_reply_at: null, created_at: fifteenDays }),
    ).toBe(true);
  });
});

describe("mapOpportunityToJob", () => {
  const baseOpp: Opportunity = {
    id: "abc123",
    bot_type: "manual",
    title: "Healthcare Recruiter",
    company: "AdeptID",
    url: "https://www.linkedin.com/jobs/view/4407170012/",
    source: "linkedin",
    location: "United States (Remote)",
    score: 9,
    salary_low: 65000,
    status: "applied",
    reasoning: "Strong fit",
    cover_letter: null,
    proposal: null,
    notes: "Submitted with youngalgy@gmail.com",
    created_at: "2026-04-29T05:30:00Z",
    first_reply_at: null,
    reply_kind: null,
  };

  it("maps every required field correctly", () => {
    const job = mapOpportunityToJob(baseOpp);
    expect(job.id).toBe("abc123");
    expect(job.company).toBe("AdeptID");
    expect(job.position).toBe("Healthcare Recruiter");
    expect(job.location).toBe("United States (Remote)");
    expect(job.salary).toBe("$65,000");
    expect(job.salaryRaw).toBe(65000);
    expect(job.status).toBe("applied");
    expect(job.appliedDate).toBe("2026-04-29T05:30:00Z");
    expect(job.url).toBe("https://www.linkedin.com/jobs/view/4407170012/");
    expect(job.score).toBe(9);
    expect(job.notes).toBe("Submitted with youngalgy@gmail.com");
  });

  it("falls back location to 'Unknown' when null", () => {
    const job = mapOpportunityToJob({ ...baseOpp, location: null });
    expect(job.location).toBe("Unknown");
  });

  it("uses reasoning as notes when notes is null", () => {
    const job = mapOpportunityToJob({ ...baseOpp, notes: null });
    expect(job.notes).toBe("Strong fit");
  });

  it("normalizes weird status strings", () => {
    expect(mapOpportunityToJob({ ...baseOpp, status: "phone screen" }).status).toBe(
      "phone_screen",
    );
    expect(mapOpportunityToJob({ ...baseOpp, status: "withdrawn" }).status).toBe("withdrew");
    expect(mapOpportunityToJob({ ...baseOpp, status: null }).status).toBe("applied");
  });

  it("returns undefined salary when salary_low is null/zero", () => {
    expect(mapOpportunityToJob({ ...baseOpp, salary_low: null }).salary).toBeUndefined();
    expect(mapOpportunityToJob({ ...baseOpp, salary_low: 0 }).salary).toBeUndefined();
  });
});
