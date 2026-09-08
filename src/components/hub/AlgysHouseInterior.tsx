import { useCallback, useEffect, useRef, useState } from "react";
import {
  ALGY_HOUSE_HOST,
  ALGY_HOUSE_MITCH_GREETING,
  ALGY_HOUSE_DEFAULT_FLOOR,
  ALGY_HOUSE_DOOR,
  ALGY_HOUSE_FEATURES,
  ALGY_HOUSE_FLOOR_KEY,
  ALGY_HOUSE_PLAYER_KEY,
  ALGY_HOUSE_SCENE,
  ALGY_HOUSE_SCENE_KEY,
  ALGY_HOUSE_SPAWN,
  ALGY_HOUSE_STAIRS_DOWN,
  ALGY_HOUSE_STAIRS_UP,
  ALGY_HOUSE_STAIRS_UP_ORIGIN,
  ALGY_HOUSE_STAIRWELL_ORIGIN,
  ALGY_HOUSE_TILE,
  ALGY_HOUSE_UPSTAIRS_DOOR,
  algyHouseArrivalForFloor,
  algyHouseComputerFacing,
  algyHouseFeatureFacing,
  algyHouseGridForFloor,
  algyHouseHasHost,
  algyHouseHostFacing,
  algyHouseStep,
  algyHouseStairFootOffset,
  algyHouseUpstairsDescentAlpha,
  isAlgyHouseWalkable,
  type AlgyHouseFloor,
  type AlgyHouseTransition,
  type HouseDirection,
  type HousePlayer,
  type HousePoint,
} from "./algyHouseScene";
import {
  houseDoorCharacterAlpha,
  type HouseDoorTransitionPhase,
} from "./algyHouseDoor";
import { useHouseStereo } from "./useHouseStereo";
import { HUB_DPAD_BUTTON_STYLE, HUB_DPAD_GO_STYLE, HUB_DPAD_LAYOUT_STYLE } from "./hubDpadStyles";
import { useHouseArt } from "./useHouseArt";
import type { HouseCharacterId } from "./algyHouseVisitor";
import { algyHouseFurnitureForFloor, algyHouseGroundView, houseDecorDepth, HOUSE_COUCH_TV_ART, HOUSE_COUCH_TV_POSITION } from "./algyHouseLayout";
import { drawAlgyHouseRoomShell, drawAlgyHouseUpstairsDoor, drawHouseDecorArt, drawHouseBedsideLamp, drawHouseNorthFacingSofa } from "./algyHouseRoomArt";

const KEY_DIRECTION: Record<string, HouseDirection | undefined> = {
  ArrowUp: "n",
  w: "n",
  W: "n",
  ArrowDown: "s",
  s: "s",
  S: "s",
  ArrowRight: "e",
  d: "e",
  D: "e",
  ArrowLeft: "w",
  a: "w",
  A: "w",
};

const FONT = "'Press Start 2P', monospace";
const MOVE_MS = 150;
const HOUSE_DIALOGUE = {
  host: { speaker: "ALGY", line: ALGY_HOUSE_MITCH_GREETING },
  door: { speaker: "DOOR", line: "This door is locked..." },
  computer: { speaker: "COMPUTER", line: "Codex is thinking..." },
} as const;

interface HouseMove {
  from: HousePoint;
  to: HousePoint;
  dir: HouseDirection;
  startedAt: number;
  transition: AlgyHouseTransition | null;
}

interface AlgysHouseInteriorProps {
  characterId?: HouseCharacterId;
  floor: AlgyHouseFloor;
  muted: boolean;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  onToggleMute: () => void;
  onLeave: () => void;
  onChangeFloor: (floor: AlgyHouseFloor) => void;
  onChangeCharacter?: (characterId: HouseCharacterId) => void;
  characterChangePending?: boolean;
  characterChangeStatus?: string | null;
  onPrepareDoorSound: () => void;
  doorTransitionPhase: HouseDoorTransitionPhase;
  /** Only the older embedded room should restore itself as a town scene. */
  persistTownScene?: boolean;
}

function safeSessionGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSessionSet(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // The room remains playable when storage is unavailable.
  }
}

function defaultPlayerForFloor(floor: AlgyHouseFloor): HousePlayer {
  return floor === ALGY_HOUSE_DEFAULT_FLOOR
    ? { ...ALGY_HOUSE_SPAWN }
    : algyHouseArrivalForFloor(floor);
}

function readSavedPlayer(floor: AlgyHouseFloor, characterId: HouseCharacterId): HousePlayer {
  if (typeof window === "undefined") return defaultPlayerForFloor(floor);
  const raw = safeSessionGet(ALGY_HOUSE_PLAYER_KEY);
  if (!raw) return defaultPlayerForFloor(floor);
  try {
    const candidate = JSON.parse(raw) as Partial<HousePlayer> & { floor?: AlgyHouseFloor };
    if (
      (candidate.floor === floor || (candidate.floor === undefined && floor === ALGY_HOUSE_DEFAULT_FLOOR)) &&
      typeof candidate.x === "number" &&
      typeof candidate.y === "number" &&
      isAlgyHouseWalkable(floor, candidate.x, candidate.y, characterId)
    ) {
      const cell = algyHouseGridForFloor(floor)[candidate.y]?.[candidate.x];
      if (cell === "D" || cell === "U" || cell === "S") return defaultPlayerForFloor(floor);
      const dir: HouseDirection =
        candidate.dir === "n" || candidate.dir === "s" || candidate.dir === "e" || candidate.dir === "w"
          ? candidate.dir
          : "n";
      return { x: candidate.x, y: candidate.y, dir, frame: 0 };
    }
  } catch {
    // Ignore stale or malformed session data.
  }
  return defaultPlayerForFloor(floor);
}

function drawAtlasPiece(
  context: CanvasRenderingContext2D,
  atlas: HTMLImageElement | null,
  source: { x: number; y: number; w: number; h: number },
  destination: { x: number; y: number; w: number; h: number },
): void {
  if (!atlas?.complete || atlas.naturalWidth === 0) return;
  context.drawImage(
    atlas,
    source.x,
    source.y,
    source.w,
    source.h,
    destination.x,
    destination.y,
    destination.w,
    destination.h,
  );
}

const STAIR_PIXEL = ALGY_HOUSE_TILE / 16;
const STAIR_PALETTE = {
  outline: "#39232f",
  opening: "#24131d",
  deep: "#57313a",
  woodDark: "#6f3f32",
  woodMid: "#96563b",
  wood: "#bc7446",
  woodLight: "#dfaa65",
  panelDark: "#85594d",
  panel: "#b47e64",
  panelLight: "#d2a783",
  brass: "#e2b45c",
} as const;
const GROUND_STAIR_STEPS = [
  { x: 2, y: 3 },
  { x: 10, y: 6 },
  { x: 18, y: 9 },
  { x: 26, y: 12 },
  { x: 34, y: 15 },
  { x: 42, y: 18 },
  { x: 50, y: 21 },
  { x: 58, y: 24 },
] as const;
const UPSTAIRS_STAIR_STEPS = [
  { x: 2, y: 10 },
  { x: 10, y: 13 },
  { x: 18, y: 16 },
  { x: 26, y: 19 },
  { x: 34, y: 22 },
  { x: 42, y: 25 },
  { x: 50, y: 28 },
  { x: 58, y: 31 },
] as const;

type StairPixelPoint = readonly [x: number, y: number];

function drawStairPixelRect(
  context: CanvasRenderingContext2D,
  origin: HousePoint,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
): void {
  context.fillStyle = color;
  context.fillRect(
    origin.x * ALGY_HOUSE_TILE + x * STAIR_PIXEL,
    origin.y * ALGY_HOUSE_TILE + y * STAIR_PIXEL,
    width * STAIR_PIXEL,
    height * STAIR_PIXEL,
  );
}

