import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Coins,
  CreditCard,
  RotateCcw,
  KeyRound,
  Lock,
  LayoutDashboard,
  Mail,
  Code2,
} from "lucide-react";
import { Monogram } from "@/components/landing/Monogram";
import { ThemeToggle } from "@/components/landing/ThemeToggle";
import { SectionNav } from "@/components/landing/SectionNav";
import { useThemeMode } from "@/components/landing/useThemeMode";

/**
 * CreditKit, the product page. CreditKit is a Next.js + Supabase + Stripe starter
 * Algy built and sells ($129, one time, full source). Checkout is on Gumroad.
 *
 * Public and ungated, themed via useThemeMode so it matches the landing and
 * freelance pages. Every claim matches the real product copy (creditkit.html /
 * the distribution pack) and the master resume. Copy is in Alex's voice.
 *
 * NOTE: /creditkit used to rewrite to public/creditkit.html in vercel.json.
 * That rewrite was removed so this React route renders instead.
 */
const GUMROAD_URL = "https://youngalgy.gumroad.com/l/creditkit";
const WRITEUP_URL =
  "https://dev.to/youngalgy/how-to-build-a-credit-system-for-a-nextjs-ai-app-stripe-supabase-heb";

const bugs: readonly { title: string; body: string }[] = [
  {
    title: "Overselling",
    body: "Two requests land at once and the balance goes negative. You gave the work away for free.",
  },
  {
    title: "Double-charging",
    body: "Stripe retries a webhook and the same purchase grants the credits twice.",
  },
  {
    title: "No refund on failure",
    body: "A job dies after you already charged, and the user is out money and emailing you.",
  },
];

const steps: readonly { n: string; title: string; body: string }[] = [
  { n: "1", title: "User buys credits", body: "Stripe credit packs or subscriptions." },
  { n: "2", title: "Atomic spend", body: "One Postgres update that can't go negative, even under load." },
  { n: "3", title: "Worker runs the job", body: "A background queue picks it up and processes it." },
  { n: "4", title: "Done, or refunded", body: "If the job fails, the credits go back on their own." },
];

type Feature = { icon: typeof Coins; title: string; body: string };

const features: readonly Feature[] = [
  { icon: Coins, title: "Credits engine", body: "Atomic and idempotent. Every change is logged." },
  { icon: CreditCard, title: "Stripe billing", body: "Credit packs and subscriptions, webhook-driven." },
  { icon: RotateCcw, title: "Auto-refund worker", body: "A job dies, the credits come back." },
  { icon: KeyRound, title: "Passwordless auth", body: "Email-code login, no resets to manage." },
  { icon: Lock, title: "Row-level security", body: "Every row locked to its owner." },
  { icon: LayoutDashboard, title: "Usage dashboard", body: "Balance, history, and packs." },
  { icon: Mail, title: "Email, built in", body: "Resend, already wired up." },
  { icon: Code2, title: "Full source, in TS", body: "Next.js 15, Supabase, Stripe, Tailwind." },
];

