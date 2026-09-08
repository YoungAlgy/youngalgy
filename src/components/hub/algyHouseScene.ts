import type { HouseCharacterId } from "./algyHouseVisitor";
import { algyHouseFurnitureAt, algyHouseFurnitureBlocksStep, type HouseLayoutRect } from "./algyHouseLayout";

export type HouseDirection = "n" | "s" | "e" | "w";

export interface HousePoint {
  x: number;
  y: number;
}

export interface HousePlayer extends HousePoint {
  dir: HouseDirection;
  frame: number;
}

export type AlgyHouseFloor = "ground" | "upstairs";
export type AlgyHouseTransition = "outside" | AlgyHouseFloor;

export type HouseFeatureId = "crt" | "skull" | "window" | "stereo";

export interface HouseFeature extends HousePoint {
  id: HouseFeatureId;
  floor: AlgyHouseFloor;
  width: number;
  height: number;
  verb: string;
  label: string;
  /** Separate the tall art from its floor-level collision footprint. */
  art?: HouseLayoutRect;
}

export const ALGY_HOUSE_SCENE_KEY = "toggle-town:scene";
export const ALGY_HOUSE_PLAYER_KEY = "toggle-town:algy-house-player";
export const ALGY_HOUSE_FLOOR_KEY = "toggle-town:algy-house-floor";
export const ALGY_HOUSE_SCENE = "algy-house";
export const ALGY_HOUSE_DEFAULT_FLOOR: AlgyHouseFloor = "ground";
export const ALGY_HOUSE_TRACK = "/audio/toggletown-original.mp3";
export const ALGY_HOUSE_TRACK_LABEL = "Toggle Town / Original Mix";
export const ALGY_HOUSE_ATLAS = "/sprites/interiors/algy_house_16.png";
export const ALGY_HOUSE_SKULL = "/sprites/interiors/algy-skull-detail.svg";
export const ALGY_HOUSE_AVATAR = "/sprites/characters/algy_run.png";
export const ALGY_HOUSE_MITCH_AVATAR = "/sprites/characters/mitch_run.png";
export const ALGY_HOUSE_HOST = { x: 9, y: 3, dir: "s", frame: 0 } as const;
export const ALGY_HOUSE_MITCH_GREETING = "Money Mitch!! Great to see you bro!!";

/** Algy waits by the upstairs computer when Mitch visits. Never create a double. */
export function algyHouseHasHost(floor: AlgyHouseFloor, characterId: HouseCharacterId): boolean {
  return floor === "upstairs" && characterId === "mitch";
}

export function algyHouseHostFacing(floor: AlgyHouseFloor, player: HousePlayer, characterId: HouseCharacterId): boolean {
  if (!algyHouseHasHost(floor, characterId)) return false;
  const vector = DIRECTION_VECTOR[player.dir];
  return player.x + vector.x === ALGY_HOUSE_HOST.x && player.y + vector.y === ALGY_HOUSE_HOST.y;
}

/** The CRT is used from its open front tile, without changing its collision edges. */
export function algyHouseComputerFacing(floor: AlgyHouseFloor, player: HousePlayer): boolean {
  return floor === "upstairs" && player.x === 10 && player.y === 2 && player.dir === "n";
}

export const ALGY_HOUSE_COLS = 14;
export const ALGY_HOUSE_ROWS = 10;
export const ALGY_HOUSE_TILE = 48;
export const ALGY_HOUSE_SPAWN: HousePlayer = { x: 3, y: 8, dir: "n", frame: 0 };
export const ALGY_HOUSE_DOOR: HousePoint = { x: 3, y: 9 };
// Closed door on the right end of the upstairs south wall. No destination yet.
// Keep its grid cell solid. Only the ground-floor D cell exits to town.
export const ALGY_HOUSE_UPSTAIRS_DOOR: HousePoint = { x: 11, y: 9 };
// Another native pixel left, keeping the stair height and walking route intact.
export const ALGY_HOUSE_STAIRS_UP_ORIGIN: HousePoint = { x: 0.8125, y: -0.375 };
export const ALGY_HOUSE_STAIRS_UP_OPENING: HousePoint = { x: 1, y: 0 };
export const ALGY_HOUSE_STAIRS_UP: HousePoint = { x: 1, y: 1 };
export const ALGY_HOUSE_STAIRWELL_ORIGIN: HousePoint = { x: 2, y: 1 };
export const ALGY_HOUSE_STAIRS_DOWN: HousePoint = { x: 4, y: 2 };
export const ALGY_HOUSE_UPSTAIRS_SPAWN: HousePlayer = { x: 1, y: 2, dir: "w", frame: 0 };
export const ALGY_HOUSE_GROUND_STAIR_RETURN: HousePlayer = { x: 5, y: 1, dir: "e", frame: 0 };

// Ground floor: # wall, . floor, D outside door, B stair body, ^ stair tread,
// U upstairs transition. The compact flight rises west into the upper-left.
// Its center path is entered from the east at column three. Column four is
// ordinary floor beside the lowest step. Floor below it is walkable, but
// vertical steps cannot jump into or off the raised treads.
export const ALGY_HOUSE_GROUND_GRID = [
  "#BBBB#########",
  "#U^^.........#",
  "#............#",
  "#............#",
  "#............#",
  "#............#",
  "#............#",
  "#............#",
  "#............#",
  "###D##########",
] as const;

