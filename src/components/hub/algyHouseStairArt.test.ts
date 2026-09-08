import { describe, expect, it, vi } from "vitest";
import { drawAlgyHouseRoomShell } from "./algyHouseRoomArt";
import { ALGY_HOUSE_STAIRS_UP_ORIGIN, ALGY_HOUSE_STAIRS_UP_OPENING, ALGY_HOUSE_STAIRS_UP,
  ALGY_HOUSE_GROUND_STAIR_RETURN, algyHouseStairFootOffset } from "./algyHouseScene";

describe("fine ground stair art alignment", () => {
  it("keeps the stair walking route fixed while fine-tuning its art", () => {
    expect(ALGY_HOUSE_STAIRS_UP_ORIGIN).toEqual({ x: 0.8125, y: -0.375 });
    expect(ALGY_HOUSE_STAIRS_UP_OPENING).toEqual({ x: 1, y: 0 });
    expect(ALGY_HOUSE_STAIRS_UP).toEqual({ x: 1, y: 1 });
    expect(ALGY_HOUSE_GROUND_STAIR_RETURN).toMatchObject({ x: 5, y: 1 });
  });
  it("nudges the wall opening three pixels left without moving the entry tile", () => {
    const context = { fillRect: vi.fn(), save: vi.fn(), restore: vi.fn() };
    drawAlgyHouseRoomShell(context as unknown as CanvasRenderingContext2D, null, "ground");
    expect(context.fillRect).toHaveBeenCalledWith(45, -33, 30, 48);
    expect(context.fillRect).toHaveBeenCalledWith(45, -36, 33, 6);
    expect(ALGY_HOUSE_STAIRS_UP_OPENING).toEqual({ x: 1, y: 0 });
  });
  it("blends the first step's height without a jump at the tread", () => {
    expect(algyHouseStairFootOffset("ground", 5, 1)).toBe(0);
    expect(algyHouseStairFootOffset("ground", 4.5, 1)).toBe(0);
    expect(algyHouseStairFootOffset("ground", 4, 1)).toBe(0);
    expect(algyHouseStairFootOffset("ground", 3.5, 1)).toBe(-18);
    expect(algyHouseStairFootOffset("ground", 3, 1)).toBe(-36);
    expect(algyHouseStairFootOffset("ground", 1, 1)).toBe(-72);
    expect(algyHouseStairFootOffset("ground", 4.001, 1)).toBe(0);
    expect(algyHouseStairFootOffset("ground", 3.999, 1)).toBeCloseTo(0, 1);
    expect(algyHouseStairFootOffset("ground", 3.001, 1)).toBeCloseTo(-36, 1);
    expect(algyHouseStairFootOffset("ground", 2.999, 1)).toBeCloseTo(-36, 1);
  });
  it("does not lift the room floor or change upstairs descent", () => {
    expect(algyHouseStairFootOffset("ground", 4, 2)).toBe(0);
    for (const y of [1, 1.01, 1.5, 1.99, 2]) {
      expect(algyHouseStairFootOffset("ground", 4, y)).toBe(0);
    }
    expect(algyHouseStairFootOffset("ground", 5.01, 1)).toBe(0);
    expect(algyHouseStairFootOffset("upstairs", 1, 2)).toBe(0);
    expect(algyHouseStairFootOffset("upstairs", 2.5, 2)).toBe(24);
    expect(algyHouseStairFootOffset("upstairs", 4, 2)).toBe(48);
  });
});
