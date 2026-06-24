import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, Database, Network, ShieldCheck, Boxes } from "lucide-react";
import { Monogram } from "@/components/landing/Monogram";
import { ThemeToggle } from "@/components/landing/ThemeToggle";
import { useThemeMode } from "@/components/landing/useThemeMode";
import { CONTACT_EMAIL, GITHUB_URL } from "@/data/landing-content";

/**
 * Freelance, the public "work with me" page. Sells the sharpest, least-crowded
 * lane: healthcare and provider-data pipeline work. Leads with the NPPES hook
 * (a ~9 GB / ~9M-record federal file cleaned to a 1.4M active directory, solo,
 * in production), which screens people in by itself.
 *
 * Public on purpose (not behind the dashboard gate), themed via useThemeMode so
 * it matches the landing look. Every claim matches the resume and the Ava Health
 * case study on "/". Contact is the site's CONTACT_EMAIL. Copy is in Alex's voice.
 */
const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Freelance project, healthcare data"
)}`;

type Service = { icon: typeof Database; title: string; body: string };

const services: readonly Service[] = [
  {
    icon: Database,
    title: "Provider data and NPPES pipelines",
    body: "I take the raw federal NPPES file, about 9 GB unzipped, or your own provider data, and turn it into a clean directory you can actually query. NPI matching, fixing taxonomies, cleaning up addresses, checking licenses.",
  },
  {
    icon: Network,
    title: "Moving health data to the cloud",
    body: "I get health data off spreadsheets and old systems and into clean Postgres or Supabase, with real APIs and syncing. Nothing gets lost and nothing that works today breaks.",
  },
  {
    icon: ShieldCheck,
    title: "Sensitive data handling and access control",
    body: "Private data handled carefully. Scrubbing and de-identifying records, masking PII, and locking down who can see what with row-level security.",
  },
  {
    icon: Boxes,
    title: "Full-stack health-tech builds",
    body: "The whole thing. A CRM, automated texting and email to clinicians, dashboards, and the servers under it. Built and run by one person.",
  },
];

const proof: readonly { value: string; label: string }[] = [
  { value: "9M to 1.4M", label: "The raw federal NPPES file holds close to 9 million records. I cleaned it into a 1.4 million active provider directory." },
  { value: "12+", label: "Products I shipped this past year, by myself, with AI tools." },
  { value: "16 x 51", label: "Healthcare jobs across every state plus DC, with the licensing content to match." },
  { value: "Solo", label: "I own the whole stack, from the database to the servers it runs on." },
];

const how: readonly [string, string][] = [
  ["One person, whole stack", "You work with the same person who builds the data model, writes the app, and runs the servers. No handoffs."],
  ["Fast, with AI tools", "I ship working software in days. Over a dozen products this past year is the proof."],
  ["Works async", "I send clear written updates and shipped work. I do not need a standup to get things done. Good if you want output more than meetings."],
  ["Small paid test first", "We start with a small paid pilot. You see real results on your own data before you commit to anything bigger."],
];

const Freelance = () => {
  const [mode, setMode] = useThemeMode();

  // Per-route head: title, description, canonical for /freelance. Restored on
  // unmount so other routes keep index.html's homepage defaults. Same pattern
  // as LegalLayout so Google indexes this page on its own.
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Freelance · Healthcare data pipelines · Alexander Holmes";

    const descEl = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = descEl?.getAttribute("content") ?? null;
    const desc =
      "Freelance and contract healthcare-data engineering. NPPES and provider-data pipelines, moving data from old systems to the cloud, PHI-safe de-identification, and full-stack health-tech builds. Built solo, running in production. Remote from Tampa, FL.";
    if (descEl) descEl.setAttribute("content", desc);

    let canonicalEl = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const createdCanonical = !canonicalEl;
    const prevCanonical = canonicalEl?.getAttribute("href") ?? null;
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", window.location.origin + "/freelance");

    return () => {
      document.title = prevTitle;
      if (descEl && prevDesc !== null) descEl.setAttribute("content", prevDesc);
      if (canonicalEl) {
        if (createdCanonical) canonicalEl.remove();
        else if (prevCanonical !== null) canonicalEl.setAttribute("href", prevCanonical);
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded focus:font-semibold focus:outline-none"
        style={{ background: "var(--accent-primary)", color: "var(--accent-ink)" }}
      >
        Skip to content
      </a>

      <header className="relative z-10">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-6 flex items-center justify-between gap-3">
          <a href="/" aria-label="Alexander Holmes home" className="block shrink-0" style={{ color: "var(--accent-secondary)" }}>
            <Monogram />
          </a>
          <nav className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2 sm:gap-x-6 lg:gap-x-8">
            <Link to="/" className="landing-mono inline-flex items-center gap-1" style={{ color: "var(--ink)", opacity: 0.85 }}>
              ← PORTFOLIO
            </Link>
            <span className="landing-mono" style={{ opacity: 0.3 }}>·</span>
            <Link to="/creditkit" className="landing-mono inline-flex items-center gap-1" style={{ color: "var(--ink)", opacity: 0.85 }}>
              CREDITKIT
            </Link>
            <ThemeToggle mode={mode} onChange={setMode} />
          </nav>
        </div>
      </header>

      <main id="main" className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Hero, lead with the NPPES hook */}
        <section className="py-12 sm:py-16 lg:py-24">
          <div className="landing-mono mb-5 inline-flex items-center gap-2" style={{ color: "var(--accent-secondary)" }}>
            <span className="inline-block rounded-full" style={{ width: 6, height: 6, background: "var(--accent-secondary)" }} />
            FREELANCE · CONTRACT · HEALTHCARE DATA
          </div>
          <h1 className="landing-display text-[clamp(2.75rem,9vw,7rem)] period-dot" style={{ color: "var(--ink)" }}>
            Provider-data
            <br />
            pipelines
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mt-6 sm:mt-8" style={{ lineHeight: 1.55, color: "var(--ink)", opacity: 0.9 }}>
            The raw federal <strong>NPPES</strong> provider file is a 1 GB download that unzips to about 9 GB, with{" "}
            <span style={{ color: "var(--accent-secondary)", fontWeight: 600 }}>close to 9 million provider records</span>.
            {" "}That's every provider ID ever issued. It's too big to open in Excel. You need a data engineer for it. I loaded and cleaned it into a{" "}
            <strong>1.4 million record</strong> active directory that runs in production, by myself. That's the kind of work I take on.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10">
            <a href={MAILTO} className="landing-mono inline-flex items-center justify-center gap-2 px-7 py-3.5 w-full sm:w-auto" style={{ background: "var(--accent-primary)", color: "var(--accent-ink)" }}>
              START A PROJECT <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <Link
              to="/"
              className="landing-mono inline-flex items-center justify-center gap-2 px-7 py-3.5 w-full sm:w-auto"
              style={{ border: "1px solid var(--accent-secondary)", color: "var(--accent-secondary)" }}
            >
              SEE THE WORK <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        <div className="landing-divider border-t" />

        {/* What I build */}
        <section className="py-14 sm:py-20">
          <h2 className="landing-display text-[clamp(2.25rem,6vw,4rem)] period-dot mb-10 sm:mb-14" style={{ color: "var(--ink)" }}>
            What I build
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title}>
                  <Icon className="h-7 w-7 mb-4" style={{ color: "var(--accent-primary)" }} aria-hidden />
                  <h3 className="landing-display text-xl sm:text-2xl mb-3" style={{ color: "var(--ink)" }}>
                    {s.title}
                  </h3>
                  <p className="text-base" style={{ lineHeight: 1.6, color: "var(--ink)", opacity: 0.8 }}>
                    {s.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="landing-divider border-t" />

        {/* Proof */}
        <section className="py-14 sm:py-20">
          <h2 className="landing-display text-[clamp(2.25rem,6vw,4rem)] period-dot mb-10 sm:mb-14" style={{ color: "var(--ink)" }}>
            The proof
          </h2>
          <ul className="space-y-6">
            {proof.map((p) => (
              <li
                key={p.value}
                className="grid grid-cols-[7rem_1fr] sm:grid-cols-[12rem_1fr] gap-x-5 sm:gap-x-8 items-baseline py-2 border-b"
                style={{ borderColor: "color-mix(in srgb, var(--ink) 8%, transparent)" }}
              >
                <span className="landing-display landing-stat-number text-lg sm:text-3xl" style={{ color: "var(--accent-primary)" }}>
                  {p.value}
                </span>
                <span className="text-sm sm:text-base" style={{ color: "var(--ink)", opacity: 0.8 }}>
                  {p.label}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="landing-divider border-t" />

        {/* How I work */}
        <section className="py-14 sm:py-20">
          <h2 className="landing-display text-[clamp(2.25rem,6vw,4rem)] period-dot mb-10 sm:mb-14" style={{ color: "var(--ink)" }}>
            How I work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 max-w-4xl">
            {how.map(([t, b]) => (
              <div key={t}>
                <h3 className="landing-mono mb-3" style={{ color: "var(--accent-secondary)" }}>
                  {t}
                </h3>
                <p className="text-base" style={{ lineHeight: 1.6, color: "var(--ink)", opacity: 0.8 }}>
                  {b}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="landing-divider border-t" />

        {/* CTA */}
        <section className="py-16 sm:py-24 text-center">
          <h2 className="landing-display text-[clamp(2.5rem,8vw,6rem)] period-dot mb-6 sm:mb-8" style={{ color: "var(--ink)" }}>
            Have a data problem?
          </h2>
          <p className="text-base lg:text-lg mb-8 sm:mb-10 mx-auto max-w-xl" style={{ color: "var(--ink)", opacity: 0.8 }}>
            Tell me what you're dealing with. I'll give you an honest read on whether I can help and how I'd go about it.
            I'm remote, based in Tampa, and fine across US time zones.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
            <a
              href={MAILTO}
              className="landing-mono inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3.5 break-all sm:break-normal"
              style={{ background: "var(--accent-primary)", color: "var(--accent-ink)" }}
            >
              <Mail className="h-4 w-4 shrink-0" /> {CONTACT_EMAIL} <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-mono inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3.5"
              style={{ border: "1px solid var(--accent-secondary)", color: "var(--accent-secondary)" }}
            >
              GITHUB <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
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
            <Link to="/" className="landing-mono inline-flex items-center gap-1" style={{ color: "var(--accent-secondary)", textDecoration: "none" }}>
              ← PORTFOLIO
            </Link>
            <span className="landing-mono" style={{ opacity: 0.3 }}>·</span>
            <Link to="/privacy" className="landing-mono" style={{ color: "var(--accent-secondary)", textDecoration: "none" }}>
              PRIVACY
            </Link>
            <span className="landing-mono" style={{ opacity: 0.3 }}>·</span>
            <Link to="/terms" className="landing-mono" style={{ color: "var(--accent-secondary)", textDecoration: "none" }}>
              TERMS
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Freelance;
