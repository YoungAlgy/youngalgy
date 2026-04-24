import { cn } from "@/lib/utils";

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

// Big hero-tile monogram — used only in the landing hero, sits to the
// left of the wordmark. Pink gradient fill + chunky white AH inside.
function HeroTile({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-square w-[clamp(7rem,14vw,10.5rem)] shrink-0",
        "rounded-[1.25rem] overflow-hidden",
        "shadow-[0_16px_60px_-12px_hsl(328_90%_62%/0.55)]",
        "ring-1 ring-primary/40",
        className,
      )}
      aria-hidden
    >
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
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full p-[14%]"
        fill="none"
      >
        {/* Chunky A */}
        <path
          d="M10 90 L30 10 L42 10 L62 90 L52 90 L46 72 L26 72 L20 90 Z M30 60 L42 60 L36 38 Z"
          fill="hsl(0 0% 100%)"
        />
        {/* Chunky H */}
        <path
          d="M66 10 L76 10 L76 44 L88 44 L88 10 L98 10 L98 90 L88 90 L88 54 L76 54 L76 90 L66 90 Z"
          fill="hsl(0 0% 100%)"
        />
      </svg>
      {/* Bottom-right accent dot */}
      <span className="absolute bottom-3 right-3 h-2.5 w-2.5 rounded-full bg-[hsl(195_95%_60%)] shadow-[0_0_12px_hsl(195_95%_60%)]" />
    </div>
  );
}

// Geometric AH monogram — two overlapping bars with a negative-space cut.
// Designed as a single SVG so it scales crisply at any size, and inherits
// `currentColor` for the theme accent.
export function Logo({ variant = "full", size = "md", className }: LogoProps) {
  const s = sizeMap[size];
  const markSize = s.mark;

  const mark = (
    <svg
      width={markSize}
      height={markSize}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden="true"
    >
      {/* Outer rounded square — signature pink */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="10"
        fill="hsl(var(--primary))"
      />
      {/* A: left diagonal */}
      <path
        d="M11 36 L19 12 L23 12 L31 36 L27 36 L25 30 L17 30 L15 36 Z M19 26 L23 26 L21 18 Z"
        fill="hsl(var(--primary-foreground))"
      />
      {/* H: right side */}
      <path
        d="M32 12 L36 12 L36 22 L42 22 L42 12 L46 12"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="3.5"
        strokeLinecap="square"
        fill="none"
      />
      {/* Accent dot — subtle cyan mark in lower-right corner */}
      <circle cx="41" cy="40" r="2.5" fill="hsl(195 95% 60%)" />
    </svg>
  );

  if (variant === "tile") {
    return <HeroTile className={className} />;
  }

  if (variant === "mark") {
    return <div className={cn("inline-flex items-center", className)}>{mark}</div>;
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
      {mark}
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
