import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ALGY_HOUSE_EXTERIOR_DOOR,
  ALGY_HOUSE_RETURN_POSE,
  HOUSE_DOOR_FADE_MS,
  houseDoorCharacterAlpha,
  shouldEnterAlgyHouse,
} from "./algyHouseDoor";

describe("Algy's House exterior doorway", () => {
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

  it("uses the House as the root page without adding local game routes", () => {
    const homeSource = readFileSync(resolve(process.cwd(), "src/pages/AlgyHouseHome.tsx"), "utf8");
    const appSource = readFileSync(resolve(process.cwd(), "src/App.tsx"), "utf8");

    expect(appSource).toContain('path="/"');
    expect(appSource).toContain("AlgyHouseHome");
    expect(homeSource).toContain('data-testid="house-door-transition"');
    expect(appSource).not.toMatch(/path="\/(?:pixel|basic|casino|poker|blackjack|fishing|downs)/);
  });

  it("exits the released personal House to the separate Toggle Town site", () => {
    const homeSource = readFileSync(resolve(process.cwd(), "src/pages/AlgyHouseHome.tsx"), "utf8");
    const appSource = readFileSync(resolve(process.cwd(), "src/App.tsx"), "utf8");

    expect(homeSource).toContain('algyHouseTownReturnHref(import.meta.env.DEV, characterId)');
    expect(homeSource).toContain('import.meta.env.DEV ? "/pixel" : "https://toggle.town/"');
    expect(homeSource).not.toContain('window.location.assign("/pixel")');
    expect(appSource).not.toContain('path="/pixel"');
  });
});
