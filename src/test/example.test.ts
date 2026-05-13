/**
 * Sanity tests for the `cn()` utility (clsx + tailwind-merge).
 *
 * cn() is used pervasively across every component for class composition.
 * These tests verify the core contract — conditional classes and
 * Tailwind conflict resolution — so a broken import or wrong merge
 * strategy is caught immediately.
 */
import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("concatenates plain strings", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("filters out falsy values", () => {
    // false && "b" evaluates to false — pass the evaluated form directly so
    // no-constant-binary-expression doesn't fire on the literal `false &&`.
    expect(cn("a", false, null, undefined, "c")).toBe("a c");
  });

  it("resolves Tailwind conflicts — last value wins (tailwind-merge)", () => {
    // p-4 is overridden by p-6
    expect(cn("p-4", "p-6")).toBe("p-6");
    // bg-red-500 is overridden by bg-blue-500
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("handles object syntax (clsx shorthand)", () => {
    expect(cn({ "font-bold": true, italic: false })).toBe("font-bold");
  });

  it("handles conditional classes", () => {
    const active = true;
    const hidden = false;
    expect(cn("base", active && "active", hidden && "hidden")).toBe("base active");
  });
});
