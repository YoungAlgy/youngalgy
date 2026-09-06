import { act, renderHook } from "@testing-library/react";
import { StrictMode, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useHouseArt } from "./useHouseArt";

interface MockImage {
  complete: boolean;
  naturalWidth: number;
  onload: null | (() => void);
  onerror: null | (() => void);
  src: string;
}

describe("useHouseArt", () => {
  let images: MockImage[];
  let ImageMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    images = [];
    class PendingImage implements MockImage {
      complete = false;
      naturalWidth = 0;
      onload: null | (() => void) = null;
      onerror: null | (() => void) = null;
      src = "";
      constructor() { images.push(this); }
    }
    ImageMock = vi.fn(() => new PendingImage());
    vi.stubGlobal("Image", ImageMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  const succeed = async (image: MockImage) => {
    image.complete = true;
    image.naturalWidth = 16;
    await act(async () => { image.onload?.(); await Promise.resolve(); });
  };

  it("becomes ready only after every required image loads", async () => {
    const view = renderHook(() => useHouseArt("mitch"));
    expect(view.result.current.status).toBe("loading");
    expect(images).toHaveLength(5);

    for (const image of images.slice(0, -1)) await succeed(image);
    expect(view.result.current.status).toBe("loading");
    await succeed(images.at(-1)!);

    expect(view.result.current.status).toBe("ready");
    expect(Object.values(view.result.current.images).every(Boolean)).toBe(true);
    expect(view.result.current.images.avatar?.src).toBe("/sprites/characters/mitch_run.png");
    expect(view.result.current.images.hostAvatar?.src).toBe("/sprites/characters/algy_run.png");
  });

  it("reports an error with no drawable images and recreates only failed work on retry", async () => {
    const view = renderHook(() => useHouseArt("mitch"));
    const failed = images.find((image) => image.src.includes("stair-upstairs"))!;
    for (const image of images.filter((item) => item !== failed)) await succeed(image);
    await act(async () => { failed.onerror?.(); await Promise.resolve(); });

    expect(view.result.current.status).toBe("error");
    expect(Object.values(view.result.current.images).every((image) => image === null)).toBe(true);
    const requestsBeforeRetry = images.length;
    act(() => view.result.current.retry());
    expect(view.result.current.status).toBe("loading");
    expect(images).toHaveLength(requestsBeforeRetry + 1);
    expect(images.at(-1)?.src).toContain("stair-upstairs");
    await succeed(images.at(-1)!);
    expect(view.result.current.status).toBe("ready");
  });

  it("times out the batch after fifteen seconds", async () => {
    const view = renderHook(() => useHouseArt("algy"));
    expect(images).toHaveLength(4);
    await act(async () => { vi.advanceTimersByTime(15_000); await Promise.resolve(); });
    expect(view.result.current.status).toBe("error");
    expect(Object.values(view.result.current.images).every((image) => image === null)).toBe(true);
  });

  it("ignores a stale character batch and cleans up its handlers and timers", async () => {
    const view = renderHook(({ characterId }) => useHouseArt(characterId), {
      initialProps: { characterId: "algy" as "algy" | "mitch" },
    });
    const stale = [...images];
    view.rerender({ characterId: "mitch" });
    expect(view.result.current.status).toBe("loading");
    expect(stale.every((image) => image.onload === null && image.onerror === null)).toBe(true);

    for (const image of images.slice(stale.length)) await succeed(image);
    expect(view.result.current.status).toBe("ready");
    expect(view.result.current.images.avatar?.src).toContain("mitch_run.png");
    await act(async () => { vi.advanceTimersByTime(15_000); await Promise.resolve(); });
    expect(view.result.current.status).toBe("ready");
  });

  it("loads successfully after the Strict Mode effect replay", async () => {
    const wrapper = ({ children }: { children: ReactNode }) => <StrictMode>{children}</StrictMode>;
    const view = renderHook(() => useHouseArt("algy"), { wrapper });
    const active = images.filter((image) => image.onload !== null);
    expect(active).toHaveLength(4);

    for (const image of active) await succeed(image);
    expect(view.result.current.status).toBe("ready");
    expect(Object.values(view.result.current.images).every(Boolean)).toBe(true);
  });

  it("does not update after unmount and clears pending handlers", async () => {
    const view = renderHook(() => useHouseArt("algy"));
    const pending = [...images];
    view.unmount();
    expect(pending.every((image) => image.onload === null && image.onerror === null)).toBe(true);
    await act(async () => { vi.advanceTimersByTime(15_000); await Promise.resolve(); });
  });
});