function drawStairPixelPolygon(
  context: CanvasRenderingContext2D,
  origin: HousePoint,
  points: readonly StairPixelPoint[],
  color: string,
): void {
  if (points.length < 3) return;
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(
    origin.x * ALGY_HOUSE_TILE + points[0][0] * STAIR_PIXEL,
    origin.y * ALGY_HOUSE_TILE + points[0][1] * STAIR_PIXEL,
  );
  for (let index = 1; index < points.length; index += 1) {
    context.lineTo(
      origin.x * ALGY_HOUSE_TILE + points[index][0] * STAIR_PIXEL,
      origin.y * ALGY_HOUSE_TILE + points[index][1] * STAIR_PIXEL,
    );
  }
  context.closePath();
  context.fill();
}

function drawStairPixelLine(
  context: CanvasRenderingContext2D,
  origin: HousePoint,
  points: readonly StairPixelPoint[],
  width: number,
  color: string,
): void {
  if (points.length < 2) return;
  context.strokeStyle = color;
  context.lineWidth = width * STAIR_PIXEL;
  context.lineCap = "square";
  context.lineJoin = "round";
  context.beginPath();
  context.moveTo(
    origin.x * ALGY_HOUSE_TILE + points[0][0] * STAIR_PIXEL,
    origin.y * ALGY_HOUSE_TILE + points[0][1] * STAIR_PIXEL,
  );
  for (let index = 1; index < points.length; index += 1) {
    context.lineTo(
      origin.x * ALGY_HOUSE_TILE + points[index][0] * STAIR_PIXEL,
      origin.y * ALGY_HOUSE_TILE + points[index][1] * STAIR_PIXEL,
    );
  }
  context.stroke();
}

function drawGroundStairFallbackBack(context: CanvasRenderingContext2D, origin: HousePoint): void {
  const rect = (x: number, y: number, width: number, height: number, color: string) =>
    drawStairPixelRect(context, origin, x, y, width, height, color);
  const polygon = (points: readonly StairPixelPoint[], color: string) =>
    drawStairPixelPolygon(context, origin, points, color);
  const line = (points: readonly StairPixelPoint[], width: number, color: string) =>
    drawStairPixelLine(context, origin, points, width, color);

  // V5 west-wall recess and casing. It is deliberately wide and warm so the
  // high end reads as an architectural opening instead of a black stripe.
  rect(-3, -5, 15, 28, STAIR_PALETTE.outline);
  rect(-1, -3, 9, 23, STAIR_PALETTE.opening);
  rect(8, -3, 3, 25, STAIR_PALETTE.woodDark);
  rect(9, -2, 1, 22, STAIR_PALETTE.woodLight);
  rect(-2, -5, 14, 3, STAIR_PALETTE.woodDark);
  rect(-1, -4, 12, 1, STAIR_PALETTE.woodLight);
  rect(-3, 20, 15, 3, STAIR_PALETTE.deep);

  // Closed residential stringer. Both edges stay diagonal so there is no
  // shelf-like horizontal base.
  polygon(
    [
      [1, 10],
      [69, 35],
      [69, 44],
      [1, 25],
    ],
    STAIR_PALETTE.outline,
  );
  polygon(
    [
      [3, 14],
      [67, 37],
      [67, 41],
      [3, 23],
    ],
    STAIR_PALETTE.panelDark,
  );
  polygon(
    [
      [5, 16],
      [65, 38],
      [65, 39],
      [5, 21],
    ],
    STAIR_PALETTE.panel,
  );
  line(
    [
      [5, 21],
      [65, 42],
    ],
    1,
    STAIR_PALETTE.panelLight,
  );
  line(
    [
      [3, 24],
      [68, 44],
    ],
    1,
    STAIR_PALETTE.deep,
  );

  // Broad three-quarter-view slabs form one connected flight. Paint the low
  // steps first so the high steps overlap in the same order as the mockup.
  for (const step of [...GROUND_STAIR_STEPS].reverse()) {
    polygon(
      [
        [step.x, step.y - 1],
        [step.x + 11, step.y + 3],
        [step.x + 9, step.y + 9],
        [step.x - 2, step.y + 5],
      ],
      STAIR_PALETTE.outline,
    );
    polygon(
      [
        [step.x - 2, step.y + 5],
        [step.x + 9, step.y + 9],
        [step.x + 9, step.y + 12],
        [step.x - 2, step.y + 8],
      ],
      STAIR_PALETTE.outline,
    );
    polygon(
      [
        [step.x - 1, step.y + 6],
        [step.x + 8, step.y + 10],
        [step.x + 8, step.y + 11],
        [step.x - 1, step.y + 7],
      ],
      STAIR_PALETTE.woodMid,
    );
    polygon(
      [
        [step.x + 1, step.y],
        [step.x + 9, step.y + 3],
        [step.x + 8, step.y + 7],
        [step.x, step.y + 4],
      ],
      STAIR_PALETTE.wood,
    );
    line(
      [
        [step.x + 1, step.y],
        [step.x + 9, step.y + 3],
      ],
      1,
      STAIR_PALETTE.woodLight,
    );
  }
}

function drawGroundStairFallbackFront(context: CanvasRenderingContext2D, origin: HousePoint): void {
  const rect = (x: number, y: number, width: number, height: number, color: string) =>
    drawStairPixelRect(context, origin, x, y, width, height, color);
  const line = (points: readonly StairPixelPoint[], width: number, color: string) =>
    drawStairPixelLine(context, origin, points, width, color);

  // One substantial far-side banister, two balusters, and a rounded low newel.
  // These are drawn after Algy so he passes behind the rail while climbing.
  line(
    [
      [1, -3],
      [9, 0],
      [17, 3],
      [25, 6],
      [33, 9],
      [41, 12],
      [49, 15],
      [57, 18],
      [66, 21],
    ],
    5,
    STAIR_PALETTE.outline,
  );
  line(
    [
      [1, -3],
      [9, 0],
      [17, 3],
      [25, 6],
      [33, 9],
      [41, 12],
      [49, 15],
      [57, 18],
      [66, 21],
    ],
    2,
    STAIR_PALETTE.wood,
  );
  line(
    [
      [2, -4],
      [18, 2],
      [34, 8],
      [50, 14],
      [65, 19],
    ],
    1,
    STAIR_PALETTE.woodLight,
  );
  for (const post of [
    { x: 4, top: -2, bottom: 5 },
    { x: 34, top: 9, bottom: 16 },
    { x: 58, top: 18, bottom: 25 },
  ]) {
    rect(post.x, post.top, 3, post.bottom - post.top + 1, STAIR_PALETTE.outline);
    rect(post.x + 1, post.top + 1, 1, post.bottom - post.top - 1, STAIR_PALETTE.wood);
  }
  rect(65, 19, 5, 20, STAIR_PALETTE.outline);
  rect(67, 22, 2, 14, STAIR_PALETTE.woodMid);
  rect(63, 17, 9, 5, STAIR_PALETTE.outline);
  rect(65, 18, 5, 2, STAIR_PALETTE.brass);
}

