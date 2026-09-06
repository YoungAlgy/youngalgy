import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AlgysHouseInterior from "./AlgysHouseInterior";

// These interaction tests isolate controls. Asset loading has its own suite.
const houseArtMock = vi.hoisted(() => ({
  images: { atlas: null, avatar: null, hostAvatar: null, groundStairArt: null, upstairsStairArt: null },
  retry: vi.fn(),
}));

vi.mock("./useHouseArt", () => ({
  useHouseArt: () => ({ status: "ready", images: houseArtMock.images, retry: houseArtMock.retry }),
}));
import {
  ALGY_HOUSE_DEFAULT_FLOOR,
  ALGY_HOUSE_HOST,
  ALGY_HOUSE_MITCH_GREETING,
  ALGY_HOUSE_PLAYER_KEY,
  ALGY_HOUSE_SPAWN,
  ALGY_HOUSE_UPSTAIRS_SPAWN,
  algyHouseHasHost,
  algyHouseHostFacing,
  algyHouseGridForFloor,
  algyHouseStep,
  isAlgyHouseWalkable,
  type AlgyHouseFloor,
  type HouseDirection,
  type HousePlayer,
} from "./algyHouseScene";

const CARDINALS: readonly { dx: number; dy: number }[] = [
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
];

function savePlayer(floor: AlgyHouseFloor, player: HousePlayer): void {
  window.sessionStorage.setItem(ALGY_HOUSE_PLAYER_KEY, JSON.stringify({ floor, ...player }));
}

function roomProps(overrides?: {
  characterId?: "algy" | "mitch";
  floor?: AlgyHouseFloor;
  onPrepareDoorSound?: () => void;
}) {
  return {
    characterId: overrides?.characterId,
    floor: overrides?.floor ?? ALGY_HOUSE_DEFAULT_FLOOR,
    muted: false,
    onToggleMute: vi.fn(),
    onLeave: vi.fn(),
    onChangeFloor: vi.fn(),
    onPrepareDoorSound: overrides?.onPrepareDoorSound ?? vi.fn(),
    doorTransitionPhase: "idle" as const,
  };
}

function renderRoom(overrides?: Parameters<typeof roomProps>[0]) {
  const props = roomProps(overrides);
  const view = render(<AlgysHouseInterior {...props} />);
  act(() => scheduledFrame?.(0));
  return { props, view };
}

let scheduledFrame: FrameRequestCallback | null = null;

