/**
 * Case-study signature illustrations. All four SVGs use currentColor and CSS
 * vars so they auto-recolor when the dual-theme toggle flips between Pirate
 * (wine + gold) and Miami (magenta + cyan). No per-illustration JS swap
 * needed — strokes and fills consume var(--accent-primary) and
 * var(--accent-secondary).
 *
 * All SVGs use preserveAspectRatio so text positions are safely inside the
 * viewBox at any container width.
 */

const SECONDARY = "var(--accent-secondary)";
const PRIMARY = "var(--accent-primary)";
const INK_MUTED = "var(--ink-muted)";

const monoStyle = {
  fontFamily: "var(--font-mono)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.18em",
};

export function AvaMapIllustration() {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-auto" aria-hidden="true">
      <path
        d="M40 110 C50 80 80 70 110 75 L140 65 L180 70 L220 75 L260 80 L290 85 L320 95 L335 115 L325 140 L300 155 L270 160 L230 165 L195 168 L170 185 L155 205 L160 220 L170 205 L185 188 L165 175 L140 165 L110 155 L80 148 L55 135 Z"
        fill="none"
        stroke={INK_MUTED}
        strokeWidth={1}
        opacity={0.45}
      />
      <circle cx="90" cy="110" r="2.5" fill={SECONDARY} opacity={0.7} />
      <circle cx="120" cy="130" r="3.5" fill={SECONDARY} opacity={0.8} />
      <circle cx="150" cy="110" r="2.5" fill={SECONDARY} opacity={0.7} />
      <circle cx="185" cy="120" r="3" fill={SECONDARY} opacity={0.75} />
      <circle cx="220" cy="115" r="4" fill={SECONDARY} />
      <circle cx="255" cy="125" r="2.5" fill={SECONDARY} opacity={0.7} />
      <circle cx="280" cy="110" r="3" fill={SECONDARY} opacity={0.8} />
      <circle cx="170" cy="190" r="5" fill={PRIMARY} />
      <text x="180" y="194" fill={PRIMARY} fontSize="9" style={monoStyle}>
        TAMPA
      </text>
      <text x="20" y="22" fill={SECONDARY} fontSize="9" style={monoStyle}>
        FIG. 01
      </text>
      <text x="345" y="22" fill={SECONDARY} fontSize="9" textAnchor="end" style={monoStyle}>
        ACTIVE
      </text>
      <text x="20" y="248" fill={SECONDARY} fontSize="8" opacity={0.6} style={monoStyle}>
        850K / 50 STATES
      </text>
      <text x="345" y="248" fill={SECONDARY} fontSize="8" opacity={0.6} textAnchor="end" style={monoStyle}>
        NODE / PG / SUPABASE
      </text>
    </svg>
  );
}

export function NftFrameIllustration() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto" aria-hidden="true">
      <rect x="40" y="40" width="320" height="320" fill="none" stroke={SECONDARY} strokeWidth={1.5} />
      <rect x="50" y="50" width="300" height="300" fill="none" stroke={SECONDARY} strokeWidth={0.5} opacity={0.5} />
      <g transform="translate(200 215)">
        <ellipse cx="0" cy="0" rx="60" ry="55" fill={PRIMARY} />
        <circle cx="-20" cy="-12" r="3.8" fill={SECONDARY} />
        <circle cx="20" cy="-12" r="3.8" fill={SECONDARY} />
        <path d="M -60 -28 Q -82 -50 -92 -72" stroke={PRIMARY} strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M 60 -28 Q 82 -50 92 -72" stroke={PRIMARY} strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M -45 40 Q -60 60 -65 75" stroke={PRIMARY} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M 0 40 Q 0 65 0 80" stroke={PRIMARY} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M 45 40 Q 60 60 65 75" stroke={PRIMARY} strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
      <text x="60" y="310" fill={SECONDARY} fontSize="10" style={monoStyle}>
        LOBBY LOBSTERS / 8888
      </text>
      <text x="60" y="328" fill={SECONDARY} fontSize="8" opacity={0.6} style={monoStyle}>
        2021 / ETH / CHARITY DROP
      </text>
      <text x="20" y="22" fill={SECONDARY} fontSize="9" style={monoStyle}>
        FIG. 02
      </text>
      <text x="380" y="22" fill={PRIMARY} fontSize="9" textAnchor="end" style={monoStyle}>
        $4.4M RAISED
      </text>
      <text x="20" y="380" fill={SECONDARY} fontSize="8" opacity={0.6} style={monoStyle}>
        BAYC FOUNDING
      </text>
      <text x="380" y="380" fill={SECONDARY} fontSize="8" opacity={0.6} textAnchor="end" style={monoStyle}>
        OPENSEA SEED
      </text>
    </svg>
  );
}