function drawUpstairsStairwellFallbackBack(context: CanvasRenderingContext2D, origin: HousePoint): void {
  const rect = (x: number, y: number, width: number, height: number, color: string) =>
    drawStairPixelRect(context, origin, x, y, width, height, color);
  const polygon = (points: readonly StairPixelPoint[], color: string) =>
    drawStairPixelPolygon(context, origin, points, color);
  const line = (points: readonly StairPixelPoint[], width: number, color: string) =>
    drawStairPixelLine(context, origin, points, width, color);

  // V5 diagonal slot follows the stair's actual slope and leaves floor visible
  // around it, avoiding the old raised-stage silhouette.
  polygon(
    [
      [-4, 8],
      [3, 4],
      [72, 30],
      [67, 44],
      [-5, 18],
    ],
    STAIR_PALETTE.outline,
  );
  polygon(
    [
      [-1, 10],
      [4, 7],
      [69, 31],
      [64, 40],
      [-3, 16],
    ],
    STAIR_PALETTE.deep,
  );
  polygon(
    [
      [1, 11],
      [5, 9],
      [67, 32],
      [63, 38],
      [-1, 15],
    ],
    STAIR_PALETTE.opening,
  );

  // The far rim tracks the diagonal instead of drawing a horizontal box top.
  line(
    [
      [2, 5],
      [72, 31],
    ],
    4,
    STAIR_PALETTE.outline,
  );
  line(
    [
      [3, 5],
      [71, 30],
    ],
    2,
    STAIR_PALETTE.woodDark,
  );
  line(
    [
      [5, 5],
      [69, 29],
    ],
    1,
    STAIR_PALETTE.woodLight,
  );

  for (const step of [...UPSTAIRS_STAIR_STEPS].reverse()) {
    polygon(
      [
        [step.x, step.y],
        [step.x + 11, step.y + 4],
        [step.x + 9, step.y + 9],
        [step.x - 2, step.y + 5],
      ],
      STAIR_PALETTE.outline,
    );
    polygon(
      [
        [step.x - 2, step.y + 5],
        [step.x + 9, step.y + 9],
        [step.x + 9, step.y + 11],
        [step.x - 2, step.y + 7],
      ],
      STAIR_PALETTE.outline,
    );
    polygon(
      [
        [step.x - 1, step.y + 6],
        [step.x + 8, step.y + 10],
        [step.x + 8, step.y + 10],
        [step.x - 1, step.y + 7],
      ],
      STAIR_PALETTE.woodMid,
    );
    polygon(
      [
        [step.x + 1, step.y + 1],
        [step.x + 9, step.y + 4],
        [step.x + 8, step.y + 7],
        [step.x, step.y + 4],
      ],
      STAIR_PALETTE.wood,
    );
    line(
      [
        [step.x + 1, step.y + 1],
        [step.x + 9, step.y + 4],
      ],
      1,
      STAIR_PALETTE.woodLight,
    );
  }

  // Small west return trim mirrors the downstairs casing.
  rect(-4, 8, 4, 13, STAIR_PALETTE.outline);
  rect(-3, 10, 1, 9, STAIR_PALETTE.woodMid);
  rect(-5, 7, 7, 3, STAIR_PALETTE.outline);
  rect(-3, 8, 3, 1, STAIR_PALETTE.brass);
}

function drawUpstairsStairwellFallbackFront(context: CanvasRenderingContext2D, origin: HousePoint): void {
  const line = (points: readonly StairPixelPoint[], width: number, color: string) =>
    drawStairPixelLine(context, origin, points, width, color);

  // Only the flush diagonal near lip sits in front of Algy as he descends.
  line(
    [
      [-4, 18],
      [67, 44],
    ],
    5,
    STAIR_PALETTE.outline,
  );
  line(
    [
      [-3, 17],
      [66, 43],
    ],
    2,
    STAIR_PALETTE.woodDark,
  );
  line(
    [
      [-2, 17],
      [65, 42],
    ],
    1,
    STAIR_PALETTE.woodLight,
  );
}

const GROUND_STAIR_ART_SIZE = { width: 48, height: 40 } as const;
const UPSTAIRS_STAIR_ART_SIZE = { width: 48, height: 28 } as const;
const GROUND_STAIR_HIGH_CAP_SIZE = { width: 7, height: 2 } as const;

function stairArtReady(image: HTMLImageElement | null): image is HTMLImageElement {
  return Boolean(image?.complete && image.naturalWidth > 0);
}

function groundStairArtPosition(origin: HousePoint): HousePoint {
  return {
    x: origin.x * ALGY_HOUSE_TILE,
    y: origin.y * ALGY_HOUSE_TILE,
  };
}

function upstairsStairArtPosition(origin: HousePoint): HousePoint {
  return {
    // The safe x1 landing remains clear. The opening begins with the route at
    // x2,y2 and ends after the x4 return trigger.
    x: origin.x * ALGY_HOUSE_TILE,
    y: (origin.y + 1) * ALGY_HOUSE_TILE,
  };
}

function drawGroundStairImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  position: HousePoint,
): void {
  const remainingTopWidth = GROUND_STAIR_ART_SIZE.width - GROUND_STAIR_HIGH_CAP_SIZE.width;
  context.drawImage(
    image,
    GROUND_STAIR_HIGH_CAP_SIZE.width,
    0,
    remainingTopWidth,
    GROUND_STAIR_HIGH_CAP_SIZE.height,
    position.x + GROUND_STAIR_HIGH_CAP_SIZE.width * STAIR_PIXEL,
    position.y,
    remainingTopWidth * STAIR_PIXEL,
    GROUND_STAIR_HIGH_CAP_SIZE.height * STAIR_PIXEL,
  );
  context.drawImage(
    image,
    0,
    GROUND_STAIR_HIGH_CAP_SIZE.height,
    GROUND_STAIR_ART_SIZE.width,
    GROUND_STAIR_ART_SIZE.height - GROUND_STAIR_HIGH_CAP_SIZE.height,
    position.x,
    position.y + GROUND_STAIR_HIGH_CAP_SIZE.height * STAIR_PIXEL,
    GROUND_STAIR_ART_SIZE.width * STAIR_PIXEL,
    (GROUND_STAIR_ART_SIZE.height - GROUND_STAIR_HIGH_CAP_SIZE.height) * STAIR_PIXEL,
  );
  // The flattened sprite has the highest tread painted across the west post.
  // Reuse its intact shaft pixels as a foreground slice, extending the wood
  // through that tread. Repainting the old whole-image mask cannot fix pixels
  // that were already hidden in the source image.
  context.drawImage(
    image, 4, 4, 3, 5,
    position.x + 4 * STAIR_PIXEL, position.y + 4 * STAIR_PIXEL,
    3 * STAIR_PIXEL, 14 * STAIR_PIXEL,
  );
  context.drawImage(
    image, 4, 9, 3, 1,
    position.x + 4 * STAIR_PIXEL, position.y + 18 * STAIR_PIXEL,
    3 * STAIR_PIXEL, STAIR_PIXEL,
  );
}

function drawExactGroundStairBack(
  context: CanvasRenderingContext2D,
  origin: HousePoint,
  image: HTMLImageElement | null,
): void {
  if (!stairArtReady(image)) {
    drawGroundStairFallbackBack(context, origin);
    return;
  }
  const position = groundStairArtPosition(origin);
  drawGroundStairImage(context, image, position);
}

function drawExactGroundStairFront(
  context: CanvasRenderingContext2D,
  origin: HousePoint,
  image: HTMLImageElement | null,
): void {
  if (!stairArtReady(image)) {
    drawGroundStairFallbackFront(context, origin);
    return;
  }
  const position = groundStairArtPosition(origin);
  context.save();
  context.beginPath();
  context.rect(
    position.x,
    position.y,
    7 * STAIR_PIXEL,
    20 * STAIR_PIXEL,
  );
  context.moveTo(position.x + 4 * STAIR_PIXEL, position.y - STAIR_PIXEL);
  context.lineTo(position.x + 48 * STAIR_PIXEL, position.y + 23 * STAIR_PIXEL);
  context.lineTo(position.x + 48 * STAIR_PIXEL, position.y + 30 * STAIR_PIXEL);
  context.lineTo(position.x + 4 * STAIR_PIXEL, position.y + 7 * STAIR_PIXEL);
  context.closePath();
  context.rect(
    position.x + 41 * STAIR_PIXEL,
    position.y + 19 * STAIR_PIXEL,
    7 * STAIR_PIXEL,
    21 * STAIR_PIXEL,
  );
  context.clip();
  drawGroundStairImage(context, image, position);
  context.restore();
}

