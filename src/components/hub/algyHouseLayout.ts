import type { AlgyHouseFloor, HousePoint } from "./algyHouseScene";

/** Local two-floor furniture layout. Source art is shared across both rooms. */
export interface HouseLayoutRect { x: number; y: number; width: number; height: number }
export type HouseDecor = {
  id: string;
  source: HouseLayoutRect;
  art: HouseLayoutRect;
  blockedEdges?: ReadonlyArray<readonly [HousePoint, HousePoint]>;
} & ({
  /** Only the object's footprint blocks feet. Tall backs may overlap a player behind it. */
  solid: HouseLayoutRect;
  /** Preserve the visual foot row when the collision shape is offset. */
  depth?: number;
} | {
  /** Art can share a furniture footprint, or block only the edge between tiles. */
  solid: null;
  depth: number;
});

// New atlas cuts are appended below the original 256x160 image.
export const HOUSE_PLANK_ART = { x: 0, y: 160, width: 48, height: 32 } as const;
export const HOUSE_RUG_ART = { x: 0, y: 192, width: 64, height: 48 } as const;
export const HOUSE_RUG_POSITION = { x: 8, y: 3.5, width: 4, height: 3 } as const;
export const HOUSE_BEDROOM_RUG_ART = { x: 176, y: 160, width: 32, height: 16 } as const;
// Small runner beside the open edge of the bed, clear of the nightstand.
export const HOUSE_BEDROOM_RUG_POSITION = { x: 3.125, y: 6.75, width: 2, height: 1 } as const;
export const HOUSE_COUCH_TV_ART = { x: 112, y: 288, width: 32, height: 32 } as const;
// Center the wider screen on the table. Its pedestal meets the tabletop at 2x.
export const HOUSE_COUCH_TV_POSITION = { x: 9 + 1 / 3, y: 2 + 1 / 12, width: 4 / 3, height: 4 / 3 } as const;

export const ALGY_HOUSE_GROUND_FURNITURE: readonly HouseDecor[] = [
  { id: "sofa", source: { x: 64, y: 160, width: 32, height: 32 },
    art: { x: 9 + 1 / 3, y: 4 + 2 / 3, width: 4 / 3, height: 4 / 3 }, solid: { x: 9, y: 5, width: 2, height: 1 } },
  { id: "palm", source: { x: 96, y: 160, width: 32, height: 32 },
    // The canopy overlaps the back walkway. Only the pot's lower row blocks feet.
    art: { x: 11, y: 1, width: 2, height: 2 }, solid: { x: 11, y: 2, width: 2, height: 1 } },
  { id: "coffee-table", source: { x: 128, y: 160, width: 32, height: 32 },
    art: { x: 9 + 1 / 3, y: 2 + 2 / 3, width: 4 / 3, height: 4 / 3 }, solid: { x: 9, y: 3, width: 2, height: 1 } },
  // A single furniture row leaves the floor strips above and below open.
  { id: "dining-table", source: { x: 0, y: 240, width: 32, height: 32 },
    art: { x: 2, y: 3.5, width: 2, height: 2 }, solid: { x: 2, y: 4, width: 2, height: 1 } },
  { id: "dining-chair-west", source: { x: 144, y: 288, width: 16, height: 32 },
    art: { x: 1 + 1 / 3, y: 4 + 7 / 12, width: 2 / 3, height: 4 / 3 }, solid: { x: 1, y: 4, width: 1, height: 1 } },
  { id: "dining-chair-east", source: { x: 160, y: 288, width: 16, height: 32 },
    art: { x: 4, y: 4 + 7 / 12, width: 2 / 3, height: 4 / 3 }, solid: { x: 4, y: 4, width: 1, height: 1 } },
  // Pair the original side-facing gray chairs rather than introducing new views.
  // Each upper seat shares its lower seat's blocked row, leaving row three open.
  { id: "dining-chair-west-upper", source: { x: 144, y: 288, width: 16, height: 32 },
    art: { x: 1 + 1 / 3, y: 3 + 7 / 12, width: 2 / 3, height: 4 / 3 }, solid: null, depth: 5 },
  { id: "dining-chair-east-upper", source: { x: 160, y: 288, width: 16, height: 32 },
    art: { x: 4, y: 3 + 7 / 12, width: 2 / 3, height: 4 / 3 }, solid: null, depth: 5 },
  { id: "floor-lamp", source: { x: 32, y: 240, width: 16, height: 48 },
    // Stand on either side, but go around the lamp instead of crossing its base.
    art: { x: 11.5, y: 3.375, width: 1, height: 3 }, solid: null,
    blockedEdges: [
      [{ x: 11, y: 5 }, { x: 12, y: 5 }],
      [{ x: 11, y: 5 }, { x: 11, y: 4 }],
      [{ x: 12, y: 5 }, { x: 12, y: 4 }],
    ], depth: 6 },
  { id: "entry-plant", source: { x: 48, y: 240, width: 16, height: 32 },
    // Stand above or below the pot, but walk around its right side to pass it.
    art: { x: 1, y: 6, width: 1, height: 2 }, solid: null,
    blockedEdges: [[{ x: 1, y: 6 }, { x: 1, y: 7 }]], depth: 7.5 },
];

