import { algyHouseVisitorHref, type HouseCharacterId } from "./algyHouseVisitor";

export const LOCAL_HOUSE_ORIGIN = "http://127.0.0.1:4185";
export const LOCAL_TOWN_ENTRY = "http://127.0.0.1:4182/pixel";
export const LOCAL_TOWN_PROBE_MS = 1500;
export const LOCAL_TOWN_DEPARTURE_MS = 6000;

/** DEV-only transport. A failed or canceled exit leaves the room resumable. */
export function attemptLocalHouseExit(character: HouseCharacterId, options: {
  signal: AbortSignal;
  beginTransition: (commit: () => void) => void;
  navigate: (href: string) => void;
  onDeparture: () => void;
}): Promise<boolean> {
  return new Promise((resolve) => {
    const request = new AbortController();
    let finished = false;
    let departureTimer: number | undefined;
    const finish = (departed: boolean) => {
      if (finished) return;
      finished = true;
      window.clearTimeout(probeTimer);
      window.clearTimeout(departureTimer);
      window.removeEventListener("pagehide", onDeparture);
      options.signal.removeEventListener("abort", onAbort);
      request.abort();
      resolve(departed);
    };
    const onAbort = () => finish(false);
    const onDeparture = () => {
      // Only an actual page departure discards the old room resume position.
      try { options.onDeparture(); }
      finally { finish(true); }
    };
    const probeTimer = window.setTimeout(() => finish(false), LOCAL_TOWN_PROBE_MS);
    if (options.signal.aborted) { finish(false); return; }
    options.signal.addEventListener("abort", onAbort, { once: true });

    void (async () => {
      const response = await fetch(LOCAL_TOWN_ENTRY, {
        cache: "no-store", credentials: "omit", redirect: "error", signal: request.signal,
      });
      if (!response.ok || response.redirected ||
        !/^text\/html(?:;|$)/i.test(response.headers.get("content-type") ?? "")) throw new Error("Town unavailable");
      const html = await response.text();
      if (finished) return;
      if (!/<title>Toggle Town<\/title>/i.test(html) || !/\bid=["']root["']/.test(html)) throw new Error("Unexpected local app");
      window.clearTimeout(probeTimer);
      // Also bound a transition that is rejected or a browser navigation that
      // is canceled. The original player and audio settings stay in place.
      departureTimer = window.setTimeout(() => finish(false), LOCAL_TOWN_DEPARTURE_MS);
      options.beginTransition(() => {
        if (finished) return;
        window.addEventListener("pagehide", onDeparture, { once: true });
        try { options.navigate(algyHouseVisitorHref(LOCAL_TOWN_ENTRY, character)); }
        catch { finish(false); }
      });
    })().catch(() => finish(false));
  });
}
