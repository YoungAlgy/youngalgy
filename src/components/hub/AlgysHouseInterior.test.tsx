import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AlgysHouseInterior from "./AlgysHouseInterior";
import {
  ALGY_HOUSE_COLS,
  ALGY_HOUSE_DEFAULT_FLOOR,
  ALGY_HOUSE_DOOR,
  ALGY_HOUSE_FEATURES,
  ALGY_HOUSE_FLOOR_KEY,
  ALGY_HOUSE_GRID,
  ALGY_HOUSE_GROUND_GRID,
  ALGY_HOUSE_GROUND_STAIR_RETURN,
  ALGY_HOUSE_PLAYER_KEY,
  ALGY_HOUSE_ROWS,
  ALGY_HOUSE_SCENE,
  ALGY_HOUSE_SCENE_KEY,
  ALGY_HOUSE_SPAWN,
  ALGY_HOUSE_STAIRS_DOWN,
  ALGY_HOUSE_STAIRS_UP,
  ALGY_HOUSE_UPSTAIRS_GRID,
  ALGY_HOUSE_UPSTAIRS_SPAWN,
  algyHouseArrivalForFloor,
  algyHouseFeatureAt,
  algyHouseFeatureFacing,
  algyHouseGridForFloor,
  algyHouseStep,
  algyHouseUpstairsDescentAlpha,
  isAlgyHouseWalkable,
  type AlgyHouseFloor,
  type HouseDirection,
} from "./algyHouseScene";

const CARDINALS = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
] as const;

function reachableFrom(floor: AlgyHouseFloor, start: { x: number; y: number }): Set<string> {
  const visited = new Set<string>([`${start.x},${start.y}`]);
  const queue = [start];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const direction of CARDINALS) {
      const next = { x: current.x + direction.x, y: current.y + direction.y };
      const key = `${next.x},${next.y}`;
      if (!visited.has(key) && isAlgyHouseWalkable(floor, next.x, next.y)) {
        visited.add(key);
        queue.push(next);
      }
    }
  }
  return visited;
}

function allWalkableTiles(floor: AlgyHouseFloor): string[] {
  return algyHouseGridForFloor(floor).flatMap((row, y) =>
    [...row].flatMap((_cell, x) => (isAlgyHouseWalkable(floor, x, y) ? [`${x},${y}`] : [])),
  );
}

function followSteps(
  floor: AlgyHouseFloor,
  start: { x: number; y: number },
  directions: HouseDirection[],
) {
  let player = start;
  return directions.map((direction) => {
    const step = algyHouseStep(floor, player, direction);
    expect(step).not.toBeNull();
    player = step!.point;
    return step;
  });
}

