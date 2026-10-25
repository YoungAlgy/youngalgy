import { algyHouseVisitorHref, type HouseCharacterId } from "./algyHouseVisitor";

export const LOCAL_HOUSE_ORIGIN = "http://127.0.0.1:4185";
export const LOCAL_TOWN_ENTRY = "http://127.0.0.1:4182/pixel";
export const LOCAL_TOWN_PROBE_MS = 1500;
export const LOCAL_TOWN_DEPARTURE_MS = 6000;

interface HouseExitOptions {
  signal: AbortSignal;
  beginTransition: (commit: () => void) => void;
  navigate: (href: string) => void;
  onDeparture: () => void;
}

/** Confirm actual departure without fetching or changing room resume state early. */
export function confirmHouseDeparture(href: string, options: HouseExitOptions): Promise<boolean> {
  return new Promise(resolve => {
    let finished = false;
    let committed = false;
    const finish = (departed: boolean) => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timer);
      window.removeEventListener("pagehide", onDeparture);
      options.signal.removeEventListener("abort", onAbort);
      resolve(departed);
    };
    const onAbort = () => finish(false);
    const onDeparture = () => {
      if (finished) return;
      try { options.onDeparture(); }
      finally { finish(true); }
    };
    const timer = window.setTimeout(() => finish(false), LOCAL_TOWN_DEPARTURE_MS);
    if (options.signal.aborted) { finish(false); return; }
    options.signal.addEventListener("abort", onAbort, { once: true });
    try {
      options.beginTransition(() => {
        if (finished || committed) return;
        committed = true;
        window.addEventListener("pagehide", onDeparture, { once: true });
        try { options.navigate(href); }
        catch { finish(false); }
      });
    } catch { finish(false); }
  });
}

/** DEV-only preflight, followed by the same departure confirmation as production. */
export function attemptLocalHouseExit(character: HouseCharacterId, options: HouseExitOptions): Promise<boolean> {
  return new Promise(resolve => {
    const request = new AbortController();
    let finished = false;
    const finish = (departed: boolean) => {
      if (finished) return;
      finished = true;
      window.clearTimeout(probeTimer);
      options.signal.removeEventListener("abort", onAbort);
      request.abort();
      resolve(departed);
    };
    const onAbort = () => finish(false);
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
      finish(await confirmHouseDeparture(algyHouseVisitorHref(LOCAL_TOWN_ENTRY, character), options));
    })().catch(() => finish(false));
  });
}
