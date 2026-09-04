import { useCallback, useEffect, useRef, useState } from "react";
import { ALGY_HOUSE_TRACK } from "./algyHouseScene";

type StereoStatus = "stopped" | "loading" | "playing" | "error";

export function useHouseStereo({ muted, volume }: { muted: boolean; volume: number }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestedRef = useRef(false);
  const generationRef = useRef(0);
  const settingsRef = useRef({ muted, volume });
  const [status, setStatus] = useState<StereoStatus>("stopped");

  useEffect(() => {
    settingsRef.current = { muted, volume };
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
    setStatus("stopped");
  }, []);

  useEffect(() => () => {
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
  }, []);

  const toggle = useCallback(() => {
    if (requestedRef.current) {
      stop();
      return;
    }
    // Construct and load the song only in the explicit interaction handler.
    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;
    audio.preload = "none";
    audio.loop = false;
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
      setStatus("stopped");
    };
    audio.onerror = () => {
      if (generation !== generationRef.current) return;
      requestedRef.current = false;
      generationRef.current += 1;
      audio.pause();
      setStatus("error");
    };
    void (async () => {
      try {
        await audio.play();
        if (generation !== generationRef.current) {
          // Do not interrupt a newer explicit play request on the same element.
          if (!requestedRef.current) audio.pause();
          return;
        }
        setStatus("playing");
      } catch {
        if (generation !== generationRef.current) return;
        requestedRef.current = false;
        setStatus("error");
      }
    })();
  }, [stop]);

  return { status, toggle, stop };
}
