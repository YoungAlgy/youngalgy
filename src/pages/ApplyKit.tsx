import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  FileText,
  Mail,
  MessageSquareText,
  Sparkles,
  Wallet,
  Code2,
} from "lucide-react";
import { Monogram } from "@/components/landing/Monogram";
import { ThemeToggle } from "@/components/landing/ThemeToggle";
import { SectionNav } from "@/components/landing/SectionNav";
import { useThemeMode } from "@/components/landing/useThemeMode";

/**
 * ApplyKit, the case-study page. ApplyKit was a standalone Gemini-powered
 * tool that tailored a resume and cover letter to one specific job posting,
 * plus interview prep. Retired as its own paid product on 2026-07-24 (wasn't
 * making money standalone); the tailoring feature lives on for free inside
 * FreeResumePost's /account/tailor, for candidates who already have a resume
 * on file there. This page now tells that story and points to the new home.
 *
 * Public and ungated, themed via useThemeMode so it matches the landing,
 * freelance, creditkit, and baselens pages. Copy is in Alex's voice.
 */
const APPLYKIT_URL = "https://www.freeresumepost.co/account/tailor";

const steps: readonly { n: string; title: string; body: string }[] = [
  { n: "1", title: "Paste the job", body: "Drop in the job posting. It reads your resume straight from your FreeResumePost account, no re-pasting it." },
  { n: "2", title: "Gemini reads both", body: "It matches your real experience against what the posting actually asks for, no invented skills." },
  { n: "3", title: "Get three things back", body: "Tailored resume bullets, a real cover letter, and the interview questions you'll probably get asked." },
];

type Feature = { icon: typeof FileText; title: string; body: string };

const features: readonly Feature[] = [
  { icon: FileText, title: "Tailored resume bullets", body: "Your real experience, reworded to match what this specific job wants." },
  { icon: Mail, title: "A real cover letter", body: "Written for this job and this company, not a fill-in-the-blank template." },
  { icon: MessageSquareText, title: "Interview prep", body: "The questions this posting will probably lead to, with a tip on how to answer each." },
  { icon: Sparkles, title: "Powered by Gemini", body: "Structured output, not a chat window. It only uses what's actually in your resume." },
  { icon: Wallet, title: "Free now", body: "Folded into FreeResumePost as a free account feature. No separate payment, no separate account." },
  { icon: Code2, title: "Built in the open", body: "Next.js, Gemini. Originally its own Stripe-billed app, since simplified." },
];

