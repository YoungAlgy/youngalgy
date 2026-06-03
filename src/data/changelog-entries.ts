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
  // ─── June 2026 ───────────────────────────────────────────────────────
  {
    date: "2026-06-03",
    title: "Added the local-food marketplace to the timeline",
    body: "New 2026 entry on the route/timeline: a two-sided local-food marketplace — Stripe Connect payouts, farm storefronts, pickup/delivery. Another shipped product in the builder story.",
    tag: "improved",
  },
  {
    date: "2026-06-02",
    title: "Landing hero now says what I actually do",
    body: "The homepage hero was just my name and two buttons — a first-time visitor (or a founder I'd just messaged) had no idea what I do until they scrolled. Added one understated line right under the name: full-stack product engineer who ships solo, ~12 products live across healthcare data, music, quant, and web3. States the work and stops — the case studies below carry the proof. Theme-agnostic — reads right in both the Pirate and Miami palettes.",
    tag: "improved",
  },
  {
    date: "2026-06-02",
    title: "\"Saved\" is now a status you can set on a lead",
    body: "You can now mark an opportunity as Saved — a lead you want to act on but haven't applied to yet — right from the status dropdown. Previously Saved rows could exist but you couldn't select the status in the UI, so researched-but-not-yet-sent leads had nowhere clean to live. Now they sit at the top of the status list, distinct from Applied, so your queue of \"go fire these\" targets is visible and trackable alongside everything in flight.",
    tag: "improved",
  },
  // ─── May 2026 ────────────────────────────────────────────────────────
  {
    date: "2026-05-28",
    title: "Privacy Policy + Terms of Use shipped (public, covering the site and the dashboard)",
    body: "youngalgy.com now has real /privacy and /terms pages instead of dead footer links. They're public (reachable without the dashboard password — legal pages always should be) and styled to match the landing's Miami/Pirate theme. Each policy explicitly covers both surfaces: the public portfolio (no signup, no tracking beyond privacy-friendly Vercel Analytics, theme preference stored locally) and the private password-gated dashboard (a single-operator job tracker backed by Supabase — not a data-collecting product). Footer links now appear on the landing, the dashboard, the changelog, and the password gate, so you can reach the policies from anywhere. Governing law is Florida; contact routes to the site email.",
    tag: "new",
  },
  {
    date: "2026-05-28",
    title: "Web3 case study + route now lead with Futureverse and the advisory track record",
    body: "The internet-art case study was under-selling the Web3 era — it only named Universe XYZ, BAYC, and OpenSea. It now leads with Futureverse (core/early contributor — minted the first NFT from Pixel Of The Apes, then helped steer Fluf World, Altered State Machines, and The Root Network L1) and folds in the full advisory track record: advisor + seed backer across 5 Web3 projects plus hundreds of founders pro bono. The card period widened from 2021–2022 to 2021–2025 to cover the whole run, and the Polymorphs shipping credit (first changeable-outfit character NFTs on Ethereum) is now stated outright. The Route timeline picks up two matching rows — a 2021 Futureverse core-contributor row and a 2022 'advisor + seed · 5 Web3 projects + 100s of founders' row — and the Web3 loadout adds Metaverse / L1 and Advisory + seed chips. Brings the landing in line with the resume + LinkedIn + Indeed, where Futureverse was added across the board.",
    tag: "improved",
  },
  {
    date: "2026-05-26",
    title: "Route picks up Bay Bite (toggle.town/fishing) in the 2026 SaaS row",
    body: "The 2026 'personal SaaS + dashboards' row now lists Bay Bite alongside The Downs and the other niche-hobby tool apps — natural pairing since both Bay Bite (Tampa Bay fishing log) and The Downs (horse-racing bot dashboard) are passion-project apps shipped through Toggle Town. Bay Bite v0.2.0 went live 2026-05-24 at toggle.town/fishing with tab-bar nav, shared catch log on Supabase, and the first three layers of the learning loop active.",
    tag: "improved",
  },
  {
    date: "2026-05-26",
    title: "Contact pitch now opens the freelance lane alongside W-2 roles",
    body: "Contact section subtitle adds 'Available for select freelance app builds' between the operator/builder/GTM line and the Tampa location line. Net-new lane signal — until now the landing only invited recruiters for full-time roles, with no surface for founders or operators who want a build done on contract. The 'select' framing keeps it from sounding spammy/hungry; the existing operator/builder/GTM line still leads so the W-2 positioning isn't diluted.",
    tag: "improved",
  },
  {
    date: "2026-05-21",
    title: "Dashboard overhaul: lanes, best-shots, stale sweep, cadence, source ROI, time-to-reply, perf",
    body: "Biggest dashboard pass in a while. SNAPSHOT: new 'Best Shots' card surfaces the top-5 high-score (≥7) apps still awaiting a reply so Anchorage Digital (score 9) and other strongest bets stay front-of-mind instead of buried in the kanban. New 'Stale sweep' action only appears when there are apps stuck in 'Applied' for >14 days with no reply; one click bulk-marks them all ghosted (with a confirm step) so the funnel reads honest. The Pipeline funnel drops the 'Hired' bar — always 0 and just noise. Stats grid grows from 7 tiles to 8 with a new 'Days Since Last' apply cadence tile (green at 0d, info 1-3d, warning 4-7d, destructive 8+d) so the daily-discipline streak is visible at a glance. TRENDS: new 'By Lane' breakdown table groups apps as CRYPTO / OPERATOR / SUPPORT / RECRUITING / CSM / MARKETING / ENGINEERING / OTHER (derived client-side from title + company + source), showing reply-rate and positive-rate per lane so the overclaim trap is visible — the lanes you're firing into vs the lanes that actually reply. New 'Source ROI' table shows total / replied / reply% / positive% per source, sorted by reply rate so the highest-signal sources bubble to the top — apply effort should follow the signal, not the volume habit. New 'Time to First Reply' bar chart buckets replies by 0-3d (auto-bin, destructive red), 4-7d (quick human, info blue), 8-14d (slow human, warning amber), 15+d (late/backfill, muted) so it's clear whether rejections are mostly algorithmic auto-filters firing on years-in-role gates or real humans reading the apps. FILTERS: new Lane chip strip in the FilterBar — multi-select to narrow the kanban/table by lane (chip color matches the lane dot in Best Shots). Lane filter is URL-deep-linked via the ?lane= param. PERF: the Recharts-backed components (DailyApps, SourcePie, SalaryHist, TimeToReply) are now lazy-loaded behind Suspense fallbacks so the initial paint isn't blocked by the 410KB recharts chunk — the renderer no longer freezes when scrolling past the Trends section.",
    tag: "new",
  },
  {
    date: "2026-05-17",
    title: "Route + loadout refresh, contact pitch + CTA polish, dashboard reply-time insight",
    body: "Route timeline picks up three new 2026 rows — Studio (browser audio + mastering), The Downs (horse-racing bot dashboard), and Toggle Town pixel-art hub game — then collapses the 2026 cluster from 11 rows down to 4 by lane: Ava Health + Beacon as the healthcare row, Money Mitch Vault + Studio + Toggle Town hub as the music + audio + game row, Alpha + FreeJobPost + FreeResumePost + Mitchmark + The Downs + job-seeker dashboard as the personal SaaS + dashboards row, and Quant trading bots as its own row. The loadout reordered to lead with Software / Web3 / Markets & Quant first, with Sales & Recruiting moved last to reflect where the actual track record sits. Contact pitch now reads 'Open to operator, builder, and GTM roles. Tampa, FL — remote or hybrid' so recruiters across operator + GTM lanes see themselves in it. Footer was showing ALEXANDER HOLMES twice (in the copyright AND as a right-side wordmark); removed the right-side one and rebalanced the grid to two columns. SEE THE WORK in the hero opens Toggle.Town in a new tab again, reverting the in-page anchor from the prior day. Dashboard Snapshot adds a Median Days to Reply tile (replaced the Stale tile, which was redundant with Awaiting Reply) so it's clear at a glance whether rejections are mostly algorithmic auto-filters (<4d, shown destructive-red) or human review (7d+, shown info-blue).",
    tag: "improved",
  },
  {
    date: "2026-05-16",
    title: "Hero tagline pulled back — just the name and the CTAs",
    body: "The healthcare-software/healthcare-talent tagline shipped yesterday didn't read right. Hero is back to just ALEXANDER HOLMES. with the two CTAs underneath.",
    tag: "fixed",
  },
  {
    date: "2026-05-15",
    title: "Landing hero work CTA scrolls to the work",
    body: "The 'SEE THE WORK' button now anchors to the case studies on the same page instead of bouncing to Toggle.Town (still linked in the footer).",
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
