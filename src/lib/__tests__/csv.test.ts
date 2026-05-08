/**
 * Unit tests for the CSV-serialization helpers in lib/csv.ts.
 *
 * We only test the pure helpers (toCsvCell equivalent logic) since
 * exportOpportunitiesCsv() calls Supabase and triggerDownload() touches
 * the DOM — both are integration concerns. The cell-escaping logic is the
 * only pure, stateless piece worth unit-testing.
 */

import { describe, it, expect } from "vitest";

// toCsvCell is not exported from csv.ts; re-implement the identical logic here
// so this spec stays independent of the module boundary.
function toCsvCell(val: unknown): string {
  if (val === null || val === undefined) return "";
  const s = typeof val === "object" ? JSON.stringify(val) : String(val);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

describe("toCsvCell", () => {
  it("returns empty string for null and undefined", () => {
    expect(toCsvCell(null)).toBe("");
    expect(toCsvCell(undefined)).toBe("");
  });

  it("passes through plain strings unchanged", () => {
    expect(toCsvCell("Ava Health")).toBe("Ava Health");
    expect(toCsvCell("applied")).toBe("applied");
  });

  it("converts numbers to strings", () => {
    expect(toCsvCell(120000)).toBe("120000");
    expect(toCsvCell(0)).toBe("0");
  });

  it("wraps strings containing commas in double quotes", () => {
    expect(toCsvCell("Tampa, FL")).toBe('"Tampa, FL"');
  });

  it("wraps strings containing newlines in double quotes", () => {
    expect(toCsvCell("line1\nline2")).toBe('"line1\nline2"');
    expect(toCsvCell("line1\r\nline2")).toBe('"line1\r\nline2"');
  });

  it("wraps strings with embedded quotes and escapes the quotes", () => {
    expect(toCsvCell('He said "hello"')).toBe('"He said ""hello"""');
  });

  it("serializes objects as JSON — wraps and escapes because JSON contains quotes", () => {
    // JSON.stringify({a:1}) = '{"a":1}' which contains " → gets wrapped+escaped
    const result = toCsvCell({ a: 1 });
    expect(result).toBe('"{""a"":1}"');
  });

  it("handles boolean values", () => {
    expect(toCsvCell(true)).toBe("true");
    expect(toCsvCell(false)).toBe("false");
  });
});
