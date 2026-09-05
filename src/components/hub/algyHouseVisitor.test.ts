import { describe, expect, it } from "vitest";
import {
  algyHouseTownReturnHref,
  algyHouseVisitorHref,
  hasExplicitHouseVisitor,
  houseCharacterFromSearch,
  houseVisitorReloadHref,
  isAlgyHouseTownArrival,
  townVisitorReloadHref,
} from "./algyHouseVisitor";

describe("Algy's House visitor handoff", () => {
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

