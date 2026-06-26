import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Search,
  Coins,
  Tags,
  ShieldCheck,
  Network,
  Code2,
} from "lucide-react";
import { Monogram } from "@/components/landing/Monogram";
import { ThemeToggle } from "@/components/landing/ThemeToggle";
import { useThemeMode } from "@/components/landing/useThemeMode";

/**
 * BaseLens, the project page. BaseLens is a pay-per-call AI endpoint that reads
 * any Base address and returns a structured risk/activity read, paid in USDC over
 * x402. Built for the agent economy. Open source, not a paid product.
 *
 * Public and ungated, themed via useThemeMode so it matches the landing, freelance,
 * and creditkit pages. Same per-route head pattern as those.
 */
const GITHUB_URL = "https://github.com/YoungAlgy/baselens";

const steps: readonly { n: string; title: string; body: string }[] = [
  { n: "1", title: "Send an address", body: "An agent or a person posts a Base address to the endpoint." },
  { n: "2", title: "Pay a few cents", body: "It asks for a tiny USDC payment over x402. The caller's wallet pays it automatically." },
  { n: "3", title: "Get the read", body: "BaseLens pulls the onchain history and returns a structured risk and activity summary." },
];

type Feature = { icon: typeof Search; title: string; body: string };

const features: readonly Feature[] = [
  { icon: Search, title: "Onchain reads", body: "Balance, contract status, recent transactions, and counterparties." },
  { icon: Coins, title: "Token context", body: "ERC-20 transfers, aggregated into the tokens an address actually touches." },
  { icon: Tags, title: "Known-contract labels", body: "Canonical Base contracts get named, so risk calls aren't blind." },
  { icon: ShieldCheck, title: "Grounded risk flags", body: "Failed-tx ratio, new or dormant wallets, unlabeled-only counterparties, computed from the data." },
  { icon: Network, title: "x402 micropayments", body: "Pay-per-call in USDC on Base. No account, no API key." },
  { icon: Code2, title: "Open source, in TS", body: "Next.js, x402, Coinbase CDP, viem, Claude." },
];

const SAMPLE = `{
  "address": "0x4200...0006",
  "selfLabel": "WETH (canonical)",
  "riskLevel": "low",
  "activitySummary": "Canonical Wrapped Ether on Base. High
     volume, interacts with major routers and the bridge.",
  "riskFactors": [],
  "recommendation": "Safe to interact with."
}`;

