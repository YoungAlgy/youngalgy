/**
 * Case-study signature illustrations. All four SVGs use currentColor and CSS
 * vars so they auto-recolor when the dual-theme toggle flips between Pirate
 * (wine + gold) and Miami (magenta + cyan). No per-illustration JS swap
 * needed — strokes and fills consume var(--accent-primary) and
 * var(--accent-secondary).
 */

const SECONDARY = "var(--accent-secondary)";
const PRIMARY = "var(--accent-primary)";
const INK_MUTED = "var(--ink-muted)";

export function AvaMapIllustration() {
  return (
    <svg viewBox="0 0 360 220" className="w-full h-auto" aria-hidden="true">
      <path
        d="M30 100 C40 70 70 60 100 65 L130 55 L170 60 L210 65 L250 70 L280 75 L310 85 L325 105 L315 130 L290 145 L260 150 L220 155 L185 158 L160 175 L145 195 L150 210 L160 195 L175 178 L155 165 L130 155 L100 145 L70 138 L45 125 Z"
        fill="none"
        stroke={INK_MUTED}
        strokeWidth={1}
        opacity={0.45}
      />
      <circle cx="80" cy="100" r="2.5" fill={SECONDARY} opacity={0.7} />
      <circle cx="110" cy="120" r="3.5" fill={SECONDARY} opacity={0.8} />
      <circle cx="140" cy="100" r="2.5" fill={SECONDARY} opacity={0.7} />
      <circle cx="175" cy="110" r="3" fill={SECONDARY} opacity={0.75} />
      <circle cx="210" cy="105" r="4" fill={SECONDARY} />
      <circle cx="245" cy="115" r="2.5" fill={SECONDARY} opacity={0.7} />
      <circle cx="270" cy="100" r="3" fill={SECONDARY} opacity={0.8} />
      <circle cx="160" cy="180" r="5" fill={PRIMARY} />
      <text x="155" y="170" className="landing-mono" fill={PRIMARY} fontSize="9">
        TAMPA
      </text>
      <text x="22" y="22" className="landing-mono" fill={SECONDARY} fontSize="9">
        — FIG. 01 —
      </text>
      <text x="290" y="22" className="landing-mono" fill={SECONDARY} fontSize="9">
        — ACTIVE —
      </text>
      <text x="22" y="210" className="landing-mono" fill={SECONDARY} fontSize="8" opacity={0.6}>
        850K · 50 STATES
      </text>
      <text x="245" y="210" className="landing-mono" fill={SECONDARY} fontSize="8" opacity={0.6}>
        NODE · PG · SUPABASE
      </text>
    </svg>
  );
}

export function NftFrameIllustration() {
  return (
    <svg viewBox="0 0 360 360" className="w-full h-auto" aria-hidden="true">
      <rect x="40" y="40" width="280" height="280" fill="none" stroke={SECONDARY} strokeWidth={1.5} />
      <rect x="50" y="50" width="260" height="260" fill="none" stroke={SECONDARY} strokeWidth={0.5} opacity={0.5} />
      <g transform="translate(180 200)">
        <ellipse cx="0" cy="0" rx="55" ry="50" fill={PRIMARY} />
        <circle cx="-18" cy="-10" r="3.5" fill={SECONDARY} />
        <circle cx="18" cy="-10" r="3.5" fill={SECONDARY} />
        <path d="M -55 -25 Q -75 -45 -85 -65" stroke={PRIMARY} strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M 55 -25 Q 75 -45 85 -65" stroke={PRIMARY} strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M -40 35 Q -55 55 -60 70" stroke={PRIMARY} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M 0 35 Q 0 60 0 75" stroke={PRIMARY} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M 40 35 Q 55 55 60 70" stroke={PRIMARY} strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
      <text x="60" y="285" className="landing-mono" fill={SECONDARY} fontSize="10">
        LOBBY LOBSTERS / 8888
      </text>
      <text x="60" y="300" className="landing-mono" fill={SECONDARY} fontSize="8" opacity={0.6}>
        2021 · ETH · CHARITY DROP
      </text>
      <text x="22" y="30" className="landing-mono" fill={SECONDARY} fontSize="9">
        — FIG. 02 —
      </text>
      <text x="280" y="30" className="landing-mono" fill={PRIMARY} fontSize="9">
        $4.4M RAISED
      </text>
      <text x="22" y="345" className="landing-mono" fill={SECONDARY} fontSize="8" opacity={0.6}>
        BAYC · FOUNDING COLLECTIVE
      </text>
      <text x="245" y="345" className="landing-mono" fill={SECONDARY} fontSize="8" opacity={0.6}>
        OPENSEA · SEED
      </text>
    </svg>
  );
}

