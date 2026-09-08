import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AlgysHouseInterior from "./AlgysHouseInterior";

const houseArtMock = vi.hoisted(() => ({
  images: { atlas: null, avatar: null, hostAvatar: null, groundStairArt: null, upstairsStairArt: null },
  retry: vi.fn(),
}));

vi.mock("./useHouseArt", () => ({
  useHouseArt: () => ({ status: "ready", images: houseArtMock.images, retry: houseArtMock.retry }),
}));

import {
  ALGY_HOUSE_PLAYER_KEY,
  algyHouseComputerFacing,
  type AlgyHouseFloor,
  type HousePlayer,
} from "./algyHouseScene";

const COMPUTER_LINE = "Codex is thinking...";

let scheduledFrame: FrameRequestCallback | null = null;

function savePlayer(floor: AlgyHouseFloor, player: HousePlayer): void {
  window.sessionStorage.setItem(ALGY_HOUSE_PLAYER_KEY, JSON.stringify({ floor, ...player }));
}

async function renderRoom(characterId: "algy" | "mitch" = "algy", floor: AlgyHouseFloor = "upstairs") {
  const props = {
    characterId,
    floor,
    muted: false,
    onToggleMute: vi.fn(),
    onLeave: vi.fn(),
    onChangeFloor: vi.fn(),
    onPrepareDoorSound: vi.fn(),
    doorTransitionPhase: "idle" as const,
  };
  const view = render(<AlgysHouseInterior {...props} />);
  await act(async () => { scheduledFrame?.(0); });
  return { props, view };
}

function expectComputerDialogue(): void {
  const dialogue = screen.getByRole("dialog");
  expect(dialogue).toHaveTextContent("COMPUTER");
  expect(dialogue).toHaveTextContent(COMPUTER_LINE);
}

describe("Algy's House computer interaction", () => {
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

  it.each([
    ["algy", "Enter"],
    ["algy", "Go"],
    ["mitch", "Enter"],
    ["mitch", "Go"],
  ] as const)("opens the exact computer dialogue for %s through %s only after interaction", async (characterId, activation) => {
    savePlayer("upstairs", { x: 10, y: 2, dir: "n", frame: 0 });
    await renderRoom(characterId);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    if (activation === "Enter") fireEvent.keyDown(window, { key: "Enter" });
    else fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expectComputerDialogue();
  });

  it("keeps the computer dialogue open on repeated Enter, pauses movement, and leaves audio alone", async () => {
    savePlayer("upstairs", { x: 10, y: 2, dir: "n", frame: 0 });
    const play = vi.spyOn(window.HTMLMediaElement.prototype, "play").mockResolvedValue();
    const { props } = await renderRoom("algy");
    const automaticPlayCalls = play.mock.calls.length;

    fireEvent.keyDown(window, { key: "Enter" });
    expectComputerDialogue();
    fireEvent.keyDown(window, { key: "Enter", repeat: true });
    fireEvent.keyDown(window, { key: "ArrowDown" });
    fireEvent.keyDown(window, { key: "ArrowDown", repeat: true });
    act(() => scheduledFrame?.(300));

    expectComputerDialogue();
    expect(JSON.parse(window.sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY) ?? "null")).toMatchObject({
      floor: "upstairs", x: 10, y: 2,
    });
    expect(play).toHaveBeenCalledTimes(automaticPlayCalls);
    expect(props.onToggleMute).not.toHaveBeenCalled();
    expect(props.onPrepareDoorSound).not.toHaveBeenCalled();
  });

  it("closes with Escape or OK, restores Go focus, and can reopen", async () => {
    savePlayer("upstairs", { x: 10, y: 2, dir: "n", frame: 0 });
    await renderRoom("mitch");
    const go = screen.getByRole("button", { name: "Go" });

    fireEvent.click(go);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(go);

    fireEvent.click(go);
    fireEvent.click(screen.getByRole("button", { name: "Close conversation" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(go);

    fireEvent.click(go);
    expectComputerDialogue();
  });

  it("requires the upstairs computer tile and north-facing player", async () => {
    const valid: HousePlayer = { x: 10, y: 2, dir: "n", frame: 0 };
    expect(algyHouseComputerFacing("upstairs", valid)).toBe(true);
    for (const [floor, player] of [
      ["ground", valid],
      ["upstairs", { x: 10, y: 2, dir: "s", frame: 0 }],
      ["upstairs", { x: 10, y: 3, dir: "n", frame: 0 }],
      ["upstairs", { x: 9, y: 2, dir: "e", frame: 0 }],
    ] as const) {
      expect(algyHouseComputerFacing(floor, player)).toBe(false);
    }

    savePlayer("upstairs", { x: 10, y: 3, dir: "n", frame: 0 });
    await renderRoom("algy");
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
