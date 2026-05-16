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
 *
 * When shipping a user-visible change to either youngalgy.com landing OR
 * the /dashboard area, PREPEND a new entry to this array in the same
 * commit before declaring the work done.
 */

export type ChangelogTag = "new" | "improved" | "fixed" | "reliability" | "security";

export interface ChangelogEntry {
  date: string;        // ISO YYYY-MM-DD
  title: string;
  body: string;
  tag: ChangelogTag;
}

export const changelogEntries: readonly ChangelogEntry[] = [
  // ─── May 2026 ────────────────────────────────────────────────────────
  {
    date: "2026-05-15",
    title: "Landing hero gets a tagline + the work CTA scrolls to the work",
    body: "Recruiters who land on youngalgy.com now see what you do without scrolling: 'Builds healthcare software. Places healthcare talent. Ava Health · 1.4M+ provider directory · Tampa, FL — open to remote + hybrid Tampa roles.' The 'SEE THE WORK' button now anchors to the case studies on the same page instead of bouncing to Toggle.Town (still linked in the footer).",
    tag: "improved",
  },
  {
    date: "2026-05-15",
    title: "Dashboard header reads 'Alexander' to match resume + LinkedIn",
    body: "Logo wordmark and full lockup now display 'Alexander' instead of 'Algernon' or 'Algy', matching the professional name used on the resume, LinkedIn, and job applications. SkullCrest's screen-reader label updated to match.",
    tag: "fixed",
  },
  {
    date: "2026-05-15",
    title: "Rejection log now sorts by when the rejection arrived",
    body: "Recent Rejections used to sort by submission date, so a fresh rejection of an old application would hide behind newer-but-still-open rows. Now it sorts by the reply date and shows when the rejection actually landed.",
    tag: "fixed",
  },
  {
    date: "2026-05-15",
    title: "Added a 'Today' tile to the dashboard snapshot",
    body: "New stat tile shows how many applications you've submitted today (local calendar day, resets at midnight). Sits next to Total Submitted and This Week so you can see at a glance whether you've hit the day's pace already.",
    tag: "new",
  },
  {
    date: "2026-05-14",
    title: "Timeline tightened — labels trimmed, NOW row removed",
    body: "Pulled the personal-relation tag off Mitchmark (now just 'prospect dashboard'), dropped the price tag off Alpha (now just 'digest app'), and trimmed the job-seeker dashboard row to its core. Removed the standalone '1.4M+ healthcare professionals — NOW' row; that stat already lives in the Ava Health case study and was double-counting on the timeline.",
    tag: "improved",
  },
  {
    date: "2026-05-14",
    title: "Timeline rebuilt: Toggle Money 2015, Toggle Town 2019, 2026 ship-list expanded",
    body: "Toggle Money (the recording studio) now anchors 2015. Toggle Town slots into 2019 as the esports brand it actually was. 2026 picks up six more rows for the apps shipped this year: Money Mitch Vault, Beacon, FreeJobPost + FreeResumePost, Mitchmark, Alpha, and the job-seeker dashboard + youngalgy.com landing itself.",
    tag: "improved",
  },
  {
    date: "2026-05-14",
    title: "Timeline dates corrected on the landing page",
    body: "Mitch's Big Gates signing moved to 2018. The 'USF · Psychology (begins)' row was dropped — the 2020 graduation row covers the education arc on its own. The Money Mitch case-study period now reads 2018 — present to match.",
    tag: "fixed",
  },
  {
    date: "2026-05-14",
    title: "Nav and footer links open in a new tab",
    body: "Clicking Alpha, Dashboard, or Toggle.Town from the landing nav (or Alpha / Toggle.Town from the footer) now opens the destination in a fresh tab instead of replacing the landing tab. Keeps the portfolio open while you side-quest.",
    tag: "improved",
  },
  {
    date: "2026-05-14",
    title: "Company view gets a mobile card layout",
    body: "The By Company view used to force a 7-column horizontal scroll on phones. Now on mobile it renders as tap-to-expand cards (company + count, latest role, status mix bar, last-applied date) — matches the existing JobTable mobile pattern. Desktop table view unchanged.",
    tag: "improved",
  },
  {
    date: "2026-05-13",
    title: "Internal Changelog page launches",
    body: "New /changelog page lives behind the dashboard's auth gate. Hand-curated list of every user-visible change to the dashboard and the public landing, newest first. Linked from the dashboard header next to Export CSV.",
    tag: "new",
  },
  {
    date: "2026-05-13",
    title: "Public youngalgy.com landing fully rebuilt",
    body: "The portfolio at youngalgy.com now has a runtime Miami / Pirate theme toggle, case studies for Ava Health · Universe XYZ · Money Mitch · Quant Trading, a Route timeline, and a cleaner contact section. Dashboard area unchanged.",
    tag: "new",
  },
  {
    date: "2026-05-13",
    title: "Mobile responsive pass on the landing",
    body: "Tightened nav, hero CTAs, the Route, contact, and footer for iPhone- and iPad-sized screens. CTAs stack full-width on phones, the nav no longer overflows, footer columns center on single-column mobile layouts.",
    tag: "improved",
  },
  {
    date: "2026-05-13",
    title: "Dashboard favicon matches the dashboard theme",
    body: "When you're on /dashboard or /changelog, the browser tab icon switches from the public-site boat mark to the pink-skull logo so you can spot the dashboard tab in a sea of others. Reverts on every other page.",
    tag: "improved",
  },
  {
    date: "2026-05-13",
    title: "Ava Health provider stat bumped 850K → 1.4M+",
    body: "Live unique-NPI count crossed 1.4M today after the NPPES bulk ingest. The Ava Health case study on the landing, the route timeline, and the US-map illustration now all reflect the verified post-dedupe figure.",
    tag: "improved",
  },

  // ─── May 8 — Polish + accessibility blitz ────────────────────────────
  {
    date: "2026-05-08",
    title: "Daily Applications chart renders correctly across timezones",
    body: "Bars were silently misaligned by one day when crossing midnight — fixed. Counts now reflect the day the application was actually submitted in your local timezone.",
    tag: "fixed",
  },
  {
    date: "2026-05-08",
    title: "Password gate no longer hangs on network errors",
    body: "If Supabase didn't respond on first load the loading spinner would spin forever and you'd never see the password form. Now times out cleanly and shows the sign-in screen so you can retry.",
    tag: "fixed",
  },
  {
    date: "2026-05-08",
    title: "Kanban edit button visible on touch devices",
    body: "The edit pencil on each Kanban card was hidden behind a hover state, which meant it was invisible on iPad and phones. Now it always shows on touch devices.",
    tag: "fixed",
  },
  {
    date: "2026-05-08",
    title: "Status colors unified across the dashboard",
    body: "Phone Screen is now consistently blue, Interview is purple, Offer/Hired are green, Rejected is red — wherever a status appears (Kanban, table, badge, funnel). Was inconsistent before.",
    tag: "improved",
  },
  {
    date: "2026-05-08",
    title: "Save as PDF expands collapsed sections",
    body: "When you print the landing page or save it as PDF from the browser, hidden 'expand to read more' sections now auto-expand so the full content makes it into the PDF.",
    tag: "improved",
  },
  {
    date: "2026-05-08",
    title: "Screen-reader + keyboard accessibility pass",
    body: "Every interactive control on the dashboard got an aria-label, focus states, and keyboard reachability. Status dropdowns, view-mode toggles, filter pills, search input, sort select, and the company-row expand button are all reachable without a mouse.",
    tag: "improved",
  },
  {
    date: "2026-05-08",
    title: "Filter Bar Clear resets search and funnel too",
    body: "Previously Clear only reset the filter sliders, leaving the search box and pipeline-stage selection sticky. Now one click wipes everything back to the default view.",
    tag: "fixed",
  },

  // ─── Apr 27 — Reply tracking + perf ──────────────────────────────────
  {
    date: "2026-04-27",
    title: "Reply tracking: log when and how recruiters respond",
    body: "New first_reply_at + reply_kind fields on each application. Mark a thread as Interview, Reject, Auto-reply, etc. so the Response Rate stat reflects actual signal instead of just submissions.",
    tag: "new",
  },
  {
    date: "2026-04-27",
    title: "Reply-state filter pills",
    body: "New filter chips in the toolbar: Awaiting reply / Replied. Combine with status filters to find e.g. 'Phone Screen status but never replied to my email'.",
    tag: "new",
  },
  {
    date: "2026-04-27",
    title: "Edit drawer adds reply fields",
    body: "When you click into an application you can now set first_reply_at (date the recruiter responded) and reply_kind from the drawer. Was previously only editable via direct SQL.",
    tag: "new",
  },
  {
    date: "2026-04-27",
    title: "Faster dashboard load + lighter database load",
    body: "Stats cards, pipeline funnel, daily-apps chart, source pie, salary histogram now derive from the same in-memory job list instead of firing six separate database queries on every mount. Background polling extended from 30 to 90 seconds.",
    tag: "reliability",
  },

  // ─── Apr 26 — Real auth ──────────────────────────────────────────────
  {
    date: "2026-04-26",
    title: "Real authentication + RLS lockdown",
    body: "Dashboard now requires a real Supabase auth session, not just a cosmetic password check. Postgres Row-Level Security is enabled on the opportunities table so even a leaked anon key can't read your data. Sessions persist about a week.",
    tag: "security",
  },

  // ─── Apr 25 — Brand pivot ────────────────────────────────────────────
  {
    date: "2026-04-25",
    title: "Public landing pivots to psychedelic skull crest",
    body: "Hero gets the 5-stop electric gradient and the floating SkullCrest centerpiece. Replaces the earlier Logo-only hero. Anchor for the 'Sales-first, builder-brained' identity through April-May.",
    tag: "new",
  },
  {
    date: "2026-04-25",
    title: "Unified AH glyph + Dashboard link in nav",
    body: "Refined the AH wordmark and added a Dashboard button to the public-site nav so the password-gated workspace is reachable in one click from any page.",
    tag: "improved",
  },

  // ─── Apr 24 — Vercel migration + landing v2 ──────────────────────────
  {
    date: "2026-04-24",
    title: "Save as PDF support on the public landing",
    body: "Browser Print → Save as PDF now produces a clean single-column resume version of the landing. Hides decorative gradients, expands collapsed sections, prints in light-on-white.",
    tag: "new",
  },
  {
    date: "2026-04-24",
    title: "Live CRM section on the landing",
    body: "New section on the public landing showcasing the Ava Health CRM work — the directory the public dashboard hides behind auth. PII scrubbed; representative screenshots only.",
    tag: "new",
  },
  {
    date: "2026-04-24",
    title: "Design refresh: Logo component + Space Grotesk type",
    body: "Standardized on Space Grotesk display + Inter body across the landing. Replaced ad-hoc SVG logos with a single Logo component. Tightened hero spacing so the H1 sits properly at all viewport widths.",
    tag: "improved",
  },

  // ─── Apr 17–18 — Dashboard expansion ─────────────────────────────────
  {
    date: "2026-04-18",
    title: "Edit Job drawer with status, notes, salary",
    body: "Click an application row and a side drawer opens with editable fields for status, status notes, salary, source, and free-form notes. Was previously read-only.",
    tag: "new",
  },
  {
    date: "2026-04-17",
    title: "Stats cards row land at the top of the dashboard",
    body: "Six metric cards across the top: Total Submitted, This Week, Awaiting Reply, Interviews, Stale (>14d), Response Rate. Replaces the old single 'count' header.",
    tag: "new",
  },

  // ─── Apr 15 — Project genesis ────────────────────────────────────────
  {
    date: "2026-04-15",
    title: "Dashboard goes live",
    body: "First production cut of the job-search workspace: applications table, Kanban board view, interview scheduler, dark/light theme toggle. Backed by Supabase so the data follows you across devices.",
    tag: "new",
  },
];
