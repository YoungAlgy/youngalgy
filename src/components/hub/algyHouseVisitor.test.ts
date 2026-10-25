import { describe, expect, it } from "vitest";
import {
  algyHouseExitHref,
  algyHouseTownReturnHref,
  algyHouseVisitorHref,
  hasExplicitHouseVisitor,
  houseCharacterFromSearch,
  houseVisitorReloadHref,
  isAlgyHouseTownArrival,
  townVisitorReloadHref,
} from "./algyHouseVisitor";

describe("Algy's House visitor handoff", () => {
  it.each(["algy", "mitch"] as const)("returns local %s visits to the fixed Town porch", (character) => {
    for (const explicitVisitor of [false, true]) {
      const target = new URL(algyHouseExitHref(true, "http://127.0.0.1:4185", character, explicitVisitor));
      expect(target.origin + target.pathname).toBe("http://127.0.0.1:4182/pixel");
      expect([...target.searchParams.entries()]).toEqual([["character", character], ["return", "algy-porch"]]);
      expect(target.hash).toBe("");
    }
  });

  it.each([
    "http://localhost:4185", "http://127.0.0.1:4182", "https://127.0.0.1:4185",
    "http://127.0.0.1:4185.bad.test", "https://youngalgy.com", "https://bad.test/?return=http://127.0.0.1:4185",
  ])("does not enable the local pair from %s", (origin) => {
    expect(algyHouseExitHref(true, origin, "mitch", true)).toBe("/pixel?character=mitch&return=algy-porch");
    expect(algyHouseExitHref(true, origin, "algy", false)).toBe("/pixel");
  });

  it("keeps both production exit paths even on the local origin", () => {
    for (const origin of ["http://127.0.0.1:4185", "https://youngalgy.com"]) {
      expect(algyHouseExitHref(false, origin, "mitch", true)).toBe("https://toggle.town/pixel?character=mitch&return=algy-porch");
      expect(algyHouseExitHref(false, origin, "algy", false)).toBe("https://toggle.town/");
    }
  });

  it("accepts only Mitch and defaults every other value to Algy", () => {
    expect(houseCharacterFromSearch("?character=mitch")).toBe("mitch");
    expect(houseCharacterFromSearch("?character=algy")).toBe("algy");
    expect(houseCharacterFromSearch("?character=anything&next=https://bad.test")).toBe("algy");
    expect(hasExplicitHouseVisitor("?character=mitch")).toBe(true);
    expect(hasExplicitHouseVisitor("?character=anything")).toBe(false);
  });

  it("builds fixed house and town URLs without accepting redirect input", () => {
    expect(algyHouseVisitorHref("/", "mitch")).toBe("/?character=mitch&return=algy-porch");
    expect(algyHouseVisitorHref("https://youngalgy.com/", "algy")).toBe("https://youngalgy.com/?character=algy&return=algy-porch");
    expect(algyHouseTownReturnHref(true, "mitch")).toBe("/pixel?character=mitch&return=algy-porch");
    expect(algyHouseTownReturnHref(false, "mitch")).toBe("https://toggle.town/pixel?character=mitch&return=algy-porch");
  });

  it("recognizes and consumes only the fixed one-time arrival marker", () => {
    expect(isAlgyHouseTownArrival("?character=mitch&return=algy-porch")).toBe(true);
    expect(isAlgyHouseTownArrival("?return=https://bad.test")).toBe(false);
    expect(houseVisitorReloadHref("/?character=mitch&return=algy-porch")).toBe("/?character=mitch");
    expect(townVisitorReloadHref("/pixel?return=algy-porch", "mitch")).toBe("/pixel?character=mitch");
  });
});
