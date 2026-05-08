import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { daysSince, hoursSince, formatRelativeDate } from "@/lib/dates";

describe("daysSince", () => {
  beforeEach(() => {
    // Pin "now" to 2026-05-08T12:00:00Z
    vi.setSystemTime(new Date("2026-05-08T12:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 0 for today's date", () => {
    expect(daysSince("2026-05-08T06:00:00Z")).toBe(0);
  });

  it("returns 1 for yesterday", () => {
    expect(daysSince("2026-05-07T10:00:00Z")).toBe(1);
  });

  it("returns 14 for two weeks ago", () => {
    expect(daysSince("2026-04-24T12:00:00Z")).toBe(14);
  });

  it("never returns a negative number (future date)", () => {
    expect(daysSince("2026-05-09T12:00:00Z")).toBe(0);
  });
});

describe("hoursSince", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2026-05-08T12:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns ~3 hours for a 3-hour-old timestamp", () => {
    expect(hoursSince("2026-05-08T09:00:00Z")).toBeCloseTo(3, 0);
  });

  it("returns 0 for a future timestamp", () => {
    expect(hoursSince("2026-05-08T15:00:00Z")).toBe(0);
  });
});

describe("formatRelativeDate", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2026-05-08T12:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows 'Today' for same-day timestamps", () => {
    expect(formatRelativeDate("2026-05-08T06:00:00Z")).toBe("Today");
  });

  it("shows 'Yesterday' for 1-day-old timestamps", () => {
    expect(formatRelativeDate("2026-05-07T10:00:00Z")).toBe("Yesterday");
  });

  it("shows 'N days ago' for 2–6 day old timestamps", () => {
    expect(formatRelativeDate("2026-05-06T12:00:00Z")).toBe("2 days ago");
    expect(formatRelativeDate("2026-05-04T12:00:00Z")).toBe("4 days ago");
    expect(formatRelativeDate("2026-05-03T12:00:00Z")).toBe("5 days ago");
  });

  it("shows 'MMM D' for timestamps 7+ days old (boundary at exactly 7)", () => {
    // Exactly 7 days → d === 7 → not < 7 → falls through to MMM D format
    expect(formatRelativeDate("2026-05-01T12:00:00Z")).toBe("May 1");
    // 14 days — well into the MMM D range
    expect(formatRelativeDate("2026-04-24T12:00:00Z")).toBe("Apr 24");
    expect(formatRelativeDate("2026-01-15T12:00:00Z")).toBe("Jan 15");
  });

  it("shows '6 days ago' for 6-day-old timestamps (last case before MMM D)", () => {
    expect(formatRelativeDate("2026-05-02T12:00:00Z")).toBe("6 days ago");
  });
});
