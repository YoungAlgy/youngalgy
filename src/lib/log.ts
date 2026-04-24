/**
 * Error logger. In dev, the full error is printed so you can debug.
 * In prod, only a stable context label hits the console (we don't leak
 * PostgREST internals) and we optionally ship the error to a Supabase
 * `client_errors` table if present — drop that table any time to disable.
 */
import { supabase } from "@/lib/supabase";

const isDev = import.meta.env.DEV;

export function logError(context: string, err?: unknown) {
  if (isDev) {
    console.error(`[error] ${context}`, err);
  } else {
    console.error(`[error] ${context}`);
  }

  // Best-effort remote sink — fire-and-forget. Failures are swallowed.
  if (!isDev) {
    try {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : err
              ? JSON.stringify(err).slice(0, 500)
              : undefined;
      void supabase
        .from("client_errors")
        .insert({
          context,
          message,
          path: typeof window !== "undefined" ? window.location.pathname : null,
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
        })
        .then(() => {
          /* ignore */
        });
    } catch {
      /* ignore */
    }
  }
}
