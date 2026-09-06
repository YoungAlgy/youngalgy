import { useCallback, useEffect, useRef, useState } from "react";
import {
  ALGY_HOUSE_ATLAS,
  ALGY_HOUSE_AVATAR,
  ALGY_HOUSE_MITCH_AVATAR,
} from "./algyHouseScene";
import type { HouseCharacterId } from "./algyHouseVisitor";

const GROUND_STAIR_ART_URL = "/sprites/interiors/algy-house-stair-ground.png";
const UPSTAIRS_STAIR_ART_URL = "/sprites/interiors/algy-house-stair-upstairs.png";
const HOUSE_ART_TIMEOUT_MS = 15_000;

export interface HouseArtImages {
  atlas: HTMLImageElement | null;
  avatar: HTMLImageElement | null;
  hostAvatar: HTMLImageElement | null;
  groundStairArt: HTMLImageElement | null;
  upstairsStairArt: HTMLImageElement | null;
}

export interface HouseArtResult {
  status: "loading" | "ready" | "error";
  images: HouseArtImages;
  retry: () => void;
}

const EMPTY_IMAGES: HouseArtImages = {
  atlas: null,
  avatar: null,
  hostAvatar: null,
  groundStairArt: null,
  upstairsStairArt: null,
};

interface LoadState {
  characterId: HouseCharacterId;
  attempt: number;
  status: HouseArtResult["status"];
  images: HouseArtImages;
}

export function useHouseArt(characterId: HouseCharacterId): HouseArtResult {
  const loadedByUrlRef = useRef(new Map<string, HTMLImageElement>());
  const generationRef = useRef(0);
  const [attempt, setAttempt] = useState(0);
  const [loadState, setLoadState] = useState<LoadState>({
    characterId,
    attempt,
    status: "loading",
    images: EMPTY_IMAGES,
  });

  useEffect(() => {
    const generation = ++generationRef.current;
    let active = true;
    const cleanups: Array<() => void> = [];
    const avatarUrl = characterId === "mitch" ? ALGY_HOUSE_MITCH_AVATAR : ALGY_HOUSE_AVATAR;
    const urls = Array.from(new Set([
      ALGY_HOUSE_ATLAS,
      avatarUrl,
      ALGY_HOUSE_AVATAR,
      GROUND_STAIR_ART_URL,
      UPSTAIRS_STAIR_ART_URL,
    ]));

    setLoadState({ characterId, attempt, status: "loading", images: EMPTY_IMAGES });

    const load = (url: string): Promise<HTMLImageElement> => {
      const cached = loadedByUrlRef.current.get(url);
      if (cached) return Promise.resolve(cached);

      return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        let settled = false;
        const finish = (error?: Error) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          image.onload = null;
          image.onerror = null;
          if (error) reject(error);
          else {
            loadedByUrlRef.current.set(url, image);
            resolve(image);
          }
        };
        const cancel = () => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          image.onload = null;
          image.onerror = null;
        };
        const timer = window.setTimeout(
          () => finish(new Error(`House art timed out: ${url}`)),
          HOUSE_ART_TIMEOUT_MS,
        );
        image.onload = () => {
          if (image.naturalWidth > 0) finish();
          else finish(new Error(`House art was empty: ${url}`));
        };
        image.onerror = () => finish(new Error(`House art failed to load: ${url}`));
        cleanups.push(cancel);
        image.src = url;
        if (image.complete && image.naturalWidth > 0) finish();
      });
    };

    void Promise.all(urls.map(load)).then(() => {
      if (!active || generation !== generationRef.current) return;
      setLoadState({
        characterId,
        attempt,
        status: "ready",
        images: {
          atlas: loadedByUrlRef.current.get(ALGY_HOUSE_ATLAS) ?? null,
          avatar: loadedByUrlRef.current.get(avatarUrl) ?? null,
          hostAvatar: loadedByUrlRef.current.get(ALGY_HOUSE_AVATAR) ?? null,
          groundStairArt: loadedByUrlRef.current.get(GROUND_STAIR_ART_URL) ?? null,
          upstairsStairArt: loadedByUrlRef.current.get(UPSTAIRS_STAIR_ART_URL) ?? null,
        },
      });
    }).catch(() => {
      if (!active || generation !== generationRef.current) return;
      for (const cleanup of cleanups) cleanup();
      setLoadState({ characterId, attempt, status: "error", images: EMPTY_IMAGES });
    });

    return () => {
      active = false;
      generationRef.current += 1;
      for (const cleanup of cleanups) cleanup();
    };
  }, [attempt, characterId]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  if (loadState.characterId !== characterId || loadState.attempt !== attempt) {
    return { status: "loading", images: EMPTY_IMAGES, retry };
  }
  return { status: loadState.status, images: loadState.images, retry };
}

export default useHouseArt;
