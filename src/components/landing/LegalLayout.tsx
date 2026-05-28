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
  lastUpdated: string;
  children: ReactNode;
};

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  const [mode, setMode] = useThemeMode();

  // Per-route document title; restored on unmount.
  useEffect(() => {
    const prev = document.title;
    document.title = `${title} · Alexander Holmes`;
    return () => {
      document.title = prev;
    };
  }, [title]);

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
