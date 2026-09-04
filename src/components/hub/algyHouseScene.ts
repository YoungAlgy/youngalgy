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
}

export const ALGY_HOUSE_SCENE_KEY = "toggle-town:scene";
export const ALGY_HOUSE_PLAYER_KEY = "toggle-town:algy-house-player";
export const ALGY_HOUSE_FLOOR_KEY = "toggle-town:algy-house-floor";
export const ALGY_HOUSE_SCENE = "algy-house";
export const ALGY_HOUSE_DEFAULT_FLOOR: AlgyHouseFloor = "ground";
export const ALGY_HOUSE_TRACK = "/audio/repo-young-algy.mp3";
export const ALGY_HOUSE_ATLAS = "/sprites/interiors/algy_house_16.png";
export const ALGY_HOUSE_SKULL = "/sprites/interiors/algy-skull-detail.svg";
export const ALGY_HOUSE_AVATAR = "/sprites/characters/algy_run.png";

export const ALGY_HOUSE_COLS = 14;
export const ALGY_HOUSE_ROWS = 10;
export const ALGY_HOUSE_TILE = 48;
export const ALGY_HOUSE_SPAWN: HousePlayer = { x: 3, y: 8, dir: "n", frame: 0 };
export const ALGY_HOUSE_DOOR: HousePoint = { x: 3, y: 9 };
export const ALGY_HOUSE_STAIRS_UP_ORIGIN: HousePoint = { x: 1, y: 1 };
export const ALGY_HOUSE_STAIRS_UP: HousePoint = { x: 1, y: 2 };
export const ALGY_HOUSE_STAIRWELL_ORIGIN: HousePoint = { x: 2, y: 1 };
export const ALGY_HOUSE_STAIRS_DOWN: HousePoint = { x: 4, y: 2 };
export const ALGY_HOUSE_UPSTAIRS_SPAWN: HousePlayer = { x: 1, y: 2, dir: "w", frame: 0 };
export const ALGY_HOUSE_GROUND_STAIR_RETURN: HousePlayer = { x: 5, y: 2, dir: "e", frame: 0 };

// Ground floor: # wall, . floor, D outside door, B stair body, ^ stair tread,
// U upstairs transition. The compact flight rises west into the upper-left.
// Its center path stays walkable from the east while the stair body blocks
// side entry.
export const ALGY_HOUSE_GROUND_GRID = [
  "##############",
  "#BBBB........#",
  "#U^^^........#",
  "#BBBB........#",
  "#............#",
  "#............#",
  "#............#",
  "#............#",
  "#............#",
  "###D##########",
] as const;

// Upstairs uses a separate stairwell opening one tile east of its safe landing.
// Walking east over the descending treads to S returns downstairs before the
// avatar reaches the low east post. B keeps the opening solid from the sides.
export const ALGY_HOUSE_UPSTAIRS_GRID = [
  "##############",
  "#.BBB........#",
  "#.^^S........#",
  "#.BBB........#",
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
  { id: "stereo", floor: "upstairs", x: 8, y: 1, width: 1, height: 2, verb: "Play", label: "Repo / Young Algy" },
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

export function algyHouseUpstairsDescentAlpha(
  descendingUpstairs: boolean,
  tileX: number,
  tileY: number,
): number {
  if (!descendingUpstairs || Math.abs(tileY - ALGY_HOUSE_STAIRS_DOWN.y) > 0.05) return 1;
  return Math.max(0, Math.min(1, ALGY_HOUSE_STAIRS_DOWN.x - tileX));
}

export function isAlgyHouseWalkable(floor: AlgyHouseFloor, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= ALGY_HOUSE_COLS || y >= ALGY_HOUSE_ROWS) return false;
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
): { point: HousePoint; transition: AlgyHouseTransition | null } | null {
  const vector = DIRECTION_VECTOR[dir];
  const point = { x: player.x + vector.x, y: player.y + vector.y };
  if (!isAlgyHouseWalkable(floor, point.x, point.y)) return null;
  const cell = algyHouseGridForFloor(floor)[point.y]?.[point.x];
  return {
    point,
    transition: cell === "D" ? "outside" : cell === "U" ? "upstairs" : cell === "S" ? "ground" : null,
  };
}
