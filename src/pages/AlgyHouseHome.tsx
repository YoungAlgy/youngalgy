import { useCallback, useEffect, useState } from "react";
import AlgysHouseInterior from "@/components/hub/AlgysHouseInterior";
import {
  ALGY_HOUSE_DEFAULT_FLOOR,
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
  type HouseCharacterId,
} from "@/components/hub/algyHouseVisitor";
import { useHouseTransition } from "@/components/hub/useHouseTransition";
import { useRouteHead } from "@/components/landing/useRouteHead";
import "../youngalgy-house.css";

const SETTINGS_KEY = "youngalgy:house-audio";

function savedFloor(): AlgyHouseFloor {
  try {
    return window.sessionStorage.getItem(ALGY_HOUSE_FLOOR_KEY) === "upstairs"
      ? "upstairs" : ALGY_HOUSE_DEFAULT_FLOOR;
  } catch { return ALGY_HOUSE_DEFAULT_FLOOR; }
}

function savedSettings(): { muted: boolean; volume: number } {
  try {
    const value = JSON.parse(window.localStorage.getItem(SETTINGS_KEY) ?? "null");
    return {
      muted: value?.muted === true,
      volume: typeof value?.volume === "number" && Number.isFinite(value.volume)
        ? Math.max(0, Math.min(1, value.volume)) : 0.55,
    };
  } catch { return { muted: false, volume: 0.55 }; }
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
  const [townArrival] = useState(() => isAlgyHouseTownArrival(window.location.search));
  const [characterId] = useState<HouseCharacterId>(() => houseCharacterFromSearch(window.location.search));
  const [explicitVisitor] = useState(() => hasExplicitHouseVisitor(window.location.search));
  const [prepared, setPrepared] = useState(() => !townArrival);
  const [floor, setFloor] = useState<AlgyHouseFloor>(() => townArrival ? ALGY_HOUSE_DEFAULT_FLOOR : savedFloor());
  const [settings, setSettings] = useState(savedSettings);
  const { phase, start, prepareSound } = useHouseTransition(settings.muted);

  useEffect(() => {
    try { window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }
    catch { /* Storage is optional. */ }
  }, [settings]);

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
    start(() => setFloor(target), target === "upstairs" ? "stairs-up" : "stairs-down");
  }, [floor, start]);

  const leave = useCallback(() => {
    start(() => {
      try {
        window.sessionStorage.removeItem(ALGY_HOUSE_SCENE_KEY);
        window.sessionStorage.removeItem(ALGY_HOUSE_FLOOR_KEY);
        window.sessionStorage.removeItem(ALGY_HOUSE_PLAYER_KEY);
      } catch { /* Storage is optional. */ }
      window.location.assign((townArrival || explicitVisitor)
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
