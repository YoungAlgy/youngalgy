import { Link, useLocation } from "react-router-dom";

/**
 * The retired product pages no longer appear in shared navigation. Sub-pages
 * keep one clear route back to the portfolio.
 */
export function SectionNav({ variant = "header" }: { variant?: "header" | "footer" }) {
  const { pathname } = useLocation();
  if (pathname === "/") return null;

  const linkStyle = variant === "footer"
    ? { color: "var(--accent-secondary)", textDecoration: "none" }
    : { color: "var(--ink)", opacity: 0.85 };

  return <Link to="/" className="landing-mono inline-flex items-center gap-1" style={linkStyle}>← PORTFOLIO</Link>;
}
