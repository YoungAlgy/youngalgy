import { describe, expect, it } from "vitest";
import { GBA_FRAME_MS, HUB_RUN_STEP_MS, HUB_WALK_STEP_MS, hubMovementDelta, hubMovementFrame, hubStepDuration } from "./hubMovement";

describe("shared FireRed movement timing", () => {
  it("takes 16 native frames per walking tile and 8 per running tile", () => {
    expect(hubStepDuration(false)).toBe(16 * GBA_FRAME_MS);
    expect(hubStepDuration(true)).toBe(8 * GBA_FRAME_MS);
    expect(HUB_WALK_STEP_MS).toBeCloseTo(267.8833, 4);
    expect(HUB_RUN_STEP_MS).toBeCloseTo(133.94165, 4);
    expect(HUB_RUN_STEP_MS * 2).toBe(HUB_WALK_STEP_MS);
  });

  it("cycles all six poses over two tiles, with alternating feet", () => {
    expect([0, 1 / 3, 2 / 3].map(progress => hubMovementFrame(0, progress, true))).toEqual([0, 1, 2]);
    expect([0, 1 / 3, 2 / 3].map(progress => hubMovementFrame(1, progress, true))).toEqual([3, 4, 5]);
    expect(hubMovementFrame(1, 1, true)).toBe(hubMovementFrame(2, 0, true));
    expect(hubMovementFrame(77, 0.8, false)).toBe(0);
  });

  it("matches visual ground speed at Town and House grid scales", () => {
    for (const sprinting of [false, true]) {
      expect(64 / hubStepDuration(sprinting, 64)).toBeCloseTo(48 / hubStepDuration(sprinting, 48), 10);
      expect(64 / hubStepDuration(sprinting, 64)).toBeCloseTo(32 / hubStepDuration(sprinting), 10);
    }
    expect(hubStepDuration(false, 64)).toBeCloseTo(535.7666, 4);
    expect(hubStepDuration(false, 48)).toBeCloseTo(401.82495, 4);
    // Half a Town tile and two-thirds of a House tile are the same footstep.
    expect(hubMovementFrame(0, 0.5, true, 64)).toBe(3);
    expect(hubMovementFrame(0, 2 / 3, true, 48)).toBe(3);
    expect(hubMovementFrame(0, 1, true, 48)).toBe(hubMovementFrame(1, 0, true, 48));
  });

  it.each([30, 60, 120, 144])("retains travel time with remainder at %ifps", fps => {
    for (const sprinting of [false, true]) {
      let progress = 0;
      let steps = 0;
      for (let tick = 0; tick < fps; tick++) {
        progress += hubMovementDelta(1000 / fps) / hubStepDuration(sprinting);
        if (progress >= 1) { steps++; progress -= 1; }
      }
      expect(steps + progress).toBeCloseTo(1000 / hubStepDuration(sprinting), 10);
    }
  });

  it("bounds a stalled frame to less than one sprint tile", () => {
    expect(hubMovementDelta(-1)).toBe(0);
    expect(hubMovementDelta(16)).toBe(16);
    expect(hubMovementDelta(60_000)).toBe(100);
    expect(hubMovementDelta(60_000)).toBeLessThan(HUB_RUN_STEP_MS);
  });
});
