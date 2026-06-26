import { Fragment, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Shared top-nav / footer section links so every page lists every section,
 * automatically.
 *
 * Add a page here ONCE and every page's nav and footer picks it up. On the home
 * page it lists all sections; on a sub-page it leads with "← PORTFOLIO" and
 * lists the other sections, omitting the current one. Use variant="footer" for
 * the muted footer styling. Drop it into the <nav> (before <ThemeToggle>) and
 * into the footer link row (before the legal/extra links).
 */
const SECTIONS = [
  { to: "/freelance", label: "FREELANCE" },
  { to: "/creditkit", label: "CREDITKIT" },
  { to: "/baselens", label: "BASELENS" },
] as const;

export function SectionNav({ variant = "header" }: { variant?: "header" | "footer" }) {
  const { pathname } = useLocation();
  const others = SECTIONS.filter((s) => s.to !== pathname);
  const links =
    pathname === "/"
      ? [...others]
      : [{ to: "/", label: "← PORTFOLIO" }, ...others];

  const linkStyle: CSSProperties =
    variant === "footer"
      ? { color: "var(--accent-secondary)", textDecoration: "none" }
      : { color: "var(--ink)", opacity: 0.85 };

  return (
    <>
      {links.map((link, i) => (
        <Fragment key={link.to}>
          {i > 0 && (
            <span className="landing-mono" style={{ opacity: 0.3 }}>
              ·
            </span>
          )}
          <Link to={link.to} className="landing-mono inline-flex items-center gap-1" style={linkStyle}>
            {link.label}
          </Link>
        </Fragment>
      ))}
    </>
  );
}