// Upstairs uses a separate stairwell opening one tile east of its safe landing.
// Walking east over the descending treads to S returns downstairs before the
// avatar reaches the low east post. The rows above and below the opening are
// ordinary floor. Vertical movement still cannot cross into the stair treads.
export const ALGY_HOUSE_UPSTAIRS_GRID = [
  "##############",
  "#............#",
  "#.^^S........#",
  "#............#",
  "#............#",
  "#............#",
  "#............#",
  "#............#",
  "#............#",
  "##############",
] as const;

// Retain the original name for ground-floor consumers and older local state.
export const ALGY_HOUSE_GRID = ALGY_HOUSE_GROUND_GRID;

export const ALGY_HOUSE_FEATURES: readonly HouseFeature[] = [
  { id: "stereo", floor: "upstairs", x: 9, y: 2, width: 1, height: 1,
    art: { x: 9, y: 1.5, width: 1, height: 2 }, verb: "Play", label: ALGY_HOUSE_TRACK_LABEL },
];

const DIRECTION_VECTOR: Record<HouseDirection, HousePoint> = {
  n: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  e: { x: 1, y: 0 },
  w: { x: -1, y: 0 },
};

export function algyHouseGridForFloor(floor: AlgyHouseFloor) {
  return floor === "upstairs" ? ALGY_HOUSE_UPSTAIRS_GRID : ALGY_HOUSE_GROUND_GRID;
}

export function algyHouseArrivalForFloor(floor: AlgyHouseFloor): HousePlayer {
  return floor === "upstairs"
    ? { ...ALGY_HOUSE_UPSTAIRS_SPAWN }
    : { ...ALGY_HOUSE_GROUND_STAIR_RETURN };
}

/** Follow the stair art continuously, including the short rise onto its first tread. */
export function algyHouseStairFootOffset(floor: AlgyHouseFloor, tileX: number, tileY: number): number {
  const stairRow = floor === "ground" ? ALGY_HOUSE_STAIRS_UP.y : ALGY_HOUSE_STAIRS_DOWN.y;
  if (Math.abs(tileY - stairRow) > 0.05) return 0;
  if (floor === "ground" && tileX >= 1 && tileX < 4) {
    const artLift = (ALGY_HOUSE_STAIRS_UP_ORIGIN.y - ALGY_HOUSE_STAIRS_UP_OPENING.y) * ALGY_HOUSE_TILE;
    // Stay at floor height in column four. Blend onto the visible stair at three.
    const entryProgress = Math.min(1, 4 - tileX);
    return ((Math.min(tileX, 3) - 4) * 18 + artLift) * entryProgress;
  }
  if (floor === "upstairs" && tileX >= 1 && tileX <= 4) return (tileX - 1) * 16;
  return 0;
}

export function algyHouseUpstairsDescentAlpha(
  descendingUpstairs: boolean,
  tileX: number,
  tileY: number,
): number {
  if (!descendingUpstairs || Math.abs(tileY - ALGY_HOUSE_STAIRS_DOWN.y) > 0.05) return 1;
  return Math.max(0, Math.min(1, ALGY_HOUSE_STAIRS_DOWN.x - tileX));
}

export function isAlgyHouseWalkable(floor: AlgyHouseFloor, x: number, y: number, characterId: HouseCharacterId = "algy"): boolean {
  if (x < 0 || y < 0 || x >= ALGY_HOUSE_COLS || y >= ALGY_HOUSE_ROWS) return false;
  if (algyHouseHasHost(floor, characterId) && x === ALGY_HOUSE_HOST.x && y === ALGY_HOUSE_HOST.y) return false;
  if (algyHouseFurnitureAt(x, y, floor)) return false;
  if (algyHouseFeatureAt(x, y, floor)) return false;
  const cell = algyHouseGridForFloor(floor)[y]?.[x];
  return cell === "." || cell === "D" || cell === "^" || cell === "U" || cell === "S";
}

export function algyHouseFeatureAt(x: number, y: number, floor: AlgyHouseFloor = "ground"): HouseFeature | null {
  return ALGY_HOUSE_FEATURES.find((feature) => feature.floor === floor &&
    x >= feature.x && x < feature.x + feature.width && y >= feature.y && y < feature.y + feature.height) ?? null;
}

export function algyHouseFeatureFacing(floor: AlgyHouseFloor, player: HousePlayer): HouseFeature | null {
  const vector = DIRECTION_VECTOR[player.dir];
  return algyHouseFeatureAt(player.x + vector.x, player.y + vector.y, floor);
}

export function algyHouseStep(
  floor: AlgyHouseFloor,
  player: Pick<HousePlayer, "x" | "y">,
  dir: HouseDirection,
  characterId: HouseCharacterId = "algy",
): { point: HousePoint; transition: AlgyHouseTransition | null } | null {
  const vector = DIRECTION_VECTOR[dir];
  const point = { x: player.x + vector.x, y: player.y + vector.y };
  if (!isAlgyHouseWalkable(floor, point.x, point.y, characterId)) return null;
  if (algyHouseFurnitureBlocksStep(floor, player, point)) return null;
  const cell = algyHouseGridForFloor(floor)[point.y]?.[point.x];
  const fromCell = algyHouseGridForFloor(floor)[player.y]?.[player.x];
  const isTread = (value: string | undefined) => value === "^" || value === "U" || value === "S";
  // Opening the neighboring floor should never allow a sideways jump onto
  // elevated steps, or an accidental warp from above/below the stair opening.
  if ((dir === "n" || dir === "s") && (isTread(cell) || isTread(fromCell))) return null;
  if ((cell === "U" && dir !== "w") || (cell === "S" && dir !== "e")) return null;
  return {
    point,
    transition: cell === "D" ? "outside" : cell === "U" ? "upstairs" : cell === "S" ? "ground" : null,
  };
}