function drawExactUpstairsStairBack(
  context: CanvasRenderingContext2D,
  origin: HousePoint,
  image: HTMLImageElement | null,
): void {
  if (!stairArtReady(image)) {
    drawUpstairsStairwellFallbackBack(context, origin);
    drawUpstairsStairwellFallbackFront(context, origin);
    return;
  }
  const position = upstairsStairArtPosition(origin);
  context.drawImage(
    image,
    position.x,
    position.y,
    UPSTAIRS_STAIR_ART_SIZE.width * STAIR_PIXEL,
    UPSTAIRS_STAIR_ART_SIZE.height * STAIR_PIXEL,
  );
}

function drawExactUpstairsStairFront(
  context: CanvasRenderingContext2D,
  origin: HousePoint,
  image: HTMLImageElement | null,
): void {
  if (!stairArtReady(image)) {
    drawUpstairsStairwellFallbackFront(context, origin);
    return;
  }
  const position = upstairsStairArtPosition(origin);
  context.save();
  context.beginPath();
  context.rect(
    position.x,
    position.y + 24 * STAIR_PIXEL,
    UPSTAIRS_STAIR_ART_SIZE.width * STAIR_PIXEL,
    4 * STAIR_PIXEL,
  );
  context.rect(
    position.x + 43 * STAIR_PIXEL,
    position.y + 17 * STAIR_PIXEL,
    5 * STAIR_PIXEL,
    11 * STAIR_PIXEL,
  );
  context.clip();
  context.drawImage(
    image,
    position.x,
    position.y,
    UPSTAIRS_STAIR_ART_SIZE.width * STAIR_PIXEL,
    UPSTAIRS_STAIR_ART_SIZE.height * STAIR_PIXEL,
  );
  context.restore();
}

function drawHouseActor(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  characterId: HouseCharacterId,
  direction: HouseDirection,
  frame: number,
  x: number,
  y: number,
): void {
  const directionOffset: Record<HouseDirection, number> = { e: 0, n: 6, w: 12, s: 18 };
  context.fillStyle = "rgba(26, 10, 30, 0.42)";
  context.fillRect(x + 7, y + 59, 18, 4);
  if (image?.complete && image.naturalWidth > 0) {
    context.drawImage(image, (directionOffset[direction] + frame) * 16, 0, 16, 32, x, y, 32, 64);
    return;
  }
  context.fillStyle = characterId === "mitch" ? "#573b2b" : "#e5bd45";
  context.fillRect(x + 8, y + 4, 16, 16);
  context.fillStyle = characterId === "mitch" ? "#bb3e53" : "#43759a";
  context.fillRect(x + 5, y + 20, 22, 28);
  context.fillStyle = "#2b2038";
  context.fillRect(x + 7, y + 48, 7, 16);
  context.fillRect(x + 18, y + 48, 7, 16);
}

function drawRoom(
  context: CanvasRenderingContext2D,
  viewportW: number,
  viewportH: number,
  atlas: HTMLImageElement | null,
  avatar: HTMLImageElement | null,
  groundStairArt: HTMLImageElement | null,
  upstairsStairArt: HTMLImageElement | null,
  floor: AlgyHouseFloor,
  player: HousePlayer,
  move: HouseMove | null,
  now: number,
  playerAlpha: number,
  descendingUpstairs: boolean,
  characterId: HouseCharacterId,
  hostAvatar: HTMLImageElement | null,
  hostDirection: HouseDirection,
): void {
  const progress = move ? Math.min(1, (now - move.startedAt) / MOVE_MS) : 1;
  const ease = progress * progress * (3 - 2 * progress);
  const drawTileX = move ? move.from.x + (move.to.x - move.from.x) * ease : player.x;
  const drawTileY = move ? move.from.y + (move.to.y - move.from.y) * ease : player.y;

  context.fillStyle = "#120b1d";
  context.fillRect(0, 0, viewportW, viewportH);

  const groundView = algyHouseGroundView(viewportW, viewportH);
  const zoom = groundView.zoom;
  const cameraX = groundView.cameraX;
  const cameraY = groundView.cameraY;
  const screenCenterX = Math.round(viewportW / 2);
  const screenCenterY = groundView.centerY;

  context.save();
  context.translate(screenCenterX, screenCenterY);
  context.scale(zoom, zoom);
  context.translate(-cameraX, -cameraY);
  context.imageSmoothingEnabled = false;

  drawAlgyHouseRoomShell(context, atlas, floor);

  if (floor === "ground") {
    drawExactGroundStairBack(context, ALGY_HOUSE_STAIRS_UP_ORIGIN, groundStairArt);
  } else {
    drawExactUpstairsStairBack(context, ALGY_HOUSE_STAIRWELL_ORIGIN, upstairsStairArt);
    drawAlgyHouseUpstairsDoor(context);
  }

  const avatarX = drawTileX * ALGY_HOUSE_TILE;
  const avatarY = drawTileY * ALGY_HOUSE_TILE + algyHouseStairFootOffset(floor, drawTileX, drawTileY);
  const moving = move !== null;
  const animationFrame = moving ? Math.floor(now / 95) % 6 : player.frame % 6;
  const drawX = avatarX + (ALGY_HOUSE_TILE - 32) / 2;
  const drawY = avatarY + ALGY_HOUSE_TILE - 64;
  const drawStereo = () => {
    for (const feature of ALGY_HOUSE_FEATURES.filter((item) => item.floor === floor)) {
      const art = feature.art ?? feature;
      drawAtlasPiece(context, atlas, { x: 32, y: 0, w: 16, h: 32 }, {
        x: art.x * ALGY_HOUSE_TILE,
        y: art.y * ALGY_HOUSE_TILE,
        w: art.width * ALGY_HOUSE_TILE,
        h: art.height * ALGY_HOUSE_TILE,
      });
    }
  };
  const drawHost = () => {
    if (!algyHouseHasHost(floor, characterId)) return;
    drawHouseActor(context, hostAvatar, "algy", hostDirection, 0,
      ALGY_HOUSE_HOST.x * ALGY_HOUSE_TILE + (ALGY_HOUSE_TILE - 32) / 2,
      ALGY_HOUSE_HOST.y * ALGY_HOUSE_TILE + ALGY_HOUSE_TILE - 64);
  };
  // Both actors use the same art scale and foot-based depth order.
  const drawPlayer = () => {
    context.save();
    // Clip only inside the stairwell. The east-side floor at x5 must stay visible.
    if (floor === "upstairs" && drawTileX > 1.4 && drawTileX <= ALGY_HOUSE_STAIRS_DOWN.x && Math.abs(drawTileY - ALGY_HOUSE_STAIRS_DOWN.y) < 0.05) {
      const opening = upstairsStairArtPosition(ALGY_HOUSE_STAIRWELL_ORIGIN);
      context.beginPath();
      context.moveTo(opening.x + 2 * STAIR_PIXEL, opening.y + 3 * STAIR_PIXEL);
      context.lineTo(opening.x + 37 * STAIR_PIXEL, opening.y + 3 * STAIR_PIXEL);
      context.lineTo(opening.x + 47 * STAIR_PIXEL, opening.y + 11 * STAIR_PIXEL);
      context.lineTo(opening.x + 45 * STAIR_PIXEL, opening.y + 23 * STAIR_PIXEL);
      context.lineTo(opening.x + 2 * STAIR_PIXEL, opening.y + 23 * STAIR_PIXEL);
      context.lineTo(opening.x, opening.y + 9 * STAIR_PIXEL);
      context.closePath();
      context.clip();
    }
    context.globalAlpha = playerAlpha * algyHouseUpstairsDescentAlpha(descendingUpstairs, drawTileX, drawTileY);
    drawHouseActor(context, avatar, characterId, player.dir, animationFrame, drawX, drawY);
    context.restore();
  };

  // Use the same feet-based depth order for furniture and actors on either floor.
  const layers = algyHouseFurnitureForFloor(floor).map((item) => ({
    depth: houseDecorDepth(item),
    draw: () => {
      if (item.id === "sofa") drawHouseNorthFacingSofa(context, item.art);
      else drawHouseDecorArt(context, atlas, item.source, item.art);
      if (item.id === "bedside-table") drawHouseBedsideLamp(context, item.art);
      if (item.id === "coffee-table") drawHouseDecorArt(context, atlas, HOUSE_COUCH_TV_ART, HOUSE_COUCH_TV_POSITION);
    },
  }));
  const stereoFeature = ALGY_HOUSE_FEATURES.find((item) => item.id === "stereo" && item.floor === floor);
  if (stereoFeature) layers.push({ depth: stereoFeature.y + stereoFeature.height, draw: drawStereo });
  layers.push({ depth: ALGY_HOUSE_HOST.y + 1, draw: drawHost });
  layers.push({ depth: drawTileY + 1, draw: drawPlayer });
  layers.sort((a, b) => a.depth - b.depth).forEach((layer) => layer.draw());

  if (floor === "ground") {
    // On the newly opened floor below the stairs the whole actor is in front.
    if (drawTileY <= ALGY_HOUSE_STAIRS_UP.y + 0.05) drawExactGroundStairFront(context, ALGY_HOUSE_STAIRS_UP_ORIGIN, groundStairArt);
  } else {
    // Keep the railing over a descending actor, but behind anyone on the floor below.
    if (drawTileY <= ALGY_HOUSE_STAIRS_DOWN.y + 0.05) drawExactUpstairsStairFront(context, ALGY_HOUSE_STAIRWELL_ORIGIN, upstairsStairArt);
  }

  context.restore();
}