const BaseLens = () => {
  const [mode, setMode] = useThemeMode();

  useEffect(() => {
    const restores: Array<() => void> = [];

    const prevTitle = document.title;
    document.title = "BaseLens · Onchain risk analysis for AI agents · Alexander Holmes";
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
      "BaseLens is a pay-per-call AI endpoint that reads any Base address and returns a structured risk and activity summary. Built on x402, Coinbase CDP, and Claude, for the agent economy.";
    const title = "BaseLens, onchain risk analysis for AI agents";
    const url = window.location.origin + "/baselens";

    setMeta("name", "description", desc);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", desc);

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
            <Link to="/" className="landing-mono inline-flex items-center gap-1" style={{ color: "var(--ink)", opacity: 0.85 }}>
              ← PORTFOLIO
            </Link>
            <span className="landing-mono" style={{ opacity: 0.3 }}>·</span>
            <Link to="/freelance" className="landing-mono inline-flex items-center gap-1" style={{ color: "var(--ink)", opacity: 0.85 }}>
              FREELANCE
            </Link>
            <ThemeToggle mode={mode} onChange={setMode} />
          </nav>
        </div>
      </header>

      <main id="main" className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Hero */}
        <section className="py-12 sm:py-16 lg:py-24">
          <div className="landing-mono mb-5 inline-flex items-center gap-2" style={{ color: "var(--accent-secondary)" }}>
            <span className="inline-block rounded-full" style={{ width: 6, height: 6, background: "var(--accent-secondary)" }} />
            BASELENS · X402 · BASE · AI
          </div>
          <h1 className="landing-display text-[clamp(2.75rem,9vw,7rem)] period-dot" style={{ color: "var(--ink)" }}>
            Know who you're
            <br />
            dealing with onchain
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mt-6 sm:mt-8" style={{ lineHeight: 1.55, color: "var(--ink)", opacity: 0.9 }}>
            BaseLens reads any wallet or contract on Base and returns a{" "}
            <span style={{ color: "var(--accent-secondary)", fontWeight: 600 }}>plain-English risk read</span>. It's built for AI
            agents, which now move money onchain and need to check an address before they trust it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-mono inline-flex items-center justify-center gap-2 px-7 py-3.5 w-full sm:w-auto"
              style={{ background: "var(--accent-primary)", color: "var(--accent-ink)" }}
            >
              VIEW THE SOURCE <ArrowUpRight className="h-3.5 w-3.5" />
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
            Open source. Built for the agent economy.
          </p>
        </section>

        <div className="landing-divider border-t" />

        {/* How it works */}
        <section id="how" className="py-14 sm:py-20">
          <h2 className="landing-display text-[clamp(2.25rem,6vw,4rem)] period-dot mb-5" style={{ color: "var(--ink)" }}>
            One paid call, one clear answer
          </h2>
          <p className="text-base lg:text-lg max-w-2xl mb-10 sm:mb-14" style={{ lineHeight: 1.6, color: "var(--ink)", opacity: 0.8 }}>
            No account, no API key. The caller pays a few cents of USDC per lookup, the way agents are starting to pay for
            everything.
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

        {/* What you get back */}
        <section className="py-14 sm:py-20">
          <h2 className="landing-display text-[clamp(2.25rem,6vw,4rem)] period-dot mb-8 sm:mb-12" style={{ color: "var(--ink)" }}>
            A structured read, not a chatbot reply
          </h2>
          <pre
            className="landing-mono text-xs sm:text-sm overflow-x-auto rounded-2xl px-5 py-5 sm:px-7 sm:py-6"
            style={{
              border: "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
              background: "color-mix(in srgb, var(--accent-primary) 6%, transparent)",
              color: "var(--ink)",
              lineHeight: 1.7,
            }}
          >
            {SAMPLE}
          </pre>
        </section>

        <div className="landing-divider border-t" />

        {/* Under the hood */}
        <section className="py-14 sm:py-20">
          <h2 className="landing-display text-[clamp(2.25rem,6vw,4rem)] period-dot mb-5" style={{ color: "var(--ink)" }}>
            Real onchain depth
          </h2>
          <p className="text-base lg:text-lg max-w-2xl mb-10 sm:mb-14" style={{ lineHeight: 1.6, color: "var(--ink)", opacity: 0.8 }}>
            It reads the chain, labels what it can, computes risk signals from the data, then has Claude write the read on
            top of those facts. Grounded, not guessed.
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
            <h2 className="landing-display text-[clamp(2rem,6vw,4rem)] period-dot mb-6" style={{ color: "var(--ink)" }}>
              Infrastructure for the agent economy
            </h2>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-mono inline-flex items-center justify-center gap-2 px-8 py-4"
              style={{ background: "var(--accent-primary)", color: "var(--accent-ink)" }}
            >
              VIEW THE SOURCE <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <div className="flex flex-wrap justify-center gap-2 mt-10">
              {["Next.js", "x402", "Coinbase CDP", "Base", "viem", "Claude"].map((chip) => (
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
            <Link to="/" className="landing-mono inline-flex items-center gap-1" style={{ color: "var(--accent-secondary)", textDecoration: "none" }}>
              ← PORTFOLIO
            </Link>
            <span className="landing-mono" style={{ opacity: 0.3 }}>·</span>
            <Link to="/freelance" className="landing-mono" style={{ color: "var(--accent-secondary)", textDecoration: "none" }}>
              FREELANCE
            </Link>
            <span className="landing-mono" style={{ opacity: 0.3 }}>·</span>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="landing-mono inline-flex items-center gap-1" style={{ color: "var(--accent-secondary)" }}>
              GITHUB <ArrowUpRight className="h-3 w-3" />
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BaseLens;
