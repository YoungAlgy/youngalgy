type IconProps = { size?: number };

/**
 * The Alpha mark: a lowercase Greek alpha set in the display serif. It nods to
 * the Alpha brand (the house style) without redrawing the real alpha logo.
 */
function AlphaMark({ size = 22 }: IconProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        fontFamily: '"Source Serif 4", Georgia, serif',
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        display: "inline-block",
      }}
    >
      α
    </span>
  );
}

/** A faceted diamond for the Money Mitch theme. */
function DiamondIcon({ size = 22 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3h12l4 6-10 13L2 9Z" />
      <path d="M11 3 8 9l4 13 4-13-3-6" />
      <path d="M2 9h20" />
    </svg>
  );
}

type Mode = "alpha" | "moneymitch";

type ThemeToggleProps = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

export function ThemeToggle({ mode, onChange }: ThemeToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange("alpha")}
        aria-label="Switch to Alpha theme"
        aria-pressed={mode === "alpha"}
        className="relative flex items-center justify-center p-1 transition-opacity"
        style={{ color: "var(--accent-secondary)", opacity: mode === "alpha" ? 1 : 0.55 }}
      >
        <AlphaMark />
        {mode === "alpha" && (
          <span
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 block rounded-full"
            style={{ width: 4, height: 4, background: "var(--accent-primary)" }}
          />
        )}
      </button>
      <button
        type="button"
        onClick={() => onChange("moneymitch")}
        aria-label="Switch to Money Mitch theme"
        aria-pressed={mode === "moneymitch"}
        className="relative flex items-center justify-center p-1 transition-opacity"
        style={{ color: "var(--accent-secondary)", opacity: mode === "moneymitch" ? 1 : 0.55 }}
      >
        <DiamondIcon />
        {mode === "moneymitch" && (
          <span
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 block rounded-full"
            style={{ width: 4, height: 4, background: "var(--accent-primary)" }}
          />
        )}
      </button>
    </div>
  );
}

export type { Mode };
