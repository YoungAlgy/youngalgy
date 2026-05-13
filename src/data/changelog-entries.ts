/**
 * Workspace changelog. Hand-curated entries — NOT auto-generated from git.
 * Write in the language a dashboard user would notice the change. No
 * commit hashes, no file paths, no "P0 bug" framing.
 *
 * Tag conventions:
 *   new         — net-new feature you can now use
 *   improved    — existing feature got better / faster / cleaner
 *   fixed       — broken thing now works
 *   reliability — perf, load, infra — invisible but felt
 *   security    — auth, RLS, hardening
 *
 * Newest entry first. Date is ISO YYYY-MM-DD (used to group by month).
 */

export type ChangelogTag = "new" | "improved" | "fixed" | "reliability" | "security";

export interface ChangelogEntry {
  date: string;        // ISO YYYY-MM-DD
  title: string;
  body: string;
  tag: ChangelogTag;
}

export const changelogEntries: readonly ChangelogEntry[] = [
  {
    date: "2026-05-13",
    title: "Dashboard favicon now matches the dashboard theme",
    body: "When you're on /dashboard, the browser tab icon switches from the public-site boat mark to the pink-skull logo so you can spot the dashboard tab in a sea of others. Reverts to the public mark on every other page.",
    tag: "improved",
  },
  {
    date: "2026-05-13",
    title: "Public youngalgy.com landing fully rebuilt",
    body: "The portfolio at youngalgy.com now has a runtime Miami / Pirate theme toggle, case studies for Ava Health · Universe XYZ · Money Mitch · Quant Trading, a route timeline, and a clean contact section. Dashboard area unchanged.",
    tag: "new",
  },
  {
    date: "2026-05-08",
    title: "Daily Applications chart renders correctly across timezones",
    body: "Bars were silently misaligned by one day when crossing midnight — fixed. Counts now reflect the day the application was actually submitted in your local timezone.",
    tag: "fixed",
  },
  {
    date: "2026-04-27",
    title: "Faster dashboard load + lighter database load",
    body: "Stats cards, charts, and analytics now derive from the same in-memory job list instead of firing six separate database queries on every mount. Background polling extended from 30 to 90 seconds.",
    tag: "reliability",
  },
  {
    date: "2026-04-19",
    title: "Kanban board for your pipeline",
    body: "Drag applications between Submitted · Phone Screen · Interview · Offer · Hired columns. The Board view is now the default — switch to By Job or By Company anytime with the view-toggle in the toolbar.",
    tag: "new",
  },
  {
    date: "2026-04-19",
    title: "Drip campaigns auto-pause on reply",
    body: "When a candidate replies, any scheduled follow-up emails in that thread are paused automatically. No more sending a Day 3 nudge after someone already wrote back.",
    tag: "improved",
  },
  {
    date: "2026-04-19",
    title: "Hot Leads + funnel-stage leaderboard",
    body: "New section surfaces applications with engagement signals (recruiter views, link clicks, opens). Leaderboard view ranks companies by pipeline stage and stale-since-applied days.",
    tag: "new",
  },
  {
    date: "2026-04-18",
    title: "Filter Bar Clear button resets search and funnel too",
    body: "Previously Clear only reset the filter sliders, leaving the search box and pipeline-stage selection sticky. Now one click wipes everything back to the default view.",
    tag: "fixed",
  },
  {
    date: "2026-04-17",
    title: "Coverage heatmap by metro",
    body: "New view shows where you've actually been applying — color-coded by application density across U.S. metros. Helpful for spotting geographic blind spots in your sourcing.",
    tag: "new",
  },
];
