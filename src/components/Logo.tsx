import { cn } from "@/lib/utils";
import { SkullMark } from "@/components/SkullCrest";

interface LogoProps {
  variant?: "mark" | "wordmark" | "full" | "tile";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: { mark: 20, text: "text-base" },
  md: { mark: 28, text: "text-lg" },
  lg: { mark: 36, text: "text-xl" },
  xl: { mark: 48, text: "text-2xl" },
};

/**
 * Unified AH glyph drawn as a single SVG.
 *
 * The A and H share a horizontal crossbar at the same height, and the A's
 * right diagonal runs into the H's left vertical so the two letters read
 * as one geometric shape, not two stacked monograms. The empty space
 * between A's diagonals is cut out with `fill-rule="evenodd"`. A solid
 * pink underbar at the bottom of the tile replaces the floaty cyan dot
 * the previous version used — feels more like a stamp, less like a chip.
 */
function MonogramGlyph({
  fg,
  accent,
}: {
  /** color of the AH letters (e.g. `currentColor` or `hsl(0 0% 100%)`) */
  fg: string;
  /** color of the accent underbar */
  accent: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" fill="none">
      <g transform="translate(8 8)">
        {/* A — solid filled triangle silhouette with cut-out counter,
            using fill-rule=evenodd so the inner triangle is a hole. */}
        <path
          d="M0 80 L20 0 L36 0 L48 48 L34 48 L32 40 L18 40 L14 48 L0 48 Z M22 28 L30 28 L26 12 Z"
          fill={fg}
          fillRule="evenodd"
        />
        {/* Shared horizontal crossbar — the structural element that ties A & H */}
        <rect x="14" y="36" width="56" height="6" fill={fg} />
        {/* H — left vertical (overlaps the A's right edge for visual continuity) */}
        <rect x="48" y="0" width="10" height="80" fill={fg} />
        {/* H — right vertical */}
        <rect x="74" y="0" width="10" height="80" fill={fg} />
      </g>
      {/* Accent underbar — pink stripe near the bottom of the tile.
          Replaces the cyan dot; reads as a brand "stamp" cue. */}
      <rect x="14" y="91" width="44" height="4" rx="1" fill={accent} />
    </svg>
  );
}

/**
 * Big hero-tile monogram — used only on the landing hero. Pink gradient
 * fill, white AH glyph inside, sticker-style corner-cut + slight tilt.
 */
function HeroTile({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "group relative aspect-square w-[clamp(7rem,14vw,10.5rem)] shrink-0",
        "rounded-[1.25rem] overflow-hidden",
        "shadow-[0_16px_60px_-12px_hsl(328_90%_62%/0.55)]",
        "ring-1 ring-primary/40",
        // Subtle resting tilt — feels like a stamp/sticker
        "rotate-[-1.5deg]",
        // Hover: rotate further & scale up; sheen sweep below
        "transition-transform duration-500 ease-out",
        "hover:-rotate-[3.5deg] hover:scale-[1.04]",
        "motion-reduce:rotate-0 motion-reduce:hover:rotate-0 motion-reduce:hover:scale-100",
        className,
      )}
      aria-hidden
    >
      {/* Pink radial gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(140% 120% at 20% 15%, hsl(328 95% 70%) 0%, hsl(328 95% 55%) 45%, hsl(300 85% 22%) 100%)",
        }}
      />
      {/* Subtle noise / grain overlay */}
      <div
        className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(hsl(0 0% 100% / 0.4) 1px, transparent 1px)",
          backgroundSize: "6px 6px",
        }}
      />
      {/* Glossy sheen that drifts across on hover */}
      <div
        className={cn(
          "absolute -inset-y-4 -left-1/3 w-1/2 pointer-events-none",
          "bg-gradient-to-r from-transparent via-white/20 to-transparent",
          "rotate-[18deg] translate-x-[-200%] opacity-0",
          "transition-all duration-700 ease-out",
          "group-hover:translate-x-[420%] group-hover:opacity-100",
          "motion-reduce:hidden",
        )}
      />
      <MonogramGlyph fg="hsl(0 0% 100%)" accent="hsl(195 95% 65%)" />
      {/* Sticker-style corner notch (top-right) */}
      <span
        aria-hidden
        className="absolute top-0 right-0 w-5 h-5 bg-background/90 rounded-bl-xl"
      />
    </div>
  );
}

export function Logo({ variant = "full", size = "md", className }: LogoProps) {
  const s = sizeMap[size];

  if (variant === "tile") {
    return <HeroTile className={className} />;
  }

  if (variant === "mark") {
    return (
      <div className={cn("inline-flex items-center", className)}>
        <SkullMark size={s.mark} />
      </div>
    );
  }

  if (variant === "wordmark") {
    return (
      <div className={cn("inline-flex items-center", className)}>
        <span
          className={cn(
            "font-display font-black uppercase tracking-[0.02em] leading-none",
            s.text,
          )}
        >
          Algy<span className="text-primary">.</span>
        </span>
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <SkullMark size={s.mark} />
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-black uppercase tracking-[0.02em]",
            s.text,
          )}
        >
          Algernon<span className="text-primary">.</span>
        </span>
        <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mt-0.5 font-medium">
          Holmes · Tampa
        </span>
      </div>
    </div>
  );
}
