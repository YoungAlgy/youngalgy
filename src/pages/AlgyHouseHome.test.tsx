import { act, fireEvent, render, screen } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ALGY_HOUSE_FLOOR_KEY,
  ALGY_HOUSE_PLAYER_KEY,
  ALGY_HOUSE_SCENE_KEY,
  type AlgyHouseFloor,
} from "@/components/hub/algyHouseScene";
import { HOUSE_DOOR_FADE_MS, HOUSE_DOOR_HOLD_MS } from "@/components/hub/algyHouseDoor";

const interior = vi.hoisted(() => ({ props: null as null | {
  floor: AlgyHouseFloor;
  muted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onLeave: () => void;
  onChangeFloor: (floor: AlgyHouseFloor) => void;
  onChangeCharacter: (characterId: "algy" | "mitch") => void;
  doorTransitionPhase: string;
  persistTownScene: boolean;
  characterId: "algy" | "mitch";
  characterChangePending: boolean;
  characterChangeStatus: string | null;
} }));

vi.mock("@/components/hub/AlgysHouseInterior", () => ({
  default: (props: NonNullable<typeof interior.props>) => {
    interior.props = props;
    let playerAtMount = "";
    try { playerAtMount = window.sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY) ?? ""; }
    catch { /* The app supports unavailable storage. */ }
    return (
      <section
        data-testid="mock-house-interior"
        data-floor={props.floor}
        data-muted={String(props.muted)}
        data-volume={String(props.volume)}
        data-phase={props.doorTransitionPhase}
        data-character={props.characterId}
        data-player-at-mount={playerAtMount}
      >
        {props.characterChangeStatus && <div role="status">{props.characterChangeStatus}</div>}
        <button type="button" onClick={props.onToggleMute}>Toggle mute</button>
        <button type="button" onClick={() => props.onVolumeChange(-1)}>Volume low</button>
        <button type="button" onClick={() => props.onVolumeChange(2)}>Volume high</button>
        <button type="button" onClick={() => props.onChangeFloor("upstairs")}>Upstairs</button>
        <button type="button" onClick={() => props.onChangeFloor("ground")}>Ground</button>
        <button type="button" onClick={() => props.onChangeCharacter(props.characterId === "algy" ? "mitch" : "algy")}>Change character</button>
        <button type="button" onClick={props.onLeave}>Leave</button>
      </section>
    );
  },
}));

vi.mock("@/components/hub/houseTransitionSound", () => ({
  prepareHouseTransitionSound: vi.fn(),
  playHouseTransitionSound: vi.fn(),
}));

import AlgyHouseHome from "./AlgyHouseHome";

const SETTINGS_KEY = "youngalgy:house-audio";

function currentInterior() {
  return screen.getByTestId("mock-house-interior");
}

