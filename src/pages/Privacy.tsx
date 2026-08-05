import { Link } from "react-router-dom";
import { LegalLayout } from "@/components/landing/LegalLayout";
import { CONTACT_EMAIL } from "@/data/landing-content";

/**
 * Privacy — public policy for youngalgy.com, a static personal portfolio.
 *
 * Written to match what the site actually does — no boilerplate about data
 * we don't collect. Update if/when a contact form, signup, or third-party
 * tracker is added.
 */
const Privacy = () => (
  <LegalLayout
    title="Privacy"
    description="Privacy policy for youngalgy.com: what the public portfolio does (and doesn't) collect. Operated solely by Alexander Holmes."
    lastUpdated="2026-08-05"
  >
    <p>
      <strong>Short version:</strong> youngalgy.com is a personal site run by
      Alexander Holmes (Tampa, FL). It collects no personal information from
      visitors.
    </p>

    <h2>Who runs this site</h2>
    <p>
      youngalgy.com is operated solely by Alexander Holmes — a personal
      portfolio, not a company or a multi-user service. Questions go to{" "}
      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
    </p>

    <h2>The site</h2>
    <p>
      The page at <code>youngalgy.com</code> has no signup, no contact form,
      and no account system. It doesn&apos;t set advertising cookies or run
      fingerprinting. The only thing stored in your browser is a single{" "}
      <code>localStorage</code> entry remembering your theme choice
      (Alpha / Money Mitch). It never leaves your device.
    </p>
    <p>
      The site is hosted on <strong>Cloudflare Pages</strong> and runs no
      analytics or tracking scripts. Cloudflare keeps standard server request
      logs (IP, user-agent, referrer) for security and abuse prevention, as
      any web host does.
    </p>

    <h2>Third parties</h2>
    <p>
      <strong>Cloudflare Pages</strong> hosts the site, with no analytics.
      That&apos;s the only third party involved — no analytics or advertising
      networks are embedded.
    </p>

    <h2>Cookies &amp; storage</h2>
    <p>
      No advertising or cross-site tracking cookies. The only browser storage
      is the theme preference described above.
    </p>

    <h2>Your choices</h2>
    <p>
      Because the site collects no personal data, there&apos;s nothing to
      request or delete. You can clear the theme storage anytime via your
      browser. If you&apos;ve emailed me, you can ask me to delete that
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
