import { useCallback, useEffect, useRef, useState } from "react";
import AlgysHouseInterior from "@/components/hub/AlgysHouseInterior";
import {
  ALGY_HOUSE_DEFAULT_FLOOR,
  ALGY_HOUSE_AVATAR,
  ALGY_HOUSE_MITCH_AVATAR,
  ALGY_HOUSE_FLOOR_KEY,
  ALGY_HOUSE_PLAYER_KEY,
  ALGY_HOUSE_SCENE_KEY,
  type AlgyHouseFloor,
} from "@/components/hub/algyHouseScene";
import { HOUSE_DOOR_FADE_MS } from "@/components/hub/algyHouseDoor";
import {
  algyHouseExitHref,
  hasExplicitHouseVisitor,
  houseCharacterFromSearch,
  houseVisitorReloadHref,
  isAlgyHouseTownArrival,
  townVisitorReloadHref,
  type HouseCharacterId,
} from "@/components/hub/algyHouseVisitor";
import { useHouseTransition } from "@/components/hub/useHouseTransition";
import { attemptLocalHouseExit, LOCAL_HOUSE_ORIGIN } from "@/components/hub/localHouseExit";
import { useRouteHead } from "@/components/landing/useRouteHead";
import "../youngalgy-house.css";

const SETTINGS_KEY = "youngalgy:house-audio";
const DEFAULT_MUSIC_VOLUME = 0.55;
function loadAvatar(url: string, avatarLoads: Map<string, Promise<void>>): Promise<void> {
  const cached = avatarLoads.get(url);
  if (cached) return cached;
  const request = new Promise<void>((resolve, reject) => {
    const image = new Image();
    let settled = false;
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
      if (error) reject(error); else resolve();
    };
    const timer = window.setTimeout(() => finish(new Error(`Timed out loading ${url}`)), 4000);
    image.onload = () => finish();
    image.onerror = () => finish(new Error(`Could not load ${url}`));
    image.src = url;
    if (image.complete && image.naturalWidth > 0) {
      finish();
    }
  });
  avatarLoads.set(url, request);
  request.catch(() => avatarLoads.delete(url));
  return request;
}

async function preloadAvatar(url: string, avatarLoads: Map<string, Promise<void>>): Promise<void> {
  try { await loadAvatar(url, avatarLoads); }
  catch { await loadAvatar(url, avatarLoads); }
}

function savedFloor(): AlgyHouseFloor {
  try {
    return window.sessionStorage.getItem(ALGY_HOUSE_FLOOR_KEY) === "upstairs"
      ? "upstairs" : ALGY_HOUSE_DEFAULT_FLOOR;
  } catch { return ALGY_HOUSE_DEFAULT_FLOOR; }
}

function initialSettings(): { muted: boolean; volume: number } {
  try {
    const value = JSON.parse(window.localStorage.getItem(SETTINGS_KEY) ?? "null");
    // Each house visit starts audible. Mute and zero volume still work while
    // visiting, but an old silent setting must not silence the next arrival.
    return {
      muted: false,
      volume: typeof value?.volume === "number" && Number.isFinite(value.volume) && value.volume > 0
        ? Math.min(1, value.volume) : DEFAULT_MUSIC_VOLUME,
    };
  } catch { return { muted: false, volume: DEFAULT_MUSIC_VOLUME }; }
}

