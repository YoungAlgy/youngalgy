import { cn } from "@/lib/utils";

/**
 * Hand-drawn psychedelic skull crest — Day-of-the-Dead × Grateful-Dead ×
 * Tampa hip-hop. Sugar skull with green eye sockets, rose crown, lightning
 * bolt down the brow, and butterfly wings flanking on either side. All
 * vector so it stays crisp at any size; saturated fills + heavy outlines
 * to feel hand-drawn instead of corporate-vector.
 *
 * Rendered directly in Landing.tsx as the hero centerpiece.
 */
export function SkullCrest({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 540"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
      aria-label="Alexander's psychedelic sugar-skull crest"
      role="img"
    >
      <defs>
        <radialGradient id="sc-glow" cx="50%" cy="48%" r="55%">
          <stop offset="0%" stopColor="hsl(328 95% 60%)" stopOpacity="0.55" />
          <stop offset="55%" stopColor="hsl(280 70% 28%)" stopOpacity="0.30" />
          <stop offset="100%" stopColor="hsl(272 60% 8%)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wing-l" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB400" />
          <stop offset="40%" stopColor="#EE2B8B" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        <linearGradient id="wing-r" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFB400" />
          <stop offset="40%" stopColor="#EE2B8B" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        <linearGradient id="bolt" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFD400" />
          <stop offset="100%" stopColor="#FF7A00" />
        </linearGradient>
      </defs>

      {/* Aurora glow */}
      <circle cx="240" cy="280" r="230" fill="url(#sc-glow)" />

      {/* Butterfly wing — left */}
      <g
        stroke="#0a0612"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path
          d="M150 200
             Q60 140, 30 240
             Q15 320, 80 380
             Q140 410, 175 365
             Q200 320, 195 270
             Q188 225, 150 200 Z"
          fill="url(#wing-l)"
        />
        {/* Wing eye / accent */}
        <ellipse cx="100" cy="290" rx="28" ry="38" fill="#22D3EE" />
        <ellipse cx="100" cy="290" rx="14" ry="22" fill="#0a0612" />
        <ellipse cx="103" cy="282" rx="5" ry="8" fill="#fff" />
        {/* Wing veins */}
        <path d="M120 260 Q90 280 65 320" fill="none" />
        <path d="M140 230 Q110 250 70 270" fill="none" />
        <path d="M150 340 Q120 350 95 370" fill="none" />
      </g>

      {/* Butterfly wing — right (mirror) */}
      <g
        stroke="#0a0612"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path
          d="M330 200
             Q420 140, 450 240
             Q465 320, 400 380
             Q340 410, 305 365
             Q280 320, 285 270
             Q292 225, 330 200 Z"
          fill="url(#wing-r)"
        />
        <ellipse cx="380" cy="290" rx="28" ry="38" fill="#22D3EE" />
        <ellipse cx="380" cy="290" rx="14" ry="22" fill="#0a0612" />
        <ellipse cx="383" cy="282" rx="5" ry="8" fill="#fff" />
        <path d="M360 260 Q390 280 415 320" fill="none" />
        <path d="M340 230 Q370 250 410 270" fill="none" />
        <path d="M330 340 Q360 350 385 370" fill="none" />
      </g>

      {/* Rose crown — three roses across the top of the skull */}
      <g stroke="#0a0612" strokeWidth="3.5" strokeLinejoin="round">
        {/* Center rose */}
        <g transform="translate(240 175)">
          <circle r="32" fill="#EE2B8B" />
          <circle r="22" fill="#FF4D9E" />
          <circle r="13" fill="#FF7A00" />
          <circle r="6" fill="#FFD400" />
        </g>
        {/* Left rose */}
        <g transform="translate(180 195)">
          <circle r="26" fill="#C9148F" />
          <circle r="17" fill="#EE2B8B" />
          <circle r="9" fill="#FF7A00" />
        </g>
        {/* Right rose */}
        <g transform="translate(300 195)">
          <circle r="26" fill="#C9148F" />
          <circle r="17" fill="#EE2B8B" />
          <circle r="9" fill="#FF7A00" />
        </g>
        {/* Leaves */}
        <path d="M148 200 Q130 215 140 240 Q155 230 160 210 Z" fill="#5BD800" />
        <path d="M332 200 Q350 215 340 240 Q325 230 320 210 Z" fill="#5BD800" />
        <path d="M222 145 Q210 160 215 175 Q230 168 232 152 Z" fill="#5BD800" />
        <path d="M258 145 Q270 160 265 175 Q250 168 248 152 Z" fill="#5BD800" />
      </g>

      {/* Skull — cream-white sugar skull with heavy outlines */}
      <g stroke="#0a0612" strokeWidth="4.5" strokeLinejoin="round">
        {/* Skull cranium + jaw */}
        <path
          d="M150 230
             Q150 175, 200 165
             Q240 158, 280 165
             Q330 175, 330 230
             L330 320
             Q330 360, 305 380
             L305 410
             Q305 432, 285 432
             L195 432
             Q175 432, 175 410
             L175 380
             Q150 360, 150 320 Z"
          fill="#FFF6E0"
        />

        {/* Eye socket — left (green psychedelic) */}
        <g>
          <ellipse cx="200" cy="265" rx="32" ry="36" fill="#5BD800" />
          {/* Yin-yang dot in iris */}
          <circle cx="200" cy="265" r="14" fill="#0a0612" />
          <circle cx="200" cy="259" r="5" fill="#FFD400" />
          <circle cx="200" cy="271" r="3" fill="#FFF6E0" />
          {/* Hot pink sparks under socket */}
          <path d="M178 295 L185 305 M193 297 L196 312 M210 297 L214 312 M223 295 L218 308"
            stroke="#EE2B8B" strokeWidth="3.5" fill="none" />
        </g>

        {/* Eye socket — right */}
        <g>
          <ellipse cx="280" cy="265" rx="32" ry="36" fill="#5BD800" />
          <circle cx="280" cy="265" r="14" fill="#0a0612" />
          <circle cx="280" cy="259" r="5" fill="#FFD400" />
          <circle cx="280" cy="271" r="3" fill="#FFF6E0" />
          <path d="M258 295 L262 308 M270 297 L268 312 M285 297 L289 312 M298 295 L295 308"
            stroke="#EE2B8B" strokeWidth="3.5" fill="none" />
        </g>

        {/* Lightning bolt down the brow — Steal-Your-Face cue */}
        <path
          d="M236 240 L252 240 L242 282 L260 282 L228 340 L240 296 L222 296 Z"
          fill="url(#bolt)"
          stroke="#0a0612"
          strokeWidth="3.5"
        />

        {/* Nasal cavity — purple inverted heart */}
        <path
          d="M232 360
             Q232 350, 240 348
             Q248 350, 248 360
             L240 376 Z"
          fill="#7B2CFF"
        />

        {/* Teeth — square sugar-skull teeth */}
        <g fill="#FFF6E0">
          <rect x="195" y="392" width="14" height="22" rx="2" />
          <rect x="213" y="392" width="14" height="22" rx="2" />
          <rect x="231" y="392" width="14" height="22" rx="2" />
          <rect x="249" y="392" width="14" height="22" rx="2" />
          <rect x="267" y="392" width="14" height="22" rx="2" />
          {/* One gold tooth */}
          <rect x="240" y="392" width="14" height="22" rx="2" fill="#FFD400" />
        </g>
      </g>

      {/* Sparkles around the skull */}
      <g fill="#FFD400" stroke="#0a0612" strokeWidth="2">
        <path d="M120 170 l5 -12 l5 12 l12 5 l-12 5 l-5 12 l-5 -12 l-12 -5 z" />
        <path d="M360 170 l5 -12 l5 12 l12 5 l-12 5 l-5 12 l-5 -12 l-12 -5 z" />
        <path d="M240 100 l4 -10 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 z" />
        <path d="M90 440 l4 -10 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 z" />
        <path d="M390 440 l4 -10 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 z" />
      </g>
    </svg>
  );
}

