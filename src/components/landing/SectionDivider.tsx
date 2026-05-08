/**
 * Decorative SVG divider used between Landing-page sections.
 * Pure SVG, no props, no state — placed in its own file per the
 * 2026-04-29 cleanup plan to keep Landing.tsx focused on layout.
 */
export function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2" aria-hidden>
      <svg viewBox="0 0 80 8" className="w-20 h-2 text-primary/40">
        <path
          d="M0,4 Q10,0 20,4 T40,4 T60,4 T80,4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary/70">
        <path
          d="M13 2L4.09 12.97L11 13L10 22L18.91 10.03L12 10L13 2Z"
          fill="currentColor"
        />
      </svg>
      <svg viewBox="0 0 80 8" className="w-20 h-2 text-primary/40">
        <path
          d="M0,4 Q10,8 20,4 T40,4 T60,4 T80,4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
