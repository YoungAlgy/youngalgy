import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { changelogEntries, type ChangelogTag } from "@/data/changelog-entries";

/**
 * Workspace changelog. Lives behind the same PasswordGate as the dashboard.
 *
 * This page is intentionally NOT in robots.txt, sitemap.xml, or the public
 * landing footer. We force `noindex, nofollow` at the document level on
 * mount and restore the previous robots directive on unmount so the rest
 * of the SPA's pages remain indexable.
 */

const TAG_STYLES: Record<ChangelogTag, string> = {
  new: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 ring-1 ring-inset ring-indigo-500/20",
  improved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 ring-1 ring-inset ring-emerald-500/20",
  fixed: "bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-500/20",
  reliability: "bg-sky-500/10 text-sky-600 dark:text-sky-300 ring-1 ring-inset ring-sky-500/20",
  security: "bg-red-500/10 text-red-600 dark:text-red-300 ring-1 ring-inset ring-red-500/20",
};

const MONTH_FMT = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const DATE_FMT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const LAST_UPDATED_FMT = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });

function TagPill({ tag }: { tag: ChangelogTag }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${TAG_STYLES[tag]}`}
    >
      {tag}
    </span>
  );
}

const Changelog = () => {
  // Force noindex/nofollow on this route only; restore the public directive
  // on unmount. The default <meta name="robots"> in index.html is "index, follow"
  // for the public landing.
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const prev = meta?.content ?? "index, follow";
    if (meta) meta.content = "noindex, nofollow";
    const prevTitle = document.title;
    document.title = "Changelog · Alexander Holmes";
    return () => {
      if (meta) meta.content = prev;
      document.title = prevTitle;
    };
  }, []);

  const grouped = useMemo(() => {
    const buckets = new Map<string, typeof changelogEntries[number][]>();
    for (const entry of changelogEntries) {
      const key = entry.date.slice(0, 7); // YYYY-MM
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key)!.push(entry);
    }
    return Array.from(buckets.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([ym, entries]) => ({
        ym,
        label: MONTH_FMT.format(new Date(`${ym}-01T00:00:00`)),
        entries: entries.slice().sort((a, b) => b.date.localeCompare(a.date)),
      }));
  }, []);

  const lastUpdated = useMemo(() => {
    const latest = changelogEntries
      .map((e) => e.date)
      .sort()
      .at(-1);
    return latest ? LAST_UPDATED_FMT.format(new Date(`${latest}T00:00:00`)) : "—";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="container max-w-3xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-primary px-2 py-1 rounded border border-primary/30 bg-primary/5">
            Changelog
          </span>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
          Last updated {lastUpdated}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold mt-2 tracking-tight">Changelog</h1>
        <p className="text-muted-foreground mt-3 max-w-xl text-sm sm:text-base">
          User-visible changes to the dashboard and public site, most recent first. Hand-curated, not auto-generated.
        </p>

        <div className="mt-10 sm:mt-12 space-y-12">
          {grouped.map(({ ym, label, entries }) => (
            <section key={ym}>
              <h2 className="text-xs font-mono uppercase tracking-[0.22em] text-muted-foreground mb-4">
                {label}
              </h2>
              <div className="space-y-3">
                {entries.map((entry, i) => (
                  <Card key={`${entry.date}-${i}`} className="p-5 sm:p-6 border bg-card">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                        {DATE_FMT.format(new Date(`${entry.date}T00:00:00`))}
                      </span>
                      <TagPill tag={entry.tag} />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold leading-snug">{entry.title}</h3>
                    <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed mt-2">
                      {entry.body}
                    </p>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Changelog;