/** Standalone personal-home entry. No town ambient track, auth or product shell. */
export default function AlgyHouseHome() {
  useRouteHead({
    title: "Algy's House | Young Algy",
    description: "Step inside Algy's House. A pixel-art home with music by Young Algy.",
    url: "https://youngalgy.com/",
    image: "https://youngalgy.com/og-algys-house-20260904.png",
    imageAlt: "Inside Algy's House, with wooden stairs and Algy by the door.",
    imageWidth: 1280,
    imageHeight: 800,
    siteName: "Young Algy",
  });
  const avatarLoadsRef = useRef(new Map<string, Promise<void>>());
  const characterRequestRef = useRef(0);
  const mountedRef = useRef(true);
  const [townArrival] = useState(() => isAlgyHouseTownArrival(window.location.search));
  const [characterId, setCharacterId] = useState<HouseCharacterId>(() => houseCharacterFromSearch(window.location.search));
  const [explicitVisitor] = useState(() => hasExplicitHouseVisitor(window.location.search));
  // A town arrival must discard its last room coordinates before the interior
  // is allowed to synchronously read them. Direct/reload visits mount at once.
  const [prepared, setPrepared] = useState(() => !townArrival);
  const [floor, setFloor] = useState<AlgyHouseFloor>(() => townArrival ? ALGY_HOUSE_DEFAULT_FLOOR : savedFloor());
  const [settings, setSettings] = useState(initialSettings);
  const [characterPending, setCharacterPending] = useState(false);
  const [characterError, setCharacterError] = useState<string | null>(null);
  const [exitPending, setExitPending] = useState(false);
  const [exitNotice, setExitNotice] = useState<string | null>(null);
  const localExitRef = useRef<Promise<boolean> | null>(null);
  const localExitAbortRef = useRef<AbortController | null>(null);
  const localExitDepartedRef = useRef(false);
  const exitNoticeTimerRef = useRef<number | undefined>();
  const { phase, start, prepareSound } = useHouseTransition(settings.muted);

  useEffect(() => {
    void loadAvatar(ALGY_HOUSE_AVATAR, avatarLoadsRef.current).catch(() => undefined);
    void loadAvatar(ALGY_HOUSE_MITCH_AVATAR, avatarLoadsRef.current).catch(() => undefined);
  }, []);

  useEffect(() => {
    // React Strict Mode replays mount effects in development. Restore the live
    // flag during each setup so the simulated cleanup cannot permanently make
    // later avatar loads look like they completed after an unmount.
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      characterRequestRef.current += 1;
      localExitAbortRef.current?.abort();
      window.clearTimeout(exitNoticeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV || window.location.origin !== LOCAL_HOUSE_ORIGIN) return;
    const onPageShow = (event: PageTransitionEvent) => {
      // Back from a completed local departure must not restore the old input
      // lock from the browser's page cache. Reload at the safe room entrance.
      if (event.persisted && localExitDepartedRef.current) window.location.reload();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ volume: settings.volume })); }
    catch { /* Storage is optional. */ }
  }, [settings.volume]);

  useEffect(() => {
    if (!townArrival) return;
    try {
      window.sessionStorage.removeItem(ALGY_HOUSE_SCENE_KEY);
      window.sessionStorage.removeItem(ALGY_HOUSE_FLOOR_KEY);
      window.sessionStorage.removeItem(ALGY_HOUSE_PLAYER_KEY);
      window.history.replaceState(null, "", houseVisitorReloadHref(`${window.location.pathname}${window.location.search}${window.location.hash}`));
    } catch { /* Storage and History are optional. */ }
    setPrepared(true);
  }, [townArrival]);

  const changeFloor = useCallback((target: AlgyHouseFloor) => {
    if (localExitRef.current || target === floor) return;
    characterRequestRef.current += 1;
    setCharacterPending(false);
    start(() => setFloor(target), target === "upstairs" ? "stairs-up" : "stairs-down");
  }, [floor, start]);

  const changeCharacter = useCallback(async (target: HouseCharacterId) => {
    if (localExitRef.current) return;
    const request = ++characterRequestRef.current;
    setCharacterError(null);
    if (target === characterId) {
      setCharacterPending(false);
      return;
    }
    setCharacterPending(true);
    try {
      await preloadAvatar(target === "mitch" ? ALGY_HOUSE_MITCH_AVATAR : ALGY_HOUSE_AVATAR, avatarLoadsRef.current);
    } catch {
      if (mountedRef.current && request === characterRequestRef.current) {
        setCharacterPending(false);
        setCharacterError("Could not load that character. Try again.");
      }
      return;
    }
    if (!mountedRef.current || request !== characterRequestRef.current) return;
    setCharacterPending(false);
    start(() => {
      try {
        window.history.replaceState(null, "", townVisitorReloadHref(`${window.location.pathname}${window.location.search}${window.location.hash}`, target));
      } catch { /* History is optional. */ }
      setCharacterId(target);
    }, "door");
  }, [characterId, start]);

  const leave = useCallback(() => {
    characterRequestRef.current += 1;
    setCharacterPending(false);
    const clearResume = () => {
      try {
        window.sessionStorage.removeItem(ALGY_HOUSE_SCENE_KEY);
        window.sessionStorage.removeItem(ALGY_HOUSE_FLOOR_KEY);
        window.sessionStorage.removeItem(ALGY_HOUSE_PLAYER_KEY);
      } catch { /* Storage is optional. */ }
    };
    if (import.meta.env.DEV && window.location.origin === LOCAL_HOUSE_ORIGIN) {
      if (localExitRef.current) return localExitRef.current;
      const controller = new AbortController();
      localExitAbortRef.current = controller;
      window.clearTimeout(exitNoticeTimerRef.current);
      setExitNotice(null);
      setExitPending(true);
      const attempt = attemptLocalHouseExit(characterId, {
        signal: controller.signal,
        beginTransition: (commit) => start(commit, "door"),
        navigate: (href) => window.location.assign(href),
        onDeparture: () => {
          clearResume();
          localExitDepartedRef.current = true;
        },
      });
      localExitRef.current = attempt;
      void attempt.then((departed) => {
        if (localExitRef.current !== attempt) return;
        localExitRef.current = null;
        localExitAbortRef.current = null;
        if (!mountedRef.current) return;
        setExitPending(false);
        if (!departed) {
          setExitNotice("Town isn't available right now. You're still in the house.");
          exitNoticeTimerRef.current = window.setTimeout(() => setExitNotice(null), 4000);
        }
      });
      return attempt;
    }
    start(() => {
      clearResume();
      window.location.assign(algyHouseExitHref(
        import.meta.env.DEV,
        window.location.origin,
        characterId,
        townArrival || explicitVisitor || hasExplicitHouseVisitor(window.location.search),
      ));
    }, "door");
  }, [characterId, explicitVisitor, start, townArrival]);

  return (
    <div
      className="youngalgy-house"
      data-testid="youngalgy-house-home"
      aria-busy={exitPending}
      // Keep the loading/door-fade surface protected too, outside the room itself.
      style={{ position: "fixed", inset: 0, userSelect: "none", WebkitUserSelect: "none",
        WebkitTouchCallout: "none", WebkitTapHighlightColor: "transparent" }}
    >
      {prepared && (
        <AlgysHouseInterior
          characterId={characterId}
          persistTownScene={false}
          floor={floor}
          muted={settings.muted}
          volume={settings.volume}
          onToggleMute={() => setSettings((value) => ({ ...value, muted: !value.muted }))}
          onVolumeChange={(volume) => {
            if (Number.isFinite(volume)) setSettings((value) => ({ ...value, volume: Math.max(0, Math.min(1, volume)) }));
          }}
          onLeave={leave}
          onChangeFloor={changeFloor}
          onChangeCharacter={changeCharacter}
          characterChangePending={characterPending || exitPending}
          characterChangeStatus={characterError}
          onPrepareDoorSound={prepareSound}
          doorTransitionPhase={phase}
        />
      )}
      <div
        aria-hidden="true"
        data-testid="house-door-transition"
        data-phase={phase}
        style={{ position: "fixed", inset: 0, background: "#08040d", opacity: phase === "out" || phase === "hold" ? 1 : 0,
          transition: phase === "hold" ? "none" : `opacity ${HOUSE_DOOR_FADE_MS}ms linear`,
          pointerEvents: phase === "idle" && !exitPending ? "none" : "auto", zIndex: 100 }}
      />
      {(exitPending || exitNotice) && (
        <div role="status" style={{ position: "fixed", left: 14, bottom: 194, maxWidth: "calc(100vw - 28px)",
          padding: "10px 12px", border: "2px solid #c89838", background: "rgba(28, 18, 34, 0.94)",
          color: "#f4e8c1", fontSize: 10, lineHeight: 1.8, zIndex: 101, pointerEvents: "none" }}>
          {exitPending ? "Opening Town..." : exitNotice}
        </div>
      )}
    </div>
  );
}
