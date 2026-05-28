import { Link } from "react-router-dom";
import { LegalLayout } from "@/components/landing/LegalLayout";
import { CONTACT_EMAIL } from "@/data/landing-content";

/**
 * Privacy — public policy covering both surfaces of youngalgy.com:
 *   1. the public portfolio landing ("/")
 *   2. the password-gated personal job-tracking dashboard ("/dashboard")
 *
 * Written to match what the site actually does — no boilerplate about data
 * we don't collect. Update if/when a contact form, signup, or third-party
 * tracker is added.
 */
const Privacy = () => (
  <LegalLayout
    title="Privacy"
    description="Privacy policy for youngalgy.com — what the public portfolio and the private job-tracking dashboard do (and don't) collect. Operated solely by Alexander Holmes."
    lastUpdated="2026-05-28"
  >
    <p>
      <strong>Short version:</strong> youngalgy.com is a personal site run by
      Alexander Holmes (Tampa, FL). The public landing page collects no
      personal information from visitors. The dashboard behind it is a private,
      password-gated tool I use to track my own job search — it isn&apos;t a
      product that collects data about you.
    </p>

    <h2>Who runs this site</h2>
    <p>
      youngalgy.com is operated solely by Alexander Holmes — a personal
      portfolio plus a private tool, not a company or a multi-user service.
      Questions go to{" "}
      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
    </p>

    <h2>The public landing page</h2>
    <p>
      The page at <code>youngalgy.com</code> has no signup, no contact form,
      and no account system. It doesn&apos;t set advertising cookies or run
      fingerprinting. The only thing stored in your browser is a single{" "}
      <code>localStorage</code> entry remembering your theme choice
      (Miami / Pirate) — it never leaves your device.
    </p>
    <p>
      The site is hosted on <strong>Vercel</strong> and uses{" "}
      <strong>Vercel Analytics</strong>, which records privacy-friendly,
      aggregate pageview metrics without cookies and without identifying
      individual visitors. Vercel also keeps standard server request logs
      (IP, user-agent, referrer) for security and abuse prevention, as any web
      host does.
    </p>

    <h2>The dashboard (private)</h2>
    <p>
      <code>youngalgy.com/dashboard</code> (and the related changelog) sit
      behind a password gate. It&apos;s a single-operator tool — I use it to
      track <em>my own</em> job applications. It is not a sign-up product and
      does not collect, profile, or store information about visitors or third
      parties.
    </p>
    <p>
      The application records I enter (job title, company, listing URL, source,
      status, my own notes, and draft cover letters) are stored in a{" "}
      <strong>Supabase</strong> Postgres database. That data is mine, about my
      own job search; it is not sold, shared, or used for advertising.
    </p>

    <h2>Third parties</h2>
    <ul>
      <li><strong>Vercel</strong> — hosting + privacy-friendly analytics for the whole site.</li>
      <li><strong>Supabase</strong> — database for the private dashboard only.</li>
    </ul>
    <p>
      Each has its own privacy practices. No analytics or advertising networks
      beyond the above are embedded.
    </p>

    <h2>Cookies &amp; storage</h2>
    <p>
      No advertising or cross-site tracking cookies. The site uses only
      functional browser storage: the theme preference described above, and a
      session flag that remembers you&apos;ve passed the dashboard password gate
      so you don&apos;t have to re-enter it on every page.
    </p>

    <h2>Your choices</h2>
    <p>
      Because the public site collects no personal data, there&apos;s nothing
      to request or delete. You can clear the theme/gate storage anytime via
      your browser. If you&apos;ve emailed me, you can ask me to delete that
      correspondence at{" "}
      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
    </p>

    <h2>Changes</h2>
    <p>
      If the site ever adds a form, signup, or new tracker, this page gets
      updated and the date at the top changes. See the{" "}
      <Link to="/terms">Terms</Link> for the rules of use.
    </p>
  </LegalLayout>
);

export default Privacy;
