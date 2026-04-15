import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://oydhnnqgbcsxvdttkncm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95ZGhubnFnYmNzeHZkdHRrbmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODQ2NjEsImV4cCI6MjA5MDQ2MDY2MX0.IexptgQVGv393rDeawkUvc1bk2516J8HO5LHZcbzgzw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
