type Mode = "alpha" | "moneymitch";

type ThemeToggleProps = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

/**
 * The canonical Toggle switch — a faithful match of toggle.town/casino's
 * ToggleThemeSwitch (the shared Toggle brand gesture). One pill, the knob flips
 * the skin: Alpha (light) = knob LEFT, glyph alpha; Money Mitch (dark) = knob
 * RIGHT, glyph diamond (sides match toggle.town's ToggleThemeSwitch). Gold-gradient knob on a quiet track, with a faint gold
 * inset ring on the light side. youngalgy maps alpha->light, moneymitch->dark,
 * so the gesture reads identically to the casino while using youngalgy's own
 * gold (--accent-secondary: champagne in MM, muted gold in Alpha).
 */
export function ThemeToggle({ mode, onChange }: ThemeToggleProps) {
  const isAlpha = mode === "alpha"; // alpha = light, moneymitch = dark
  const W = 58;
  const H = 30;
  const knob = H - 8; // 22

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isAlpha}
      aria-label={isAlpha ? "Switch to the Money Mitch (dark) theme" : "Switch to the Alpha (light) theme"}
      title={isAlpha ? "Switch to dark (Money Mitch)" : "Switch to light (Alpha)"}
      onClick={() => onChange(isAlpha ? "moneymitch" : "alpha")}
      className="inline-flex shrink-0"
      style={{
        width: W,
        height: H,
        borderRadius: H,
        position: "relative",
        padding: 0,
        cursor: "pointer",
        border: "1px solid color-mix(in srgb, var(--ink) 18%, transparent)",
        background: "color-mix(in srgb, var(--ink) 7%, transparent)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 3,
          left: isAlpha ? 3 : W - knob - 3,
          width: knob,
          height: knob,
          borderRadius: "50%",
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--accent-secondary) 82%, #ffffff), var(--accent-secondary))",
          boxShadow: "0 1px 3px rgba(0,0,0,.45)",
          transition: "left .2s cubic-bezier(.3,1.4,.5,1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#1b1205",
          lineHeight: 1,
        }}
      >
        {isAlpha ? (
          <span style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 700, fontSize: knob * 0.62 }}>α</span>
        ) : (
          <span style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: knob * 0.5 }}>◆</span>
        )}
      </span>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: H,
          boxShadow: isAlpha
            ? "inset 0 0 0 1px color-mix(in srgb, var(--accent-secondary) 24%, transparent)"
            : "none",
        }}
      />
    </button>
  );
}

export type { Mode };
