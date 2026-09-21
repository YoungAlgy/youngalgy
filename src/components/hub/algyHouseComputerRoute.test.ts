import { describe, expect, it } from "vitest";
import {
  ALGY_HOUSE_COMPUTER_APPROACH,
  algyHouseComputerRoute,
} from "./algyHouseComputerRoute";
import {
  ALGY_HOUSE_COLS,
  ALGY_HOUSE_HOST,
  ALGY_HOUSE_ROWS,
  algyHouseStep,
  isAlgyHouseWalkable,
  type HouseDirection,
  type HousePoint,
} from "./algyHouseScene";
import type { HouseCharacterId } from "./algyHouseVisitor";

const DIRECTIONS: readonly HouseDirection[] = ["n", "e", "s", "w"];

function replay(start: HousePoint, route: HouseDirection[], characterId: HouseCharacterId): HousePoint {
  return route.reduce<HousePoint>((point, direction) => {
    const step = algyHouseStep("upstairs", point, direction, characterId);
    expect(step, `blocked step from ${point.x},${point.y} ${direction}`).not.toBeNull();
    expect(step?.transition, `transition from ${point.x},${point.y} ${direction}`).toBeNull();
    return step!.point;
  }, start);
}

function shortestSafeDistance(start: HousePoint, characterId: HouseCharacterId): number | null {
  const queue = [{ point: start, distance: 0 }];
  const visited = new Set([`${start.x},${start.y}`]);
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const current = queue[cursor];
    if (current.point.x === ALGY_HOUSE_COMPUTER_APPROACH.x && current.point.y === ALGY_HOUSE_COMPUTER_APPROACH.y) {
      return current.distance;
    }
    for (const direction of DIRECTIONS) {
      const step = algyHouseStep("upstairs", current.point, direction, characterId);
      if (!step || step.transition !== null) continue;
      const key = `${step.point.x},${step.point.y}`;
      if (visited.has(key)) continue;
      visited.add(key);
      queue.push({ point: step.point, distance: current.distance + 1 });
    }
  }
  return null;
}

describe("algyHouseComputerRoute", () => {
  it("exports the fixed tile and facing direction in front of the computer", () => {
    expect(ALGY_HOUSE_COMPUTER_APPROACH).toEqual({ x: 10, y: 2, dir: "n" });
  });

  it("returns no ground-floor route and an empty route at the target", () => {
    expect(algyHouseComputerRoute("ground", { x: 10, y: 2 }, "algy")).toBeNull();
    expect(algyHouseComputerRoute("upstairs", { x: 10, y: 2 }, "algy")).toEqual([]);
    expect(algyHouseComputerRoute("upstairs", { x: 10, y: 2 }, "mitch")).toEqual([]);
  });

  for (const characterId of ["algy", "mitch"] as const) {
    it(`finds a shortest transition-free route from every valid upstairs tile for ${characterId}`, () => {
      for (let y = 0; y < ALGY_HOUSE_ROWS; y += 1) {
        for (let x = 0; x < ALGY_HOUSE_COLS; x += 1) {
          if (!isAlgyHouseWalkable("upstairs", x, y, characterId)) continue;
          const start = { x, y };
          const route = algyHouseComputerRoute("upstairs", start, characterId);
          const shortest = shortestSafeDistance(start, characterId);
          expect(route, `route from ${x},${y}`).not.toBeNull();
          expect(route?.length, `shortest route from ${x},${y}`).toBe(shortest);
          expect(replay(start, route!, characterId)).toEqual({ x: 10, y: 2 });
        }
      }
    });
  }

  it("respects the host collision and routes around blocked furniture edges", () => {
    expect(isAlgyHouseWalkable("upstairs", ALGY_HOUSE_HOST.x, ALGY_HOUSE_HOST.y, "mitch")).toBe(false);
    const mitchRoute = algyHouseComputerRoute("upstairs", { x: 9, y: 4 }, "mitch");
    expect(mitchRoute).not.toBeNull();
    expect(replay({ x: 9, y: 4 }, mitchRoute!, "mitch")).toEqual({ x: 10, y: 2 });

    expect(algyHouseStep("upstairs", { x: 10, y: 1 }, "s", "algy")).toBeNull();
    const blockedEdgeRoute = algyHouseComputerRoute("upstairs", { x: 10, y: 1 }, "algy");
    expect(blockedEdgeRoute).not.toBeNull();
    expect(blockedEdgeRoute?.length).toBeGreaterThan(1);
    expect(replay({ x: 10, y: 1 }, blockedEdgeRoute!, "algy")).toEqual({ x: 10, y: 2 });
  });

  it("never takes the downstairs transition from a stair tile", () => {
    expect(algyHouseStep("upstairs", { x: 3, y: 2 }, "e", "algy")?.transition).toBe("ground");
    const route = algyHouseComputerRoute("upstairs", { x: 3, y: 2 }, "algy");
    expect(route).not.toBeNull();
    expect(route?.[0]).not.toBe("e");
    expect(replay({ x: 3, y: 2 }, route!, "algy")).toEqual({ x: 10, y: 2 });
  });

  it("rejects blocked, fractional, and out-of-bounds starts", () => {
    expect(algyHouseComputerRoute("upstairs", { x: 11, y: 2 }, "algy")).toBeNull();
    expect(algyHouseComputerRoute("upstairs", { x: 1.5, y: 3 }, "algy")).toBeNull();
    expect(algyHouseComputerRoute("upstairs", { x: ALGY_HOUSE_COLS, y: 2 }, "algy")).toBeNull();
  });
});
