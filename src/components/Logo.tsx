import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "mark" | "wordmark" | "full";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: { mark: 20, text: "text-base" },
  md: { mark: 28, text: "text-lg" },
  lg: { mark: 36, text: "text-xl" },
  xl: { mark: 48, text: "text-2xl" },
};

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
