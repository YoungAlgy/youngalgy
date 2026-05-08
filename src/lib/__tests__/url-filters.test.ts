import { describe, it, expect } from "vitest";
import { DEFAULT_FILTERS, type Filters } from "@/components/FilterBar";
import {
  filtersFromParams,
  paramsFromFilters,
  VALID_REPLY_STATES,
} from "@/lib/url-filters";

describe("filtersFromParams", () => {
  it("returns sane defaults from an empty URL", () => {
    const f = filtersFromParams(new URLSearchParams());
    expect(f.statuses).toEqual([]);
    expect(f.sources).toEqual([]);
    expect(f.dateRange).toBe("all");
    expect(f.customFrom).toBeUndefined();
    expect(f.customTo).toBeUndefined();
    expect(f.salaryMin).toBe(0);
    expect(f.hasUrl).toBe(false);
    expect(f.replyState).toBe("all");
  });

  it("parses comma-separated statuses + sources", () => {
    const f = filtersFromParams(
      new URLSearchParams("status=applied,interview&source=linkedin,wellfound"),
    );
    expect(f.statuses).toEqual(["applied", "interview"]);
    expect(f.sources).toEqual(["linkedin", "wellfound"]);
  });

  it("filters out empty fragments from the comma-split", () => {
    const f = filtersFromParams(new URLSearchParams("status=applied,,interview,"));
    expect(f.statuses).toEqual(["applied", "interview"]);
  });

  it("parses salaryMin as a number; falls back to 0 on garbage", () => {
    expect(filtersFromParams(new URLSearchParams("salaryMin=50000")).salaryMin).toBe(50000);
    expect(filtersFromParams(new URLSearchParams("salaryMin=abc")).salaryMin).toBe(0);
    expect(filtersFromParams(new URLSearchParams("salaryMin=0")).salaryMin).toBe(0);
  });

  it("treats hasUrl=1 as true; everything else as false", () => {
    expect(filtersFromParams(new URLSearchParams("hasUrl=1")).hasUrl).toBe(true);
    expect(filtersFromParams(new URLSearchParams("hasUrl=true")).hasUrl).toBe(false);
    expect(filtersFromParams(new URLSearchParams("hasUrl=0")).hasUrl).toBe(false);
    expect(filtersFromParams(new URLSearchParams("hasUrl=")).hasUrl).toBe(false);
  });

  it("only accepts valid replyState values; falls back to 'all'", () => {
    expect(filtersFromParams(new URLSearchParams("reply=awaiting")).replyState).toBe("awaiting");
    expect(filtersFromParams(new URLSearchParams("reply=stale")).replyState).toBe("stale");
    expect(filtersFromParams(new URLSearchParams("reply=replied")).replyState).toBe("replied");
    expect(filtersFromParams(new URLSearchParams("reply=garbage")).replyState).toBe("all");
    expect(filtersFromParams(new URLSearchParams("reply=")).replyState).toBe("all");
  });

  it("passes through custom date range", () => {
    const f = filtersFromParams(
      new URLSearchParams("range=custom&from=2026-04-01&to=2026-04-29"),
    );
    expect(f.dateRange).toBe("custom");
    expect(f.customFrom).toBe("2026-04-01");
    expect(f.customTo).toBe("2026-04-29");
  });
});