function PixelArrow({ direction }: { direction: HouseDirection }) {
  const rotation = direction === "n" ? 0 : direction === "e" ? 90 : direction === "s" ? 180 : 270;
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style={{ transform: `rotate(${rotation}deg)` }}>
      <polygon points="12,4 20,19 4,19" fill="#f4e8c1" />
    </svg>
  );
}

export default function AlgysHouseInterior({
  characterId = "algy",
  floor,
  muted,
  volume = 0.55,
  onVolumeChange,
  onToggleMute,
  onLeave,
  onChangeFloor,
  onChangeCharacter,
  characterChangePending = false,
  characterChangeStatus,
  onPrepareDoorSound,
  doorTransitionPhase,
  persistTownScene = true,
}: AlgysHouseInteriorProps) {
  const { images, status: artStatus, retry: retryArt } = useHouseArt(characterId);
  const [paintedImages, setPaintedImages] = useState<typeof images | null>(null);
  const artReady = artStatus === "ready" && paintedImages === images;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<HousePlayer>(readSavedPlayer(floor, characterId));
  const hostDirectionRef = useRef<HouseDirection>("s");
  const dialogueRef = useRef(false);
  const doorApproachLatchedRef = useRef(false);
  const restoreDialogueFocusRef = useRef(false);
  const dialogueCloseRef = useRef<HTMLButtonElement>(null);
  const interactButtonRef = useRef<HTMLButtonElement>(null);
  const volumeInputRef = useRef<HTMLInputElement>(null);
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const infoCloseRef = useRef<HTMLButtonElement>(null);
  const characterButtonRef = useRef<HTMLButtonElement>(null);
  const characterChoiceRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const restoreMenuFocusRef = useRef<"info" | "character" | null>(null);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [dialogueKind, setDialogueKind] = useState<keyof typeof HOUSE_DIALOGUE>("host");
  const [infoOpen, setInfoOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const uiBlockingRef = useRef(false);
  uiBlockingRef.current = infoOpen || pickerOpen || !artReady;
  const [nearHost, setNearHost] = useState(() => algyHouseHostFacing(floor, playerRef.current, characterId));
  const floorRef = useRef(floor);
  const moveRef = useRef<HouseMove | null>(null);
  const descendingUpstairsRef = useRef(false);
  const heldDirectionsRef = useRef<Set<HouseDirection>>(new Set());
  const blockedDirectionsRef = useRef<Set<HouseDirection>>(new Set());
  const beginMoveRef = useRef<(direction: HouseDirection) => void>(() => undefined);
  const doorTransitionRef = useRef({
    phase: doorTransitionPhase,
    startedAt: typeof performance === "undefined" ? 0 : performance.now(),
  });
  const [leaving, setLeaving] = useState(false);
  const leavingRef = useRef(false);
  const [nearStereo, setNearStereo] = useState(() => algyHouseFeatureFacing(floor, playerRef.current)?.id === "stereo");
  const [musicReady, setMusicReady] = useState(false);
  // Keep music alive across floor/character art loads after the first reveal.
  useEffect(() => { if (artReady) setMusicReady(true); }, [artReady]);
  const stereo = useHouseStereo({ muted, volume, autoPlay: musicReady && !leaving });
  const { stop: stopStereo, start: startStereo } = stereo;
  const musicButtonLabel = stereo.status === "playing" || stereo.status === "loading"
    ? (muted || volume === 0 ? "Unmute" : "Mute") : "Play music";
  const handleMusicButton = () => {
    if (stereo.status === "playing" || stereo.status === "loading") {
      if (volume === 0) {
        onVolumeChange?.(0.55);
        if (muted) onToggleMute();
      } else onToggleMute();
      return;
    }
    // A direct retry can restore audibility. Automatic entry respects saved
    // mute/volume, including a deliberately silent setting.
    if (muted) onToggleMute();
    if (volume === 0) onVolumeChange?.(0.55);
    startStereo();
  };

  useEffect(() => {
    doorTransitionRef.current = {
      phase: doorTransitionPhase,
      startedAt: performance.now(),
    };
    if (doorTransitionPhase !== "idle") {
      for (const direction of heldDirectionsRef.current) blockedDirectionsRef.current.add(direction);
      heldDirectionsRef.current.clear();
      moveRef.current = null;
    }
  }, [doorTransitionPhase]);

  useEffect(() => {
    if (persistTownScene) {
      safeSessionSet(ALGY_HOUSE_SCENE_KEY, ALGY_HOUSE_SCENE);
    } else {
      // The standalone room shares local storage with the town preview.
      // Browser Back must restore the exterior, not the legacy embedded room.
      try { window.sessionStorage.removeItem(ALGY_HOUSE_SCENE_KEY); }
      catch { /* Storage is optional. */ }
    }
    safeSessionSet(ALGY_HOUSE_FLOOR_KEY, floor);
    descendingUpstairsRef.current = false;
    if (floorRef.current !== floor) {
      floorRef.current = floor;
      playerRef.current = algyHouseArrivalForFloor(floor);
      moveRef.current = null;
      heldDirectionsRef.current.clear();
      safeSessionSet(ALGY_HOUSE_PLAYER_KEY, JSON.stringify({ floor, ...playerRef.current }));
    }
    if (!isAlgyHouseWalkable(floor, playerRef.current.x, playerRef.current.y, characterId)) {
      const safePlayer = [
        { x: playerRef.current.x, y: playerRef.current.y + 1 },
        { x: playerRef.current.x, y: playerRef.current.y - 1 },
        { x: playerRef.current.x - 1, y: playerRef.current.y },
        { x: playerRef.current.x + 1, y: playerRef.current.y },
      ].find((point) => isAlgyHouseWalkable(floor, point.x, point.y, characterId));
      playerRef.current = safePlayer
        ? { ...playerRef.current, ...safePlayer, frame: 0 }
        : algyHouseArrivalForFloor(floor);
      safeSessionSet(ALGY_HOUSE_PLAYER_KEY, JSON.stringify({ floor, ...playerRef.current }));
    }
    setNearStereo(algyHouseFeatureFacing(floor, playerRef.current)?.id === "stereo");
    setNearHost(algyHouseHostFacing(floor, playerRef.current, characterId));
    dialogueRef.current = false;
    setDialogueOpen(false);
  }, [characterId, floor, persistTownScene]);

  useEffect(() => {
    if (dialogueOpen) dialogueCloseRef.current?.focus({ preventScroll: true });
    else if (restoreDialogueFocusRef.current) {
      restoreDialogueFocusRef.current = false;
      interactButtonRef.current?.focus({ preventScroll: true });
    }
  }, [dialogueOpen]);

  useEffect(() => {
    if (infoOpen) infoCloseRef.current?.focus({ preventScroll: true });
    else if (pickerOpen) characterChoiceRefs.current[characterId === "algy" ? 0 : 1]?.focus({ preventScroll: true });
    else if (restoreMenuFocusRef.current) {
      const target = restoreMenuFocusRef.current;
      restoreMenuFocusRef.current = null;
      (target === "info" ? infoButtonRef.current : characterButtonRef.current)?.focus({ preventScroll: true });
    }
  }, [characterId, infoOpen, pickerOpen]);

  const closeDialogue = useCallback(() => {
    dialogueRef.current = false;
    restoreDialogueFocusRef.current = true;
    setDialogueOpen(false);
    heldDirectionsRef.current.clear();
  }, []);

  const leaveHouse = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    heldDirectionsRef.current.clear();
    moveRef.current = null;
    stopStereo();
    setLeaving(true);
    onLeave();
  }, [onLeave, stopStereo]);

  const interact = useCallback(() => {
    if (dialogueRef.current) { closeDialogue(); return; }
    if (leaving || uiBlockingRef.current || moveRef.current || doorTransitionRef.current.phase !== "idle") return;
    if (
      floor === "upstairs" &&
      playerRef.current.x === ALGY_HOUSE_UPSTAIRS_DOOR.x &&
      playerRef.current.y === ALGY_HOUSE_UPSTAIRS_DOOR.y - 1 &&
      playerRef.current.dir === "s"
    ) {
      heldDirectionsRef.current.clear();
      setDialogueKind("door");
      dialogueRef.current = true;
      setDialogueOpen(true);
      return;
    }
    if (algyHouseHostFacing(floor, playerRef.current, characterId)) {
      for (const direction of heldDirectionsRef.current) blockedDirectionsRef.current.add(direction);
      heldDirectionsRef.current.clear();
      const opposite: Record<HouseDirection, HouseDirection> = { n: "s", s: "n", e: "w", w: "e" };
      hostDirectionRef.current = opposite[playerRef.current.dir];
      setDialogueKind("host");
      dialogueRef.current = true;
      setDialogueOpen(true);
      return;
    }
    if (algyHouseComputerFacing(floor, playerRef.current)) {
      for (const direction of heldDirectionsRef.current) blockedDirectionsRef.current.add(direction);
      heldDirectionsRef.current.clear();
      setDialogueKind("computer");
      dialogueRef.current = true;
      setDialogueOpen(true);
      return;
    }
    if (algyHouseFeatureFacing(floor, playerRef.current)?.id === "stereo") {
      volumeInputRef.current?.focus({ preventScroll: true });
    }
  }, [characterId, closeDialogue, floor, leaving]);

  const beginMove = useCallback((direction: HouseDirection) => {
    if (
      leavingRef.current ||
      dialogueRef.current ||
      uiBlockingRef.current ||
      doorTransitionRef.current.phase !== "idle" ||
      blockedDirectionsRef.current.has(direction) ||
      moveRef.current
    ) return;
    const player = playerRef.current;
    const step = algyHouseStep(floor, player, direction, characterId);
    player.dir = direction;
    setNearStereo(algyHouseFeatureFacing(floor, player)?.id === "stereo");
    setNearHost(algyHouseHostFacing(floor, player, characterId));
    if (!step) return;
    if (step.transition === "outside") {
      // Fade from the inside doorway. Never animate a step beyond the room.
      onPrepareDoorSound();
      leaveHouse();
      return;
    }
    if (floor === "upstairs" && step.transition === "ground") {
      descendingUpstairsRef.current = true;
    }
    onPrepareDoorSound();
    moveRef.current = {
      from: { x: player.x, y: player.y },
      to: step.point,
      dir: direction,
      startedAt: performance.now(),
      transition: step.transition,
    };
  }, [characterId, floor, leaveHouse, onPrepareDoorSound]);

  useEffect(() => {
    beginMoveRef.current = beginMove;
  }, [beginMove]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select")) return;
      if (uiBlockingRef.current) {
        if (event.key === "Escape") {
          event.preventDefault();
          restoreMenuFocusRef.current = infoOpen ? "info" : "character";
          setInfoOpen(false);
          setPickerOpen(false);
        }
        return;
      }
      if (dialogueRef.current && ["Escape", "Enter", " ", "Spacebar", "e", "E"].includes(event.key)) {
        event.preventDefault();
        if (!event.repeat) closeDialogue();
        return;
      }
      if (event.key === "Enter" || event.key === " " || event.key === "Spacebar" || event.key === "e" || event.key === "E") {
        if (event.target instanceof HTMLElement && event.target.closest("button")) return;
        event.preventDefault();
        if (!event.repeat) interact();
        return;
      }
      const direction = KEY_DIRECTION[event.key];
      if (!direction) return;
      event.preventDefault();
      // Menus and tab changes clear movement. A key still held from before
      // that pause must be released before it can start another step.
      if (event.repeat && !heldDirectionsRef.current.has(direction)) return;
      if (dialogueRef.current) {
        blockedDirectionsRef.current.add(direction);
        return;
      }
      if (blockedDirectionsRef.current.has(direction)) return;
      if (doorTransitionRef.current.phase !== "idle") {
        blockedDirectionsRef.current.add(direction);
        return;
      }
      heldDirectionsRef.current.add(direction);
      beginMoveRef.current(direction);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      const direction = KEY_DIRECTION[event.key];
      if (direction) {
        heldDirectionsRef.current.delete(direction);
        blockedDirectionsRef.current.delete(direction);
      }
    };
    const clearHeld = () => {
      heldDirectionsRef.current.clear();
      blockedDirectionsRef.current.clear();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") clearHeld();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearHeld);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearHeld);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [closeDialogue, infoOpen, interact]);

  useEffect(() => {
    if (artStatus !== "ready") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const { atlas, avatar, hostAvatar, groundStairArt, upstairsStairArt } = images;

    let frameId = 0;
    let firstFramePainted = false;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const render = (now: number) => {
      resize();
      const viewportW = canvas.width;
      const viewportH = canvas.height;
      context.setTransform(1, 0, 0, 1, 0, 0);

      const move = moveRef.current;
      if (move && now - move.startedAt >= MOVE_MS) {
        const player = playerRef.current;
        player.x = move.to.x;
        player.y = move.to.y;
        player.dir = move.dir;
        player.frame = (player.frame + 1) % 6;
        moveRef.current = null;
        setNearStereo(algyHouseFeatureFacing(floor, player)?.id === "stereo");
        setNearHost(algyHouseHostFacing(floor, player, characterId));
        const atLockedDoorApproach = floor === "upstairs" &&
          player.x === ALGY_HOUSE_UPSTAIRS_DOOR.x && player.y === ALGY_HOUSE_UPSTAIRS_DOOR.y - 1;
        if (!atLockedDoorApproach) doorApproachLatchedRef.current = false;
        if (atLockedDoorApproach && !doorApproachLatchedRef.current) {
          doorApproachLatchedRef.current = true;
          setDialogueKind("door");
          dialogueRef.current = true;
          heldDirectionsRef.current.clear();
          setDialogueOpen(true);
        }
        if (move.transition === "outside") {
          leaveHouse();
        } else if (move.transition === "ground" || move.transition === "upstairs") {
          onChangeFloor(move.transition);
        } else {
          safeSessionSet(ALGY_HOUSE_PLAYER_KEY, JSON.stringify({ floor, ...player }));
          const held = Array.from(heldDirectionsRef.current);
          const nextDirection = held[held.length - 1];
          if (nextDirection) beginMoveRef.current(nextDirection);
        }
      }

      const transition = doorTransitionRef.current;
      const playerAlpha = houseDoorCharacterAlpha(transition.phase, now - transition.startedAt);
      drawRoom(
        context,
        viewportW,
        viewportH,
        atlas,
        avatar,
        groundStairArt,
        upstairsStairArt,
        floor,
        playerRef.current,
        moveRef.current,
        now,
        playerAlpha,
        descendingUpstairsRef.current,
        characterId,
        hostAvatar,
        hostDirectionRef.current,
      );
      if (!firstFramePainted) {
        firstFramePainted = true;
        setPaintedImages(images);
      }
      frameId = window.requestAnimationFrame(render);
    };

    frameId = window.requestAnimationFrame(render);
    window.addEventListener("resize", resize);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [artStatus, images, characterId, floor, leaveHouse, onChangeFloor]);

  const pressDirection = (direction: HouseDirection) => {
    if (dialogueRef.current || uiBlockingRef.current) return;
    if (blockedDirectionsRef.current.has(direction)) return;
    if (doorTransitionRef.current.phase !== "idle") {
      blockedDirectionsRef.current.add(direction);
      return;
    }
    heldDirectionsRef.current.add(direction);
    beginMoveRef.current(direction);
  };

  const releaseDirection = (direction: HouseDirection) => {
    heldDirectionsRef.current.delete(direction);
    blockedDirectionsRef.current.delete(direction);
  };

  const buttonStyle = {
    width: 52,
    height: 52,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #c89838",
    borderRadius: 8,
    background: "rgba(28, 18, 12, 0.82)",
    boxShadow: "2px 2px 0 rgba(0,0,0,0.5)",
    color: "#f4e8c1",
    touchAction: "none" as const,
    userSelect: "none" as const,
    cursor: "pointer",
  };

  return (
    <main
      data-testid="algys-house-interior"
      data-floor={floor}
      data-character={characterId}
      data-host-present={algyHouseHasHost(floor, characterId) ? "true" : "false"}
      data-muted={muted ? "true" : "false"}
      data-door-x={ALGY_HOUSE_DOOR.x}
      data-stair-x={ALGY_HOUSE_STAIRS_UP_ORIGIN.x}
      data-stair-direction="west"
      data-feature-count={ALGY_HOUSE_FEATURES.filter((feature) => feature.floor === floor).length}
      data-stereo-status={stereo.status}
      data-art-status={artReady ? "ready" : artStatus === "error" ? "error" : "loading"}
      aria-busy={!artReady && artStatus !== "error"}
      data-transition-phase={doorTransitionPhase}
      style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#120b1d", color: "#f4e8c1", fontFamily: FONT }}
    >
      <canvas
        ref={canvasRef}
        aria-label={floor === "upstairs" ? "Algy's House upstairs room, return staircase and closed lower-right door" : "Algy's House ground-floor room and staircase"}
        style={{ width: "100%", height: "100%", display: "block", imageRendering: "pixelated", visibility: artReady ? "visible" : "hidden" }}
      />

      {!artReady && (
        <section data-testid="house-art-cover" aria-label="House loading" style={{ position: "fixed", inset: 0, zIndex: 90, display: "grid", placeContent: "center", justifyItems: "center", gap: 20, padding: 24, background: "#120b1d", textAlign: "center", fontSize: 12, lineHeight: 2 }}>
          <div>ALGY'S HOUSE</div>
          {artStatus === "error" ? <>
            <p role="alert" style={{ margin: 0, fontSize: 10 }}>House art could not load.</p>
            <button type="button" onClick={retryArt} style={{ ...buttonStyle, width: "auto", padding: "8px 16px", font: "inherit", fontSize: 10 }}>Try again</button>
          </> : <div role="status" aria-label="Loading house" style={{ color: "#c89838" }}>...</div>}
        </section>
      )}
      <div aria-hidden={!artReady || undefined} style={{ visibility: artReady ? "visible" : "hidden" }}>
      <button
        type="button"
        onClick={handleMusicButton}
        disabled={!artReady || dialogueOpen || infoOpen || pickerOpen || leaving || doorTransitionPhase !== "idle"}
        aria-label={musicButtonLabel}
        title={musicButtonLabel}
        style={{
          ...buttonStyle,
          position: "fixed",
          top: 12,
          left: 12,
          width: 44,
          height: 40,
          borderRadius: 0,
          background: "rgba(28, 18, 12, 0.78)",
          boxShadow: "2px 2px 0 rgba(0,0,0,0.5)",
          fontFamily: FONT,
          fontSize: 14,
        }}
      >
        {stereo.status === "stopped" || stereo.status === "blocked" || stereo.status === "error" ? "▶" : muted || volume === 0 ? "♪̶" : "♪"}
      </button>

      {!dialogueOpen && <aside
        aria-label="House menu"
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          zIndex: 7,
          display: "grid",
          justifyItems: "end",
          gap: 6,
          width: "fit-content",
          maxWidth: "calc(100vw - 80px)",
          marginLeft: "auto",
          fontSize: 9,
          lineHeight: 1.5,
        }}
      >
        <div data-testid="house-top-row" style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", gap: 6, width: "fit-content", maxWidth: "calc(100vw - 80px)" }}>
          <button ref={infoButtonRef} type="button" disabled={infoOpen || pickerOpen} aria-label="Open info" aria-expanded={infoOpen} onClick={() => {
            heldDirectionsRef.current.clear();
            moveRef.current = null;
            setPickerOpen(false);
            restoreMenuFocusRef.current = infoOpen ? "info" : null;
            setInfoOpen((open) => !open);
          }} style={{ flex: "0 0 auto", width: 32, height: 32, padding: 0, border: "2px solid #c89838", borderRadius: 0, background: "rgba(28, 18, 12, 0.78)", boxShadow: "2px 2px 0 rgba(0,0,0,0.5)", color: "#f4e8c1", font: "inherit", cursor: "pointer" }}>
            ⓘ
          </button>
          <div data-testid="location-label" style={{ minWidth: 0, width: "fit-content", maxWidth: "calc(100vw - 118px)", marginLeft: "auto", boxSizing: "border-box", padding: "8px 10px", border: "2px solid #c89838", background: "rgba(28, 18, 12, 0.78)", boxShadow: "2px 2px 0 rgba(0,0,0,0.5)", color: "#f4e8c1", lineHeight: 1.5, letterSpacing: "0.08em", overflowWrap: "anywhere" }}>
            {floor === "upstairs" ? "ALGY'S HOUSE / UPSTAIRS" : "ALGY'S HOUSE"}
          </div>
        </div>
        <nav aria-label="Legal" style={{ width: "fit-content", padding: "6px 8px", border: "2px solid #c89838", background: "rgba(28, 18, 12, 0.78)", boxShadow: "2px 2px 0 rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>
          <a href="https://youngalgy.com/privacy" tabIndex={infoOpen || pickerOpen ? -1 : 0} style={{ color: "#f4e8c1", pointerEvents: infoOpen || pickerOpen ? "none" : "auto" }}>PRIVACY</a>
          <span aria-hidden="true"> · </span>
          <a href="https://youngalgy.com/terms" tabIndex={infoOpen || pickerOpen ? -1 : 0} style={{ color: "#f4e8c1", pointerEvents: infoOpen || pickerOpen ? "none" : "auto" }}>TERMS</a>
        </nav>
        {onChangeCharacter && (
          <button ref={characterButtonRef} type="button" disabled={infoOpen || pickerOpen || characterChangePending} aria-label="Change character" aria-expanded={pickerOpen} onClick={() => {
            heldDirectionsRef.current.clear();
            moveRef.current = null;
            if (dialogueRef.current) closeDialogue();
            setInfoOpen(false);
            restoreMenuFocusRef.current = pickerOpen ? "character" : null;
            setPickerOpen((open) => !open);
          }} style={{ width: "fit-content", padding: "7px 9px", border: "2px solid #c89838", borderRadius: 0, background: "rgba(28, 18, 12, 0.78)", boxShadow: "2px 2px 0 rgba(0,0,0,0.5)", color: "#f4e8c1", font: "inherit", cursor: "pointer" }}>
            ☺ {characterId === "algy" ? "Algy" : "Mitch"}
          </button>
        )}
        {characterChangeStatus && <div role="status" style={{ width: 180, maxWidth: "calc(100vw - 80px)", padding: "7px 9px", border: "2px solid #c89838", background: "rgba(28, 18, 12, 0.92)", boxShadow: "2px 2px 0 rgba(0,0,0,0.5)", color: "#f4e8c1" }}>{characterChangeStatus}</div>}
        {pickerOpen && (
          <div role="dialog" aria-modal="true" aria-label="Choose character" onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            event.preventDefault();
            const current = characterChoiceRefs.current.indexOf(document.activeElement as HTMLButtonElement);
            characterChoiceRefs.current[(current + (event.shiftKey ? -1 : 1) + 2) % 2]?.focus();
          }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {(["algy", "mitch"] as const).map((id, index) => (
              <button ref={(element) => { characterChoiceRefs.current[index] = element; }} key={id} type="button" aria-pressed={characterId === id} onClick={() => {
                restoreMenuFocusRef.current = "character";
                setPickerOpen(false);
                if (id !== characterId) onChangeCharacter?.(id);
              }} style={{ padding: "8px 4px", border: "2px solid #c89838", borderRadius: 0, background: characterId === id ? "#57313a" : "rgba(28, 18, 12, 0.92)", boxShadow: "2px 2px 0 rgba(0,0,0,0.5)", color: "#f4e8c1", font: "inherit", textTransform: "capitalize", cursor: "pointer" }}>
                {id === "algy" ? "Algy" : "Mitch"}
              </button>
            ))}
          </div>
        )}
      </aside>}

      {infoOpen && (
        <section role="dialog" aria-modal="true" aria-label="House info key" onKeyDown={(event) => {
          if (event.key === "Tab") { event.preventDefault(); infoCloseRef.current?.focus(); }
        }} style={{ position: "fixed", zIndex: 8, top: 64, right: 12, width: 260, maxWidth: "calc(100vw - 24px)", boxSizing: "border-box", padding: 12, border: "2px solid #c89838", background: "rgba(28, 18, 12, 0.96)", boxShadow: "2px 2px 0 rgba(0,0,0,0.5)", color: "#f4e8c1", fontSize: 9, lineHeight: 1.8 }}>
          <strong>KEY</strong>
          <p>Arrow keys or WASD: move<br />Enter, Space, or E: interact<br />Touch: use the onscreen GO button</p>
          <p>Music starts when you enter. Some browsers need a tap or key press first.</p>
          <p>The top-left button mutes music. Face the upstairs speaker to adjust its volume.</p>
          <p style={{ marginBottom: 0 }}>Environment art licensed from LimeZu.</p>
          <button ref={infoCloseRef} type="button" onClick={() => { restoreMenuFocusRef.current = "info"; setInfoOpen(false); }} style={{ marginTop: 10, minHeight: 40, padding: "7px 10px", border: "2px solid #c89838", borderRadius: 0, background: "#241419", boxShadow: "2px 2px 0 rgba(0,0,0,0.5)", color: "#f4e8c1", font: "inherit", cursor: "pointer" }}>Close info</button>
        </section>
      )}

      {!dialogueOpen && !infoOpen && !pickerOpen && nearStereo && onVolumeChange && (
        <aside
          aria-label="Stereo"
          style={{ position: "fixed", left: 14, bottom: 194, maxWidth: "calc(100vw - 28px)", padding: "6px 12px", border: "2px solid #c89838", background: "rgba(28, 18, 34, 0.94)", fontSize: 9, lineHeight: 1.8 }}
        >
              <input
                ref={volumeInputRef}
                aria-label="Music volume"
                type="range" min="0" max="100" step="5"
                value={muted ? 0 : Math.round(volume * 100)}
                onChange={(event) => {
                  const nextVolume = Number(event.target.value) / 100;
                  onVolumeChange(nextVolume);
                  if (muted && nextVolume > 0) onToggleMute();
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Escape") return;
                  event.preventDefault();
                  event.stopPropagation();
                  interactButtonRef.current?.focus({ preventScroll: true });
                }}
                style={{ display: "block", margin: 0, width: 140, height: 32, accentColor: "#c89838" }}
              />
        </aside>
      )}

      {!dialogueOpen && !infoOpen && !pickerOpen && nearHost && (
        <aside aria-label="Interaction" role="status" style={{ position: "fixed", left: 14, bottom: nearStereo ? 254 : 194, maxWidth: "calc(100vw - 28px)", padding: "10px 12px", border: "2px solid #c89838", background: "rgba(28, 18, 34, 0.94)", color: "#e2b45c", fontSize: 9, lineHeight: 1.8 }}>
          GO / Enter: talk to Algy
        </aside>
      )}

      <div
        aria-label="Room controls"
        style={{
          ...HUB_DPAD_LAYOUT_STYLE,
          visibility: !artReady || dialogueOpen || infoOpen || pickerOpen ? "hidden" : "visible",
          gridTemplateAreas: '". up ." "left action right" ". down ."',
          zIndex: 5,
        }}
      >
        {(["n", "w", "e", "s"] as HouseDirection[]).map((direction) => {
          const gridArea = direction === "n" ? "up" : direction === "s" ? "down" : direction === "w" ? "left" : "right";
          const label = direction === "n" ? "up" : direction === "s" ? "down" : direction === "w" ? "left" : "right";
          return (
            <button
              key={direction}
              type="button"
              disabled={dialogueOpen}
              aria-label={`Move ${label}`}
              onClick={(event) => {
                // Pointer movement already starts on press. Native keyboard
                // and assistive clicks have no pointer press, so take one step.
                if (event.detail === 0) beginMoveRef.current(direction);
              }}
              onPointerDown={(event) => {
                event.preventDefault();
                event.currentTarget.setPointerCapture?.(event.pointerId);
                pressDirection(direction);
              }}
              onPointerUp={(event) => {
                event.preventDefault();
                releaseDirection(direction);
              }}
              onPointerCancel={() => releaseDirection(direction)}
              onPointerLeave={(event) => {
                if (event.buttons === 0) releaseDirection(direction);
              }}
              style={{ ...HUB_DPAD_BUTTON_STYLE, gridArea }}
            >
              <PixelArrow direction={direction} />
            </button>
          );
        })}
        <button
          ref={interactButtonRef}
          type="button"
          aria-label="Go"
          title="Interact (Enter / E)"
          onClick={interact}
          style={{ ...HUB_DPAD_GO_STYLE, gridArea: "action" }}
        >
          GO
        </button>
      </div>

      {dialogueOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 10 }}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="algy-house-dialogue-speaker"
            aria-describedby="algy-house-dialogue-line"
            onKeyDown={(event) => {
              if (event.key === "Tab") {
                event.preventDefault();
                dialogueCloseRef.current?.focus({ preventScroll: true });
              }
            }}
            style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 14,
              width: "calc(100% - 28px)", maxWidth: 520, boxSizing: "border-box", padding: 16,
              border: "3px solid #c89838", background: "#1c1222", boxShadow: "4px 4px 0 #08040d",
              fontSize: 10, lineHeight: 2 }}
          >
            <div id="algy-house-dialogue-speaker" style={{ color: "#ffd870", marginBottom: 8 }}>{HOUSE_DIALOGUE[dialogueKind].speaker}</div>
            <p id="algy-house-dialogue-line" style={{ margin: "0 0 12px" }}>{HOUSE_DIALOGUE[dialogueKind].line}</p>
            <button ref={dialogueCloseRef} type="button" onClick={closeDialogue} aria-label="Close conversation"
              style={{ ...buttonStyle, width: "auto", minWidth: 64, minHeight: 44, padding: "8px 12px", marginLeft: "auto", fontFamily: FONT, fontSize: 10 }}>
              OK
            </button>
          </section>
        </div>
      )}
      </div>
    </main>
  );
}
