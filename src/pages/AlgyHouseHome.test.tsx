import { act, fireEvent, render, screen } from "@testing-library/react";
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
  doorTransitionPhase: string;
} }));

vi.mock("@/components/hub/AlgysHouseInterior", () => ({
  default: (props: NonNullable<typeof interior.props>) => {
    interior.props = props;
    return (
      <section
        data-testid="mock-house-interior"
        data-floor={props.floor}
        data-muted={String(props.muted)}
        data-volume={String(props.volume)}
        data-phase={props.doorTransitionPhase}
      >
        <button type="button" onClick={props.onToggleMute}>Toggle mute</button>
        <button type="button" onClick={() => props.onVolumeChange(-1)}>Volume low</button>
        <button type="button" onClick={() => props.onVolumeChange(2)}>Volume high</button>
        <button type="button" onClick={() => props.onChangeFloor("upstairs")}>Upstairs</button>
        <button type="button" onClick={() => props.onChangeFloor("ground")}>Ground</button>
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
  });

  it("restores an upstairs visit from session storage", () => {
    window.sessionStorage.setItem(ALGY_HOUSE_FLOOR_KEY, "upstairs");

    render(<AlgyHouseHome />);

    expect(currentInterior()).toHaveAttribute("data-floor", "upstairs");
  });

  it("restores house metadata after returning from another route", () => {
    document.title = "Privacy | Alex Holmes";
    document.head.innerHTML = '<link rel="canonical" href="https://youngalgy.com/privacy"><meta name="robots" content="noindex, nofollow">';

    render(<AlgyHouseHome />);

    expect(document.title).toBe("Algy's House | Young Algy");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://youngalgy.com/");
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
    expect(document.querySelector('meta[property="og:image:width"]')).toHaveAttribute("content", "1280");
    expect(document.querySelector('meta[property="og:image:height"]')).toHaveAttribute("content", "800");
    expect(document.querySelector('meta[property="og:site_name"]')).toHaveAttribute("content", "Young Algy");
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

  it("does not create or autoplay audio on mount or unmute", () => {
    const AudioMock = vi.fn();
    vi.stubGlobal("Audio", AudioMock);
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ muted: true, volume: 0.4 }));

    render(<AlgyHouseHome />);
    fireEvent.click(screen.getByRole("button", { name: "Toggle mute" }));

    expect(currentInterior()).toHaveAttribute("data-muted", "false");
    expect(AudioMock).not.toHaveBeenCalled();
  });

  it("restores clamped settings and persists valid updates", () => {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ muted: true, volume: 4 }));

    render(<AlgyHouseHome />);
    expect(currentInterior()).toHaveAttribute("data-muted", "true");
    expect(currentInterior()).toHaveAttribute("data-volume", "1");

    fireEvent.click(screen.getByRole("button", { name: "Volume low" }));
    expect(currentInterior()).toHaveAttribute("data-volume", "0");
    expect(JSON.parse(window.localStorage.getItem(SETTINGS_KEY) ?? "null")).toEqual({ muted: true, volume: 0 });

    fireEvent.click(screen.getByRole("button", { name: "Toggle mute" }));
    fireEvent.click(screen.getByRole("button", { name: "Volume high" }));
    expect(currentInterior()).toHaveAttribute("data-muted", "false");
    expect(currentInterior()).toHaveAttribute("data-volume", "1");
    expect(JSON.parse(window.localStorage.getItem(SETTINGS_KEY) ?? "null")).toEqual({ muted: false, volume: 1 });
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

  it("clears the house resume state and returns to Toggle Town after the door transition", () => {
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
    expect(assign).toHaveBeenCalledWith("https://toggle.town/");
  });
});
