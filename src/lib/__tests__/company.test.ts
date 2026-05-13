import { describe, it, expect } from "vitest";
import { displayCompany } from "@/lib/company";

describe("displayCompany", () => {
  it("returns empty string for null/undefined/empty input", () => {
    expect(displayCompany(null)).toBe("");
    expect(displayCompany(undefined)).toBe("");
    expect(displayCompany("")).toBe("");
  });

  it("applies the override for known stripped-punctuation names", () => {
    expect(displayCompany("shugarman bath")).toBe("Shugarman's Bath");
    expect(displayCompany("shugarmans bath")).toBe("Shugarman's Bath");
  });

  it("override match is case-insensitive", () => {
    expect(displayCompany("Shugarman Bath")).toBe("Shugarman's Bath");
    expect(displayCompany("SHUGARMAN BATH")).toBe("Shugarman's Bath");
  });

  it("passes through names not in the override map unchanged", () => {
    expect(displayCompany("Ava Health")).toBe("Ava Health");
    expect(displayCompany("Google")).toBe("Google");
    expect(displayCompany("HCA Healthcare")).toBe("HCA Healthcare");
  });

  it("trims leading/trailing whitespace before lookup", () => {
    expect(displayCompany("  shugarman bath  ")).toBe("Shugarman's Bath");
  });
});