function readPngSize(relativePath: string) {
  const png = readFileSync(resolve(process.cwd(), relativePath));
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

type TransitionPhase = "idle" | "out" | "hold" | "in";

function roomProps(overrides?: {
  floor?: AlgyHouseFloor;
  muted?: boolean;
  onToggleMute?: () => void;
  onLeave?: () => void;
  onChangeFloor?: (floor: AlgyHouseFloor) => void;
  onPrepareDoorSound?: () => void;
  doorTransitionPhase?: TransitionPhase;
}) {
  return {
    floor: overrides?.floor ?? ALGY_HOUSE_DEFAULT_FLOOR,
    muted: overrides?.muted ?? false,
    onToggleMute: overrides?.onToggleMute ?? vi.fn(),
    onLeave: overrides?.onLeave ?? vi.fn(),
    onChangeFloor: overrides?.onChangeFloor ?? vi.fn(),
    onPrepareDoorSound: overrides?.onPrepareDoorSound ?? vi.fn(),
    doorTransitionPhase: overrides?.doorTransitionPhase ?? ("idle" as TransitionPhase),
  };
}

function renderRoom(overrides?: Parameters<typeof roomProps>[0]) {
  const props = roomProps(overrides);
  return { props, view: render(<AlgysHouseInterior {...props} />) };
}

let scheduledFrame: FrameRequestCallback | null = null;

function completeCurrentMove(): void {
  const callback = scheduledFrame;
  expect(callback).not.toBeNull();
  act(() => callback?.(200));
}

describe("Algy's House compact two-floor map", () => {
  it("keeps both connected rooms at 14x10 and preserves the ground-grid alias", () => {
    expect(ALGY_HOUSE_ROWS).toBe(10);
    expect(ALGY_HOUSE_COLS).toBe(14);
    expect(ALGY_HOUSE_GRID).toBe(ALGY_HOUSE_GROUND_GRID);

    for (const floor of ["ground", "upstairs"] as const) {
      const grid = algyHouseGridForFloor(floor);
      const spawn = floor === "ground" ? ALGY_HOUSE_SPAWN : ALGY_HOUSE_UPSTAIRS_SPAWN;
      expect(grid).toHaveLength(ALGY_HOUSE_ROWS);
      for (const row of grid) expect(row).toHaveLength(ALGY_HOUSE_COLS);
      expect(isAlgyHouseWalkable(floor, spawn.x, spawn.y)).toBe(true);
      expect(reachableFrom(floor, spawn).size).toBe(allWalkableTiles(floor).length);
    }
  });

  it("uses the compact native stair sprites at their exact source sizes", () => {
    expect(readPngSize("public/sprites/interiors/algy-house-stair-ground.png")).toEqual({
      width: 48,
      height: 40,
    });
    expect(readPngSize("public/sprites/interiors/algy-house-stair-upstairs.png")).toEqual({
      width: 48,
      height: 28,
    });

    const source = readFileSync(resolve(process.cwd(), "src/components/hub/AlgysHouseInterior.tsx"), "utf8");
    expect(source).toContain("const GROUND_STAIR_ART_SIZE = { width: 48, height: 40 }");
    expect(source).toContain("const UPSTAIRS_STAIR_ART_SIZE = { width: 48, height: 28 }");
    expect(source).toContain("const GROUND_STAIR_HIGH_CAP_SIZE = { width: 7, height: 2 }");
  });

  it("funnels the ground route through x1-x4 and blocks both stair sides", () => {
    expect(ALGY_HOUSE_STAIRS_UP).toEqual({ x: 1, y: 2 });
    expect(ALGY_HOUSE_GROUND_GRID[1].slice(1, 5)).toBe("BBBB");
    expect(ALGY_HOUSE_GROUND_GRID[2].slice(1, 5)).toBe("U^^^");
    expect(ALGY_HOUSE_GROUND_GRID[3].slice(1, 5)).toBe("BBBB");
    for (const x of [1, 2, 3, 4]) {
      expect(isAlgyHouseWalkable("ground", x, 2)).toBe(true);
      expect(isAlgyHouseWalkable("ground", x, 1)).toBe(false);
      expect(isAlgyHouseWalkable("ground", x, 3)).toBe(false);
    }
    expect(isAlgyHouseWalkable("ground", 5, 2)).toBe(true);
  });

  it("funnels the upstairs route through x2-x4 and keeps x1 as its clear landing", () => {
    expect(ALGY_HOUSE_STAIRS_DOWN).toEqual({ x: 4, y: 2 });
    expect(ALGY_HOUSE_UPSTAIRS_GRID[1].slice(2, 6)).toBe("BBB.");
    expect(ALGY_HOUSE_UPSTAIRS_GRID[2].slice(2, 6)).toBe("^^S.");
    expect(ALGY_HOUSE_UPSTAIRS_GRID[3].slice(2, 6)).toBe("BBB.");
    expect(isAlgyHouseWalkable("upstairs", 1, 2)).toBe(true);
    for (const x of [2, 3, 4]) {
      expect(isAlgyHouseWalkable("upstairs", x, 2)).toBe(true);
      expect(isAlgyHouseWalkable("upstairs", x, 1)).toBe(false);
      expect(isAlgyHouseWalkable("upstairs", x, 3)).toBe(false);
    }
    expect(isAlgyHouseWalkable("upstairs", 5, 1)).toBe(true);
    expect(isAlgyHouseWalkable("upstairs", 5, 2)).toBe(true);
    expect(isAlgyHouseWalkable("upstairs", 5, 3)).toBe(true);
    expect(isAlgyHouseWalkable("ground", -1, 2)).toBe(false);
    expect(isAlgyHouseWalkable("upstairs", ALGY_HOUSE_COLS, 2)).toBe(false);
  });

  it("reaches upstairs in exactly four westward inputs from the ground return", () => {
    const steps = followSteps("ground", ALGY_HOUSE_GROUND_STAIR_RETURN, ["w", "w", "w", "w"]);
    expect(steps.map((step) => step?.point)).toEqual([
      { x: 4, y: 2 },
      { x: 3, y: 2 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ]);
    expect(steps.slice(0, 3).every((step) => step?.transition === null)).toBe(true);
    expect(steps[3]).toEqual({ point: ALGY_HOUSE_STAIRS_UP, transition: "upstairs" });
  });

  it("returns downstairs one tile earlier in exactly three eastward inputs", () => {
    const steps = followSteps("upstairs", ALGY_HOUSE_UPSTAIRS_SPAWN, ["e", "e", "e"]);
    expect(steps.map((step) => step?.point)).toEqual([
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
    ]);
    expect(steps.slice(0, 2).every((step) => step?.transition === null)).toBe(true);
    expect(steps[2]).toEqual({ point: ALGY_HOUSE_STAIRS_DOWN, transition: "ground" });
    expect(algyHouseUpstairsDescentAlpha(true, 3, 2)).toBe(1);
    expect(algyHouseUpstairsDescentAlpha(true, 3.5, 2)).toBe(0.5);
    expect(algyHouseUpstairsDescentAlpha(true, 4, 2)).toBe(0);
    expect(algyHouseUpstairsDescentAlpha(false, 4, 2)).toBe(1);
    expect(algyHouseUpstairsDescentAlpha(true, 4, 3)).toBe(1);
  });

  it("lands on walkable tiles facing away from the staircase and resists held-input bounce", () => {
    expect(algyHouseArrivalForFloor("upstairs")).toEqual({ x: 1, y: 2, dir: "w", frame: 0 });
    expect(algyHouseArrivalForFloor("ground")).toEqual({ x: 5, y: 2, dir: "e", frame: 0 });
    expect(ALGY_HOUSE_UPSTAIRS_SPAWN).toEqual(algyHouseArrivalForFloor("upstairs"));
    expect(ALGY_HOUSE_GROUND_STAIR_RETURN).toEqual(algyHouseArrivalForFloor("ground"));
    expect(isAlgyHouseWalkable("upstairs", 1, 2)).toBe(true);
    expect(isAlgyHouseWalkable("ground", 5, 2)).toBe(true);
    expect(algyHouseStep("upstairs", ALGY_HOUSE_UPSTAIRS_SPAWN, "w")).toBeNull();
    expect(algyHouseStep("ground", ALGY_HOUSE_GROUND_STAIR_RETURN, "e")).toEqual({
      point: { x: 6, y: 2 },
      transition: null,
    });
  });

  it("keeps the left exterior door and adds only the upstairs stereo", () => {
    expect(ALGY_HOUSE_DOOR).toEqual({ x: 3, y: 9 });
    expect(ALGY_HOUSE_SPAWN).toMatchObject({ x: 3, y: 8, dir: "n" });
    expect(ALGY_HOUSE_GROUND_GRID.flatMap((row) => [...row]).filter((cell) => cell === "D")).toHaveLength(1);
    expect(ALGY_HOUSE_UPSTAIRS_GRID.flatMap((row) => [...row])).not.toContain("D");
    expect(algyHouseStep("ground", ALGY_HOUSE_SPAWN, "s")).toEqual({
      point: ALGY_HOUSE_DOOR,
      transition: "outside",
    });
    expect(ALGY_HOUSE_FEATURES).toHaveLength(1);
    expect(algyHouseFeatureAt(8, 2, "upstairs")?.id).toBe("stereo");
    expect(algyHouseFeatureAt(8, 2, "ground")).toBeNull();
    expect(isAlgyHouseWalkable("upstairs", 8, 1)).toBe(false);
    expect(isAlgyHouseWalkable("upstairs", 8, 2)).toBe(false);
    expect(isAlgyHouseWalkable("upstairs", 8, 3)).toBe(true);
    expect(algyHouseFeatureFacing("upstairs", { x: 8, y: 3, dir: "n", frame: 0 })?.id).toBe("stereo");
    expect(algyHouseFeatureFacing("upstairs", { x: 8, y: 3, dir: "s", frame: 0 })).toBeNull();
    expect(algyHouseFeatureAt(5, 3)).toBeNull();
    expect(algyHouseFeatureAt(1, 2)).toBeNull();
  });
});

describe("Algy's House compact two-floor interface", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    scheduledFrame = null;
    vi.spyOn(performance, "now").mockReturnValue(0);
    Object.defineProperty(window, "requestAnimationFrame", {
      configurable: true,
      value: vi.fn((callback: FrameRequestCallback) => {
        scheduledFrame = callback;
        return 1;
      }),
    });
    Object.defineProperty(window, "cancelAnimationFrame", {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("exposes both floor states, the x1 stair origin, mute, and shared controls", () => {
    const onToggleMute = vi.fn();
    const { props, view } = renderRoom({ floor: "ground", onToggleMute });
    const room = screen.getByTestId("algys-house-interior");
    expect(room).toHaveAttribute("data-floor", "ground");
    expect(room).toHaveAttribute("data-door-x", "3");
    expect(room).toHaveAttribute("data-stair-x", "1");
    expect(room).toHaveAttribute("data-feature-count", "0");
    expect(room).toHaveAttribute("data-transition-phase", "idle");
    expect(screen.getByLabelText("Algy's House ground-floor room and staircase")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Interact" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Mute" }));
    expect(onToggleMute).toHaveBeenCalledTimes(1);
    expect(window.sessionStorage.getItem(ALGY_HOUSE_SCENE_KEY)).toBe(ALGY_HOUSE_SCENE);
    expect(window.sessionStorage.getItem(ALGY_HOUSE_FLOOR_KEY)).toBe("ground");

    view.rerender(<AlgysHouseInterior {...props} floor="upstairs" />);
    expect(screen.getByTestId("algys-house-interior")).toHaveAttribute("data-floor", "upstairs");
    expect(screen.getByText("ALGY'S HOUSE / UPSTAIRS")).toBeInTheDocument();
    expect(screen.getByLabelText("Algy's House upstairs room and return staircase")).toBeInTheDocument();
    expect(window.sessionStorage.getItem(ALGY_HOUSE_FLOOR_KEY)).toBe("upstairs");
  });

  it("writes floor-tagged safe arrivals whenever the active floor changes", () => {
    const { props, view } = renderRoom({ floor: "ground" });
    view.rerender(<AlgysHouseInterior {...props} floor="upstairs" />);
    expect(JSON.parse(window.sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY) ?? "null")).toEqual({
      floor: "upstairs",
      ...ALGY_HOUSE_UPSTAIRS_SPAWN,
    });

    view.rerender(<AlgysHouseInterior {...props} floor="ground" />);
    expect(JSON.parse(window.sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY) ?? "null")).toEqual({
      floor: "ground",
      ...ALGY_HOUSE_GROUND_STAIR_RETURN,
    });
  });

  it("ignores a saved player tagged for another floor but honors a matching save", () => {
    window.sessionStorage.setItem(
      ALGY_HOUSE_PLAYER_KEY,
      JSON.stringify({ floor: "upstairs", x: 6, y: 1, dir: "n", frame: 0 }),
    );
    const wrongFloorPrepare = vi.fn();
    const wrongFloorView = renderRoom({ floor: "ground", onPrepareDoorSound: wrongFloorPrepare }).view;
    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(wrongFloorPrepare).toHaveBeenCalledTimes(1);
    wrongFloorView.unmount();

    window.sessionStorage.clear();
    window.sessionStorage.setItem(
      ALGY_HOUSE_PLAYER_KEY,
      JSON.stringify({ floor: "ground", x: 6, y: 1, dir: "n", frame: 0 }),
    );
    const matchingFloorPrepare = vi.fn();
    renderRoom({ floor: "ground", onPrepareDoorSound: matchingFloorPrepare });
    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(matchingFloorPrepare).not.toHaveBeenCalled();
  });

  it("rejects saved transition cells on both floors so reload cannot immediately warp", () => {
    window.sessionStorage.setItem(
      ALGY_HOUSE_PLAYER_KEY,
      JSON.stringify({ floor: "ground", ...ALGY_HOUSE_STAIRS_UP, dir: "w", frame: 0 }),
    );
    const onPrepareDoorSound = vi.fn();
    const groundView = renderRoom({ floor: "ground", onPrepareDoorSound }).view;
    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(onPrepareDoorSound).toHaveBeenCalledTimes(1);
    groundView.unmount();

    window.sessionStorage.clear();
    window.sessionStorage.setItem(
      ALGY_HOUSE_PLAYER_KEY,
      JSON.stringify({ floor: "upstairs", ...ALGY_HOUSE_STAIRS_DOWN, dir: "e", frame: 0 }),
    );
    const upstairsPrepare = vi.fn();
    renderRoom({ floor: "upstairs", onPrepareDoorSound: upstairsPrepare });
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(upstairsPrepare).not.toHaveBeenCalled();
  });

  it("dispatches the correct floor callback when each transition cell is crossed", () => {
    window.sessionStorage.setItem(
      ALGY_HOUSE_PLAYER_KEY,
      JSON.stringify({ floor: "ground", x: 2, y: 2, dir: "w", frame: 0 }),
    );
    const groundChange = vi.fn();
    const groundView = renderRoom({ floor: "ground", onChangeFloor: groundChange }).view;
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    completeCurrentMove();
    expect(groundChange).toHaveBeenCalledWith("upstairs");
    groundView.unmount();

    window.sessionStorage.clear();
    window.sessionStorage.setItem(
      ALGY_HOUSE_PLAYER_KEY,
      JSON.stringify({ floor: "upstairs", x: 3, y: 2, dir: "e", frame: 0 }),
    );
    scheduledFrame = null;
    const upstairsChange = vi.fn();
    renderRoom({ floor: "upstairs", onChangeFloor: upstairsChange });
    fireEvent.keyDown(window, { key: "ArrowRight" });
    completeCurrentMove();
    expect(upstairsChange).toHaveBeenCalledWith("ground");
  });

  it("blocks held and repeated movement until the transition key is released", () => {
    const onPrepareDoorSound = vi.fn();
    const { props, view } = renderRoom({
      floor: "ground",
      onPrepareDoorSound,
      doorTransitionPhase: "out",
    });
    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(onPrepareDoorSound).not.toHaveBeenCalled();

    view.rerender(<AlgysHouseInterior {...props} doorTransitionPhase="idle" />);
    fireEvent.keyDown(window, { key: "ArrowUp", repeat: true });
    expect(onPrepareDoorSound).not.toHaveBeenCalled();
    fireEvent.keyUp(window, { key: "ArrowUp" });
    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(onPrepareDoorSound).toHaveBeenCalledTimes(1);
  });

  it("keeps the empty-room interaction inert", () => {
    const play = vi.spyOn(window.HTMLMediaElement.prototype, "play").mockResolvedValue();
    renderRoom({ floor: "upstairs" });
    fireEvent.keyDown(window, { key: "Enter" });
    fireEvent.click(screen.getByRole("button", { name: "Interact" }));
    expect(play).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
