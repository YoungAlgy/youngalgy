import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { navSections } from "@/data/landing-content";

/**
 * Right-side fixed nav rail for the Landing page (visible at lg+).
 * Tracks the current viewport-anchored section via IntersectionObserver
 * and highlights the matching link.
 *
 * Extracted from Landing.tsx during the 2026-04-29 cleanup. Reads
 * navSections from src/data/landing-content.ts so the section list
 * stays the source of truth.
 */
export function SectionNav() {
  const [active, setActive] = useState<string>(navSections[0]?.id ?? "story");

  useEffect(() => {
    const ids = navSections.map((s) => s.id);
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-20 flex-col gap-3 text-xs font-semibold uppercase tracking-widest"
    >
      {navSections.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={cn(
              "group flex items-center gap-3 transition-colors duration-200 rounded-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "h-px transition-all duration-300",
                isActive
                  ? "w-10 bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
                  : "w-5 bg-muted-foreground/40 group-hover:w-7 group-hover:bg-foreground/60",
              )}
            />
            <span>{s.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
