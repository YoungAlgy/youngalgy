import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AlgysHouseInterior from "./AlgysHouseInterior";
import { ALGY_HOUSE_PLAYER_KEY, type AlgyHouseFloor, type HousePlayer } from "./algyHouseScene";

const houseArtMock = vi.hoisted(() => ({ images: { atlas: null, avatar: null, hostAvatar: null, groundStairArt: null, upstairsStairArt: null }, retry: vi.fn() }));
vi.mock("./useHouseArt", () => ({ useHouseArt: () => ({ status: "ready", images: houseArtMock.images, retry: houseArtMock.retry }) }));

let scheduledFrame: FrameRequestCallback | null = null;
function installAudio(implementation: () => Promise<void> = () => Promise.resolve()) {
  const audio = document.createElement("audio");
  const play = vi.fn(implementation);
  const pause = vi.fn();
  Object.defineProperty(audio, "play", { configurable: true, value: play });
  Object.defineProperty(audio, "pause", { configurable: true, value: pause });
  const AudioMock = vi.fn(() => audio);
  vi.stubGlobal("Audio", AudioMock);
  return { audio, play, pause, AudioMock };
}
function savePlayer(floor: AlgyHouseFloor, player: HousePlayer) {
  sessionStorage.setItem(ALGY_HOUSE_PLAYER_KEY, JSON.stringify({ floor, ...player }));
}
function roomProps(overrides: Partial<React.ComponentProps<typeof AlgysHouseInterior>> = {}) {
  return { floor: "upstairs" as AlgyHouseFloor, muted: false, volume: 0.55, onVolumeChange: vi.fn(), onToggleMute: vi.fn(), onLeave: vi.fn(), onChangeFloor: vi.fn(), onPrepareDoorSound: vi.fn(), doorTransitionPhase: "idle" as const, ...overrides };
}
function renderRoom(overrides: Partial<React.ComponentProps<typeof AlgysHouseInterior>> = {}) {
  const props = roomProps(overrides);
  const view = render(<AlgysHouseInterior {...props} />);
  act(() => scheduledFrame?.(0));
  return { props, view };
}
async function settle() { await act(async () => { await Promise.resolve(); }); }
function completeMove() { const callback = scheduledFrame; expect(callback).not.toBeNull(); act(() => callback?.(200)); }