describe("Algy's House visitor host", () => {
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
    Object.defineProperty(window, "cancelAnimationFrame", { configurable: true, value: vi.fn() });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("makes the upstairs host tile solid for Mitch while keeping the surrounding paths reachable", () => {
    expect(ALGY_HOUSE_HOST).toEqual({ x: 9, y: 3, dir: "s", frame: 0 });
    expect(isAlgyHouseWalkable("upstairs", ALGY_HOUSE_HOST.x, ALGY_HOUSE_HOST.y, "mitch")).toBe(false);
    expect(algyHouseStep("upstairs", { x: 9, y: 4 }, "n", "mitch")).toBeNull();
    expect(isAlgyHouseWalkable("upstairs", ALGY_HOUSE_HOST.x, ALGY_HOUSE_HOST.y, "algy")).toBe(true);

    const visited = new Set([`${ALGY_HOUSE_UPSTAIRS_SPAWN.x},${ALGY_HOUSE_UPSTAIRS_SPAWN.y}`]);
    const queue = [{ x: ALGY_HOUSE_UPSTAIRS_SPAWN.x, y: ALGY_HOUSE_UPSTAIRS_SPAWN.y }];
    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const { dx, dy } of CARDINALS) {
        const point = { x: current.x + dx, y: current.y + dy };
        const key = `${point.x},${point.y}`;
        if (!visited.has(key) && isAlgyHouseWalkable("upstairs", point.x, point.y, "mitch")) {
          visited.add(key);
          queue.push(point);
        }
      }
    }
    const walkable = algyHouseGridForFloor("upstairs").flatMap((row, y) =>
      [...row].flatMap((_cell, x) => isAlgyHouseWalkable("upstairs", x, y, "mitch") ? [`${x},${y}`] : []),
    );
    expect(visited.size).toBe(walkable.length);
  });

  it("requires an adjacent cardinal-facing player and never treats diagonal or distant positions as a greeting", () => {
    for (const [dir, player] of Object.entries({
      n: { x: 9, y: 4, dir: "n", frame: 0 },
      s: { x: 9, y: 2, dir: "s", frame: 0 },
      e: { x: 8, y: 3, dir: "e", frame: 0 },
      w: { x: 10, y: 3, dir: "w", frame: 0 },
    }) as [HouseDirection, HousePlayer][]) {
      expect(algyHouseHostFacing("upstairs", player, "mitch"), dir).toBe(true);
    }
    expect(algyHouseHostFacing("upstairs", { x: 8, y: 4, dir: "e", frame: 0 }, "mitch")).toBe(false);
    expect(algyHouseHostFacing("upstairs", { x: 9, y: 5, dir: "n", frame: 0 }, "mitch")).toBe(false);
    expect(algyHouseHostFacing("ground", { x: 9, y: 4, dir: "n", frame: 0 }, "mitch")).toBe(false);
  });

  it("shows the host only for Mitch and avoids a duplicate host when playing as Algy", () => {
    expect(algyHouseHasHost("ground", "mitch")).toBe(false);
    expect(algyHouseHasHost("ground", "algy")).toBe(false);
    expect(algyHouseHasHost("upstairs", "mitch")).toBe(true);
    expect(algyHouseHasHost("upstairs", "algy")).toBe(false);

    const algy = renderRoom({ characterId: "algy", floor: "upstairs" });
    expect(screen.getByTestId("algys-house-interior")).toHaveAttribute("data-character", "algy");
    expect(screen.getByTestId("algys-house-interior")).toHaveAttribute("data-host-present", "false");
    algy.view.unmount();
    renderRoom({ characterId: "mitch", floor: "upstairs" });
    expect(screen.getByTestId("algys-house-interior")).toHaveAttribute("data-character", "mitch");
    expect(screen.getByTestId("algys-house-interior")).toHaveAttribute("data-host-present", "true");
  });

  it("uses the exact greeting, blocks movement while open, and ignores repeat keys", () => {
    expect(ALGY_HOUSE_MITCH_GREETING).toBe("Money Mitch!! Great to see you bro!!");
    savePlayer("upstairs", { x: 9, y: 4, dir: "n", frame: 0 });
    const onPrepareDoorSound = vi.fn();
    renderRoom({ characterId: "mitch", floor: "upstairs", onPrepareDoorSound });

    expect(screen.getByLabelText("Interaction")).toHaveTextContent("GO / Enter: talk to Algy");

    fireEvent.keyDown(window, { key: "Enter" });
    expect(screen.getByRole("dialog")).toHaveTextContent(ALGY_HOUSE_MITCH_GREETING);
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    fireEvent.keyDown(window, { key: "ArrowLeft", repeat: true });
    expect(onPrepareDoorSound).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("dismisses with Escape, Enter, or OK and returns focus to Go, then can reopen", () => {
    savePlayer("upstairs", { x: 9, y: 4, dir: "n", frame: 0 });
    renderRoom({ characterId: "mitch", floor: "upstairs" });
    const interact = screen.getByRole("button", { name: "Go" });

    fireEvent.click(interact);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(interact);

    fireEvent.click(interact);
    fireEvent.keyDown(window, { key: "Enter" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(interact);
    fireEvent.click(screen.getByRole("button", { name: "Close conversation" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(interact);

    fireEvent.click(interact);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not place the host downstairs and safely falls back from an upstairs host overlap", () => {
    savePlayer("upstairs", { ...ALGY_HOUSE_HOST, dir: "n", frame: 0 });
    const upstairs = renderRoom({ characterId: "mitch", floor: "upstairs" });
    expect(screen.getByTestId("algys-house-interior")).toHaveAttribute("data-host-present", "true");
    expect(screen.queryByText(ALGY_HOUSE_MITCH_GREETING)).not.toBeInTheDocument();
    upstairs.view.unmount();

    const ground = renderRoom({ characterId: "mitch", floor: "ground" });
    expect(screen.getByTestId("algys-house-interior")).toHaveAttribute("data-host-present", "false");
    expect(screen.queryByText(ALGY_HOUSE_MITCH_GREETING)).not.toBeInTheDocument();
    ground.view.unmount();
  });
});
