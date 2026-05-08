import { cn } from "@/lib/utils";

/**
 * Horizontal auto-scrolling marquee of skill chips.
 *
 * Doubles the items array so the CSS keyframe animation can loop without
 * a visible jump. Direction + speed are configurable per row (Sales row
 * scrolls left at 40s; Tech row scrolls right at 45s in current usage).
 *
 * Extracted from Landing.tsx during the 2026-04-29 cleanup.
 */
interface SkillsMarqueeProps {
  items: readonly string[];
  direction?: "left" | "right";
  speed?: number;
}

export function SkillsMarquee({
  items,
  direction = "left",
  speed = 35,
}: SkillsMarqueeProps) {
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden mask-edges py-2">
      <div
        className={cn(
          "flex gap-3 whitespace-nowrap w-max",
          direction === "left" ? "animate-marquee" : "animate-marquee-reverse",
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {loop.map((s, i) => (
          <span
            key={`${s}-${i}`}
            className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/30 shrink-0"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
