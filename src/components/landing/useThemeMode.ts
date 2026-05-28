import { useEffect, useState } from "react";
import type { Mode } from "./ThemeToggle";

/**
 * Shared Miami/Pirate theme hook.
 *
 * Reads the persisted choice from localStorage ("landing-mode"), defaults to
 * "pirate", and reflects it onto <html data-mode> so the index.css theme vars
 * (--ink, --accent-primary, etc.) resolve. Persists on change. Used by the
 * landing page and the public legal pages so the theme choice carries across
 * them. Removes the attribute on unmount so a non-themed route doesn't inherit
 * stale vars.
 */
const STORAGE_KEY = "landing-mode";

export function useThemeMode(): [Mode, (m: Mode) => void] {
  const [mode, setMode] = useState<Mode>("pirate");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    const next: Mode = saved === "miami" || saved === "pirate" ? saved : "pirate";
    setMode(next);
    document.documentElement.setAttribute("data-mode", next);
    return () => {
      document.documentElement.removeAttribute("data-mode");
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", mode);
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore quota / private-mode errors — preference just won't persist
    }
  }, [mode]);

  return [mode, setMode];
}
