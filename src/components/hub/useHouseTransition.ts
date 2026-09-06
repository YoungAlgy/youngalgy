import { useCallback, useEffect, useRef, useState } from "react";
import {
  HOUSE_DOOR_FADE_MS,
  HOUSE_DOOR_HOLD_MS,
  type HouseDoorTransitionPhase,
} from "./algyHouseDoor";
import {
  prepareHouseTransitionSound,
  playHouseTransitionSound,
  type HouseTransitionCue,
} from "./houseTransitionSound";

export interface HouseTransition {
  phase: HouseDoorTransitionPhase;
  start: (commit: () => void, cue: HouseTransitionCue) => void;
  prepareSound: () => void;
}

export function useHouseTransition(muted: boolean): HouseTransition {
  const [phase, setPhase] = useState<HouseDoorTransitionPhase>("idle");
  const phaseRef = useRef<HouseDoorTransitionPhase>("idle");
  const mutedRef = useRef(muted);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => () => {
    for (const timer of timersRef.current) window.clearTimeout(timer);
    timersRef.current = [];
  }, []);

  const prepareSound = useCallback(() => {
    if (!mutedRef.current) prepareHouseTransitionSound();
  }, []);

  const start = useCallback((commit: () => void, cue: HouseTransitionCue) => {
    if (phaseRef.current !== "idle") return;
    for (const timer of timersRef.current) window.clearTimeout(timer);
    timersRef.current = [];
    phaseRef.current = "out";
    setPhase("out");
    if (!mutedRef.current) playHouseTransitionSound(cue);

    const swapTimer = window.setTimeout(() => {
      if (cue === "door" && !mutedRef.current) playHouseTransitionSound(cue, true);
      try {
        commit();
      } catch (error) {
        // A failed storage, history, or navigation commit must not strand the
        // visitor behind the fully opaque transition veil.
        console.error("[youngalgy-house] scene transition commit failed", error);
      }
      phaseRef.current = "hold";
      setPhase("hold");

      const revealTimer = window.setTimeout(() => {
        phaseRef.current = "in";
        setPhase("in");
        const finishTimer = window.setTimeout(() => {
          phaseRef.current = "idle";
          setPhase("idle");
          timersRef.current = [];
        }, HOUSE_DOOR_FADE_MS);
        timersRef.current.push(finishTimer);
      }, HOUSE_DOOR_HOLD_MS);
      timersRef.current.push(revealTimer);
    }, HOUSE_DOOR_FADE_MS);
    timersRef.current.push(swapTimer);
  }, []);

  return { phase, start, prepareSound };
}

export default useHouseTransition;
