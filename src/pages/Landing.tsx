import { Link } from "react-router-dom";
import { ArrowUpRight, Mail } from "lucide-react";
import { BoatLogo } from "@/components/landing/BoatLogo";
import { ThemeToggle } from "@/components/landing/ThemeToggle";
import { useThemeMode } from "@/components/landing/useThemeMode";
import {
  AvaMapIllustration,
  NftFrameIllustration,
  CassetteIllustration,
  QuantChartIllustration,
} from "@/components/landing/Illustrations";
import {
  CONTACT_EMAIL,
  TOGGLE_TOWN_URL,
  ALPHA_URL,
  ALPHA_SAMPLE_URL,
  FACEBOOK_URL,
  LINKEDIN_URL,
  GITHUB_URL,
  timeline,
  loadout,
  cases,
  type Case,
} from "@/data/landing-content";

function Illustration({ name }: { name: Case["illustration"] }) {
  if (name === "ava-map") return <AvaMapIllustration />;
  if (name === "nft-frame") return <NftFrameIllustration />;
  if (name === "cassette") return <CassetteIllustration />;
  return <QuantChartIllustration />;
}

function CaseStudy({ data, isFirst }: { data: Case; isFirst: boolean }) {
  return (
    <section
      className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 py-16 lg:py-24 ${
        isFirst ? "" : "border-t"
      }`}
      style={{ borderColor: "color-mix(in srgb, var(--ink) 10%, transparent)" }}
    >
      <div className={data.flip ? "lg:order-2" : ""}>
        <div className="landing-mono mb-4" style={{ opacity: 0.7 }}>
          {data.category} &nbsp;/&nbsp; {data.period}
        </div>
        <h2 className="landing-display text-[clamp(2rem,4.2vw,3.5rem)] mb-7 period-dot">
          {data.title.replace(/\.$/, "")}
        </h2>
        <p
          className="text-base lg:text-lg max-w-xl"
          style={{ lineHeight: 1.6, color: "var(--ink)", opacity: 0.85 }}
        >
          {data.body}
        </p>
        {data.stats.length > 0 && (
          <ul className="space-y-5 mt-9">
            {data.stats.map((stat) => (
              <li key={stat.value} className="grid grid-cols-[5rem_1fr] gap-x-5 items-baseline">
                <span
                  className="landing-display landing-stat-number text-xl lg:text-2xl"
                  style={{ color: "var(--accent-primary)" }}
                >
                  {stat.value}
                </span>
                <div className="text-sm lg:text-base">
                  <span style={{ fontWeight: 600 }}>{stat.label}.</span>{" "}
                  <span style={{ opacity: 0.75 }}>{stat.sub}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
        {data.link && (
          <a
            href={data.link.url}
            target="_blank"
            rel="noopener"
            className="landing-mono inline-flex items-center gap-2 mt-8 text-sm hover:opacity-100 transition-opacity"
            style={{ color: "var(--accent-primary)", opacity: 0.9 }}
          >
            Visit {data.link.label} &nbsp;&rarr;
          </a>
        )}
      </div>

      <div className={`flex items-center justify-center ${data.flip ? "lg:order-1" : ""}`}>
        <div className="w-full max-w-md">
          <Illustration name={data.illustration} />
        </div>
      </div>
    </section>
  );
}

const Landing = () => {
  const [mode, setMode] = useThemeMode();

  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded focus:font-semibold focus:outline-none"
        style={{ background: "var(--accent-primary)", color: "var(--ink)" }}
      >
        Skip to content
      </a>

      <header className="relative z-10">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-6 flex items-center justify-between gap-3">
          <a
            href="/"
            aria-label="Alexander Holmes — home"
            className="block shrink-0"
            style={{ color: "var(--accent-secondary)" }}
          >
            <BoatLogo />
          </a>
          <nav className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2 sm:gap-x-6 lg:gap-x-8">
            <a
              href={ALPHA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-mono inline-flex items-center gap-1"
              style={{ color: "var(--ink)", opacity: 0.85 }}
            >
              ALPHA <ArrowUpRight className="h-3 w-3" />
            </a>
            <span className="landing-mono" style={{ opacity: 0.3 }}>
              ·
            </span>
            <a
              href="/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-mono inline-flex items-center gap-1"
              style={{ color: "var(--ink)", opacity: 0.85 }}
            >
              DASHBOARD <ArrowUpRight className="h-3 w-3" />
            </a>
            <ThemeToggle mode={mode} onChange={setMode} />
          </nav>
        </div>
      </header>

      <main id="main" className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <section className="min-h-[70vh] sm:min-h-[78vh] flex items-center py-10 sm:py-12 lg:py-20">
          <div className="w-full">
            <h1
              className="landing-display text-[clamp(3rem,12vw,9.5rem)] period-dot"
              style={{ color: "var(--ink)" }}
            >
              Alexander
              <br />
              Holmes
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10">
              <a
                href={TOGGLE_TOWN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="landing-mono inline-flex items-center justify-center gap-2 px-7 py-3.5 w-full sm:w-auto"
                style={{ background: "var(--accent-primary)", color: "var(--ink)" }}
              >
                SEE THE WORK <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="#contact"
                className="landing-mono inline-flex items-center justify-center gap-2 px-7 py-3.5 w-full sm:w-auto"
                style={{
                  border: "1px solid var(--accent-secondary)",
                  color: "var(--accent-secondary)",
                }}
              >
                GET IN TOUCH <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>

        <div className="landing-divider border-t" />

        {/* alpha. — the one thing on this site you can buy right now. Prime
            real estate after the hero, conversion-focused (sample + subscribe),
            without displacing the Ava Health flagship in the case studies. */}
        <section aria-labelledby="alpha-heading" className="py-12 sm:py-16">
          <div
            className="rounded-2xl px-6 sm:px-10 py-10 sm:py-12"
            style={{
              border: "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
              background: "color-mix(in srgb, var(--accent-primary) 7%, transparent)",
            }}
          >
            <div
              className="landing-mono mb-5 inline-flex items-center gap-2"
              style={{ color: "var(--accent-secondary)" }}
            >
              <span
                className="inline-block rounded-full"
                style={{ width: 6, height: 6, background: "var(--accent-secondary)" }}
              />
              NOW LIVE · A WEEKLY LETTER
            </div>
            <h2
              id="alpha-heading"
              className="landing-display text-[clamp(2.5rem,7vw,4.5rem)] period-dot mb-5"
              style={{ color: "var(--ink)" }}
            >
              alpha
            </h2>
            <p
              className="text-base lg:text-lg max-w-xl mb-9"
              style={{ lineHeight: 1.6, color: "var(--ink)", opacity: 0.85 }}
            >
              A $5/month personal letter on the five topics you care about —
              sourced, edited, and worth your time. Every Sunday. My own
              product, built and run end to end.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href={ALPHA_URL}
                className="landing-mono inline-flex items-center justify-center gap-2 px-7 py-3.5 w-full sm:w-auto"
                style={{ background: "var(--accent-primary)", color: "var(--ink)" }}
              >
                SUBSCRIBE · $5/MO <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={ALPHA_SAMPLE_URL}
                className="landing-mono inline-flex items-center justify-center gap-2 px-7 py-3.5 w-full sm:w-auto"
                style={{
                  border: "1px solid var(--accent-secondary)",
                  color: "var(--accent-secondary)",
                }}
              >
                READ A SAMPLE <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>

        <div className="landing-divider border-t" />

        <section id="work">
          {cases.map((c, i) => (
            <CaseStudy key={c.number} data={c} isFirst={i === 0} />
          ))}
        </section>

        <div className="landing-divider border-t" />

        <section className="py-14 sm:py-20">
          <h2
            className="landing-display text-[clamp(2.25rem,6vw,4.5rem)] period-dot mb-8 sm:mb-12"
            style={{ color: "var(--ink)" }}
          >
            The route
          </h2>
          <ul className="space-y-0">
            {timeline.map((entry, i) => (
              <li
                key={`${entry.year}-${i}`}
                className="grid grid-cols-[3.75rem_1fr] sm:grid-cols-[5rem_1fr_auto] gap-3 sm:gap-6 items-baseline py-3 sm:py-4 border-b"
                style={{ borderColor: "color-mix(in srgb, var(--ink) 8%, transparent)" }}
              >
                <span
                  className="landing-display text-xl sm:text-2xl lg:text-3xl"
                  style={{ color: "var(--accent-primary)" }}
                >
                  {entry.year}
                </span>
                <span className="text-sm sm:text-base lg:text-lg" style={{ fontFamily: "var(--font-body)" }}>
                  {entry.title}
                </span>
                <span className="landing-mono hidden sm:inline">— {entry.tag} —</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="landing-divider border-t" />

        <section className="py-14 sm:py-20">
          <h2
            className="landing-display text-[clamp(2.25rem,6vw,4.5rem)] period-dot mb-8 sm:mb-12"
            style={{ color: "var(--ink)" }}
          >
            The loadout
          </h2>
          <div className="space-y-8">
            {loadout.map((row) => (
              <div key={row.label}>
                <div className="landing-mono mb-3">— {row.label} —</div>
                <div className="flex flex-wrap gap-2">
                  {row.chips.map((chip) => (
                    <span key={chip} className="landing-pill">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="landing-divider border-t" />

        <section id="contact" className="py-16 sm:py-24 text-center">
          <h2
            className="landing-display text-[clamp(3rem,10vw,8rem)] period-dot mb-6 sm:mb-8"
            style={{ color: "var(--ink)" }}
          >
            Let's talk
          </h2>
          <p
            className="text-base lg:text-lg mb-8 sm:mb-10 mx-auto max-w-xl"
            style={{ color: "var(--ink)", opacity: 0.8 }}
          >
            Open to operator, builder, and GTM roles. Available for select freelance app builds. Tampa, FL — remote or hybrid.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="landing-mono inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3.5 break-all sm:break-normal"
              style={{ background: "var(--accent-primary)", color: "var(--ink)" }}
            >
              <Mail className="h-4 w-4 shrink-0" /> {CONTACT_EMAIL} <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-mono inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3.5"
              style={{
                border: "1px solid var(--accent-secondary)",
                color: "var(--accent-secondary)",
              }}
            >
              LINKEDIN <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-mono inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3.5"
              style={{
                border: "1px solid var(--accent-secondary)",
                color: "var(--accent-secondary)",
              }}
            >
              FACEBOOK <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-mono inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3.5"
              style={{
                border: "1px solid var(--accent-secondary)",
                color: "var(--accent-secondary)",
              }}
            >
              GITHUB <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <p
            className="landing-mono mt-8 sm:mt-12 inline-flex items-center gap-2"
            style={{ color: "var(--ink)", opacity: 0.6 }}
          >
            <span
              className="inline-block rounded-full"
              style={{ width: 6, height: 6, background: "var(--accent-secondary)" }}
            />
            TAMPA, FL · ACTIVE
          </p>
        </section>
      </main>

      <footer className="relative z-10 mt-8 sm:mt-12 pb-8 sm:pb-10">
        <div
          className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-center text-center md:text-left border-t"
          style={{ borderColor: "color-mix(in srgb, var(--ink) 12%, transparent)" }}
        >
          <p className="landing-mono md:text-left" style={{ opacity: 0.6 }}>
            © 2026 Alexander Holmes
          </p>
          <p className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2">
            <Link
              to="/privacy"
              className="landing-mono"
              style={{ color: "var(--accent-secondary)", textDecoration: "none" }}
            >
              PRIVACY
            </Link>
            <span className="landing-mono" style={{ opacity: 0.3 }}>
              ·
            </span>
            <Link
              to="/terms"
              className="landing-mono"
              style={{ color: "var(--accent-secondary)", textDecoration: "none" }}
            >
              TERMS
            </Link>
            <span className="landing-mono" style={{ opacity: 0.3 }}>
              ·
            </span>
            <a
              href={TOGGLE_TOWN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-mono inline-flex items-center gap-1"
              style={{ color: "var(--accent-secondary)" }}
            >
              TOGGLE.TOWN <ArrowUpRight className="h-3 w-3" />
            </a>
            <span className="landing-mono" style={{ opacity: 0.3 }}>
              ·
            </span>
            <a
              href={ALPHA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-mono inline-flex items-center gap-1"
              style={{ color: "var(--accent-secondary)" }}
            >
              ALPHA <ArrowUpRight className="h-3 w-3" />
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