describe("AlgyHouseHome", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    class LoadedImage {
      complete = true;
      naturalWidth = 16;
      onload: null | (() => void) = null;
      onerror: null | (() => void) = null;
      set src(_value: string) { this.onload?.(); }
    }
    vi.stubGlobal("Image", LoadedImage);
    window.sessionStorage.clear();
    window.localStorage.clear();
    interior.props = null;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("starts a fresh visit on the ground floor without creating ambient audio", () => {
    const AudioMock = vi.fn();
    vi.stubGlobal("Audio", AudioMock);

    render(<AlgyHouseHome />);

    expect(currentInterior()).toHaveAttribute("data-floor", "ground");
    expect(currentInterior()).toHaveAttribute("data-muted", "false");
    expect(currentInterior()).toHaveAttribute("data-volume", "0.55");
    expect(AudioMock).not.toHaveBeenCalled();
    expect(interior.props?.persistTownScene).toBe(false);
    expect(currentInterior()).toHaveAttribute("data-character", "algy");
  });

  it("restores an upstairs visit from session storage", () => {
    window.sessionStorage.setItem(ALGY_HOUSE_FLOOR_KEY, "upstairs");

    render(<AlgyHouseHome />);

    expect(currentInterior()).toHaveAttribute("data-floor", "upstairs");
  });

  it("starts a clean Mitch visit from town, then keeps that visitor on reload", () => {
    window.sessionStorage.setItem(ALGY_HOUSE_FLOOR_KEY, "upstairs");
    window.sessionStorage.setItem(ALGY_HOUSE_PLAYER_KEY, "old-player");
    window.history.replaceState(null, "", "/?character=mitch&return=algy-porch");

    render(<AlgyHouseHome />);

    expect(currentInterior()).toHaveAttribute("data-floor", "ground");
    expect(currentInterior()).toHaveAttribute("data-character", "mitch");
    expect(currentInterior()).toHaveAttribute("data-player-at-mount", "");
    expect(window.sessionStorage.getItem(ALGY_HOUSE_FLOOR_KEY)).toBeNull();
    expect(window.sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY)).toBeNull();
    expect(window.location.search).toBe("?character=mitch");
  });

  it("uses safe defaults for malformed saved values", () => {
    window.sessionStorage.setItem(ALGY_HOUSE_FLOOR_KEY, "not-a-floor");
    window.localStorage.setItem(SETTINGS_KEY, "not-json");

    render(<AlgyHouseHome />);

    expect(currentInterior()).toHaveAttribute("data-floor", "ground");
    expect(currentInterior()).toHaveAttribute("data-muted", "false");
    expect(currentInterior()).toHaveAttribute("data-volume", "0.55");
  });

  it("uses safe defaults when browser storage is unavailable", () => {
    vi.spyOn(window, "sessionStorage", "get").mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new Error("storage unavailable");
    });

    render(<AlgyHouseHome />);

    expect(currentInterior()).toHaveAttribute("data-floor", "ground");
    expect(currentInterior()).toHaveAttribute("data-muted", "false");
    expect(currentInterior()).toHaveAttribute("data-volume", "0.55");
  });

  it("leaves playback to the interior and starts unmuted even with an old saved mute", () => {
    const AudioMock = vi.fn();
    vi.stubGlobal("Audio", AudioMock);
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ muted: true, volume: 0.4 }));

    render(<AlgyHouseHome />);
    expect(currentInterior()).toHaveAttribute("data-muted", "false");
    expect(currentInterior()).toHaveAttribute("data-volume", "0.4");
    fireEvent.click(screen.getByRole("button", { name: "Toggle mute" }));
    expect(currentInterior()).toHaveAttribute("data-muted", "true");
    expect(AudioMock).not.toHaveBeenCalled();
  });

  it("restores clamped settings and persists valid updates", () => {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ muted: true, volume: 4 }));

    render(<AlgyHouseHome />);
    expect(currentInterior()).toHaveAttribute("data-muted", "false");
    expect(currentInterior()).toHaveAttribute("data-volume", "1");

    fireEvent.click(screen.getByRole("button", { name: "Volume low" }));
    expect(currentInterior()).toHaveAttribute("data-volume", "0");
    expect(JSON.parse(window.localStorage.getItem(SETTINGS_KEY) ?? "null")).toEqual({ volume: 0 });

    fireEvent.click(screen.getByRole("button", { name: "Toggle mute" }));
    fireEvent.click(screen.getByRole("button", { name: "Volume high" }));
    expect(currentInterior()).toHaveAttribute("data-muted", "true");
    expect(currentInterior()).toHaveAttribute("data-volume", "1");
    expect(JSON.parse(window.localStorage.getItem(SETTINGS_KEY) ?? "null")).toEqual({ volume: 1 });
  });

  it.each([0, -1, null, "0"])("restores audible startup volume from a silent or invalid saved value: %s", (volume) => {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ muted: true, volume }));
    render(<AlgyHouseHome />);
    expect(currentInterior()).toHaveAttribute("data-muted", "false");
    expect(currentInterior()).toHaveAttribute("data-volume", "0.55");
  });

  it("keeps a manual mute between floors but starts unmuted on the next visit", () => {
    const house = render(<AlgyHouseHome />);
    fireEvent.click(screen.getByRole("button", { name: "Toggle mute" }));
    fireEvent.click(screen.getByRole("button", { name: "Upstairs" }));
    act(() => vi.advanceTimersByTime(HOUSE_DOOR_FADE_MS * 2 + HOUSE_DOOR_HOLD_MS));
    expect(currentInterior()).toHaveAttribute("data-floor", "upstairs");
    expect(currentInterior()).toHaveAttribute("data-muted", "true");
    house.unmount();
    render(<AlgyHouseHome />);
    expect(currentInterior()).toHaveAttribute("data-muted", "false");
  });

  it("uses the real door transition timing before changing floors", () => {
    render(<AlgyHouseHome />);

    fireEvent.click(screen.getByRole("button", { name: "Upstairs" }));
    expect(currentInterior()).toHaveAttribute("data-floor", "ground");
    expect(currentInterior()).toHaveAttribute("data-phase", "out");

    act(() => vi.advanceTimersByTime(HOUSE_DOOR_FADE_MS));
    expect(currentInterior()).toHaveAttribute("data-floor", "upstairs");
    expect(currentInterior()).toHaveAttribute("data-phase", "hold");

    act(() => vi.advanceTimersByTime(HOUSE_DOOR_HOLD_MS));
    expect(currentInterior()).toHaveAttribute("data-phase", "in");
    act(() => vi.advanceTimersByTime(HOUSE_DOOR_FADE_MS));
    expect(currentInterior()).toHaveAttribute("data-phase", "idle");
  });

  it("preloads the requested sprite, then changes character only behind black while preserving state", async () => {
    window.sessionStorage.setItem(ALGY_HOUSE_FLOOR_KEY, "upstairs");
    window.sessionStorage.setItem(ALGY_HOUSE_PLAYER_KEY, JSON.stringify({ floor: "upstairs", x: 8, y: 4, dir: "e", frame: 0 }));
    window.history.replaceState(null, "", "/?character=algy");
    render(<AlgyHouseHome />);

    fireEvent.click(screen.getByRole("button", { name: "Change character" }));
    await act(async () => Promise.resolve());
    expect(currentInterior()).toHaveAttribute("data-character", "algy");
    expect(currentInterior()).toHaveAttribute("data-floor", "upstairs");
    expect(screen.getByTestId("house-door-transition")).toHaveAttribute("data-phase", "out");

    act(() => vi.advanceTimersByTime(HOUSE_DOOR_FADE_MS - 1));
    expect(currentInterior()).toHaveAttribute("data-character", "algy");
    act(() => vi.advanceTimersByTime(1));
    expect(currentInterior()).toHaveAttribute("data-character", "mitch");
    expect(currentInterior()).toHaveAttribute("data-floor", "upstairs");
    expect(screen.getByTestId("house-door-transition")).toHaveAttribute("data-phase", "hold");
    expect(JSON.parse(window.sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY) ?? "null")).toMatchObject({ floor: "upstairs", x: 8, y: 4 });
    expect(window.location.search).toBe("?character=mitch");
  });

  it("does not start the character fade until a late sprite finishes loading", async () => {
    window.history.replaceState(null, "", "/?character=algy");
    const images: Array<{ src: string; onload: null | (() => void) }> = [];
    class LateImage {
      complete = false;
      naturalWidth = 0;
      onload: null | (() => void) = null;
      onerror: null | (() => void) = null;
      src = "";
      constructor() { images.push(this); }
    }
    vi.stubGlobal("Image", LateImage);
    render(<AlgyHouseHome />);

    fireEvent.click(screen.getByRole("button", { name: "Change character" }));
    await act(async () => Promise.resolve());
    expect(screen.getByTestId("house-door-transition")).toHaveAttribute("data-phase", "idle");
    expect(currentInterior()).toHaveAttribute("data-character", "algy");

    const mitch = images.find((image) => image.src.endsWith("mitch_run.png"));
    expect(mitch).toBeDefined();
    await act(async () => { mitch?.onload?.(); await Promise.resolve(); });
    expect(screen.getByTestId("house-door-transition")).toHaveAttribute("data-phase", "out");
    expect(currentInterior()).toHaveAttribute("data-character", "algy");
  });

  it("finishes a late character load after the Strict Mode effect replay", async () => {
    window.history.replaceState(null, "", "/?character=algy");
    const images: Array<{ src: string; onload: null | (() => void) }> = [];
    class LateImage {
      complete = false;
      naturalWidth = 0;
      onload: null | (() => void) = null;
      onerror: null | (() => void) = null;
      src = "";
      constructor() { images.push(this); }
    }
    vi.stubGlobal("Image", LateImage);
    render(<StrictMode><AlgyHouseHome /></StrictMode>);

    fireEvent.click(screen.getByRole("button", { name: "Change character" }));
    await act(async () => Promise.resolve());
    await act(async () => {
      images.find((image) => image.src.endsWith("mitch_run.png"))?.onload?.();
      await Promise.resolve();
    });

    expect(screen.getByTestId("house-door-transition")).toHaveAttribute("data-phase", "out");
  });

  it("ignores a character sprite that finishes after the house unmounts", async () => {
    window.history.replaceState(null, "", "/?character=algy");
    const images: Array<{ src: string; onload: null | (() => void) }> = [];
    class LateImage {
      complete = false;
      naturalWidth = 0;
      onload: null | (() => void) = null;
      onerror: null | (() => void) = null;
      src = "";
      constructor() { images.push(this); }
    }
    vi.stubGlobal("Image", LateImage);
    const historySpy = vi.spyOn(window.history, "replaceState");
    const view = render(<AlgyHouseHome />);
    fireEvent.click(screen.getByRole("button", { name: "Change character" }));
    await act(async () => Promise.resolve());
    view.unmount();
    await act(async () => { images.find((image) => image.src.endsWith("mitch_run.png"))?.onload?.(); await Promise.resolve(); });
    expect(historySpy).not.toHaveBeenCalled();
  });

  it("invalidates a pending character load when leaving the house", async () => {
    window.history.replaceState(null, "", "/?character=algy");
    const images: Array<{ src: string; onload: null | (() => void) }> = [];
    class LateImage {
      complete = false;
      naturalWidth = 0;
      onload: null | (() => void) = null;
      onerror: null | (() => void) = null;
      src = "";
      constructor() { images.push(this); }
    }
    vi.stubGlobal("Image", LateImage);
    const historySpy = vi.spyOn(window.history, "replaceState");
    render(<AlgyHouseHome />);
    fireEvent.click(screen.getByRole("button", { name: "Change character" }));
    await act(async () => Promise.resolve());
    fireEvent.click(screen.getByRole("button", { name: "Leave" }));
    await act(async () => { images.find((image) => image.src.endsWith("mitch_run.png"))?.onload?.(); await Promise.resolve(); });
    expect(currentInterior()).toHaveAttribute("data-character", "algy");
    expect(screen.getByTestId("house-door-transition")).toHaveAttribute("data-phase", "out");
    expect(historySpy).not.toHaveBeenCalled();
  });

  it("shows a retry message when both bounded sprite loads fail", async () => {
    window.history.replaceState(null, "", "/?character=algy");
    const images: Array<{ src: string; onerror: null | (() => void) }> = [];
    class FailedImage {
      complete = false;
      naturalWidth = 0;
      onload: null | (() => void) = null;
      onerror: null | (() => void) = null;
      src = "";
      constructor() { images.push(this); }
    }
    vi.stubGlobal("Image", FailedImage);
    render(<AlgyHouseHome />);
    fireEvent.click(screen.getByRole("button", { name: "Change character" }));
    await act(async () => Promise.resolve());
    images.find((image) => image.src.endsWith("mitch_run.png"))?.onerror?.();
    await act(async () => Promise.resolve());
    images.filter((image) => image.src.endsWith("mitch_run.png")).at(-1)?.onerror?.();
    await act(async () => Promise.resolve());
    expect(screen.getByRole("status")).toHaveTextContent("Could not load that character. Try again.");
    expect(screen.getByTestId("house-door-transition")).toHaveAttribute("data-phase", "idle");
  });

  it("clears the house resume state and assigns the local town after the door transition", () => {
    window.sessionStorage.setItem(ALGY_HOUSE_SCENE_KEY, "algy-house");
    window.sessionStorage.setItem(ALGY_HOUSE_FLOOR_KEY, "upstairs");
    window.sessionStorage.setItem(ALGY_HOUSE_PLAYER_KEY, "player-state");
    const actualWindow = window;
    const assign = vi.fn();
    const localWindow = Object.create(actualWindow) as Window;
    Object.defineProperties(localWindow, {
      sessionStorage: { value: actualWindow.sessionStorage },
      localStorage: { value: actualWindow.localStorage },
      setTimeout: { value: actualWindow.setTimeout.bind(actualWindow) },
      clearTimeout: { value: actualWindow.clearTimeout.bind(actualWindow) },
      location: { value: { assign } },
    });
    vi.stubGlobal("window", localWindow);

    render(<AlgyHouseHome />);
    fireEvent.click(screen.getByRole("button", { name: "Leave" }));
    act(() => vi.advanceTimersByTime(HOUSE_DOOR_FADE_MS));

    expect(actualWindow.sessionStorage.getItem(ALGY_HOUSE_SCENE_KEY)).toBeNull();
    expect(actualWindow.sessionStorage.getItem(ALGY_HOUSE_FLOOR_KEY)).toBeNull();
    expect(actualWindow.sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY)).toBeNull();
    expect(assign).toHaveBeenCalledWith("/pixel");
  });

  it("returns a town arrival to the fixed porch as Mitch", () => {
    window.history.replaceState(null, "", "/?character=mitch&return=algy-porch");
    const actualWindow = window;
    const assign = vi.fn();
    const localWindow = Object.create(actualWindow) as Window;
    Object.defineProperties(localWindow, {
      sessionStorage: { value: actualWindow.sessionStorage },
      localStorage: { value: actualWindow.localStorage },
      history: { value: actualWindow.history },
      setTimeout: { value: actualWindow.setTimeout.bind(actualWindow) },
      clearTimeout: { value: actualWindow.clearTimeout.bind(actualWindow) },
      location: { value: { assign, pathname: "/", search: "?character=mitch&return=algy-porch", hash: "" } },
    });
    vi.stubGlobal("window", localWindow);

    render(<AlgyHouseHome />);
    fireEvent.click(screen.getByRole("button", { name: "Leave" }));
    act(() => vi.advanceTimersByTime(HOUSE_DOOR_FADE_MS));

    expect(assign).toHaveBeenCalledWith("/pixel?character=mitch&return=algy-porch");
  });

  it("keeps Mitch's return route after the one-time arrival marker has been consumed", () => {
    window.history.replaceState(null, "", "/?character=mitch");
    const actualWindow = window;
    const assign = vi.fn();
    const localWindow = Object.create(actualWindow) as Window;
    Object.defineProperties(localWindow, {
      sessionStorage: { value: actualWindow.sessionStorage },
      localStorage: { value: actualWindow.localStorage },
      setTimeout: { value: actualWindow.setTimeout.bind(actualWindow) },
      clearTimeout: { value: actualWindow.clearTimeout.bind(actualWindow) },
      location: { value: { assign, pathname: "/", search: "?character=mitch", hash: "" } },
    });
    vi.stubGlobal("window", localWindow);

    render(<AlgyHouseHome />);
    fireEvent.click(screen.getByRole("button", { name: "Leave" }));
    act(() => vi.advanceTimersByTime(HOUSE_DOOR_FADE_MS));

    expect(assign).toHaveBeenCalledWith("/pixel?character=mitch&return=algy-porch");
  });
});
