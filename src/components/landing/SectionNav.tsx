import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Shared top-nav section links so every page lists every section, automatically.
 *
 * Add a page here ONCE and every page's nav picks it up. On the home page it
 * lists all sections; on a sub-page it leads with "← PORTFOLIO" and lists the
 * other sections, omitting the current one. Drop this between the <nav> wrapper
 * and the <ThemeToggle> on each page.
 */
const SECTIONS = [
  { to: "/freelance", label: "FREELANCE" },
  { to: "/creditkit", label: "CREDITKIT" },
  { to: "/baselens", label: "BASELENS" },
] as const;

export function SectionNav() {
  const { pathname } = useLocation();
  const others = SECTIONS.filter((s) => s.to !== pathname);
  const links =
    pathname === "/"
      ? [...others]
      : [{ to: "/", label: "← PORTFOLIO" }, ...others];

  return (
    <>
      {links.map((link, i) => (
        <Fragment key={link.to}>
          {i > 0 && (
            <span className="landing-mono" style={{ opacity: 0.3 }}>
              ·
            </span>
          )}
          <Link
            to={link.to}
            className="landing-mono inline-flex items-center gap-1"
            style={{ color: "var(--ink)", opacity: 0.85 }}
          >
            {link.label}
          </Link>
        </Fragment>
      ))}
    </>
  );
}