/**
 * Compact skull-face mark for the favicon and small-logo contexts.
 * Same DNA as SkullCrest but stripped to just the recognizable skull
 * silhouette so it reads at 16px.
 */
export function SkullMark({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {/* Pink square chip */}
      <rect x="2" y="2" width="44" height="44" rx="10" fill="hsl(var(--primary))" />
      {/* Skull silhouette */}
      <g stroke="#0a0612" strokeWidth="1.6" strokeLinejoin="round">
        <path
          d="M14 18
             Q14 12, 19 11
             Q24 10, 29 11
             Q34 12, 34 18
             L34 26
             Q34 30, 31 32
             L31 35
             Q31 37, 29 37
             L19 37
             Q17 37, 17 35
             L17 32
             Q14 30, 14 26 Z"
          fill="#FFF6E0"
        />
        <ellipse cx="20" cy="22" rx="3.5" ry="4" fill="#5BD800" />
        <ellipse cx="28" cy="22" rx="3.5" ry="4" fill="#5BD800" />
        {/* Lightning bolt */}
        <path
          d="M23 21 L26 21 L24.5 25 L27 25 L22 31 L23.5 27 L21 27 Z"
          fill="#FFD400"
          strokeWidth="0.9"
        />
        {/* Teeth */}
        <line x1="20" y1="33" x2="20" y2="36.5" />
        <line x1="22.5" y1="33" x2="22.5" y2="36.5" />
        <line x1="25.5" y1="33" x2="25.5" y2="36.5" />
        <line x1="28" y1="33" x2="28" y2="36.5" />
      </g>
    </svg>
  );
}