describe("Algy's House background music", () => {
  beforeEach(() => {
    sessionStorage.clear(); scheduledFrame = null;
    vi.spyOn(performance, "now").mockReturnValue(0);
    Object.defineProperty(window, "requestAnimationFrame", { configurable: true, value: vi.fn((callback: FrameRequestCallback) => { scheduledFrame = callback; return 1; }) });
    Object.defineProperty(window, "cancelAnimationFrame", { configurable: true, value: vi.fn() });
  });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it.each<AlgyHouseFloor>(["ground", "upstairs"])("auto-starts after the first painted %s frame and loops", async (floor) => {
    const { audio, play, AudioMock } = installAudio();
    const view = render(<AlgysHouseInterior {...roomProps({ floor })} />);
    expect(AudioMock).not.toHaveBeenCalled();
    act(() => scheduledFrame?.(0)); await settle();
    expect(play).toHaveBeenCalledTimes(1); expect(audio.loop).toBe(true);
    expect(screen.getByRole("button", { name: "Mute" })).toBeInTheDocument();
    view.unmount();
  });

  it("honors saved mute and zero volume during automatic playback", async () => {
    const { audio, play } = installAudio(); const onToggleMute = vi.fn(); const onVolumeChange = vi.fn();
    renderRoom({ floor: "ground", muted: true, volume: 0, onToggleMute, onVolumeChange }); await settle();
    expect(play).toHaveBeenCalledTimes(1); expect(audio.muted).toBe(true); expect(audio.volume).toBe(0);
    expect(onToggleMute).not.toHaveBeenCalled(); expect(onVolumeChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Unmute" })).toBeInTheDocument();
  });

  it("shows Play music after autoplay is blocked and retries on the first trusted key", async () => {
    let keyRetry: ((event: KeyboardEvent) => void) | undefined;
    const nativeAdd = window.addEventListener.bind(window);
    vi.spyOn(window, "addEventListener").mockImplementation(((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
      if (type === "keydown") keyRetry = listener as (event: KeyboardEvent) => void;
      nativeAdd(type, listener, options);
    }) as typeof window.addEventListener);
    let attempt = 0;
    const { play } = installAudio(() => ++attempt === 1 ? Promise.reject(new DOMException("blocked", "NotAllowedError")) : Promise.resolve());
    renderRoom({ floor: "ground" }); await settle();
    expect(screen.getByRole("button", { name: "Play music" })).toBeInTheDocument();
    act(() => keyRetry?.({ type: "keydown", isTrusted: true, key: "x", ctrlKey: false, altKey: false, metaKey: false } as KeyboardEvent)); await settle();
    expect(play).toHaveBeenCalledTimes(2); expect(screen.getByRole("button", { name: "Mute" })).toBeInTheDocument();
  });

  it("keeps music playing across floor changes", async () => {
    const { play, pause } = installAudio(); const { props, view } = renderRoom(); await settle();
    view.rerender(<AlgysHouseInterior {...props} floor="ground" />); await settle();
    expect(play).toHaveBeenCalledTimes(1); expect(pause).not.toHaveBeenCalled();
    expect(screen.getByTestId("algys-house-interior")).toHaveAttribute("data-stereo-status", "playing");
  });

  it("only shows the volume popup while facing the upstairs speaker", async () => {
    installAudio(); savePlayer("upstairs", { x: 8, y: 2, dir: "n", frame: 0 }); renderRoom(); await settle();
    expect(screen.queryByLabelText("Stereo")).not.toBeInTheDocument();
    fireEvent.keyDown(window, { key: "ArrowRight" }); fireEvent.keyUp(window, { key: "ArrowRight" }); completeMove();
    const popup = screen.getByLabelText("Stereo");
    expect(popup).toContainElement(screen.getByRole("slider", { name: "Music volume" }));
    expect(popup).not.toHaveTextContent(/Original Mix|play|stop|Vol/i);
    fireEvent.keyDown(window, { key: "ArrowDown" }); fireEvent.keyUp(window, { key: "ArrowDown" }); completeMove();
    expect(screen.queryByLabelText("Stereo")).not.toBeInTheDocument();
  });

  it("speaker interaction focuses volume and never stops the music", async () => {
    const { play, pause } = installAudio(); savePlayer("upstairs", { x: 8, y: 2, dir: "e", frame: 0 }); renderRoom(); await settle();
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(screen.getByRole("slider", { name: "Music volume" })).toHaveFocus();
    expect(play).toHaveBeenCalledTimes(1); expect(pause).not.toHaveBeenCalled();
  });

  it("shows zero while muted and moving above zero unmutes", async () => {
    installAudio(); savePlayer("upstairs", { x: 8, y: 2, dir: "e", frame: 0 });
    const onToggleMute = vi.fn(); const onVolumeChange = vi.fn();
    renderRoom({ muted: true, volume: 0.4, onToggleMute, onVolumeChange }); await settle();
    const slider = screen.getByRole("slider", { name: "Music volume" }); expect(slider).toHaveValue("0");
    fireEvent.change(slider, { target: { value: "30" } });
    expect(onVolumeChange).toHaveBeenCalledWith(0.3); expect(onToggleMute).toHaveBeenCalledTimes(1);
  });

  it("stops music when the room unmounts", async () => {
    const { pause } = installAudio(); const { view } = renderRoom({ floor: "ground" }); await settle(); view.unmount(); expect(pause).toHaveBeenCalled();
  });
});
