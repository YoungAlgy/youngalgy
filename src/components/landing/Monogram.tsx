type MonogramProps = {
  size?: number;
  className?: string;
};

/**
 * Alexander Holmes monogram: "AH" set in the active theme's display serif with
 * the brand gold period dot. Replaces the old sailboat mark (the boat is freed
 * up to become the Toggle logo). Inherits the theme via CSS vars, so it reads
 * green-on-cream in Alpha and champagne-on-obsidian in Money Mitch.
 */
export function Monogram({ size = 26, className }: MonogramProps) {
  return (
    <span
      className={className}
      aria-hidden="true"
      style={{
        fontFamily: 'var(--font-display, "Source Serif 4", Georgia, serif)',
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.02em",
        color: "var(--ink)",
        display: "inline-block",
      }}
    >
      AH<span style={{ color: "var(--period-color, #C9A961)" }}>.</span>
    </span>
  );
}
