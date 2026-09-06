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
  algyHouseTownReturnHref,
  hasExplicitHouseVisitor,
  houseCharacterFromSearch,
  houseVisitorReloadHref,
  isAlgyHouseTownArrival,
  townVisitorReloadHref,
  type HouseCharacterId,
} from "@/components/hub/algyHouseVisitor";
import { useHouseTransition } from "@/components/hub/useHouseTransition";
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
    };
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
    if (target === floor) return;
    characterRequestRef.current += 1;
    setCharacterPending(false);
    start(() => setFloor(target), target === "upstairs" ? "stairs-up" : "stairs-down");
  }, [floor, start]);

  const changeCharacter = useCallback(async (target: HouseCharacterId) => {
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
    start(() => {
      try {
        window.sessionStorage.removeItem(ALGY_HOUSE_SCENE_KEY);
        window.sessionStorage.removeItem(ALGY_HOUSE_FLOOR_KEY);
        window.sessionStorage.removeItem(ALGY_HOUSE_PLAYER_KEY);
      } catch { /* Storage is optional. */ }
      window.location.assign((townArrival || explicitVisitor || hasExplicitHouseVisitor(window.location.search))
        ? algyHouseTownReturnHref(import.meta.env.DEV, characterId)
        : (import.meta.env.DEV ? "/pixel" : "https://toggle.town/"));
    }, "door");
  }, [characterId, explicitVisitor, start, townArrival]);

  return (
    <div className="youngalgy-house" data-testid="youngalgy-house-home" style={{ position: "fixed", inset: 0 }}>
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
          characterChangePending={characterPending}
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
          pointerEvents: phase === "idle" ? "none" : "auto", zIndex: 100 }}
      />
    </div>
  );
}