export function CassetteIllustration() {
  return (
    <svg viewBox="0 0 360 220" className="w-full h-auto" aria-hidden="true">
      <rect x="40" y="40" width="280" height="140" fill="none" stroke={PRIMARY} strokeWidth={2} rx="4" />
      <rect x="50" y="50" width="260" height="40" fill="none" stroke={PRIMARY} strokeWidth={0.7} opacity={0.4} />
      <text x="60" y="68" className="landing-mono" fill={SECONDARY} fontSize="10">
        BIG GATES RECORDS · 2015
      </text>
      <text x="60" y="86" className="landing-display" fill="var(--ink)" fontSize="20" style={{ fontFamily: "var(--font-display)" }}>
        MONEY MITCH
      </text>
      <text x="60" y="118" className="landing-mono" fill={SECONDARY} fontSize="9" opacity={0.7}>
        A1 · FLEXIN' LIKE WOAH
      </text>
      <circle cx="120" cy="150" r="20" fill="none" stroke={SECONDARY} strokeWidth={1.5} />
      <circle cx="120" cy="150" r="5" fill={SECONDARY} />
      <circle cx="240" cy="150" r="20" fill="none" stroke={PRIMARY} strokeWidth={1.5} />
      <circle cx="240" cy="150" r="5" fill={PRIMARY} />
      <line x1="143" y1="150" x2="217" y2="150" stroke={INK_MUTED} strokeWidth={0.7} opacity={0.4} />
      <text x="22" y="30" className="landing-mono" fill={SECONDARY} fontSize="9">
        — FIG. 03 —
      </text>
      <text x="295" y="30" className="landing-mono" fill={SECONDARY} fontSize="9">
        — SIDE A —
      </text>
      <text x="22" y="210" className="landing-mono" fill={SECONDARY} fontSize="8" opacity={0.6}>
        AGENT · ROAD MGR · ROLLOUTS
      </text>
    </svg>
  );
}

export function QuantChartIllustration() {
  return (
    <svg viewBox="0 0 360 220" className="w-full h-auto" aria-hidden="true">
      <line x1="40" y1="180" x2="320" y2="180" stroke={INK_MUTED} strokeWidth={0.5} opacity={0.3} />
      <line x1="40" y1="140" x2="320" y2="140" stroke={INK_MUTED} strokeWidth={0.5} opacity={0.15} />
      <line x1="40" y1="100" x2="320" y2="100" stroke={INK_MUTED} strokeWidth={0.5} opacity={0.15} />
      <line x1="40" y1="60" x2="320" y2="60" stroke={INK_MUTED} strokeWidth={0.5} opacity={0.15} />
      <path
        d="M 40 160 L 70 150 L 95 165 L 120 140 L 150 155 L 180 125 L 210 135 L 240 110 L 270 95 L 295 75"
        fill="none"
        stroke={PRIMARY}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="landing-quant-chart-line"
      />
      <line x1="115" y1="55" x2="115" y2="180" stroke={SECONDARY} strokeWidth={0.7} strokeDasharray="3 3" opacity={0.5} />
      <text x="100" y="48" className="landing-mono" fill={SECONDARY} fontSize="8">
        HMM↓
      </text>
      <line x1="200" y1="55" x2="200" y2="180" stroke={SECONDARY} strokeWidth={0.7} strokeDasharray="3 3" opacity={0.5} />
      <text x="185" y="48" className="landing-mono" fill={SECONDARY} fontSize="8">
        REGIME↑
      </text>
      <circle cx="295" cy="75" r="4" fill={PRIMARY} />
      <text x="302" y="78" className="landing-mono" fill={PRIMARY} fontSize="9">
        +18.4%
      </text>
      <text x="40" y="200" className="landing-mono" fill={INK_MUTED} fontSize="8" opacity={0.5}>
        09:30
      </text>
      <text x="293" y="200" className="landing-mono" fill={INK_MUTED} fontSize="8" opacity={0.5}>
        16:00
      </text>
      <text x="22" y="30" className="landing-mono" fill={SECONDARY} fontSize="9">
        — FIG. 04 —
      </text>
      <text x="285" y="30" className="landing-mono" fill={PRIMARY} fontSize="9">
        — LIVE CAPITAL —
      </text>
      <text x="22" y="212" className="landing-mono" fill={SECONDARY} fontSize="8" opacity={0.6}>
        ALPACA + KALSHI · LIVE
      </text>
    </svg>
  );
}