export const ALGY_HOUSE_UPSTAIRS_FURNITURE: readonly HouseDecor[] = [
  { id: "computer-desk", source: { x: 64, y: 0, width: 48, height: 32 },
    // Stand at the computer, but walk around it to reach the floor behind it.
    art: { x: 10, y: 1 + 2 / 3, width: 2, height: 4 / 3 }, solid: { x: 11, y: 2, width: 1, height: 1 },
    blockedEdges: [[{ x: 10, y: 2 }, { x: 10, y: 1 }]] },
  // The existing side-on bed has transparent margins. Align its actual pixels
  // to tile (3,5). Keep the three floor tiles below the mattress open.
  { id: "bed", source: { x: 128, y: 0, width: 48, height: 48 },
    art: { x: 3 - 11 / 16, y: 5 - 13 / 16, width: 3, height: 3 }, solid: { x: 3, y: 5, width: 3, height: 1 }, depth: 7 },
  { id: "bedside-table", source: { x: 160, y: 160, width: 16, height: 32 },
    // Stand beside the nightstand, but go around its right side to pass it.
    art: { x: 5.5, y: 4, width: 1, height: 2 }, solid: null,
    blockedEdges: [[{ x: 6, y: 5 }, { x: 6, y: 4 }]], depth: 6 },
  { id: "bookcase", source: { x: 96, y: 240, width: 32, height: 48 },
    art: { x: 7, y: -0.5, width: 2, height: 3 }, solid: { x: 7, y: 1, width: 2, height: 1 } },
  { id: "wardrobe", source: { x: 64, y: 240, width: 32, height: 48 },
    art: { x: 11, y: 4, width: 2, height: 3 }, solid: null,
    blockedEdges: [
      [{ x: 11, y: 6 }, { x: 11, y: 5 }],
      [{ x: 12, y: 6 }, { x: 12, y: 5 }],
    ], depth: 7 },
  { id: "office-plant", source: { x: 128, y: 240, width: 16, height: 32 },
    // Keep both standing tiles open, with no north/south crossing through the pot.
    art: { x: 10, y: 4, width: 1, height: 2 }, solid: null,
    blockedEdges: [[{ x: 10, y: 5 }, { x: 10, y: 4 }]], depth: 6 },
];

export function algyHouseFurnitureForFloor(floor: AlgyHouseFloor): readonly HouseDecor[] {
  return floor === "upstairs" ? ALGY_HOUSE_UPSTAIRS_FURNITURE : ALGY_HOUSE_GROUND_FURNITURE;
}

export function algyHouseFurnitureAt(x: number, y: number, floor: AlgyHouseFloor = "ground"): HouseDecor | null {
  return algyHouseFurnitureForFloor(floor).find(({ solid }) =>
    solid && x >= solid.x && x < solid.x + solid.width && y >= solid.y && y < solid.y + solid.height) ?? null;
}

export function algyHouseFurnitureBlocksStep(floor: AlgyHouseFloor, from: HousePoint, to: HousePoint): boolean {
  const samePoint = (a: HousePoint, b: HousePoint) => a.x === b.x && a.y === b.y;
  return algyHouseFurnitureForFloor(floor).some(({ blockedEdges }) => blockedEdges?.some(([a, b]) =>
    (samePoint(from, a) && samePoint(to, b)) ||
    (samePoint(from, b) && samePoint(to, a))
  ));
}

export function houseDecorDepth(item: HouseDecor): number {
  const footprint = item.solid ?? item.art;
  return item.depth ?? footprint.y + footprint.height;
}

/** Show the whole downstairs composition, including its raised back wall, on a phone. */
export function algyHouseGroundView(width: number, height: number) {
  const zoom = Math.max(0.1, Math.min(1.35, (width - 24) / 624, (height - 130) / 516));
  return {
    zoom,
    cameraX: 336,
    cameraY: 198,
    centerX: Math.round(width / 2),
    centerY: Math.round(width < 768 && height > width ? height * 0.4 : height / 2),
  };
}