const ApplyKit = () => {
  const [mode, setMode] = useThemeMode();

  // Per-route head: title, description, canonical for /applykit. Restored on
  // unmount so other routes keep index.html's homepage defaults. Same pattern
  // as CreditKit/BaseLens so Google indexes this page on its own.
  useEffect(() => {
    const restores: Array<() => void> = [];

    const prevTitle = document.title;
    document.title = "ApplyKit · Tailor your resume to any job · Alexander Holmes";
    restores.push(() => {
      document.title = prevTitle;
    });

    const setMeta = (attr: "name" | "property", key: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      const created = !el;
      const prev = el?.getAttribute("content") ?? null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
      restores.push(() => {
        if (created) el.remove();
        else if (prev !== null) el.setAttribute("content", prev);
      });
    };

    const desc =
      "ApplyKit tailored a resume and wrote a real cover letter for one specific job posting, plus interview prep, powered by Gemini. Now a free feature inside FreeResumePost.";
    const title = "ApplyKit, tailor your resume to any job";
    const url = window.location.origin + "/applykit";
    const ogImage = window.location.origin + "/applykit-og.png";

    setMeta("name", "description", desc);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", ogImage);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", ogImage);

    let canonicalEl = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const createdCanonical = !canonicalEl;
    const prevCanonical = canonicalEl?.getAttribute("href") ?? null;
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", url);
    restores.push(() => {
      if (createdCanonical) canonicalEl.remove();
      else if (prevCanonical !== null) canonicalEl.setAttribute("href", prevCanonical);
    });

    return () => {
      restores.forEach((restore) => restore());
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
            <SectionNav />
            <ThemeToggle mode={mode} onChange={setMode} />
          </nav>
        </div>
      </header>

      <main id="main" className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Hero */}
        <section className="py-12 sm:py-16 lg:py-24">
          <div className="landing-mono mb-5 inline-flex items-center gap-2" style={{ color: "var(--accent-secondary)" }}>
            <span className="inline-block rounded-full" style={{ width: 6, height: 6, background: "var(--accent-secondary)" }} />
            APPLYKIT · GEMINI · JOB SEARCH
          </div>
          <h1 className="landing-display text-[clamp(2.75rem,9vw,7rem)] period-dot" style={{ color: "var(--ink)" }}>
            Stop sending the
            <br />
            same resume everywhere
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mt-6 sm:mt-8" style={{ lineHeight: 1.55, color: "var(--ink)", opacity: 0.9 }}>
            Paste a job posting. It rewrites your resume bullets to match what that job actually wants, writes you
            a{" "}
            <span style={{ color: "var(--accent-secondary)", fontWeight: 600 }}>real cover letter</span>, and preps you
            for the interview. Now a free feature inside FreeResumePost.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10">
            <a
              href={APPLYKIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-mono inline-flex items-center justify-center gap-2 px-7 py-3.5 w-full sm:w-auto"
              style={{ background: "var(--accent-primary)", color: "var(--accent-ink)" }}
            >
              TRY IT FREE <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="#how"
              className="landing-mono inline-flex items-center justify-center gap-2 px-7 py-3.5 w-full sm:w-auto"
              style={{ border: "1px solid var(--accent-secondary)", color: "var(--accent-secondary)" }}
            >
              HOW IT WORKS <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <p className="landing-mono mt-5" style={{ color: "var(--ink)", opacity: 0.6 }}>
            Free, built into FreeResumePost. No separate account, no payment.
          </p>
        </section>

        <div className="landing-divider border-t" />

        {/* How it works */}
        <section id="how" className="py-14 sm:py-20">
          <h2 className="landing-display text-[clamp(2.25rem,6vw,4rem)] period-dot mb-5" style={{ color: "var(--ink)" }}>
            One job posting, one real answer
          </h2>
          <p className="text-base lg:text-lg max-w-2xl mb-10 sm:mb-14" style={{ lineHeight: 1.6, color: "var(--ink)", opacity: 0.8 }}>
            Free for anyone with a FreeResumePost account. Paste, wait a few seconds, get a tailored application back.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
            {steps.map((s) => (
              <div key={s.n}>
                <div className="landing-display landing-stat-number text-3xl sm:text-4xl mb-3" style={{ color: "var(--accent-primary)" }}>
                  {s.n}
                </div>
                <h3 className="landing-display text-lg sm:text-xl mb-2" style={{ color: "var(--ink)" }}>
                  {s.title}
                </h3>
                <p className="text-sm sm:text-base" style={{ lineHeight: 1.55, color: "var(--ink)", opacity: 0.8 }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="landing-divider border-t" />

        {/* What you get */}
        <section className="py-14 sm:py-20">
          <h2 className="landing-display text-[clamp(2.25rem,6vw,4rem)] period-dot mb-5" style={{ color: "var(--ink)" }}>
            What you get back
          </h2>
          <p className="text-base lg:text-lg max-w-2xl mb-10 sm:mb-14" style={{ lineHeight: 1.6, color: "var(--ink)", opacity: 0.8 }}>
            It only reworks what's actually true about you. Nothing invented, nothing generic.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title}>
                  <Icon className="h-7 w-7 mb-4" style={{ color: "var(--accent-primary)" }} aria-hidden />
                  <h3 className="landing-display text-xl sm:text-2xl mb-3" style={{ color: "var(--ink)" }}>
                    {f.title}
                  </h3>
                  <p className="text-base" style={{ lineHeight: 1.6, color: "var(--ink)", opacity: 0.8 }}>
                    {f.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="landing-divider border-t" />

        {/* Final CTA */}
        <section className="py-16 sm:py-24">
          <div
            className="rounded-2xl px-6 sm:px-10 py-12 sm:py-16 text-center"
            style={{
              border: "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
              background: "color-mix(in srgb, var(--accent-primary) 8%, transparent)",
            }}
          >
            <h2 className="landing-display text-[clamp(2.25rem,7vw,4.5rem)] period-dot mb-4" style={{ color: "var(--ink)" }}>
              Apply like you mean it
            </h2>
            <div
              className="landing-display landing-stat-number text-[clamp(3rem,9vw,5rem)]"
              style={{ color: "var(--accent-primary)" }}
            >
              FREE
            </div>
            <p className="landing-mono mt-2 mb-8" style={{ color: "var(--ink)", opacity: 0.7 }}>
              Built into your FreeResumePost account.
            </p>
            <a
              href={APPLYKIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-mono inline-flex items-center justify-center gap-2 px-8 py-4"
              style={{ background: "var(--accent-primary)", color: "var(--accent-ink)" }}
            >
              TRY IT FREE <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <div className="flex flex-wrap justify-center gap-2 mt-10">
              {["Next.js", "Gemini", "TypeScript"].map((chip) => (
                <span key={chip} className="landing-pill">
                  {chip}
                </span>
              ))}
            </div>
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
            <SectionNav variant="footer" />
            <span className="landing-mono" style={{ opacity: 0.3 }}>·</span>
            <a href={APPLYKIT_URL} target="_blank" rel="noopener noreferrer" className="landing-mono inline-flex items-center gap-1" style={{ color: "var(--accent-secondary)" }}>
              TRY IT FREE <ArrowUpRight className="h-3 w-3" />
            </a>
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

export default ApplyKit;
