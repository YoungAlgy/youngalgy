type IconProps = { size?: number };

function PalmTreeIcon({ size = 22 }: IconProps) {
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
      <path d="M11 22 C11 18 12 14 13 8" />
      <path d="M13 8 C9 6 5 7 4 9" />
      <path d="M13 8 C9 5 6 4 3 5" />
      <path d="M13 8 C17 5 20 4 22 5" />
      <path d="M13 8 C17 6 21 7 22 9" />
      <path d="M13 8 C13 5 14 3 15 2" />
      <circle cx="12" cy="9" r="0.55" fill="currentColor" />
      <circle cx="14" cy="10" r="0.55" fill="currentColor" />
    </svg>
  );
}

function AnchorIcon({ size = 22 }: IconProps) {
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
      <circle cx="12" cy="4" r="1.8" />
      <line x1="12" y1="5.8" x2="12" y2="20" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <path d="M4 14 C4.5 18 8 20 12 20 C16 20 19.5 18 20 14" />
      <path d="M4 14 L2.2 12.4" />
      <path d="M20 14 L21.8 12.4" />
    </svg>
  );
}

type Mode = "pirate" | "miami";

type ThemeToggleProps = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

export function ThemeToggle({ mode, onChange }: ThemeToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange("miami")}
        aria-label="Switch to Miami theme"
        aria-pressed={mode === "miami"}
        className="relative flex items-center justify-center p-1 transition-opacity"
        style={{ color: "var(--accent-secondary)", opacity: mode === "miami" ? 1 : 0.55 }}
      >
        <PalmTreeIcon />
        {mode === "miami" && (
          <span
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 block rounded-full"
            style={{ width: 4, height: 4, background: "var(--accent-primary)" }}
          />
        )}
      </button>
      <button
        type="button"
        onClick={() => onChange("pirate")}
        aria-label="Switch to Pirate theme"
        aria-pressed={mode === "pirate"}
        className="relative flex items-center justify-center p-1 transition-opacity"
        style={{ color: "var(--accent-secondary)", opacity: mode === "pirate" ? 1 : 0.55 }}
      >
        <AnchorIcon />
        {mode === "pirate" && (
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
