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

/**
 * The canonical Toggle switch (Concept A, the shared Toggle brand mark): a pill
 * track with a knob that flips between the two themes. The switch is literally
 * the Toggle logo, so adopting it here ties youngalgy.com into the Toggle family
 * without overriding the Alexander Holmes identity. Flipping it swaps the active
 * theme (alpha <-> moneymitch). The knob carries the active theme's icon + accent;
 * the far end faintly previews the theme you'd switch to.
 */
export function ThemeToggle({ mode, onChange }: ThemeToggleProps) {
  const isMM = mode === "moneymitch";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isMM}
      aria-label={`Theme: ${isMM ? "Money Mitch" : "Alpha"}. Tap to switch to ${isMM ? "Alpha" : "Money Mitch"}.`}
      onClick={() => onChange(isMM ? "alpha" : "moneymitch")}
      className="relative inline-flex items-center shrink-0"
      style={{
        width: 64,
        height: 32,
        padding: 0,
        border: 0,
        borderRadius: 999,
        cursor: "pointer",
        background: "var(--accent-soft, color-mix(in srgb, var(--accent-secondary) 16%, transparent))",
        boxShadow: "inset 0 0 0 1px var(--rule, rgba(127,127,127,0.28))",
        transition: "background 180ms cubic-bezier(.2,.7,.2,1)",
      }}
    >
      <span
        aria-hidden="true"
        className="absolute flex items-center justify-center"
        style={{ left: 9, top: 0, bottom: 0, color: "var(--accent-secondary)", opacity: isMM ? 0.5 : 0, transition: "opacity 180ms" }}
      >
        <AlphaMark size={15} />
      </span>
      <span
        aria-hidden="true"
        className="absolute flex items-center justify-center"
        style={{ right: 9, top: 0, bottom: 0, color: "var(--accent-secondary)", opacity: isMM ? 0 : 0.5, transition: "opacity 180ms" }}
      >
        <DiamondIcon size={15} />
      </span>
      <span
        className="absolute flex items-center justify-center rounded-full"
        style={{
          top: 4,
          left: isMM ? 36 : 4,
          width: 24,
          height: 24,
          background: "var(--accent-primary)",
          color: "var(--accent-ink, #ffffff)",
          transition: "left 180ms cubic-bezier(.2,.7,.2,1)",
        }}
      >
        {isMM ? <DiamondIcon size={14} /> : <AlphaMark size={15} />}
      </span>
    </button>
  );
}

export type { Mode };
