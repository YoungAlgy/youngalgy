import { describe, expect, it } from "vitest";
import {
  ALGY_HOUSE_GROUND_FURNITURE,
  ALGY_HOUSE_UPSTAIRS_FURNITURE,
  algyHouseFurnitureAt,
  algyHouseFurnitureForFloor,
  algyHouseGroundView,
  houseDecorDepth,
  HOUSE_RUG_ART,
  HOUSE_RUG_POSITION,
  HOUSE_BEDROOM_RUG_ART,
  HOUSE_BEDROOM_RUG_POSITION,
  HOUSE_COUCH_TV_ART,
  HOUSE_COUCH_TV_POSITION,
} from "./algyHouseLayout";
import {
  ALGY_HOUSE_COLS,
  ALGY_HOUSE_DOOR,
  ALGY_HOUSE_GROUND_STAIR_RETURN,
  ALGY_HOUSE_HOST,
  ALGY_HOUSE_ROWS,
  ALGY_HOUSE_SPAWN,
  ALGY_HOUSE_STAIRS_UP,
  ALGY_HOUSE_UPSTAIRS_DOOR,
  ALGY_HOUSE_UPSTAIRS_SPAWN,
  algyHouseArrivalForFloor,
  algyHouseHostFacing,
  algyHouseStep,
  isAlgyHouseWalkable,
  type HouseDirection,
  type HousePlayer,
} from "./algyHouseScene";
import type { HouseCharacterId } from "./algyHouseVisitor";

const CARDINALS: ReadonlyArray<{ direction: HouseDirection; x: number; y: number }> = [
  { direction: "n", x: 0, y: -1 },
  { direction: "s", x: 0, y: 1 },
  { direction: "w", x: -1, y: 0 },
  { direction: "e", x: 1, y: 0 },
];

function reachableTiles(floor: "ground" | "upstairs", characterId: HouseCharacterId): Set<string> {
  const start = floor === "ground" ? ALGY_HOUSE_SPAWN : { x: 1, y: 2 };
  const visited = new Set<string>([`${start.x},${start.y}`]);
  const queue = [{ x: start.x, y: start.y }];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const direction of CARDINALS) {
      const step = algyHouseStep(floor, current, direction.direction, characterId);
      if (!step) continue;
      const key = `${step.point.x},${step.point.y}`;
      if (!visited.has(key)) {
        visited.add(key);
        // A floor transition is reachable, but never a same-floor bridge.
        if (step.transition === null) queue.push(step.point);
      }
    }
  }
  return visited;
}

function allWalkableTiles(floor: "ground" | "upstairs", characterId: HouseCharacterId): Set<string> {
  const tiles = new Set<string>();
  for (let y = 0; y < ALGY_HOUSE_ROWS; y += 1) {
    for (let x = 0; x < ALGY_HOUSE_COLS; x += 1) {
      if (isAlgyHouseWalkable(floor, x, y, characterId)) tiles.add(`${x},${y}`);
    }
  }
  return tiles;
}

