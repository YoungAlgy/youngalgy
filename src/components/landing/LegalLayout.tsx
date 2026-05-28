import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useThemeMode } from "./useThemeMode";

/**
 * LegalLayout — shared shell for the public /privacy and /terms pages.
 *
 * Matches the landing's Miami/Pirate dual-theme (via useThemeMode → data-mode)
 * so the legal pages feel part of youngalgy.com rather than a bolt-on. Public
 * by design — legal pages must stay reachable without passing the dashboard
 * password gate, and they're linked from the landing footer, the dashboard,
 * the changelog, and the gate screen.
 */
type LegalLayoutProps = {
  title: string;
  description: string;
  lastUpdated: string;
  children: ReactNode;
};

export function LegalLayout({ title, description, lastUpdated, children }: LegalLayoutProps) {
  const [mode, setMode] = useThemeMode();

  // Per-route head tags: title, meta description, and canonical. Without these
  // the legal pages inherit index.html's landing description and
  // canonical=https://youngalgy.com/, so Google would canonicalize /privacy
  // and /terms back to the homepage and never index them on their own. All
  // restored on unmount so other routes aren't affected.
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} · Alexander Holmes`;

    const descEl = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = descEl?.getAttribute("content") ?? null;
    if (descEl) descEl.setAttribute("content", description);

    let canonicalEl = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const createdCanonical = !canonicalEl;
    const prevCanonical = canonicalEl?.getAttribute("href") ?? null;
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", window.location.origin + window.location.pathname);

    return () => {
      document.title = prevTitle;
      if (descEl && prevDesc !== null) descEl.setAttribute("content", prevDesc);
      if (canonicalEl) {
        if (createdCanonical) canonicalEl.remove();
        else if (prevCanonical !== null) canonicalEl.setAttribute("href", prevCanonical);
      }
    };
  }, [title, description]);

  return (
    <div className="relative z-10 min-h-screen" style={{ color: "var(--ink)" }}>
      <header className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 flex items-center justify-between">
        <Link to="/" className="landing-mono inline-flex items-center gap-2 hover:opacity-100" style={{ opacity: 0.8, textDecoration: "none" }}>
          ← ALEXANDER HOLMES
        </Link>
        <ThemeToggle mode={mode} onChange={setMode} />
      </header>

      <main className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 pb-16 text-left">
        <h1 className="landing-display text-4xl sm:text-5xl" style={{ color: "var(--ink)" }}>
          {title}
        </h1>
        <p className="landing-mono mt-3" style={{ opacity: 0.55 }}>
          LAST UPDATED · {lastUpdated}
        </p>

        <div className="legal-body mt-8 sm:mt-10" style={{ color: "var(--ink-muted)", lineHeight: 1.7 }}>
          {children}
        </div>
      </main>

      <footer className="relative z-10 pb-10">
        <div
          className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-center text-center md:text-left border-t"
          style={{ borderColor: "color-mix(in srgb, var(--ink) 12%, transparent)" }}
        >
          <p className="landing-mono md:text-left" style={{ opacity: 0.6 }}>
            © 2026 Alexander Holmes
          </p>
          <p className="flex items-center justify-center md:justify-end gap-4">
            <Link to="/privacy" className="landing-mono" style={{ color: "var(--accent-secondary)", textDecoration: "none" }}>
              PRIVACY
            </Link>
            <span className="landing-mono" style={{ opacity: 0.3 }}>·</span>
            <Link to="/terms" className="landing-mono" style={{ color: "var(--accent-secondary)", textDecoration: "none" }}>
              TERMS
            </Link>
            <span className="landing-mono" style={{ opacity: 0.3 }}>·</span>
            <Link to="/" className="landing-mono inline-flex items-center gap-1" style={{ color: "var(--accent-secondary)", textDecoration: "none" }}>
              HOME <ArrowUpRight className="h-3 w-3" />
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
