import { Link } from "react-router-dom";
import { LegalLayout } from "@/components/landing/LegalLayout";
import { CONTACT_EMAIL } from "@/data/landing-content";

/**
 * Terms — public terms of use covering both surfaces of youngalgy.com:
 *   1. the public portfolio landing ("/")
 *   2. the password-gated personal job-tracking dashboard ("/dashboard")
 *
 * Plain-English, honest about scope: this is a personal site + private tool,
 * not a commercial service with users. Governing law: Florida, USA.
 */
const Terms = () => (
  <LegalLayout
    title="Terms"
    description="Terms of use for youngalgy.com — Alexander Holmes's personal portfolio and private job-tracking tool. Provided as-is; governing law Florida."
    lastUpdated="2026-05-28"
  >
    <p>
      <strong>Short version:</strong> youngalgy.com is Alexander Holmes&apos;s
      personal portfolio, plus a private job-tracking tool for my own use.
      You&apos;re welcome to look around the public side. The dashboard is
      gated and not meant for public use. Everything is provided as-is.
    </p>

    <h2>Accepting these terms</h2>
    <p>
      By using youngalgy.com you agree to these terms and to the{" "}
      <Link to="/privacy">Privacy Policy</Link>. If you don&apos;t agree,
      please don&apos;t use the site.
    </p>

    <h2>The public landing page</h2>
    <p>
      The landing page is an informational portfolio — a record of projects
      I&apos;ve built and roles I&apos;ve held. Details and metrics are
      accurate to the best of my knowledge at the time of writing and may
      change. Nothing here is an offer, a guarantee of results, or
      professional advice.
    </p>

    <h2>The dashboard (private)</h2>
    <p>
      <code>youngalgy.com/dashboard</code> is a personal tool behind a password
      gate. It&apos;s provided for my own use, with no uptime guarantee, no
      support commitment, and no warranty. Don&apos;t attempt to bypass the
      gate, access data that isn&apos;t yours, or probe the tool for
      vulnerabilities. If you reached it by mistake, just head back to the{" "}
      <Link to="/">home page</Link>.
    </p>

    <h2>Intellectual property</h2>
    <p>
      The site&apos;s copy, design, code, and the project names referenced
      (Toggle Town, Bay Bite, The Downs, Alpha, and the rest) belong to
      Alexander Holmes unless attributed otherwise. Third-party names,
      trademarks, and logos mentioned (employers, platforms, collections)
      remain the property of their respective owners and are used for
      identification only — no affiliation or endorsement is implied.
    </p>

    <h2>External links</h2>
    <p>
      The site links out to other properties (toggle.town, Alpha, GitHub,
      LinkedIn, and project sites). I&apos;m not responsible for the content,
      availability, or practices of sites I don&apos;t control. Once you leave
      youngalgy.com, that destination&apos;s terms and privacy policy apply.
    </p>

    <h2>Disclaimer &amp; liability</h2>
    <p>
      The site and the tool are provided &quot;as is&quot; and &quot;as
      available,&quot; without warranties of any kind. To the fullest extent
      allowed by law, Alexander Holmes isn&apos;t liable for any damages
      arising from your use of — or inability to use — the site.
    </p>

    <h2>Governing law</h2>
    <p>
      These terms are governed by the laws of the State of Florida, USA,
      without regard to conflict-of-law rules.
    </p>

    <h2>Changes &amp; contact</h2>
    <p>
      These terms may be updated; the date at the top reflects the latest
      version. Questions go to{" "}
      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
    </p>
  </LegalLayout>
);

export default Terms;