describe("paramsFromFilters", () => {
  it("returns an empty URLSearchParams when everything is at defaults", () => {
    const p = paramsFromFilters(DEFAULT_FILTERS, "", "kanban", "score");
    expect(p.toString()).toBe("");
  });

  it("encodes statuses + sources as comma joins", () => {
    const f: Filters = {
      ...DEFAULT_FILTERS,
      statuses: ["applied", "interview"],
      sources: ["linkedin", "wellfound"],
    };
    const p = paramsFromFilters(f, "", "kanban", "score");
    expect(p.get("status")).toBe("applied,interview");
    expect(p.get("source")).toBe("linkedin,wellfound");
  });

  it("omits salaryMin when 0 (default), encodes when >0", () => {
    expect(paramsFromFilters({ ...DEFAULT_FILTERS, salaryMin: 0 }, "", "kanban", "score").get("salaryMin")).toBeNull();
    expect(paramsFromFilters({ ...DEFAULT_FILTERS, salaryMin: 50000 }, "", "kanban", "score").get("salaryMin")).toBe(
      "50000",
    );
  });

  it("encodes hasUrl only when true", () => {
    expect(paramsFromFilters({ ...DEFAULT_FILTERS, hasUrl: false }, "", "kanban", "score").get("hasUrl")).toBeNull();
    expect(paramsFromFilters({ ...DEFAULT_FILTERS, hasUrl: true }, "", "kanban", "score").get("hasUrl")).toBe("1");
  });

  it("omits view when 'kanban' (default), encodes table/company", () => {
    expect(paramsFromFilters(DEFAULT_FILTERS, "", "kanban", "score").get("view")).toBeNull();
    expect(paramsFromFilters(DEFAULT_FILTERS, "", "table", "score").get("view")).toBe("table");
    expect(paramsFromFilters(DEFAULT_FILTERS, "", "company", "score").get("view")).toBe("company");
  });

  it("omits sort when 'score' (default), encodes other keys", () => {
    expect(paramsFromFilters(DEFAULT_FILTERS, "", "kanban", "score").get("sort")).toBeNull();
    expect(paramsFromFilters(DEFAULT_FILTERS, "", "kanban", "date").get("sort")).toBe("date");
    expect(paramsFromFilters(DEFAULT_FILTERS, "", "kanban", "salary").get("sort")).toBe("salary");
  });

  it("encodes search query as 'q'", () => {
    expect(paramsFromFilters(DEFAULT_FILTERS, "Healthcare", "kanban", "score").get("q")).toBe(
      "Healthcare",
    );
    expect(paramsFromFilters(DEFAULT_FILTERS, "", "kanban", "score").get("q")).toBeNull();
  });

  it("omits replyState when 'all' (default), encodes others", () => {
    expect(paramsFromFilters({ ...DEFAULT_FILTERS, replyState: "all" }, "", "kanban", "score").get("reply")).toBeNull();
    expect(paramsFromFilters({ ...DEFAULT_FILTERS, replyState: "awaiting" }, "", "kanban", "score").get("reply")).toBe(
      "awaiting",
    );
  });
});

describe("filtersFromParams ↔ paramsFromFilters round-trip", () => {
  it("non-default filters survive a round-trip", () => {
    const original: Filters = {
      statuses: ["applied", "phone_screen"],
      sources: ["linkedin"],
      dateRange: "custom",
      customFrom: "2026-04-01",
      customTo: "2026-04-29",
      salaryMin: 60000,
      hasUrl: true,
      replyState: "awaiting",
    };
    const params = paramsFromFilters(original, "Recruiter", "table", "date");
    const recovered = filtersFromParams(params);
    expect(recovered).toEqual(original);
    expect(params.get("q")).toBe("Recruiter");
    expect(params.get("view")).toBe("table");
    expect(params.get("sort")).toBe("date");
  });

  it("default filters round-trip to empty URL string", () => {
    const params = paramsFromFilters(DEFAULT_FILTERS, "", "kanban", "score");
    const recovered = filtersFromParams(params);
    expect(recovered).toEqual(DEFAULT_FILTERS);
  });
});

describe("VALID_REPLY_STATES", () => {
  it("contains the 4 known reply-state values", () => {
    expect(VALID_REPLY_STATES.has("all")).toBe(true);
    expect(VALID_REPLY_STATES.has("awaiting")).toBe(true);
    expect(VALID_REPLY_STATES.has("stale")).toBe(true);
    expect(VALID_REPLY_STATES.has("replied")).toBe(true);
  });

  it("does not contain anything else", () => {
    expect(VALID_REPLY_STATES.size).toBe(4);
  });
});
