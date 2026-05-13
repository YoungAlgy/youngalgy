import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// Default to dark mode on first visit (no system preference fallback).
function initialDark(): boolean {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem("theme");
  if (saved === "dark") return true;
  if (saved === "light") return false;
  return true; // first visit → dark
}

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
    const v = initialDark();
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", v);
    }
    return v;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setDark(!dark)}
      className="rounded-full"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
    </Button>
  );
}
