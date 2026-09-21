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
import { algyHouseGroundView } from "./algyHouseLayout";

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
    onChangeCharacter: vi.fn(),
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
    vi.spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0, y: 0, left: 0, top: 0, right: 1280, bottom: 800, width: 1280, height: 800, toJSON: () => ({}),
    });
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
    ["algy", "Use"],
    ["mitch", "Enter"],
    ["mitch", "Use"],
  ] as const)("opens the exact computer dialogue for %s through %s only after interaction", async (characterId, activation) => {
    savePlayer("upstairs", { x: 10, y: 2, dir: "n", frame: 0 });
    await renderRoom(characterId);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    if (activation === "Enter") fireEvent.keyDown(window, { key: "Enter" });
    else fireEvent.click(screen.getByRole("button", { name: "Use" }));
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

  it("keeps GO as sprint at the computer and restores Use focus after dialogue", async () => {
    savePlayer("upstairs", { x: 10, y: 2, dir: "n", frame: 0 });
    await renderRoom("mitch");
    const go = screen.getByRole("button", { name: "Go" });
    const use = screen.getByRole("button", { name: "Use" });

    fireEvent.click(go, { detail: 0 });
    expect(go).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(use);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(use);

    fireEvent.click(use);
    fireEvent.click(screen.getByRole("button", { name: "Close conversation" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(use);

    fireEvent.click(use);
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
    fireEvent.click(screen.getByRole("button", { name: "Use" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it.each(["algy", "mitch"] as const)("walks %s to the computer before opening its prompt", async (characterId) => {
    savePlayer("upstairs", { x: 1, y: 2, dir: "w", frame: 0 });
    const { props } = await renderRoom(characterId);
    fireEvent.click(screen.getByRole("button", { name: "Walk to computer" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(JSON.parse(sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY)!)).toMatchObject({ x: 1, y: 2 });
    for (let step = 0; step < 40 && !screen.queryByRole("dialog"); step++) {
      act(() => scheduledFrame?.(200));
    }
    expect(JSON.parse(sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY)!)).toMatchObject({ floor: "upstairs", x: 10, y: 2, dir: "n" });
    expectComputerDialogue();
    expect(props.onChangeFloor).not.toHaveBeenCalled();
    expect(props.onLeave).not.toHaveBeenCalled();
    expect(props.onToggleMute).not.toHaveBeenCalled();
  });

  it("turns toward the computer immediately when already at its approach", async () => {
    savePlayer("upstairs", { x: 10, y: 2, dir: "s", frame: 0 });
    const { props } = await renderRoom();
    fireEvent.click(screen.getByRole("button", { name: "Walk to computer" }));
    expectComputerDialogue();
    expect(props.onPrepareDoorSound).not.toHaveBeenCalled();
    expect(JSON.parse(sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY)!)).toMatchObject({ x: 10, y: 2, dir: "n" });
  });

  it("finishes an in-flight step and replaces repeated computer clicks without skipping tiles", async () => {
    savePlayer("upstairs", { x: 8, y: 4, dir: "e", frame: 0 });
    const { props } = await renderRoom("mitch");
    fireEvent.keyDown(window, { key: "ArrowRight" });
    fireEvent.click(screen.getByRole("button", { name: "Walk to computer" }));
    fireEvent.click(screen.getByRole("button", { name: "Walk to computer" }));
    expect(JSON.parse(sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY)!)).toMatchObject({ x: 8, y: 4 });
    act(() => scheduledFrame?.(200));
    expect(JSON.parse(sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY)!)).toMatchObject({ x: 9, y: 4 });
    for (let step = 0; step < 15 && !screen.queryByRole("dialog"); step++) act(() => scheduledFrame?.(200));
    expectComputerDialogue();
    fireEvent.click(screen.getByRole("button", { name: "Close conversation" }));
    const stepCount = props.onPrepareDoorSound.mock.calls.length;
    fireEvent.keyDown(window, { key: "ArrowRight", repeat: true });
    act(() => scheduledFrame?.(400));
    expect(props.onPrepareDoorSound).toHaveBeenCalledTimes(stepCount);
  });

  it.each(["keyboard", "touch", "assistive", "blur", "pagehide", "info", "character", "use"])("cancels the computer walk on %s", async (cancel) => {
    savePlayer("upstairs", { x: 7, y: 7, dir: "n", frame: 0 });
    await renderRoom();
    fireEvent.click(screen.getByRole("button", { name: "Walk to computer" }));
    if (cancel === "keyboard") {
      fireEvent.keyDown(window, { key: "ArrowRight" });
      fireEvent.keyUp(window, { key: "ArrowRight" });
    } else if (cancel === "touch") {
      const button = screen.getByRole("button", { name: "Move right" });
      fireEvent.pointerDown(button, { pointerType: "touch", pointerId: 1 });
      fireEvent.pointerUp(button, { pointerType: "touch", pointerId: 1 });
    } else if (cancel === "assistive") fireEvent.click(screen.getByRole("button", { name: "Move right" }), { detail: 0 });
    else if (cancel === "info") fireEvent.click(screen.getByRole("button", { name: "Open info" }));
    else if (cancel === "character") fireEvent.click(screen.getByRole("button", { name: "Change character" }));
    else if (cancel === "use") fireEvent.click(screen.getByRole("button", { name: "Use" }));
    else fireEvent(window, new Event(cancel));
    for (let step = 0; step < 30; step++) act(() => scheduledFrame?.(200));
    expect(screen.queryByText(COMPUTER_LINE)).not.toBeInTheDocument();
    expect(JSON.parse(sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY)!)).not.toMatchObject({ x: 10, y: 2 });
  });

  it.each(["ground", "transition", "character"])("cancels the pending computer route on a %s change", async (change) => {
    savePlayer("upstairs", { x: 7, y: 7, dir: "n", frame: 0 });
    const { props, view } = await renderRoom();
    fireEvent.click(screen.getByRole("button", { name: "Walk to computer" }));
    view.rerender(<AlgysHouseInterior {...props}
      floor={change === "ground" ? "ground" : "upstairs"}
      characterId={change === "character" ? "mitch" : "algy"}
      doorTransitionPhase={change === "transition" ? "out" : "idle"} />);
    for (let step = 0; step < 30; step++) act(() => scheduledFrame?.(200));
    expect(screen.queryByText(COMPUTER_LINE)).not.toBeInTheDocument();
    expect(JSON.parse(sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY)!)).toMatchObject(
      change === "ground" ? { floor: "ground", x: 5, y: 1 } : { floor: "upstairs", x: 7, y: 7 },
    );
  });

  it.each([[390, 844], [1280, 800], [844, 390]])("keeps the computer tap target on its rendered art at %s by %s", async (width, height) => {
    vi.mocked(HTMLCanvasElement.prototype.getBoundingClientRect).mockReturnValue({
      x: 0, y: 0, left: 0, top: 0, right: width, bottom: height, width, height, toJSON: () => ({}),
    });
    savePlayer("upstairs", { x: 10, y: 3, dir: "s", frame: 0 });
    await renderRoom();
    const target = screen.getByRole("button", { name: "Walk to computer" });
    const camera = algyHouseGroundView(width, height);
    expect(parseFloat(target.style.left)).toBeCloseTo(camera.centerX + (480 - camera.cameraX) * camera.zoom);
    expect(parseFloat(target.style.top)).toBeCloseTo(camera.centerY + (80 - camera.cameraY) * camera.zoom);
    expect(parseFloat(target.style.width)).toBeCloseTo(96 * camera.zoom);
    expect(parseFloat(target.style.height)).toBeCloseTo(64 * camera.zoom);
    fireEvent.pointerDown(target, { pointerType: "touch", pointerId: 2 });
    fireEvent.pointerUp(target, { pointerType: "touch", pointerId: 2 });
    fireEvent.click(target);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    act(() => scheduledFrame?.(200));
    expectComputerDialogue();
  });

  it("does not expose a computer target downstairs", async () => {
    await renderRoom("algy", "ground");
    expect(screen.queryByRole("button", { name: "Walk to computer" })).not.toBeInTheDocument();
  });

  it("moves the tap target with the computer after resizing the mounted room", async () => {
    await renderRoom();
    const target = screen.getByRole("button", { name: "Walk to computer" });
    const previousLeft = target.style.left;
    vi.mocked(HTMLCanvasElement.prototype.getBoundingClientRect).mockReturnValue({
      x: 0, y: 0, left: 0, top: 0, right: 390, bottom: 844, width: 390, height: 844, toJSON: () => ({}),
    });
    act(() => scheduledFrame?.(200));
    const camera = algyHouseGroundView(390, 844);
    expect(target.style.left).not.toBe(previousLeft);
    expect(parseFloat(target.style.left)).toBeCloseTo(camera.centerX + (480 - camera.cameraX) * camera.zoom);
    expect(parseFloat(target.style.top)).toBeCloseTo(camera.centerY + (80 - camera.cameraY) * camera.zoom);
  });

  it("takes over a held touch direction without resuming it after the computer dialogue", async () => {
    savePlayer("upstairs", { x: 8, y: 4, dir: "e", frame: 0 });
    const { props } = await renderRoom("mitch");
    const right = screen.getByRole("button", { name: "Move right" });
    fireEvent.pointerDown(right, { pointerType: "touch", pointerId: 1 });
    fireEvent.click(screen.getByRole("button", { name: "Walk to computer" }));
    for (let step = 0; step < 20 && !screen.queryByRole("dialog"); step++) act(() => scheduledFrame?.(200));
    expectComputerDialogue();
    fireEvent.click(screen.getByRole("button", { name: "Close conversation" }));
    act(() => scheduledFrame?.(500));
    const stepCount = props.onPrepareDoorSound.mock.calls.length;
    fireEvent.pointerDown(right, { pointerType: "touch", pointerId: 1 });
    expect(props.onPrepareDoorSound).toHaveBeenCalledTimes(stepCount);
    fireEvent.pointerUp(right, { pointerType: "touch", pointerId: 1 });
    // The right tile is solid at the computer. Step down after releasing.
    const down = screen.getByRole("button", { name: "Move down" });
    fireEvent.pointerDown(down, { pointerType: "touch", pointerId: 2 });
    fireEvent.pointerUp(down, { pointerType: "touch", pointerId: 2 });
    act(() => scheduledFrame?.(200));
    expect(JSON.parse(sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY)!)).toMatchObject({ x: 10, y: 3 });
  });
});
