import { useCallback, useEffect, useRef, useState } from "react";
import { ALGY_HOUSE_TRACK } from "./algyHouseScene";

type StereoStatus = "stopped" | "loading" | "playing" | "blocked" | "error";

function isAutoplayBlocked(error: unknown): boolean {
  return typeof error === "object" && error !== null && "name" in error && error.name === "NotAllowedError";
}

function isRetryGesture(event: PointerEvent | KeyboardEvent): boolean {
  // Let the explicit music control own its event. Retrying during capture would
  // turn the button into "Mute" before its click handler runs and silence it.
  if (event.target instanceof Element && event.target.closest('[aria-label="Play music"]')) return false;
  if (event.type === "pointerdown") return event.isTrusted && (event as PointerEvent).button === 0;
  const keyEvent = event as KeyboardEvent;
  return keyEvent.isTrusted && !keyEvent.ctrlKey && !keyEvent.altKey && !keyEvent.metaKey &&
    !["Alt", "Control", "Meta", "Shift", "CapsLock", "Tab", "Escape"].includes(keyEvent.key);
}

export function useHouseStereo({ muted, volume, autoPlay = false }: { muted: boolean; volume: number; autoPlay?: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestedRef = useRef(false);
  const generationRef = useRef(0);
  const mountedRef = useRef(true);
  const autoPlayRef = useRef(autoPlay);
  const previousAutoPlayRef = useRef(false);
  const settingsRef = useRef({ muted, volume });
  const [status, setStatus] = useState<StereoStatus>("stopped");

  settingsRef.current = { muted, volume };
  autoPlayRef.current = autoPlay;

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = muted;
      audio.volume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.55;
    }
  }, [muted, volume]);

  const stop = useCallback(() => {
    generationRef.current += 1;
    requestedRef.current = false;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (mountedRef.current) setStatus("stopped");
  }, []);

  const start = useCallback(() => {
    if (requestedRef.current) return;
    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;
    audio.preload = autoPlayRef.current ? "auto" : "none";
    audio.loop = autoPlayRef.current;
    if (!audio.getAttribute("src")) audio.src = ALGY_HOUSE_TRACK;
    audio.muted = settingsRef.current.muted;
    const volume = settingsRef.current.volume;
    audio.volume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.55;
    const generation = ++generationRef.current;
    requestedRef.current = true;
    setStatus("loading");
    audio.onended = () => {
      if (generation !== generationRef.current) return;
      requestedRef.current = false;
      // `play()` may still have a pending promise when the media ends. Invalidate
      // that continuation so it cannot change the finished stereo back to playing.
      generationRef.current += 1;
      setStatus("stopped");
    };
    audio.onerror = () => {
      if (generation !== generationRef.current) return;
      requestedRef.current = false;
      generationRef.current += 1;
      audio.pause();
      setStatus("error");
    };
    void audio.play().then(() => {
      if (generation !== generationRef.current) {
        // Do not interrupt a newer explicit play request on the same element.
        if (!requestedRef.current) audio.pause();
        return;
      }
      setStatus("playing");
    }).catch((error: unknown) => {
      if (generation !== generationRef.current) return;
      requestedRef.current = false;
      setStatus(isAutoplayBlocked(error) ? "blocked" : "error");
    });
  }, []);

  const toggle = useCallback(() => {
    if (requestedRef.current) stop();
    else start();
  }, [start, stop]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      generationRef.current += 1;
      requestedRef.current = false;
      const audio = audioRef.current;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
        audio.currentTime = 0;
      }
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const wasAutoPlay = previousAutoPlayRef.current;
    previousAutoPlayRef.current = autoPlay;
    if (autoPlay) start();
    else if (wasAutoPlay) {
      const audio = audioRef.current;
      if (audio) audio.loop = false;
      stop();
    }
  }, [autoPlay, start, stop]);

  useEffect(() => {
    if (!autoPlay || status !== "blocked") return;
    const retry = (event: PointerEvent | KeyboardEvent) => {
      if (!autoPlayRef.current || requestedRef.current || !isRetryGesture(event)) return;
      start();
    };
    window.addEventListener("pointerdown", retry, true);
    window.addEventListener("keydown", retry, true);
    return () => {
      window.removeEventListener("pointerdown", retry, true);
      window.removeEventListener("keydown", retry, true);
    };
  }, [autoPlay, start, status]);

  return { status, start, toggle, stop };
}

export default useHouseStereo;
