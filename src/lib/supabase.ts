import { createClient } from "@supabase/supabase-js";

// Reads from Vite env first (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) so
// key rotations don't require a code push. Falls back to the new-format
// publishable key for the shared Toggle/Young Algy project — this fallback
// kicks in if the env vars aren't set at build time.
//
// 2026-04-24: Supabase disabled legacy JWT anon keys project-wide; the old
// hardcoded JWT (eyJ...IexptgQVGv393r...) that lived here no longer works.
// Swapped to the new sb_publishable_ key.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://oydhnnqgbcsxvdttkncm.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_24yHvYm2UU5zIHM31Suh4g_sqP6oOa6";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
