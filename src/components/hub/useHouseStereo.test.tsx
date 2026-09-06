import { act, renderHook } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useHouseStereo } from "./useHouseStereo";

function deferred<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

function installAudio(playImplementation: () => Promise<void> = () => Promise.resolve()) {
  const audio = document.createElement("audio");
  const play = vi.fn(playImplementation);
  const pause = vi.fn();
  Object.defineProperty(audio, "play", { configurable: true, value: play });
  Object.defineProperty(audio, "pause", { configurable: true, value: pause });
  const AudioMock = vi.fn(() => audio);
  vi.stubGlobal("Audio", AudioMock);
  return { audio, play, pause, AudioMock };
}

async function settle() {
  await act(async () => {
    await Promise.resolve();
  });
}

describe("useHouseStereo", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("does not create or load audio until the explicit stereo toggle", async () => {
    const { audio, play, AudioMock } = installAudio();
    const view = renderHook(() => useHouseStereo({ muted: false, volume: 0.55 }));

    expect(AudioMock).not.toHaveBeenCalled();
    expect(view.result.current.status).toBe("stopped");

    act(() => view.result.current.toggle());
    await settle();

    expect(AudioMock).toHaveBeenCalledTimes(1);
    expect(play).toHaveBeenCalledTimes(1);
    expect(audio.preload).toBe("none");
    expect(audio.loop).toBe(false);
    expect(audio.getAttribute("src")).toBe("/audio/toggletown-original.mp3");
    expect(view.result.current.status).toBe("playing");
  });

  it("autoplays and loops the original song when enabled", async () => {
    const { audio, play, AudioMock } = installAudio();
    const view = renderHook(() => useHouseStereo({ muted: false, volume: 0.55, autoPlay: true }));
    await settle();

    expect(AudioMock).toHaveBeenCalledTimes(1);
    expect(play).toHaveBeenCalledTimes(1);
    expect(audio.loop).toBe(true);
    expect(audio.preload).toBe("auto");
    expect(audio.getAttribute("src")).toBe("/audio/toggletown-original.mp3");
    expect(view.result.current.status).toBe("playing");
  });

  it("preserves muted and zero-volume settings during autoplay", async () => {
    const { audio } = installAudio();
    renderHook(() => useHouseStereo({ muted: true, volume: 0, autoPlay: true }));
    await settle();

    expect(audio.muted).toBe(true);
    expect(audio.volume).toBe(0);
  });

  it("reports browser blocking and retries once from a trusted gesture", async () => {
    const blocked = Object.assign(new Error("gesture required"), { name: "NotAllowedError" });
    const { play } = installAudio();
    play.mockRejectedValueOnce(blocked).mockResolvedValueOnce();
    let pointerRetry: ((event: PointerEvent) => void) | undefined;
    const add = vi.spyOn(window, "addEventListener").mockImplementation(((type: string, listener: EventListenerOrEventListenerObject) => {
      if (type === "pointerdown") pointerRetry = listener as (event: PointerEvent) => void;
    }) as typeof window.addEventListener);
    const view = renderHook(() => useHouseStereo({ muted: false, volume: 0.5, autoPlay: true }));
    await settle();

    expect(view.result.current.status).toBe("blocked");
    expect(add).toHaveBeenCalled();
    act(() => pointerRetry?.({ type: "pointerdown", isTrusted: true, button: 0 } as PointerEvent));
    act(() => pointerRetry?.({ type: "pointerdown", isTrusted: true, button: 0 } as PointerEvent));
    await settle();

    expect(play).toHaveBeenCalledTimes(2);
    expect(view.result.current.status).toBe("playing");
  });

  it("ignores shortcuts and untrusted events while autoplay is blocked", async () => {
    const blocked = Object.assign(new Error("gesture required"), { name: "NotAllowedError" });
    const { play } = installAudio(() => Promise.reject(blocked));
    let keyRetry: ((event: KeyboardEvent) => void) | undefined;
    vi.spyOn(window, "addEventListener").mockImplementation(((type: string, listener: EventListenerOrEventListenerObject) => {
      if (type === "keydown") keyRetry = listener as (event: KeyboardEvent) => void;
    }) as typeof window.addEventListener);
    renderHook(() => useHouseStereo({ muted: false, volume: 0.5, autoPlay: true }));
    await settle();

    act(() => keyRetry?.({ type: "keydown", isTrusted: false, key: "a", ctrlKey: false, altKey: false, metaKey: false } as KeyboardEvent));
    act(() => keyRetry?.({ type: "keydown", isTrusted: true, key: "r", ctrlKey: true, altKey: false, metaKey: false } as KeyboardEvent));
    act(() => keyRetry?.({ type: "keydown", isTrusted: true, key: "Tab", ctrlKey: false, altKey: false, metaKey: false } as KeyboardEvent));
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("lets the explicit Play music button own its activation while autoplay is blocked", async () => {
    const blocked = Object.assign(new Error("gesture required"), { name: "NotAllowedError" });
    const { play } = installAudio(() => Promise.reject(blocked));
    let pointerRetry: ((event: PointerEvent) => void) | undefined;
    vi.spyOn(window, "addEventListener").mockImplementation(((type: string, listener: EventListenerOrEventListenerObject) => {
      if (type === "pointerdown") pointerRetry = listener as (event: PointerEvent) => void;
    }) as typeof window.addEventListener);
    renderHook(() => useHouseStereo({ muted: false, volume: 0.5, autoPlay: true }));
    await settle();
    const button = document.createElement("button");
    button.setAttribute("aria-label", "Play music");

    act(() => pointerRetry?.({ type: "pointerdown", isTrusted: true, button: 0, target: button } as unknown as PointerEvent));

    expect(play).toHaveBeenCalledTimes(1);
  });

  it("stops, rewinds, and disables gesture retry when autoplay turns off", async () => {
    const blocked = Object.assign(new Error("gesture required"), { name: "NotAllowedError" });
    const { audio, pause, play } = installAudio(() => Promise.reject(blocked));
    const remove = vi.spyOn(window, "removeEventListener");
    const view = renderHook(({ autoPlay }) => useHouseStereo({ muted: false, volume: 0.5, autoPlay }), {
      initialProps: { autoPlay: true },
    });
    await settle();
    audio.currentTime = 19;

    view.rerender({ autoPlay: false });

    expect(play).toHaveBeenCalledTimes(1);
    expect(pause).toHaveBeenCalledTimes(1);
    expect(audio.currentTime).toBe(0);
    expect(audio.loop).toBe(false);
    expect(view.result.current.status).toBe("stopped");
    expect(remove).toHaveBeenCalledWith("pointerdown", expect.any(Function), true);
    expect(remove).toHaveBeenCalledWith("keydown", expect.any(Function), true);
  });

  it("survives StrictMode replay without a stale play completion winning", async () => {
    const firstPlay = deferred();
    const { play } = installAudio();
    play.mockImplementationOnce(() => firstPlay.promise).mockResolvedValueOnce();
    const view = renderHook(() => useHouseStereo({ muted: false, volume: 0.5, autoPlay: true }), {
      wrapper: StrictMode,
    });
    await settle();
    firstPlay.resolve();
    await settle();

    expect(play).toHaveBeenCalledTimes(2);
    expect(view.result.current.status).toBe("playing");
  });

  it("plays on toggle, then explicitly pauses and rewinds on stop", async () => {
    const { audio, play, pause } = installAudio();
    const view = renderHook(() => useHouseStereo({ muted: false, volume: 0.4 }));

    act(() => view.result.current.toggle());
    await settle();
    audio.currentTime = 23;
    act(() => view.result.current.stop());

    expect(play).toHaveBeenCalledTimes(1);
    expect(pause).toHaveBeenCalledTimes(1);
    expect(audio.currentTime).toBe(0);
    expect(view.result.current.status).toBe("stopped");
  });

  it("applies initial settings and clamps live volume changes", async () => {
    const { audio } = installAudio();
    const view = renderHook(({ muted, volume }) => useHouseStereo({ muted, volume }), {
      initialProps: { muted: true, volume: 2 },
    });

    act(() => view.result.current.toggle());
    await settle();
    expect(audio.muted).toBe(true);
    expect(audio.volume).toBe(1);

    view.rerender({ muted: false, volume: -0.25 });
    expect(audio.muted).toBe(false);
    expect(audio.volume).toBe(0);

    view.rerender({ muted: true, volume: Number.NaN });
    expect(audio.muted).toBe(true);
    expect(audio.volume).toBe(0.55);
  });

  it("keeps a stopped pending play from reviving the stereo", async () => {
    const firstPlay = deferred();
    const { audio, pause } = installAudio(() => firstPlay.promise);
    const view = renderHook(() => useHouseStereo({ muted: false, volume: 0.5 }));

    act(() => view.result.current.toggle());
    expect(view.result.current.status).toBe("loading");
    act(() => view.result.current.stop());
    firstPlay.resolve();
    await settle();

    expect(pause).toHaveBeenCalledTimes(2);
    expect(audio.currentTime).toBe(0);
    expect(view.result.current.status).toBe("stopped");
  });

  it("cleans up a pending play during unmount without letting it update state", async () => {
    const pendingPlay = deferred();
    const { audio, pause } = installAudio(() => pendingPlay.promise);
    const view = renderHook(() => useHouseStereo({ muted: false, volume: 0.5 }));

    act(() => view.result.current.toggle());
    view.unmount();
    pendingPlay.resolve();
    await settle();

    expect(pause).toHaveBeenCalledTimes(2);
    expect(audio.currentTime).toBe(0);
  });

  it("does not let an older pending play interrupt a newer explicit play", async () => {
    const firstPlay = deferred();
    const secondPlay = deferred();
    const { pause, play } = installAudio();
    play.mockImplementationOnce(() => firstPlay.promise).mockImplementationOnce(() => secondPlay.promise);
    const view = renderHook(() => useHouseStereo({ muted: false, volume: 0.5 }));

    act(() => view.result.current.toggle());
    act(() => view.result.current.stop());
    act(() => view.result.current.toggle());
    firstPlay.resolve();
    await settle();

    expect(pause).toHaveBeenCalledTimes(1);
    expect(view.result.current.status).toBe("loading");

    secondPlay.resolve();
    await settle();
    expect(view.result.current.status).toBe("playing");
  });

  it("stays errored after a rejected play until an explicit retry", async () => {
    const { play } = installAudio();
    play.mockRejectedValueOnce(new Error("blocked")).mockResolvedValueOnce();
    const view = renderHook(() => useHouseStereo({ muted: false, volume: 0.5 }));

    act(() => view.result.current.toggle());
    await settle();
    expect(view.result.current.status).toBe("error");
    expect(play).toHaveBeenCalledTimes(1);

    await settle();
    expect(play).toHaveBeenCalledTimes(1);
    act(() => view.result.current.toggle());
    await settle();
    expect(play).toHaveBeenCalledTimes(2);
    expect(view.result.current.status).toBe("playing");
  });

  it("returns to stopped when playback ends", async () => {
    const { audio } = installAudio();
    const view = renderHook(() => useHouseStereo({ muted: false, volume: 0.5 }));

    act(() => view.result.current.toggle());
    await settle();
    act(() => audio.dispatchEvent(new Event("ended")));

    expect(view.result.current.status).toBe("stopped");
  });

  it("does not let a late play resolution revive playback after ended", async () => {
    const pendingPlay = deferred();
    const { audio } = installAudio(() => pendingPlay.promise);
    const view = renderHook(() => useHouseStereo({ muted: false, volume: 0.5 }));

    act(() => view.result.current.toggle());
    expect(view.result.current.status).toBe("loading");
    act(() => audio.dispatchEvent(new Event("ended")));
    expect(view.result.current.status).toBe("stopped");

    pendingPlay.resolve();
    await settle();
    expect(view.result.current.status).toBe("stopped");
  });

  it("pauses and enters error state on a media error", async () => {
    const { audio, pause } = installAudio();
    const view = renderHook(() => useHouseStereo({ muted: false, volume: 0.5 }));

    act(() => view.result.current.toggle());
    await settle();
    act(() => audio.dispatchEvent(new Event("error")));

    expect(pause).toHaveBeenCalledTimes(1);
    expect(view.result.current.status).toBe("error");
  });
});
