import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/landing/ThemeToggle";
import { useNoIndexHead } from "@/components/landing/useNoIndexHead";
import { useThemeMode } from "@/components/landing/useThemeMode";

const RETIRED_ROUTES = {
  "/freelance": {
    name: "Freelance work",
    detail: "I am no longer taking healthcare data or app projects through this page.",
  },
  "/creditkit": {
    name: "CreditKit",
    detail: "CreditKit is no longer offered for sale.",
  },
  "/baselens": {
    name: "BaseLens",
    detail: "BaseLens is no longer part of my active project list.",
  },
  "/applykit": {
    name: "ApplyKit",
    detail: "The ApplyKit brand is retired. The job tools inside FreeResumePost remain available there.",
  },
} as const;

const RetiredPage = () => {
  const [mode, setMode] = useThemeMode();
  const { pathname } = useLocation();
  const retired = RETIRED_ROUTES[pathname as keyof typeof RETIRED_ROUTES] ?? {
    name: "This page",
    detail: "This page is no longer active.",
  };

  useNoIndexHead({
    title: `${retired.name} retired | Alex Holmes`,
    description: `${retired.name} has been retired.`,
  });

  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <header className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 flex items-center justify-between">
        <Link to="/" className="landing-mono inline-flex items-center gap-2" style={{ color: "var(--ink)", opacity: 0.8, textDecoration: "none" }}>
          ← ALEX HOLMES
        </Link>
        <ThemeToggle mode={mode} onChange={setMode} />
      </header>

      <main className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
        <p className="landing-mono mb-5" style={{ color: "var(--accent-secondary)" }}>
          RETIRED
        </p>
        <h1 className="landing-display text-[clamp(3rem,10vw,6rem)] leading-none mb-8 period-dot">
          {retired.name} is closed
        </h1>
        <p className="text-base sm:text-lg max-w-xl" style={{ lineHeight: 1.7, opacity: 0.82 }}>
          {retired.detail} This page stays up so old links have a clear answer.
        </p>
        <Link
          to="/"
          className="landing-mono inline-flex items-center gap-2 mt-10 px-5 py-3.5"
          style={{ background: "var(--accent-primary)", color: "var(--accent-ink)", textDecoration: "none" }}
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO THE PORTFOLIO
        </Link>
      </main>
    </div>
  );
};

export default RetiredPage;
