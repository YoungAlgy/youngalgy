import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AlgysHouseInterior from "./AlgysHouseInterior";
import { ALGY_HOUSE_PLAYER_KEY } from "./algyHouseScene";

type TransitionPhase = "idle" | "out" | "hold" | "in";
type CharacterId = "algy" | "mitch";

const houseArtMock = vi.hoisted(() => ({
  images: {
    atlas: null,
    avatar: { complete: true, naturalWidth: 16, src: "/sprites/characters/algy_run.png" },
    hostAvatar: null,
    groundStairArt: null,
    upstairsStairArt: null,
  },
}));

vi.mock("./useHouseArt", () => ({
  useHouseArt: () => ({ status: "ready", images: houseArtMock.images, retry: vi.fn() }),
}));

function props(overrides: Partial<{
  characterId: CharacterId;
  doorTransitionPhase: TransitionPhase;
  onLeave: () => void;
  onPrepareDoorSound: () => void;
}> = {}) {
  return {
    floor: "ground" as const,
    characterId: overrides.characterId ?? "algy",
    muted: true,
    onToggleMute: vi.fn(),
    onLeave: overrides.onLeave ?? vi.fn(),
    onChangeFloor: vi.fn(),
    onPrepareDoorSound: overrides.onPrepareDoorSound ?? vi.fn(),
    doorTransitionPhase: overrides.doorTransitionPhase ?? "idle" as TransitionPhase,
  };
}

describe("Algy's House exterior-door transition", () => {
  let scheduledFrame: FrameRequestCallback | null;
  let avatarFrames: Array<{ y: number; alpha: number }>;

  beforeEach(() => {
    window.sessionStorage.clear();
    window.sessionStorage.setItem(ALGY_HOUSE_PLAYER_KEY, JSON.stringify({
      floor: "ground", x: 3, y: 8, dir: "s", frame: 0,
    }));
    scheduledFrame = null;
    avatarFrames = [];
    vi.spyOn(performance, "now").mockReturnValue(0);
    Object.defineProperty(window, "requestAnimationFrame", {
      configurable: true,
      value: vi.fn((callback: FrameRequestCallback) => {
        scheduledFrame = callback;
        return 1;
      }),
    });
    Object.defineProperty(window, "cancelAnimationFrame", { configurable: true, value: vi.fn() });

    const context = { globalAlpha: 1, fillStyle: "", drawImage: (...args: unknown[]) => {
      const image = args[0] as { src?: string } | undefined;
      if (args.length === 9 && /(?:algy|mitch)_run\.png$/.test(image?.src ?? "")) {
        avatarFrames.push({ y: args[6] as number, alpha: context.globalAlpha });
      }
    } };
    const alphaStack: number[] = [];
    const fillStyleStack: string[] = [];
    const canvasContext = new Proxy(context, {
      get(target, property) {
        if (property in target) return target[property as keyof typeof target];
        if (property === "save") return () => { alphaStack.push(context.globalAlpha); fillStyleStack.push(context.fillStyle); };
        if (property === "restore") return () => { context.globalAlpha = alphaStack.pop() ?? 1; context.fillStyle = fillStyleStack.pop() ?? ""; };
        return () => undefined;
      },
    });
    Object.defineProperty(window.HTMLCanvasElement.prototype, "getContext", {
      configurable: true,
      value: () => canvasContext,
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it.each([
    { characterId: "algy" as const, input: "keyboard" as const },
    { characterId: "mitch" as const, input: "keyboard" as const },
    { characterId: "algy" as const, input: "dpad" as const },
    { characterId: "mitch" as const, input: "dpad" as const },
  ])("starts the $characterId exit fade immediately from the door approach by $input", ({ characterId, input }) => {
    houseArtMock.images.avatar = { complete: true, naturalWidth: 16, src: `/sprites/characters/${characterId}_run.png` };
    const onLeave = vi.fn();
    const onPrepareDoorSound = vi.fn();
    const initialProps = props({ characterId, onLeave, onPrepareDoorSound });
    const view = render(<AlgysHouseInterior {...initialProps} />);
    const frame = (now: number) => act(() => scheduledFrame?.(now));

    frame(0);
    const doorY = avatarFrames.at(-1)?.y;
    expect(doorY).toBe(368);
    act(() => {
      if (input === "keyboard") fireEvent.keyDown(window, { key: "ArrowDown" });
      else fireEvent.click(screen.getByRole("button", { name: "Move down" }));
    });
    expect(onPrepareDoorSound).toHaveBeenCalledTimes(1);
    expect(onLeave).toHaveBeenCalledTimes(1);
    expect(JSON.parse(window.sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY) ?? "null")).toMatchObject({
      floor: "ground", x: 3, y: 8,
    });

    act(() => {
      if (input === "keyboard") fireEvent.keyDown(window, { key: "ArrowDown", repeat: true });
      else fireEvent.click(screen.getByRole("button", { name: "Move down" }));
    });
    expect(onLeave).toHaveBeenCalledTimes(1);

    view.rerender(<AlgysHouseInterior {...initialProps} doorTransitionPhase="out" />);
    for (const now of [75, 150]) {
      frame(now);
      expect(avatarFrames.at(-1)?.y).toBe(doorY);
    }
    expect(avatarFrames.at(-1)?.alpha).toBeCloseTo(0.375, 5);
    view.rerender(<AlgysHouseInterior {...initialProps} doorTransitionPhase="hold" />);
    frame(300);
    expect(avatarFrames.at(-1)).toEqual({ y: doorY, alpha: 0 });
  });

  it.each(["algy", "mitch"] as const)("keeps a normal step into the door approach animated before held down exits for %s", (characterId) => {
    houseArtMock.images.avatar = { complete: true, naturalWidth: 16, src: `/sprites/characters/${characterId}_run.png` };
    window.sessionStorage.setItem(ALGY_HOUSE_PLAYER_KEY, JSON.stringify({
      floor: "ground", x: 3, y: 7, dir: "s", frame: 0,
    }));
    const onLeave = vi.fn();
    render(<AlgysHouseInterior {...props({ characterId, onLeave })} />);
    const frame = (now: number) => act(() => scheduledFrame?.(now));

    frame(0);
    act(() => fireEvent.keyDown(window, { key: "ArrowDown" }));
    expect(onLeave).not.toHaveBeenCalled();
    frame(75);
    expect(avatarFrames.at(-1)?.y).toBeGreaterThan(320);
    expect(avatarFrames.at(-1)?.y).toBeLessThan(368);
    frame(150);
    expect(JSON.parse(window.sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY) ?? "null")).toMatchObject({
      floor: "ground", x: 3, y: 8,
    });
    expect(onLeave).toHaveBeenCalledTimes(1);
    act(() => fireEvent.keyDown(window, { key: "ArrowDown", repeat: true }));
    expect(onLeave).toHaveBeenCalledTimes(1);
  });
});
