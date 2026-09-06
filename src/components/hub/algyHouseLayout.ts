import type { AlgyHouseFloor } from "./algyHouseScene";

/** Local two-floor furniture layout. Source art is shared across both rooms. */
export interface HouseLayoutRect { x: number; y: number; width: number; height: number }
export interface HouseDecor {
  id: string;
  source: HouseLayoutRect;
  art: HouseLayoutRect;
  /** Only the object's footprint blocks feet. Tall backs may overlap a player behind it. */
  solid: HouseLayoutRect;
}

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
    art: { x: 11, y: 1, width: 2, height: 2 }, solid: { x: 11, y: 1, width: 2, height: 2 } },
  { id: "coffee-table", source: { x: 128, y: 160, width: 32, height: 32 },
    art: { x: 9 + 1 / 3, y: 2 + 2 / 3, width: 4 / 3, height: 4 / 3 }, solid: { x: 9, y: 3, width: 2, height: 1 } },
  // Restore the previous square table with four verified native gray chairs.
  { id: "dining-table", source: { x: 0, y: 240, width: 32, height: 32 },
    art: { x: 2, y: 3.5, width: 2, height: 2 }, solid: { x: 2, y: 4, width: 2, height: 2 } },
  { id: "dining-chair-west", source: { x: 144, y: 288, width: 16, height: 32 },
    art: { x: 1 + 1 / 3, y: 4 + 7 / 12, width: 2 / 3, height: 4 / 3 }, solid: { x: 1, y: 5, width: 1, height: 1 } },
  { id: "dining-chair-east", source: { x: 160, y: 288, width: 16, height: 32 },
    art: { x: 4, y: 4 + 7 / 12, width: 2 / 3, height: 4 / 3 }, solid: { x: 4, y: 5, width: 1, height: 1 } },
  // Pair the original side-facing gray chairs rather than introducing new views.
  { id: "dining-chair-west-upper", source: { x: 144, y: 288, width: 16, height: 32 },
    art: { x: 1 + 1 / 3, y: 3 + 7 / 12, width: 2 / 3, height: 4 / 3 }, solid: { x: 1, y: 4, width: 1, height: 1 } },
  { id: "dining-chair-east-upper", source: { x: 160, y: 288, width: 16, height: 32 },
    art: { x: 4, y: 3 + 7 / 12, width: 2 / 3, height: 4 / 3 }, solid: { x: 4, y: 4, width: 1, height: 1 } },
  { id: "floor-lamp", source: { x: 32, y: 240, width: 16, height: 48 },
    art: { x: 11.5, y: 3.375, width: 1, height: 3 }, solid: { x: 12, y: 5, width: 1, height: 1 } },
  { id: "entry-plant", source: { x: 48, y: 240, width: 16, height: 32 },
    art: { x: 1, y: 6, width: 1, height: 2 }, solid: { x: 1, y: 7, width: 1, height: 1 } },
];

export const ALGY_HOUSE_UPSTAIRS_FURNITURE: readonly HouseDecor[] = [
  { id: "computer-desk", source: { x: 64, y: 0, width: 48, height: 32 },
    art: { x: 10, y: 1 + 2 / 3, width: 2, height: 4 / 3 }, solid: { x: 10, y: 2, width: 2, height: 1 } },
  // The existing side-on bed has transparent margins. Align its actual pixels
  // to tile (3,5), and block the mattress/bed frame, never the surrounding rug.
  { id: "bed", source: { x: 128, y: 0, width: 48, height: 48 },
    art: { x: 3 - 11 / 16, y: 5 - 13 / 16, width: 3, height: 3 }, solid: { x: 3, y: 5, width: 3, height: 2 } },
  { id: "bedside-table", source: { x: 160, y: 160, width: 16, height: 32 },
    art: { x: 5.5, y: 4, width: 1, height: 2 }, solid: { x: 6, y: 5, width: 1, height: 1 } },
  { id: "bookcase", source: { x: 96, y: 240, width: 32, height: 48 },
    art: { x: 7, y: -0.5, width: 2, height: 3 }, solid: { x: 7, y: 1, width: 2, height: 1 } },
  { id: "wardrobe", source: { x: 64, y: 240, width: 32, height: 48 },
    art: { x: 11, y: 4, width: 2, height: 3 }, solid: { x: 11, y: 6, width: 2, height: 1 } },
  { id: "office-plant", source: { x: 128, y: 240, width: 16, height: 32 },
    art: { x: 10, y: 4, width: 1, height: 2 }, solid: { x: 10, y: 5, width: 1, height: 1 } },
];

export function algyHouseFurnitureForFloor(floor: AlgyHouseFloor): readonly HouseDecor[] {
  return floor === "upstairs" ? ALGY_HOUSE_UPSTAIRS_FURNITURE : ALGY_HOUSE_GROUND_FURNITURE;
}

export function algyHouseFurnitureAt(x: number, y: number, floor: AlgyHouseFloor = "ground"): HouseDecor | null {
  return algyHouseFurnitureForFloor(floor).find(({ solid }) =>
    x >= solid.x && x < solid.x + solid.width && y >= solid.y && y < solid.y + solid.height) ?? null;
}

export function houseDecorDepth(item: HouseDecor): number {
  return item.solid.y + item.solid.height;
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