export function CassetteIllustration() {
  return (
    <svg viewBox="0 0 400 240" className="w-full h-auto" aria-hidden="true">
      <rect x="40" y="50" width="320" height="150" fill="none" stroke={PRIMARY} strokeWidth={2} rx="4" />
      <rect x="50" y="60" width="300" height="44" fill="none" stroke={PRIMARY} strokeWidth={0.7} opacity={0.4} />
      <text x="60" y="80" fill={SECONDARY} fontSize="10" style={monoStyle}>
        BIG GATES RECORDS · 2015
      </text>
      <text
        x="60"
        y="100"
        fill="var(--ink)"
        fontSize="20"
        style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
      >
        MONEY MITCH
      </text>
      <text x="60" y="130" fill={SECONDARY} fontSize="9" opacity={0.7} style={monoStyle}>
        A1 / FLEXIN' LIKE WOAH
      </text>
      <circle cx="130" cy="165" r="22" fill="none" stroke={SECONDARY} strokeWidth={1.5} />
      <circle cx="130" cy="165" r="5" fill={SECONDARY} />
      <circle cx="270" cy="165" r="22" fill="none" stroke={PRIMARY} strokeWidth={1.5} />
      <circle cx="270" cy="165" r="5" fill={PRIMARY} />
      <line x1="155" y1="165" x2="245" y2="165" stroke={INK_MUTED} strokeWidth={0.7} opacity={0.4} />
      <text x="20" y="22" fill={SECONDARY} fontSize="9" style={monoStyle}>
        FIG. 03
      </text>
      <text x="380" y="22" fill={SECONDARY} fontSize="9" textAnchor="end" style={monoStyle}>
        SIDE A
      </text>
      <text x="20" y="230" fill={SECONDARY} fontSize="8" opacity={0.6} style={monoStyle}>
        AGENT / ROAD MGR / ROLLOUTS
      </text>
    </svg>
  );
}

export function QuantChartIllustration() {
  return (
    <svg viewBox="0 0 400 240" className="w-full h-auto" aria-hidden="true">
      <line x1="40" y1="195" x2="360" y2="195" stroke={INK_MUTED} strokeWidth={0.5} opacity={0.3} />
      <line x1="40" y1="155" x2="360" y2="155" stroke={INK_MUTED} strokeWidth={0.5} opacity={0.15} />
      <line x1="40" y1="115" x2="360" y2="115" stroke={INK_MUTED} strokeWidth={0.5} opacity={0.15} />
      <line x1="40" y1="75" x2="360" y2="75" stroke={INK_MUTED} strokeWidth={0.5} opacity={0.15} />
      <path
        d="M 40 175 L 75 165 L 105 180 L 135 155 L 170 170 L 205 140 L 240 150 L 275 122 L 305 105 L 335 85"
        fill="none"
        stroke={PRIMARY}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="landing-quant-chart-line"
      />
      <line x1="125" y1="55" x2="125" y2="195" stroke={SECONDARY} strokeWidth={0.7} strokeDasharray="3 3" opacity={0.5} />
      <text x="100" y="50" fill={SECONDARY} fontSize="8" style={monoStyle}>
        HMM
      </text>
      <line x1="225" y1="55" x2="225" y2="195" stroke={SECONDARY} strokeWidth={0.7} strokeDasharray="3 3" opacity={0.5} />
      <text x="205" y="50" fill={SECONDARY} fontSize="8" style={monoStyle}>
        REGIME
      </text>
      <circle cx="335" cy="85" r="4" fill={PRIMARY} />
      <text x="328" y="78" fill={PRIMARY} fontSize="9" textAnchor="end" style={monoStyle}>
        +18.4%
      </text>
      <text x="40" y="215" fill={INK_MUTED} fontSize="8" opacity={0.5} style={monoStyle}>
        09:30
      </text>
      <text x="355" y="215" fill={INK_MUTED} fontSize="8" opacity={0.5} textAnchor="end" style={monoStyle}>
        16:00
      </text>
      <text x="20" y="22" fill={SECONDARY} fontSize="9" style={monoStyle}>
        FIG. 04
      </text>
      <text x="380" y="22" fill={PRIMARY} fontSize="9" textAnchor="end" style={monoStyle}>
        LIVE CAPITAL
      </text>
      <text x="20" y="232" fill={SECONDARY} fontSize="8" opacity={0.6} style={monoStyle}>
        ALPACA + KALSHI
      </text>
    </svg>
  );
}
