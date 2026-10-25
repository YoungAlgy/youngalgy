import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { attemptLocalHouseExit, LOCAL_TOWN_ENTRY, LOCAL_TOWN_PROBE_MS, LOCAL_TOWN_DEPARTURE_MS } from "./localHouseExit";

const townHtml = '<title>Toggle Town</title><div id="root"></div>';
function response(overrides: Record<string, unknown> = {}) {
  return { ok: true, redirected: false, headers: new Headers({ "content-type": "text/html; charset=utf-8" }), text: async () => townHtml, ...overrides };
}

describe("local House departure transport", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
  const flush = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };
  function attempt(character: "algy" | "mitch" = "mitch") {
    const controller = new AbortController();
    const navigate = vi.fn();
    const onDeparture = vi.fn();
    const beginTransition = vi.fn((commit: () => void) => commit());
    const result = attemptLocalHouseExit(character, { signal: controller.signal, navigate, onDeparture, beginTransition });
    return { controller, navigate, onDeparture, beginTransition, result };
  }

  it.each(["algy", "mitch"] as const)("checks the fixed Town app then waits for actual %s departure", async (character) => {
    const fetchMock = vi.fn().mockResolvedValue(response());
    vi.stubGlobal("fetch", fetchMock);
    const state = attempt(character);
    await flush();
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(LOCAL_TOWN_ENTRY, {
      cache: "no-store", credentials: "omit", redirect: "error", signal: expect.any(AbortSignal),
    });
    expect(state.navigate).toHaveBeenCalledExactlyOnceWith(`${LOCAL_TOWN_ENTRY}?character=${character}&return=algy-porch`);
    expect(state.onDeparture).not.toHaveBeenCalled();
    window.dispatchEvent(new Event("pagehide"));
    expect(await state.result).toBe(true);
    expect(state.onDeparture).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
    window.dispatchEvent(new Event("pagehide"));
    expect(state.onDeparture).toHaveBeenCalledTimes(1);
  });

  it.each([
    response({ ok: false }),
    response({ redirected: true }),
    response({ headers: new Headers({ "content-type": "application/json" }) }),
    response({ text: async () => '<title>Another app</title><div id="root"></div>' }),
    response({ text: async () => '<title>Toggle Town</title>' }),
  ])("refuses an unavailable, redirected or wrong app response", async (reply) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(reply));
    const state = attempt();
    expect(await state.result).toBe(false);
    expect(state.beginTransition).not.toHaveBeenCalled();
    expect(state.navigate).not.toHaveBeenCalled();
    expect(state.onDeparture).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("fails promptly on a network rejection", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    const state = attempt();
    expect(await state.result).toBe(false);
    expect(state.navigate).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("bounds an unresponsive probe and ignores its late response", async () => {
    let reply: (value: ReturnType<typeof response>) => void = () => undefined;
    const fetchMock = vi.fn((_input: RequestInfo | URL, _init?: RequestInit) => new Promise((resolve) => { reply = resolve; }));
    vi.stubGlobal("fetch", fetchMock);
    const state = attempt();
    await vi.advanceTimersByTimeAsync(LOCAL_TOWN_PROBE_MS);
    expect(await state.result).toBe(false);
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
    reply(response());
    await flush();
    expect(state.beginTransition).not.toHaveBeenCalled();
    expect(state.onDeparture).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("bounds a body that never finishes", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({ text: () => new Promise(() => undefined) })));
    const state = attempt();
    await vi.advanceTimersByTimeAsync(LOCAL_TOWN_PROBE_MS);
    expect(await state.result).toBe(false);
    expect(state.navigate).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("recovers when the browser cancels navigation without clearing resume state", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response()));
    const state = attempt();
    await flush();
    expect(state.navigate).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(LOCAL_TOWN_DEPARTURE_MS);
    expect(await state.result).toBe(false);
    window.dispatchEvent(new Event("pagehide"));
    expect(state.onDeparture).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("cancels an old queued fade commit after an abort", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response()));
    const controller = new AbortController();
    let commit: () => void = () => undefined;
    const navigate = vi.fn();
    const onDeparture = vi.fn();
    const result = attemptLocalHouseExit("mitch", { signal: controller.signal, navigate, onDeparture, beginTransition: (callback) => { commit = callback; } });
    await flush();
    controller.abort();
    expect(await result).toBe(false);
    commit();
    window.dispatchEvent(new Event("pagehide"));
    expect(navigate).not.toHaveBeenCalled();
    expect(onDeparture).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("recovers a thrown navigation without clearing the room", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response()));
    const onDeparture = vi.fn();
    const result = attemptLocalHouseExit("algy", {
      signal: new AbortController().signal,
      navigate: () => { throw new Error("Navigation canceled"); },
      beginTransition: (commit) => commit(), onDeparture,
    });
    expect(await result).toBe(false);
    expect(onDeparture).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not start a probe for an already-aborted exit", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const controller = new AbortController();
    controller.abort();
    const result = attemptLocalHouseExit("mitch", {
      signal: controller.signal, navigate: vi.fn(), onDeparture: vi.fn(), beginTransition: vi.fn(),
    });
    expect(await result).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
});
