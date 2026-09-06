import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AlgysHouseInterior from "./AlgysHouseInterior";
import {
  ALGY_HOUSE_PLAYER_KEY,
  ALGY_HOUSE_UPSTAIRS_SPAWN,
} from "./algyHouseScene";

type TransitionPhase = "idle" | "out" | "hold" | "in";

function props(overrides: Partial<{
  floor: "ground" | "upstairs";
  doorTransitionPhase: TransitionPhase;
  onChangeFloor: (floor: "ground" | "upstairs") => void;
}> = {}) {
  return {
    floor: overrides.floor ?? "upstairs",
    muted: true,
    onToggleMute: vi.fn(),
    onLeave: vi.fn(),
    onChangeFloor: overrides.onChangeFloor ?? vi.fn(),
    onPrepareDoorSound: vi.fn(),
    doorTransitionPhase: overrides.doorTransitionPhase ?? "idle",
  };
}

describe("Algy's House upstairs stair descent transition", () => {
  let scheduledFrame: FrameRequestCallback | null;
  let avatarAlphas: number[];
  let shadowAlphas: number[];
  let context: {
    globalAlpha: number;
    fillStyle: string;
    drawImage: (...args: unknown[]) => void;
    fillRect: (...args: unknown[]) => void;
  };
  let OriginalImage: typeof Image;

  beforeEach(() => {
    window.sessionStorage.clear();
    window.sessionStorage.setItem(
      ALGY_HOUSE_PLAYER_KEY,
      JSON.stringify({ floor: "upstairs", ...{ ...ALGY_HOUSE_UPSTAIRS_SPAWN, x: 3 } }),
    );
    scheduledFrame = null;
    avatarAlphas = [];
    shadowAlphas = [];
    vi.spyOn(performance, "now").mockReturnValue(0);
    Object.defineProperty(window, "requestAnimationFrame", {
      configurable: true,
      value: vi.fn((callback: FrameRequestCallback) => {
        scheduledFrame = callback;
        return 1;
      }),
    });
    Object.defineProperty(window, "cancelAnimationFrame", { configurable: true, value: vi.fn() });

    context = {
      globalAlpha: 1,
      fillStyle: "",
      drawImage: (...args: unknown[]) => {
        const image = args[0] as { src?: string } | undefined;
        if (args.length === 9 && image?.src?.endsWith("algy_run.png")) avatarAlphas.push(context.globalAlpha);
      },
      fillRect: (...args: unknown[]) => {
        if (args[2] === 18 && args[3] === 4 && context.fillStyle === "rgba(26, 10, 30, 0.42)") {
          shadowAlphas.push(context.globalAlpha);
        }
      },
    };
    const noop = () => {};
    const alphaStack: number[] = [];
    const fillStyleStack: string[] = [];
    const canvasContext = new Proxy(context, {
      get(target, property) {
        if (property in target) return target[property as keyof typeof target];
        if (property === "save") {
          return () => {
            alphaStack.push(context.globalAlpha);
            fillStyleStack.push(context.fillStyle);
          };
        }
        if (property === "restore") {
          return () => {
            context.globalAlpha = alphaStack.pop() ?? 1;
            context.fillStyle = fillStyleStack.pop() ?? "";
          };
        }
        return noop;
      },
    });
    Object.defineProperty(window.HTMLCanvasElement.prototype, "getContext", {
      configurable: true,
      value: () => canvasContext,
    });

    OriginalImage = window.Image;
    class LoadedImage {
      complete = false;
      naturalWidth = 16;
      onload: ((event: Event) => void) | null = null;
      onerror: ((event: Event) => void) | null = null;
      private source = "";

      get src() {
        return this.source;
      }

      set src(value: string) {
        this.source = value;
        queueMicrotask(() => {
          this.complete = true;
          this.onload?.(new Event("load"));
        });
      }
    }
    Object.defineProperty(window, "Image", { configurable: true, value: LoadedImage });
    Object.defineProperty(globalThis, "Image", { configurable: true, value: LoadedImage });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window, "Image", { configurable: true, value: OriginalImage });
    Object.defineProperty(globalThis, "Image", { configurable: true, value: OriginalImage });
  });

  it("fades the avatar down the stairs, holds it hidden through the floor swap, and resets at safe arrival", async () => {
    const onChangeFloor = vi.fn();
    const initialProps = props({ onChangeFloor });
    const view = render(<AlgysHouseInterior {...initialProps} />);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    const frame = (now: number) => act(() => scheduledFrame?.(now));

    frame(0);
    expect(avatarAlphas.at(-1)).toBe(1);
    expect(shadowAlphas.at(-1)).toBe(1);

    fireEvent.keyDown(window, { key: "ArrowRight" });
    frame(75);
    expect(avatarAlphas.at(-1)).toBeCloseTo(0.5, 5);
    expect(shadowAlphas.at(-1)).toBeCloseTo(0.5, 5);

    frame(150);
    expect(onChangeFloor).toHaveBeenCalledTimes(1);
    expect(onChangeFloor).toHaveBeenCalledWith("ground");
    expect(avatarAlphas.at(-1)).toBe(0);
    expect(shadowAlphas.at(-1)).toBe(0);

    view.rerender(<AlgysHouseInterior {...initialProps} doorTransitionPhase="out" />);
    frame(250);
    expect(avatarAlphas.at(-1)).toBe(0);
    expect(shadowAlphas.at(-1)).toBe(0);
    frame(389);
    expect(avatarAlphas.at(-1)).toBe(0);
    expect(shadowAlphas.at(-1)).toBe(0);

    fireEvent.keyDown(window, { key: "ArrowRight", repeat: true });
    frame(500);
    expect(onChangeFloor).toHaveBeenCalledTimes(1);

    view.rerender(<AlgysHouseInterior {...initialProps} doorTransitionPhase="hold" />);
    frame(600);
    expect(avatarAlphas.at(-1)).toBe(0);
    expect(shadowAlphas.at(-1)).toBe(0);
    expect(JSON.parse(window.sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY) ?? "null")).toMatchObject({
      floor: "upstairs",
      x: 3,
      y: 2,
    });

    view.rerender(<AlgysHouseInterior {...initialProps} floor="ground" doorTransitionPhase="hold" />);
    frame(700);
    expect(avatarAlphas.at(-1)).toBe(0);
    expect(shadowAlphas.at(-1)).toBe(0);
    expect(JSON.parse(window.sessionStorage.getItem(ALGY_HOUSE_PLAYER_KEY) ?? "null")).toMatchObject({
      floor: "ground",
      x: 5,
      y: 1,
      dir: "e",
    });

    view.rerender(<AlgysHouseInterior {...initialProps} floor="ground" doorTransitionPhase="in" />);
    frame(940);
    expect(avatarAlphas.at(-1)).toBe(1);
    expect(shadowAlphas.at(-1)).toBe(1);
    view.rerender(<AlgysHouseInterior {...initialProps} floor="ground" doorTransitionPhase="idle" />);
    frame(1000);
    expect(avatarAlphas.at(-1)).toBe(1);
    expect(shadowAlphas.at(-1)).toBe(1);
    expect(onChangeFloor).toHaveBeenCalledTimes(1);
  });
});