describe("Algy's House ground-floor layout", () => {
  it("gives the bedroom its own compact bedside cabinet and runner", () => {
    const nightstand = ALGY_HOUSE_UPSTAIRS_FURNITURE.find(item => item.id === "bedside-table")!;
    const coffeeTable = ALGY_HOUSE_GROUND_FURNITURE.find(item => item.id === "coffee-table")!;
    expect(nightstand.source).not.toEqual(coffeeTable.source);
    expect(nightstand.art).toEqual({ x: 5.5, y: 4, width: 1, height: 2 });
    expect(HOUSE_BEDROOM_RUG_ART).not.toEqual(HOUSE_RUG_ART);
    expect(HOUSE_BEDROOM_RUG_POSITION.width).toBeLessThan(HOUSE_RUG_POSITION.width);
    expect(HOUSE_BEDROOM_RUG_POSITION.y).toBeGreaterThan(6.5);
    // The rug is floor decor, with no additional collision or blocked passage.
    for (const x of [3, 4, 5]) expect(isAlgyHouseWalkable("upstairs", x, 7)).toBe(true);
  });

  it("centers the wide TV on the coffee table with its pedestal touching the tabletop", () => {
    expect(HOUSE_COUCH_TV_ART).toEqual({ x: 112, y: 288, width: 32, height: 32 });
    expect(HOUSE_COUCH_TV_POSITION).toEqual({ x: 9 + 1 / 3, y: 2 + 1 / 12, width: 4 / 3, height: 4 / 3 });
    const coffeeTable = ALGY_HOUSE_GROUND_FURNITURE.find(item => item.id === "coffee-table")!;
    const displayScale = HOUSE_COUCH_TV_POSITION.height * 48 / HOUSE_COUCH_TV_ART.height;
    const pedestalBottomY = HOUSE_COUCH_TV_POSITION.y * 48 + displayScale * 31;
    const tvCenterX = (HOUSE_COUCH_TV_POSITION.x + HOUSE_COUCH_TV_POSITION.width / 2) * 48;
    const coffeeTableCenterX = (coffeeTable.art.x + coffeeTable.art.width / 2) * 48;
    const tabletopTopY = coffeeTable.art.y * 48 + displayScale * 11;
    const tabletopBottomY = coffeeTable.art.y * 48 + displayScale * 21;
    expect(pedestalBottomY).toBe(162);
    expect(pedestalBottomY).toBeGreaterThanOrEqual(tabletopTopY);
    expect(pedestalBottomY).toBeLessThanOrEqual(tabletopBottomY);
    expect(tvCenterX).toBe(coffeeTableCenterX);
  });

  it("blocks every furniture foot tile", () => {
    for (const item of ALGY_HOUSE_GROUND_FURNITURE) {
      if (!item.solid) continue;
      for (let y = item.solid.y; y < item.solid.y + item.solid.height; y += 1) {
        for (let x = item.solid.x; x < item.solid.x + item.solid.width; x += 1) {
          expect(algyHouseFurnitureAt(x, y)?.id).toBe(item.id);
          expect(isAlgyHouseWalkable("ground", x, y)).toBe(false);
        }
      }
    }
  });

  it("moves the computer desk upstairs and clears its old ground footprint", () => {
    expect(ALGY_HOUSE_GROUND_FURNITURE.map((item) => item.id)).not.toContain("computer-desk");
    expect(ALGY_HOUSE_UPSTAIRS_FURNITURE.find((item) => item.id === "computer-desk")).toEqual({
      id: "computer-desk",
      source: { x: 64, y: 0, width: 48, height: 32 },
      art: { x: 10, y: 1 + 2 / 3, width: 2, height: 4 / 3 },
      solid: { x: 11, y: 2, width: 1, height: 1 },
      blockedEdges: [[{ x: 10, y: 2 }, { x: 10, y: 1 }]],
    });
    expect(algyHouseFurnitureForFloor("ground")).toBe(ALGY_HOUSE_GROUND_FURNITURE);
    expect(algyHouseFurnitureForFloor("upstairs")).toBe(ALGY_HOUSE_UPSTAIRS_FURNITURE);
    expect(algyHouseFurnitureAt(1, 4)?.id).toBe("dining-chair-west");
    expect(isAlgyHouseWalkable("ground", 1, 4)).toBe(false);
    expect(algyHouseFurnitureAt(10, 2, "ground")).toBeNull();
    expect(algyHouseFurnitureAt(10, 2, "upstairs")).toBeNull();
    expect(algyHouseFurnitureAt(11, 2, "upstairs")?.id).toBe("computer-desk");
    expect(isAlgyHouseWalkable("upstairs", 10, 2)).toBe(true);
    expect(isAlgyHouseWalkable("upstairs", 11, 2)).toBe(false);
  });

  it("blocks the upstairs bed while leaving the floor beside the nightstand open", () => {
    for (const x of [3, 4, 5]) {
      expect(algyHouseFurnitureAt(x, 5, "upstairs")?.id).toBe("bed");
      expect(isAlgyHouseWalkable("upstairs", x, 5)).toBe(false);
      expect(algyHouseFurnitureAt(x, 6, "upstairs")).toBeNull();
      expect(isAlgyHouseWalkable("upstairs", x, 6)).toBe(true);
    }
    expect(algyHouseFurnitureAt(6, 5, "upstairs")).toBeNull();
    expect(isAlgyHouseWalkable("upstairs", 6, 5)).toBe(true);
    expect(isAlgyHouseWalkable("upstairs", 6, 6)).toBe(true);
  });

  it("restores the square dining table with paired original side chairs and north-facing living-room layout", () => {
    const ground = Object.fromEntries(ALGY_HOUSE_GROUND_FURNITURE.map((item) => [item.id, item.solid]));
    const upstairs = Object.fromEntries(ALGY_HOUSE_UPSTAIRS_FURNITURE.map((item) => [item.id, item.solid]));
    expect(ground).toMatchObject({
      "floor-lamp": null,
      "entry-plant": null,
      "dining-table": { x: 2, y: 4, width: 2, height: 1 },
      "dining-chair-west": { x: 1, y: 4, width: 1, height: 1 },
      "dining-chair-east": { x: 4, y: 4, width: 1, height: 1 },
      "dining-chair-west-upper": null,
      "dining-chair-east-upper": null,
      sofa: { x: 9, y: 5, width: 2, height: 1 },
      palm: { x: 11, y: 2, width: 2, height: 1 },
      "coffee-table": { x: 9, y: 3, width: 2, height: 1 },
    });
    expect(upstairs).toMatchObject({
      bookcase: { x: 7, y: 1, width: 2, height: 1 },
      wardrobe: null,
      "office-plant": null,
      "computer-desk": { x: 11, y: 2, width: 1, height: 1 },
      bed: { x: 3, y: 5, width: 3, height: 1 },
      "bedside-table": null,
    });
    const diningTable = ALGY_HOUSE_GROUND_FURNITURE.find(item => item.id === "dining-table")!;
    expect(diningTable.source).toEqual({ x: 0, y: 240, width: 32, height: 32 });
    expect(diningTable.art).toEqual({ x: 2, y: 3.5, width: 2, height: 2 });
    for (const [x, y] of [[2, 4], [3, 4]]) {
      expect(algyHouseFurnitureAt(x, y)?.id).toBe("dining-table");
      expect(isAlgyHouseWalkable("ground", x, y)).toBe(false);
    }
    const diningChairs: ReadonlyArray<readonly [number, number, string]> = [
      [1, 4, "dining-chair-west"], [4, 4, "dining-chair-east"],
    ];
    for (const [x, y, id] of diningChairs) {
      expect(algyHouseFurnitureAt(x, y)?.id).toBe(id);
      expect(isAlgyHouseWalkable("ground", x, y)).toBe(false);
    }
    expect(ground["dining-chair-west"]).toEqual({ x: 1, y: 4, width: 1, height: 1 });
    expect(ground["dining-chair-east"]).toEqual({ x: 4, y: 4, width: 1, height: 1 });
    expect(ground["dining-chair-west-upper"]).toBeNull();
    expect(ground["dining-chair-east-upper"]).toBeNull();
    expect(ALGY_HOUSE_GROUND_FURNITURE.find(item => item.id === "dining-chair-west")?.art).toEqual({ x: 1 + 1 / 3, y: 4 + 7 / 12, width: 2 / 3, height: 4 / 3 });
    expect(ALGY_HOUSE_GROUND_FURNITURE.find(item => item.id === "dining-chair-east")?.art).toEqual({ x: 4, y: 4 + 7 / 12, width: 2 / 3, height: 4 / 3 });
    expect(ALGY_HOUSE_GROUND_FURNITURE.find(item => item.id === "dining-chair-west-upper")).toMatchObject({ source: { x: 144, y: 288, width: 16, height: 32 }, art: { x: 1 + 1 / 3, y: 3 + 7 / 12, width: 2 / 3, height: 4 / 3 } });
    expect(ALGY_HOUSE_GROUND_FURNITURE.find(item => item.id === "dining-chair-east-upper")).toMatchObject({ source: { x: 160, y: 288, width: 16, height: 32 }, art: { x: 4, y: 3 + 7 / 12, width: 2 / 3, height: 4 / 3 } });
    // The entry tile and the full column-six route stay clear despite four seats.
    expect(isAlgyHouseWalkable("ground", 3, 8)).toBe(true);
    for (let y = 1; y < ALGY_HOUSE_ROWS - 1; y += 1) expect(isAlgyHouseWalkable("ground", 6, y)).toBe(true);
    expect(ALGY_HOUSE_GROUND_FURNITURE.find(item => item.id === "floor-lamp")?.solid).toBeNull();
    expect(ALGY_HOUSE_GROUND_FURNITURE.find(item => item.id === "sofa")?.art).toEqual({ x: 9 + 1 / 3, y: 4 + 2 / 3, width: 4 / 3, height: 4 / 3 });
    expect(ALGY_HOUSE_GROUND_FURNITURE.find(item => item.id === "coffee-table")?.art).toEqual({ x: 9 + 1 / 3, y: 2 + 2 / 3, width: 4 / 3, height: 4 / 3 });
    expect(algyHouseFurnitureAt(9, 1, "upstairs")).toBeNull();
    expect(isAlgyHouseWalkable("upstairs", 9, 1)).toBe(true);
    for (const [floor, furniture] of [["ground", ALGY_HOUSE_GROUND_FURNITURE], ["upstairs", ALGY_HOUSE_UPSTAIRS_FURNITURE]] as const) {
      for (const item of furniture) {
        if (!item.solid) continue;
        for (let y = item.solid.y; y < item.solid.y + item.solid.height; y += 1) {
          for (let x = item.solid.x; x < item.solid.x + item.solid.width; x += 1) {
            expect(algyHouseFurnitureAt(x, y, floor)?.id).toBe(item.id);
            expect(isAlgyHouseWalkable(floor, x, y)).toBe(false);
          }
        }
      }
    }
  });

  it.each(["algy", "mitch"] as const)("lets %s stand on either side of the entry plant without crossing it", (characterId) => {
    const plant = ALGY_HOUSE_GROUND_FURNITURE.find(item => item.id === "entry-plant")!;
    expect(plant.art).toEqual({ x: 1, y: 6, width: 1, height: 2 });
    expect(plant.solid).toBeNull();
    // The plant covers the feet of someone behind it, never someone below it.
    expect(houseDecorDepth(plant)).toBeGreaterThan(7);
    expect(houseDecorDepth(plant)).toBeLessThan(8);
    for (const { startY, y, toward, away } of [
      { startY: 5, y: 6, toward: "s", away: "n" },
      { startY: 8, y: 7, toward: "n", away: "s" },
    ] as const) {
      const point = { x: 1, y };
      expect(isAlgyHouseWalkable("ground", 1, y, characterId)).toBe(true);
      expect(algyHouseFurnitureAt(1, y)).toBeNull();
      expect(algyHouseStep("ground", { x: 1, y: startY }, toward, characterId)).toEqual({ point, transition: null });
      for (let repeat = 0; repeat < 10; repeat += 1) {
        expect(algyHouseStep("ground", point, toward, characterId)).toBeNull();
      }
      expect(algyHouseStep("ground", point, away, characterId)).toEqual({ point: { x: 1, y: startY }, transition: null });
      expect(algyHouseStep("ground", point, "e", characterId)).toEqual({ point: { x: 2, y }, transition: null });
      expect(algyHouseStep("ground", { x: 2, y }, "w", characterId)).toEqual({ point, transition: null });
    }
    // The right-hand detour stays open in both directions.
    expect(algyHouseStep("ground", { x: 2, y: 6 }, "s", characterId)).toEqual({ point: { x: 2, y: 7 }, transition: null });
    expect(algyHouseStep("ground", { x: 2, y: 7 }, "n", characterId)).toEqual({ point: { x: 2, y: 6 }, transition: null });
    // This boundary belongs only to the downstairs plant.
    expect(algyHouseStep("upstairs", { x: 1, y: 6 }, "s", characterId)).toEqual({ point: { x: 1, y: 7 }, transition: null });
    expect(algyHouseStep("upstairs", { x: 1, y: 7 }, "n", characterId)).toEqual({ point: { x: 1, y: 6 }, transition: null });
  });

  it.each(["algy", "mitch"] as const)("lets %s cross all four tiles below the dining set without walking up into it", (characterId) => {
    let point = { x: 5, y: 5 };
    for (const x of [4, 3, 2, 1]) {
      expect(isAlgyHouseWalkable("ground", x, 5, characterId)).toBe(true);
      expect(algyHouseStep("ground", point, "w", characterId)).toEqual({
        point: { x, y: 5 }, transition: null,
      });
      point = { x, y: 5 };
      expect(algyHouseStep("ground", point, "n", characterId)).toBeNull();
    }
    for (const x of [2, 3, 4, 5]) {
      expect(algyHouseStep("ground", point, "e", characterId)).toEqual({
        point: { x, y: 5 }, transition: null,
      });
      point = { x, y: 5 };
    }
  });

  it.each(["algy", "mitch"] as const)("lets %s cross all four tiles above the dining set without walking down into it", (characterId) => {
    let point = { x: 5, y: 3 };
    for (const x of [4, 3, 2, 1]) {
      expect(isAlgyHouseWalkable("ground", x, 3, characterId)).toBe(true);
      expect(algyHouseStep("ground", point, "w", characterId)).toEqual({
        point: { x, y: 3 }, transition: null,
      });
      point = { x, y: 3 };
      expect(algyHouseStep("ground", point, "s", characterId)).toBeNull();
      expect(algyHouseStep("ground", point, "n", characterId)).toEqual({
        point: { x, y: 2 }, transition: null,
      });
    }
    for (const x of [2, 3, 4, 5]) {
      expect(algyHouseStep("ground", point, "e", characterId)).toEqual({
        point: { x, y: 3 }, transition: null,
      });
      point = { x, y: 3 };
    }
  });

  it.each(["algy", "mitch"] as const)("lets %s walk across both tiles behind the palm while its pot stays blocked", (characterId) => {
    const palm = ALGY_HOUSE_GROUND_FURNITURE.find(item => item.id === "palm")!;
    expect(palm.source).toEqual({ x: 96, y: 160, width: 32, height: 32 });
    expect(palm.art).toEqual({ x: 11, y: 1, width: 2, height: 2 });
    expect(houseDecorDepth(palm)).toBe(3);
    let point = { x: 10, y: 1 };
    for (const x of [11, 12]) {
      expect(isAlgyHouseWalkable("ground", x, 1, characterId)).toBe(true);
      expect(algyHouseStep("ground", point, "e", characterId)).toEqual({
        point: { x, y: 1 }, transition: null,
      });
      point = { x, y: 1 };
      expect(algyHouseStep("ground", point, "n", characterId)).toBeNull();
      expect(algyHouseStep("ground", point, "s", characterId)).toBeNull();
      expect(algyHouseFurnitureAt(x, 2)?.id).toBe("palm");
      expect(algyHouseStep("ground", { x, y: 3 }, "n", characterId)).toBeNull();
    }
    expect(algyHouseStep("ground", point, "e", characterId)).toBeNull();
    for (const x of [11, 10]) {
      expect(algyHouseStep("ground", point, "w", characterId)).toEqual({
        point: { x, y: 1 }, transition: null,
      });
      point = { x, y: 1 };
    }
    expect(algyHouseStep("ground", { x: 10, y: 2 }, "e", characterId)).toBeNull();
  });

  it.each(["algy", "mitch"] as const)("lets %s use the outer lamp aisle without crossing the lamp base", (characterId) => {
    const lamp = ALGY_HOUSE_GROUND_FURNITURE.find(item => item.id === "floor-lamp")!;
    expect(lamp.source).toEqual({ x: 32, y: 240, width: 16, height: 48 });
    expect(lamp.art).toEqual({ x: 11.5, y: 3.375, width: 1, height: 3 });
    expect(houseDecorDepth(lamp)).toBe(6);
    expect(isAlgyHouseWalkable("ground", 11, 4, characterId)).toBe(true);
    expect(isAlgyHouseWalkable("ground", 12, 4, characterId)).toBe(true);
    expect(algyHouseFurnitureAt(11, 4)).toBeNull();
    expect(isAlgyHouseWalkable("ground", 11, 5, characterId)).toBe(true);
    expect(isAlgyHouseWalkable("ground", 12, 5, characterId)).toBe(true);
    for (let repeat = 0; repeat < 10; repeat += 1) {
      expect(algyHouseStep("ground", { x: 11, y: 5 }, "n", characterId)).toBeNull();
      expect(algyHouseStep("ground", { x: 11, y: 4 }, "s", characterId)).toBeNull();
      expect(algyHouseStep("ground", { x: 11, y: 5 }, "e", characterId)).toBeNull();
      expect(algyHouseStep("ground", { x: 12, y: 5 }, "w", characterId)).toBeNull();
      expect(algyHouseStep("ground", { x: 12, y: 5 }, "n", characterId)).toBeNull();
      expect(algyHouseStep("ground", { x: 12, y: 4 }, "s", characterId)).toBeNull();
    }
    // Both sides remain reachable via the clear floor around the couch.
    let point = { x: 11, y: 5 };
    for (const [direction, x, y] of [
      ["s", 11, 6], ["e", 12, 6], ["n", 12, 5], ["s", 12, 6],
      ["w", 11, 6], ["w", 10, 6], ["w", 9, 6], ["w", 8, 6],
      ["n", 8, 5], ["n", 8, 4], ["e", 9, 4], ["e", 10, 4],
      ["e", 11, 4], ["e", 12, 4], ["w", 11, 4], ["w", 10, 4],
      ["w", 9, 4], ["w", 8, 4], ["s", 8, 5], ["s", 8, 6],
      ["e", 9, 6], ["e", 10, 6], ["e", 11, 6], ["n", 11, 5],
    ] as const) {
      expect(algyHouseStep("ground", point, direction, characterId)).toEqual({
        point: { x, y }, transition: null,
      });
      point = { x, y };
    }
    expect(algyHouseStep("ground", { x: 11, y: 3 }, "s", characterId)).toEqual({
      point: { x: 11, y: 4 }, transition: null,
    });
    expect(algyHouseStep("ground", { x: 10, y: 4 }, "e", characterId)).toEqual({
      point: { x: 11, y: 4 }, transition: null,
    });
    expect(algyHouseStep("ground", { x: 11, y: 4 }, "n", characterId)).toEqual({
      point: { x: 11, y: 3 }, transition: null,
    });
    expect(algyHouseStep("ground", { x: 11, y: 4 }, "w", characterId)).toEqual({
      point: { x: 10, y: 4 }, transition: null,
    });
    expect(algyHouseStep("ground", { x: 12, y: 5 }, "e", characterId)).toBeNull();
    expect(algyHouseStep("upstairs", { x: 11, y: 5 }, "e", characterId)).toEqual({
      point: { x: 12, y: 5 }, transition: null,
    });
    expect(algyHouseStep("upstairs", { x: 11, y: 5 }, "n", characterId)).toEqual({
      point: { x: 11, y: 4 }, transition: null,
    });
    expect(algyHouseStep("upstairs", { x: 12, y: 5 }, "n", characterId)).toEqual({
      point: { x: 12, y: 4 }, transition: null,
    });
  });

  it.each(["algy", "mitch"] as const)("lets %s step north to the computer while the tower and stereo stay blocked", (characterId) => {
    const point = { x: 10, y: 2 };
    expect(algyHouseStep("upstairs", { x: 10, y: 3 }, "n", characterId)).toEqual({ point, transition: null });
    expect(algyHouseStep("upstairs", point, "s", characterId)).toEqual({ point: { x: 10, y: 3 }, transition: null });
    expect(isAlgyHouseWalkable("upstairs", 10, 1, characterId)).toBe(true);
    expect(isAlgyHouseWalkable("upstairs", 10, 2, characterId)).toBe(true);
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(algyHouseStep("upstairs", point, "n", characterId)).toBeNull();
      expect(algyHouseStep("upstairs", { x: 10, y: 1 }, "s", characterId)).toBeNull();
    }
    expect(algyHouseStep("upstairs", { x: 9, y: 1 }, "e", characterId)).toEqual({
      point: { x: 10, y: 1 }, transition: null,
    });
    expect(algyHouseStep("upstairs", { x: 10, y: 1 }, "w", characterId)).toEqual({
      point: { x: 9, y: 1 }, transition: null,
    });
    expect(algyHouseStep("upstairs", point, "e", characterId)).toBeNull();
    expect(algyHouseStep("upstairs", point, "w", characterId)).toBeNull();
    expect(algyHouseStep("upstairs", { x: 11, y: 3 }, "n", characterId)).toBeNull();
    expect(houseDecorDepth(ALGY_HOUSE_UPSTAIRS_FURNITURE.find(item => item.id === "computer-desk")!)).toBe(3);
  });

  it.each(["algy", "mitch"] as const)("lets %s cross the three floor tiles below the bed", (characterId) => {
    for (const x of [3, 4, 5]) {
      const point = { x, y: 6 };
      expect(algyHouseStep("upstairs", { x: x - 1, y: 6 }, "e", characterId)).toEqual({ point, transition: null });
      expect(algyHouseStep("upstairs", { x: x + 1, y: 6 }, "w", characterId)).toEqual({ point, transition: null });
      expect(algyHouseStep("upstairs", point, "n", characterId)).toBeNull();
      expect(algyHouseStep("upstairs", point, "s", characterId)).toEqual({ point: { x, y: 7 }, transition: null });
      expect(algyHouseStep("upstairs", { x, y: 7 }, "n", characterId)).toEqual({ point, transition: null });
    }
    const bed = ALGY_HOUSE_UPSTAIRS_FURNITURE.find(item => item.id === "bed")!;
    expect(bed.art).toEqual({ x: 3 - 11 / 16, y: 5 - 13 / 16, width: 3, height: 3 });
    expect(houseDecorDepth(bed)).toBe(7);
  });

  it.each(["algy", "mitch"] as const)("lets %s stand at the bedside without crossing through it vertically", (characterId) => {
    const point = { x: 6, y: 5 };
    expect(algyHouseStep("upstairs", { x: 6, y: 6 }, "n", characterId)).toEqual({ point, transition: null });
    expect(algyHouseStep("upstairs", point, "s", characterId)).toEqual({ point: { x: 6, y: 6 }, transition: null });
    // The bedside tile is open, but its tall art cannot be crossed vertically.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      expect(algyHouseStep("upstairs", point, "n", characterId)).toBeNull();
      expect(algyHouseStep("upstairs", { x: 6, y: 4 }, "s", characterId)).toBeNull();
    }
    expect(algyHouseStep("upstairs", point, "e", characterId)).toEqual({ point: { x: 7, y: 5 }, transition: null });
    expect(algyHouseStep("upstairs", { x: 7, y: 5 }, "n", characterId)).toEqual({ point: { x: 7, y: 4 }, transition: null });
    expect(algyHouseStep("upstairs", { x: 7, y: 4 }, "w", characterId)).toEqual({ point: { x: 6, y: 4 }, transition: null });
    expect(algyHouseStep("upstairs", point, "w", characterId)).toBeNull();
    const nightstand = ALGY_HOUSE_UPSTAIRS_FURNITURE.find(item => item.id === "bedside-table")!;
    expect(nightstand.art).toEqual({ x: 5.5, y: 4, width: 1, height: 2 });
    expect(nightstand.solid).toBeNull();
    expect(nightstand.blockedEdges).toEqual([[{ x: 6, y: 5 }, { x: 6, y: 4 }]]);
    expect(houseDecorDepth(nightstand)).toBe(6);
    for (const tile of [{ x: 6, y: 4 }, point, { x: 6, y: 6 }]) {
      expect(isAlgyHouseWalkable("upstairs", tile.x, tile.y, characterId)).toBe(true);
    }
    expect(isAlgyHouseWalkable("upstairs", 5, 5, characterId)).toBe(false);
  });

  it.each(["algy", "mitch"] as const)("lets %s use the open office and wardrobe foot tiles without crossing either prop vertically", (characterId) => {
    const plant = ALGY_HOUSE_UPSTAIRS_FURNITURE.find(item => item.id === "office-plant")!;
    const wardrobe = ALGY_HOUSE_UPSTAIRS_FURNITURE.find(item => item.id === "wardrobe")!;
    expect(plant.art).toEqual({ x: 10, y: 4, width: 1, height: 2 });
    expect(plant.solid).toBeNull();
    expect(plant.blockedEdges).toEqual([[{ x: 10, y: 5 }, { x: 10, y: 4 }]]);
    expect(houseDecorDepth(plant)).toBe(6);
    expect(wardrobe.art).toEqual({ x: 11, y: 4, width: 2, height: 3 });
    expect(wardrobe.solid).toBeNull();
    expect(wardrobe.blockedEdges).toEqual([
      [{ x: 11, y: 6 }, { x: 11, y: 5 }],
      [{ x: 12, y: 6 }, { x: 12, y: 5 }],
    ]);
    expect(houseDecorDepth(wardrobe)).toBe(7);

    for (const point of [{ x: 10, y: 4 }, { x: 10, y: 5 }, { x: 10, y: 6 }, { x: 11, y: 5 }, { x: 11, y: 6 }, { x: 12, y: 5 }, { x: 12, y: 6 }]) {
      expect(algyHouseFurnitureAt(point.x, point.y, "upstairs")).toBeNull();
      expect(isAlgyHouseWalkable("upstairs", point.x, point.y, characterId)).toBe(true);
    }
    expect(algyHouseStep("upstairs", { x: 10, y: 6 }, "n", characterId)).toEqual({
      point: { x: 10, y: 5 }, transition: null,
    });
    expect(algyHouseStep("upstairs", { x: 10, y: 5 }, "s", characterId)).toEqual({
      point: { x: 10, y: 6 }, transition: null,
    });
    for (let attempt = 0; attempt < 2; attempt += 1) {
      expect(algyHouseStep("upstairs", { x: 10, y: 5 }, "n", characterId)).toBeNull();
      expect(algyHouseStep("upstairs", { x: 10, y: 4 }, "s", characterId)).toBeNull();
    }
    expect(algyHouseStep("upstairs", { x: 10, y: 5 }, "w", characterId)).toEqual({
      point: { x: 9, y: 5 }, transition: null,
    });
    expect(algyHouseStep("upstairs", { x: 9, y: 5 }, "n", characterId)).toEqual({
      point: { x: 9, y: 4 }, transition: null,
    });
    expect(algyHouseStep("upstairs", { x: 9, y: 4 }, "e", characterId)).toEqual({
      point: { x: 10, y: 4 }, transition: null,
    });
    expect(algyHouseStep("upstairs", { x: 10, y: 6 }, "e", characterId)).toEqual({
      point: { x: 11, y: 6 }, transition: null,
    });
    expect(algyHouseStep("upstairs", { x: 11, y: 6 }, "e", characterId)).toEqual({
      point: { x: 12, y: 6 }, transition: null,
    });
    expect(algyHouseStep("upstairs", { x: 12, y: 6 }, "w", characterId)).toEqual({
      point: { x: 11, y: 6 }, transition: null,
    });
    expect(algyHouseStep("upstairs", { x: 11, y: 6 }, "w", characterId)).toEqual({
      point: { x: 10, y: 6 }, transition: null,
    });
    for (let attempt = 0; attempt < 2; attempt += 1) {
      expect(algyHouseStep("upstairs", { x: 11, y: 6 }, "n", characterId)).toBeNull();
      expect(algyHouseStep("upstairs", { x: 11, y: 5 }, "s", characterId)).toBeNull();
      expect(algyHouseStep("upstairs", { x: 12, y: 6 }, "n", characterId)).toBeNull();
      expect(algyHouseStep("upstairs", { x: 12, y: 5 }, "s", characterId)).toBeNull();
    }
    // The open foot tiles remain connected by the west detour around the props.
    expect(algyHouseStep("upstairs", { x: 12, y: 6 }, "w", characterId)).toEqual({ point: { x: 11, y: 6 }, transition: null });
    expect(algyHouseStep("upstairs", { x: 11, y: 6 }, "w", characterId)).toEqual({ point: { x: 10, y: 6 }, transition: null });
    expect(algyHouseStep("upstairs", { x: 10, y: 6 }, "n", characterId)).toEqual({ point: { x: 10, y: 5 }, transition: null });
    expect(algyHouseStep("upstairs", { x: 10, y: 5 }, "e", characterId)).toEqual({ point: { x: 11, y: 5 }, transition: null });
    expect(algyHouseStep("upstairs", { x: 11, y: 5 }, "e", characterId)).toEqual({ point: { x: 12, y: 5 }, transition: null });
    expect(algyHouseStep("upstairs", { x: 12, y: 6 }, "e", characterId)).toBeNull();
  });

  it("keeps every remaining walkable ground tile connected for Algy and Mitch", () => {
    for (const characterId of ["algy", "mitch"] as const) {
      expect(reachableTiles("ground", characterId)).toEqual(allWalkableTiles("ground", characterId));
      expect(reachableTiles("ground", characterId)).toContain("3,8");
      expect(reachableTiles("ground", characterId)).toContain("6,1");
    }
  });

  it("keeps every remaining upstairs tile connected and all bedroom destinations reachable", () => {
    for (const characterId of ["algy", "mitch"] as const) {
      const reachable = reachableTiles("upstairs", characterId);
      expect(reachable).toEqual(allWalkableTiles("upstairs", characterId));
      expect(reachable).toContain(`${ALGY_HOUSE_UPSTAIRS_SPAWN.x},${ALGY_HOUSE_UPSTAIRS_SPAWN.y}`);
      expect(reachable).toContain("8,3");
      expect(reachable).toContain(`${ALGY_HOUSE_UPSTAIRS_DOOR.x},${ALGY_HOUSE_UPSTAIRS_DOOR.y - 1}`);
      for (const { x, y } of CARDINALS) {
        const approach = { x: ALGY_HOUSE_HOST.x - x, y: ALGY_HOUSE_HOST.y - y };
        if (isAlgyHouseWalkable("upstairs", approach.x, approach.y, characterId)) {
          expect(reachable).toContain(`${approach.x},${approach.y}`);
        }
      }
    }
    expect(algyHouseArrivalForFloor("ground")).toEqual(ALGY_HOUSE_GROUND_STAIR_RETURN);
    expect(algyHouseArrivalForFloor("upstairs")).toEqual(ALGY_HOUSE_UPSTAIRS_SPAWN);
  });

  it("preserves the door warp, spawn, stair return, stair warp, and Mitch's NPC approach", () => {
    expect(isAlgyHouseWalkable("ground", ALGY_HOUSE_SPAWN.x, ALGY_HOUSE_SPAWN.y, "algy")).toBe(true);
    expect(isAlgyHouseWalkable("ground", ALGY_HOUSE_GROUND_STAIR_RETURN.x, ALGY_HOUSE_GROUND_STAIR_RETURN.y, "algy")).toBe(true);
    expect(algyHouseStep("ground", ALGY_HOUSE_SPAWN, "s", "algy")).toEqual({
      point: ALGY_HOUSE_DOOR,
      transition: "outside",
    });
    expect(algyHouseStep("ground", { x: ALGY_HOUSE_STAIRS_UP.x + 1, y: ALGY_HOUSE_STAIRS_UP.y }, "w", "algy")).toEqual({
      point: ALGY_HOUSE_STAIRS_UP,
      transition: "upstairs",
    });

    const mitchReachable = reachableTiles("upstairs", "mitch");
    const approaches = CARDINALS.flatMap(({ direction, x, y }) => {
      const player: HousePlayer = {
        x: ALGY_HOUSE_HOST.x - x,
        y: ALGY_HOUSE_HOST.y - y,
        dir: direction,
        frame: 0,
      };
      return isAlgyHouseWalkable("upstairs", player.x, player.y, "mitch") &&
        mitchReachable.has(`${player.x},${player.y}`) && algyHouseHostFacing("upstairs", player, "mitch")
        ? [player]
        : [];
    });
    expect(isAlgyHouseWalkable("upstairs", ALGY_HOUSE_HOST.x, ALGY_HOUSE_HOST.y, "mitch")).toBe(false);
    expect(approaches.length).toBeGreaterThan(0);
  });

  it.each([
    [320, 568],
    [375, 812],
    [390, 844],
    [834, 1112],
    [1280, 800],
    [844, 390],
  ])("keeps the full ground shell visible at %ix%i", (width, height) => {
    const view = algyHouseGroundView(width, height);
    const screenX = (worldX: number) => view.centerX + (worldX - view.cameraX) * view.zoom;
    const screenY = (worldY: number) => view.centerY + (worldY - view.cameraY) * view.zoom;
    expect(screenX(27)).toBeGreaterThanOrEqual(0);
    expect(screenX(645)).toBeLessThanOrEqual(width);
    expect(screenY(-57)).toBeGreaterThanOrEqual(0);
    expect(screenY(459)).toBeLessThanOrEqual(height);
  });

  it("keeps every furniture source rectangle inside the 256x320 atlas", () => {
    for (const { source } of [...ALGY_HOUSE_GROUND_FURNITURE, ...ALGY_HOUSE_UPSTAIRS_FURNITURE]) {
      expect(source.x).toBeGreaterThanOrEqual(0);
      expect(source.y).toBeGreaterThanOrEqual(0);
      expect(source.x + source.width).toBeLessThanOrEqual(256);
      expect(source.y + source.height).toBeLessThanOrEqual(320);
    }
  });

  it("uses each furniture object's foot row or between-tile base for depth", () => {
    expect(Object.fromEntries(ALGY_HOUSE_GROUND_FURNITURE.map((item) => [item.id, houseDecorDepth(item)]))).toEqual({
      sofa: 6,
      palm: 3,
      "coffee-table": 4,
      "dining-table": 5,
      "dining-chair-west": 5,
      "dining-chair-east": 5,
      "dining-chair-west-upper": 5,
      "dining-chair-east-upper": 5,
      "floor-lamp": 6,
      "entry-plant": 7.5,
    });
    expect(Object.fromEntries(ALGY_HOUSE_UPSTAIRS_FURNITURE.map((item) => [item.id, houseDecorDepth(item)]))).toEqual({
      "computer-desk": 3,
      bed: 7,
      "bedside-table": 6,
      bookcase: 2,
      wardrobe: 7,
      "office-plant": 6,
    });
  });
});
