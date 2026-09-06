import { describe, expect, it } from "vitest";
import {
  ALGY_HOUSE_EXTERIOR_DOOR,
  ALGY_HOUSE_RETURN_POSE,
  HOUSE_DOOR_FADE_MS,
  algyHouseEntranceHref,
  houseDoorCharacterAlpha,
  shouldEnterAlgyHouse,
} from "./algyHouseDoor";

describe("Algy's House exterior doorway", () => {
  it("keeps both directions of the dedicated preview on the local site", () => {
    expect(algyHouseEntranceHref(true)).toBe("/");
  });

  it("uses the personal site's house unless local preview is explicitly enabled", () => {
    expect(algyHouseEntranceHref(false)).toBe("https://youngalgy.com/");
    expect(algyHouseEntranceHref()).toBe("https://youngalgy.com/");
  });

  it("turns the blocked north step at Algy's porch into room entry", () => {
    expect(ALGY_HOUSE_EXTERIOR_DOOR).toEqual({ x: 31, y: 28 });
    expect(shouldEnterAlgyHouse({ x: 31, y: 28 }, { dx: 0, dy: -1 })).toBe(true);
    expect(shouldEnterAlgyHouse({ x: 31, y: 28 }, { dx: 0, dy: 1 })).toBe(false);
    expect(shouldEnterAlgyHouse({ x: 31, y: 29 }, { dx: 0, dy: -1 })).toBe(false);
  });

  it("returns outside on the same safe porch tile facing away from the door", () => {
    expect(ALGY_HOUSE_RETURN_POSE).toEqual({ x: 31, y: 28, dir: "s" });
  });

  it("fades the character out and back in around the black scene swap", () => {
    expect(houseDoorCharacterAlpha("out", 0)).toBe(1);
    expect(houseDoorCharacterAlpha("out", HOUSE_DOOR_FADE_MS / 2)).toBe(0.5);
    expect(houseDoorCharacterAlpha("out", HOUSE_DOOR_FADE_MS)).toBe(0);
    expect(houseDoorCharacterAlpha("hold", 0)).toBe(0);
    expect(houseDoorCharacterAlpha("in", 0)).toBe(0);
    expect(houseDoorCharacterAlpha("in", HOUSE_DOOR_FADE_MS / 2)).toBe(0.5);
    expect(houseDoorCharacterAlpha("in", HOUSE_DOOR_FADE_MS)).toBe(1);
    expect(houseDoorCharacterAlpha("idle", 0)).toBe(1);
  });

});
