import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AlgysHouseInterior from "./AlgysHouseInterior";
import { ALGY_HOUSE_PLAYER_KEY, type AlgyHouseFloor, type HousePlayer } from "./algyHouseScene";

let scheduledFrame: FrameRequestCallback | null = null;

function installAudio() {
  const audio = document.createElement("audio");
  const play = vi.fn(() => Promise.resolve());
  const pause = vi.fn();
  Object.defineProperty(audio, "play", { configurable: true, value: play });
  Object.defineProperty(audio, "pause", { configurable: true, value: pause });
  vi.stubGlobal("Audio", vi.fn(() => audio));
  return { audio, play, pause };
}

function savePlayer(floor: AlgyHouseFloor, player: HousePlayer) {
  window.sessionStorage.setItem(ALGY_HOUSE_PLAYER_KEY, JSON.stringify({ floor, ...player }));
}

function roomProps(overrides?: {
  floor?: AlgyHouseFloor;
  muted?: boolean;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  onLeave?: () => void;
  doorTransitionPhase?: "idle" | "out" | "hold" | "in";
}) {
  return {
    floor: overrides?.floor ?? "upstairs",
    muted: overrides?.muted ?? false,
    volume: overrides?.volume ?? 0.55,
    onVolumeChange: overrides?.onVolumeChange,
    onToggleMute: vi.fn(),
    onLeave: overrides?.onLeave ?? vi.fn(),
    onChangeFloor: vi.fn(),
    onPrepareDoorSound: vi.fn(),
    doorTransitionPhase: overrides?.doorTransitionPhase ?? "idle",
  };
}

function renderRoom(overrides?: Parameters<typeof roomProps>[0]) {
  const props = roomProps(overrides);
  return { props, view: render(<AlgysHouseInterior {...props} />) };
}

async function settle() {
  await act(async () => {
    await Promise.resolve();
  });
}

function completeCurrentMove() {
  const callback = scheduledFrame;
  expect(callback).not.toBeNull();
  act(() => callback?.(200));
}

function moveAndComplete(key: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight") {
  fireEvent.keyDown(window, { key });
  fireEvent.keyUp(window, { key });
  completeCurrentMove();
}

describe("Algy's House stereo controls", () => {
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
    vi.unstubAllGlobals();
  });

  it("requires facing the adjacent stereo before Enter can play it", async () => {
    savePlayer("upstairs", { x: 7, y: 1, dir: "n", frame: 0 });
    const { play } = installAudio();
    renderRoom();

    fireEvent.keyDown(window, { key: "Enter" });
    expect(play).not.toHaveBeenCalled();

    fireEvent.keyDown(window, { key: "ArrowRight" });
    fireEvent.keyUp(window, { key: "ArrowRight" });
    expect(play).not.toHaveBeenCalled();

    fireEvent.keyDown(window, { key: "Enter" });
    await settle();
    expect(play).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status")).toHaveTextContent("Repo / Young Algy");
  });

  it("turning into the solid stereo cabinet does not move or play until interaction", async () => {
    savePlayer("upstairs", { x: 7, y: 1, dir: "n", frame: 0 });
    const { play } = installAudio();
    renderRoom();

    fireEvent.keyDown(window, { key: "ArrowRight" });
    fireEvent.keyUp(window, { key: "ArrowRight" });
    completeCurrentMove();

    expect(play).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Interact" }));
    await settle();
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("plays from the on-screen A button when the stereo is facing", async () => {
    savePlayer("upstairs", { x: 7, y: 1, dir: "e", frame: 0 });
    const { play } = installAudio();
    renderRoom();

    fireEvent.click(screen.getByRole("button", { name: "Interact" }));
    await settle();

    expect(play).toHaveBeenCalledTimes(1);
  });

  it("ignores held Enter repeats so one press cannot rapidly toggle playback", async () => {
    savePlayer("upstairs", { x: 7, y: 1, dir: "e", frame: 0 });
    const { play } = installAudio();
    renderRoom();

    fireEvent.keyDown(window, { key: "Enter" });
    fireEvent.keyDown(window, { key: "Enter", repeat: true });
    fireEvent.keyDown(window, { key: "Enter", repeat: true });
    await settle();

    expect(play).toHaveBeenCalledTimes(1);
  });

  it("blocks stereo interaction while a door transition is active", () => {
    savePlayer("upstairs", { x: 7, y: 1, dir: "e", frame: 0 });
    const { play } = installAudio();
    renderRoom({ doorTransitionPhase: "out" });

    fireEvent.click(screen.getByRole("button", { name: "Interact" }));
    fireEvent.keyDown(window, { key: "Enter" });

    expect(play).not.toHaveBeenCalled();
  });

  it("keeps slider arrow keys inside the volume control instead of moving the avatar", async () => {
    savePlayer("upstairs", { x: 7, y: 1, dir: "e", frame: 0 });
    const { play } = installAudio();
    const onVolumeChange = vi.fn();
    renderRoom({ onVolumeChange });
    const slider = screen.getByRole("slider", { name: "Music volume" });

    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(onVolumeChange).not.toHaveBeenCalled();

    fireEvent.keyDown(window, { key: "Enter" });
    await settle();
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("keeps active stereo playback through a floor change", async () => {
    savePlayer("upstairs", { x: 7, y: 1, dir: "e", frame: 0 });
    const { play, pause } = installAudio();
    const { props, view } = renderRoom();

    fireEvent.keyDown(window, { key: "Enter" });
    await settle();
    view.rerender(<AlgysHouseInterior {...props} floor="ground" />);

    expect(play).toHaveBeenCalledTimes(1);
    expect(pause).not.toHaveBeenCalled();
    expect(screen.getByTestId("algys-house-interior")).toHaveAttribute("data-stereo-status", "playing");
  });

  it("stops playback when leaving the house", async () => {
    savePlayer("upstairs", { x: 7, y: 1, dir: "e", frame: 0 });
    const { pause } = installAudio();
    const onLeave = vi.fn();
    const { props, view } = renderRoom({ onLeave });

    fireEvent.keyDown(window, { key: "Enter" });
    await settle();
    view.rerender(<AlgysHouseInterior {...props} floor="ground" />);

    for (let index = 0; index < 6; index += 1) moveAndComplete("ArrowDown");
    moveAndComplete("ArrowLeft");
    moveAndComplete("ArrowLeft");
    moveAndComplete("ArrowDown");

    expect(onLeave).toHaveBeenCalledTimes(1);
    expect(pause).toHaveBeenCalledTimes(1);
  });

  it("stops playback on unmount", async () => {
    savePlayer("upstairs", { x: 7, y: 1, dir: "e", frame: 0 });
    const { pause } = installAudio();
    const { view } = renderRoom();

    fireEvent.keyDown(window, { key: "Enter" });
    await settle();
    view.unmount();

    expect(pause).toHaveBeenCalledTimes(1);
  });
});
