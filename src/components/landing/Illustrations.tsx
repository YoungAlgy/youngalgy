/**
 * Case-study signature illustrations. All four SVGs use currentColor and CSS
 * vars so they auto-recolor when the dual-theme toggle flips between Alpha
 * (dark green + gold on cream) and Money Mitch (champagne gold on obsidian).
 * No per-illustration JS swap needed — strokes and fills consume var(--accent-primary) and
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

export function AvaPlatformIllustration() {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-auto" aria-hidden="true">
      <rect x="36" y="48" width="328" height="150" rx="8" fill="none" stroke={INK_MUTED} strokeWidth={1} opacity={0.5} />
      <rect x="58" y="74" width="78" height="42" rx="4" fill="none" stroke={SECONDARY} strokeWidth={1.2} />
      <rect x="161" y="74" width="78" height="42" rx="4" fill="none" stroke={PRIMARY} strokeWidth={1.5} />
      <rect x="264" y="74" width="78" height="42" rx="4" fill="none" stroke={SECONDARY} strokeWidth={1.2} />
      <line x1="136" y1="95" x2="161" y2="95" stroke={INK_MUTED} strokeWidth={1} opacity={0.7} />
      <line x1="239" y1="95" x2="264" y2="95" stroke={INK_MUTED} strokeWidth={1} opacity={0.7} />
      <text x="97" y="99" fill={SECONDARY} fontSize="8" textAnchor="middle" style={monoStyle}>
        NPPES
      </text>
      <text x="200" y="99" fill={PRIMARY} fontSize="8" textAnchor="middle" style={monoStyle}>
        CRM
      </text>
      <text x="303" y="99" fill={SECONDARY} fontSize="8" textAnchor="middle" style={monoStyle}>
        OUTREACH
      </text>
      <rect x="80" y="142" width="240" height="28" rx="14" fill={PRIMARY} opacity={0.12} />
      <text x="200" y="160" fill={PRIMARY} fontSize="8" textAnchor="middle" style={monoStyle}>
        FLORIDA NURSES + ALLIED HEALTH
      </text>
      <text x="20" y="248" fill={SECONDARY} fontSize="8" opacity={0.6} style={monoStyle}>
        CO-FOUNDER / RECRUITING
      </text>
      <text x="345" y="248" fill={SECONDARY} fontSize="8" opacity={0.6} textAnchor="end" style={monoStyle}>
        REACT / POSTGRES
      </text>
    </svg>
  );
}

export function MascBadgeIllustration() {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-auto" aria-hidden="true">
      <circle cx="150" cy="120" r="70" fill="none" stroke={INK_MUTED} strokeWidth={1} opacity={0.45} />
      <circle cx="150" cy="120" r="52" fill="none" stroke={SECONDARY} strokeWidth={1} opacity={0.6} />
      <path d="M150 95 L150 145 M125 120 L175 120" stroke={PRIMARY} strokeWidth={4} strokeLinecap="round" />
      <line x1="205" y1="95" x2="270" y2="65" stroke={SECONDARY} strokeWidth={0.8} opacity={0.5} />
      <line x1="212" y1="120" x2="290" y2="120" stroke={SECONDARY} strokeWidth={0.8} opacity={0.5} />
      <line x1="205" y1="148" x2="270" y2="180" stroke={SECONDARY} strokeWidth={0.8} opacity={0.5} />
      <circle cx="270" cy="65" r="3" fill={SECONDARY} opacity={0.8} />
      <circle cx="290" cy="120" r="3.5" fill={SECONDARY} />
      <circle cx="270" cy="180" r="3" fill={SECONDARY} opacity={0.8} />
      <circle cx="330" cy="95" r="2.5" fill={SECONDARY} opacity={0.6} />
      <circle cx="330" cy="145" r="2.5" fill={SECONDARY} opacity={0.6} />
      <text x="20" y="248" fill={SECONDARY} fontSize="8" opacity={0.6} style={monoStyle}>
        NATIONWIDE / MD + DO
      </text>
      <text x="345" y="248" fill={SECONDARY} fontSize="8" opacity={0.6} textAnchor="end" style={monoStyle}>
        MULTI-CHANNEL OUTREACH
      </text>
    </svg>
  );
}

export function NftFrameIllustration() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto" aria-hidden="true">
      <rect x="40" y="40" width="320" height="320" fill="none" stroke={SECONDARY} strokeWidth={1.5} />
      <rect x="50" y="50" width="300" height="300" fill="none" stroke={SECONDARY} strokeWidth={0.5} opacity={0.5} />
      <defs>
        <radialGradient id="planet-shade" cx="0.32" cy="0.32" r="0.85">
          <stop offset="0%" stopColor={SECONDARY} stopOpacity={0.55} />
          <stop offset="55%" stopColor={PRIMARY} stopOpacity={1} />
          <stop offset="100%" stopColor={PRIMARY} stopOpacity={0.85} />
        </radialGradient>
      </defs>
      <g transform="translate(200 200)">
        <circle cx="0" cy="0" r="78" fill="url(#planet-shade)" />
        <ellipse cx="-25" cy="-18" rx="14" ry="6" fill={SECONDARY} opacity={0.35} />
        <ellipse cx="18" cy="8" rx="22" ry="8" fill={SECONDARY} opacity={0.25} />
        <ellipse cx="-10" cy="28" rx="18" ry="5" fill={SECONDARY} opacity={0.3} />
        <ellipse cx="0" cy="0" rx="120" ry="22" fill="none" stroke={SECONDARY} strokeWidth={2} transform="rotate(-18)" />
        <ellipse cx="0" cy="0" rx="120" ry="22" fill="none" stroke={SECONDARY} strokeWidth={0.6} opacity={0.5} transform="rotate(-18) translate(0 4)" />
        <circle cx="-150" cy="-100" r="1.5" fill={SECONDARY} opacity={0.7} />
        <circle cx="135" cy="-130" r="1" fill={SECONDARY} opacity={0.55} />
        <circle cx="-110" cy="120" r="1.2" fill={SECONDARY} opacity={0.6} />
        <circle cx="145" cy="110" r="1" fill={SECONDARY} opacity={0.55} />
        <circle cx="-160" cy="40" r="0.8" fill={SECONDARY} opacity={0.45} />
        <circle cx="160" cy="-30" r="0.8" fill={SECONDARY} opacity={0.45} />
      </g>
      <text x="60" y="310" fill={SECONDARY} fontSize="11" style={monoStyle}>
        UNIVERSE
      </text>
      <text x="60" y="328" fill={SECONDARY} fontSize="8" opacity={0.6} style={monoStyle}>
        2021 / CHARITY DROP
      </text>
      <text x="20" y="380" fill={SECONDARY} fontSize="8" opacity={0.6} style={monoStyle}>
        BAYC FOUNDING
      </text>
      <text x="380" y="380" fill={SECONDARY} fontSize="8" opacity={0.6} textAnchor="end" style={monoStyle}>
        FLOOR SEED / 2025 EXIT
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
        BIG GATES RECORDS · SIGNED AT 17
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
        FLEXIN' LIKE WOAH
      </text>
      <circle cx="130" cy="165" r="22" fill="none" stroke={SECONDARY} strokeWidth={1.5} />
      <circle cx="130" cy="165" r="5" fill={SECONDARY} />
      <circle cx="270" cy="165" r="22" fill="none" stroke={PRIMARY} strokeWidth={1.5} />
      <circle cx="270" cy="165" r="5" fill={PRIMARY} />
      <line x1="155" y1="165" x2="245" y2="165" stroke={INK_MUTED} strokeWidth={0.7} opacity={0.4} />
      <text x="20" y="230" fill={SECONDARY} fontSize="8" opacity={0.6} style={monoStyle}>
        AGENT / BOOKINGS
      </text>
    </svg>
  );
}

export function ToggleHubIllustration() {
  return (
    <svg viewBox="0 0 400 240" className="w-full h-auto" aria-hidden="true">
      <rect x="36" y="44" width="328" height="146" rx="8" fill="none" stroke={INK_MUTED} strokeWidth={1} opacity={0.5} />
      <circle cx="200" cy="117" r="31" fill="none" stroke={PRIMARY} strokeWidth={2} />
      <text x="200" y="121" fill={PRIMARY} fontSize="9" textAnchor="middle" style={monoStyle}>
        TOGGLE
      </text>
      <line x1="169" y1="105" x2="105" y2="78" stroke={SECONDARY} strokeWidth={1} opacity={0.7} />
      <line x1="169" y1="132" x2="105" y2="157" stroke={SECONDARY} strokeWidth={1} opacity={0.7} />
      <line x1="231" y1="105" x2="295" y2="78" stroke={SECONDARY} strokeWidth={1} opacity={0.7} />
      <line x1="231" y1="132" x2="295" y2="157" stroke={SECONDARY} strokeWidth={1} opacity={0.7} />
      <text x="90" y="74" fill={SECONDARY} fontSize="8" textAnchor="middle" style={monoStyle}>SPORTS</text>
      <text x="90" y="163" fill={SECONDARY} fontSize="8" textAnchor="middle" style={monoStyle}>CASINO</text>
      <text x="310" y="74" fill={SECONDARY} fontSize="8" textAnchor="middle" style={monoStyle}>DOWNS</text>
      <text x="310" y="163" fill={SECONDARY} fontSize="8" textAnchor="middle" style={monoStyle}>FISHING</text>
      <text x="20" y="232" fill={SECONDARY} fontSize="8" opacity={0.6} style={monoStyle}>
        RESEARCH / TOOLS
      </text>
      <text x="380" y="232" fill={SECONDARY} fontSize="8" opacity={0.6} textAnchor="end" style={monoStyle}>
        BUILT + RUN SOLO
      </text>
    </svg>
  );
}