const CreditKit = () => {
  const [mode, setMode] = useThemeMode();

  // Per-route head: title, description, canonical for /creditkit. Restored on
  // unmount so other routes keep index.html's homepage defaults. Same pattern
  // as Freelance so Google indexes this page on its own.
  useEffect(() => {
    const restores: Array<() => void> = [];

    const prevTitle = document.title;
    document.title = "CreditKit · Credits and billing for AI apps · Alexander Holmes";
    restores.push(() => {
      document.title = prevTitle;
    });

    // Set a head meta tag and queue its restore, so other routes keep the
    // homepage defaults from index.html on unmount.
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
      "CreditKit is a Next.js, Supabase, and Stripe starter that ships the usage-credits and billing layer AI apps actually need. Atomic spend, idempotent Stripe webhooks, and a worker that refunds on failure. $129, full source.";
    const title = "CreditKit, credits and billing for AI apps";
    const url = window.location.origin + "/creditkit";
    const ogImage = window.location.origin + "/creditkit-og.png";

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
            CREDITKIT · NEXT.JS · SUPABASE · STRIPE
          </div>
          <h1 className="landing-display text-[clamp(2.75rem,9vw,7rem)] period-dot" style={{ color: "var(--ink)" }}>
            Stop rebuilding
            <br />
            billing for AI apps
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mt-6 sm:mt-8" style={{ lineHeight: 1.55, color: "var(--ink)", opacity: 0.9 }}>
            CreditKit ships the part nobody else does. A real{" "}
            <span style={{ color: "var(--accent-secondary)", fontWeight: 600 }}>usage-credits system</span>, Stripe billing,
            and a background worker that refunds the user when a job fails. It's the code that already runs in my own apps.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10">
            <a
              href={GUMROAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-mono inline-flex items-center justify-center gap-2 px-7 py-3.5 w-full sm:w-auto"
              style={{ background: "var(--accent-primary)", color: "var(--accent-ink)" }}
            >
              GET CREDITKIT · $129 <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href={WRITEUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-mono inline-flex items-center justify-center gap-2 px-7 py-3.5 w-full sm:w-auto"
              style={{ border: "1px solid var(--accent-secondary)", color: "var(--accent-secondary)" }}
            >
              READ THE WRITE-UP <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <p className="landing-mono mt-5" style={{ color: "var(--ink)", opacity: 0.6 }}>
            One time. Full source, yours forever.
          </p>
        </section>

        <div className="landing-divider border-t" />

        {/* The three bugs */}
        <section className="py-14 sm:py-20">
          <h2 className="landing-display text-[clamp(2.25rem,6vw,4rem)] period-dot mb-5" style={{ color: "var(--ink)" }}>
            The three bugs it kills
          </h2>
          <p className="text-base lg:text-lg max-w-2xl mb-10 sm:mb-14" style={{ lineHeight: 1.6, color: "var(--ink)", opacity: 0.8 }}>
            AI features cost you real money per call, so a flat price falls apart the first time a heavy user shows up.
            You have to sell credits. And credits bite you every time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {bugs.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl px-6 py-7"
                style={{
                  border: "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
                  background: "color-mix(in srgb, var(--accent-primary) 6%, transparent)",
                }}
              >
                <h3 className="landing-display text-xl mb-3 inline-flex items-center gap-2.5" style={{ color: "var(--ink)" }}>
                  <span className="inline-block rounded-full shrink-0" style={{ width: 9, height: 9, background: "var(--accent-secondary)" }} />
                  {b.title}
                </h3>
                <p className="text-base" style={{ lineHeight: 1.6, color: "var(--ink)", opacity: 0.8 }}>
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="landing-divider border-t" />

        {/* How it works */}
        <section className="py-14 sm:py-20">
          <h2 className="landing-display text-[clamp(2.25rem,6vw,4rem)] period-dot mb-10 sm:mb-14" style={{ color: "var(--ink)" }}>
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
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

        {/* Everything in the box */}
        <section className="py-14 sm:py-20">
          <h2 className="landing-display text-[clamp(2.25rem,6vw,4rem)] period-dot mb-5" style={{ color: "var(--ink)" }}>
            Everything in the box
          </h2>
          <p className="text-base lg:text-lg max-w-2xl mb-10 sm:mb-14" style={{ lineHeight: 1.6, color: "var(--ink)", opacity: 0.8 }}>
            Not a demo. The code that already runs in my own apps, the ones taking real payments included.
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

        {/* Proof */}
        <section className="py-16 sm:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="landing-mono mb-6 inline-flex items-center gap-2" style={{ color: "var(--accent-secondary)", opacity: 0.9 }}>
              <span className="inline-block rounded-full" style={{ width: 6, height: 6, background: "var(--accent-secondary)" }} />
              WHO MADE IT
            </div>
            <blockquote
              className="landing-display text-[clamp(1.5rem,3.5vw,2.25rem)]"
              style={{ color: "var(--ink)", lineHeight: 1.4 }}
            >
              I didn't build this to sell it. I shipped over a dozen apps on this exact code, the ones taking real
              payments included. You're buying plumbing that already survived real users and Stripe webhooks at 2am.
            </blockquote>
            <div className="landing-mono mt-7" style={{ color: "var(--ink)", opacity: 0.6 }}>
              ALGY · YOUNGALGY.COM
            </div>
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
              Skip the week of plumbing
            </h2>
            <div
              className="landing-display landing-stat-number text-[clamp(3rem,9vw,5rem)]"
              style={{ color: "var(--accent-primary)" }}
            >
              $129
            </div>
            <p className="landing-mono mt-2 mb-8" style={{ color: "var(--ink)", opacity: 0.7 }}>
              One time. Full source, yours forever.
            </p>
            <a
              href={GUMROAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-mono inline-flex items-center justify-center gap-2 px-8 py-4"
              style={{ background: "var(--accent-primary)", color: "var(--accent-ink)" }}
            >
              GET CREDITKIT <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <div className="flex flex-wrap justify-center gap-2 mt-10">
              {["Next.js 15", "Supabase", "Stripe", "TypeScript", "Tailwind", "Resend", "Passwordless auth", "Row-level security", "Dashboard"].map(
                (chip) => (
                  <span key={chip} className="landing-pill">
                    {chip}
                  </span>
                )
              )}
            </div>
            <p className="landing-mono mt-8" style={{ color: "var(--ink)", opacity: 0.55 }}>
              Checkout is handled by Gumroad.
            </p>
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
            <Link to="/freelance" className="landing-mono" style={{ color: "var(--accent-secondary)", textDecoration: "none" }}>
              FREELANCE
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

export default CreditKit;
