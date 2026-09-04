import { act, renderHook } from "@testing-library/react";
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
    expect(audio.getAttribute("src")).toBeTruthy();
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
