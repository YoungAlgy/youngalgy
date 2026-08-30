import { Link } from "react-router-dom";
import { LegalLayout } from "@/components/landing/LegalLayout";
import { CONTACT_EMAIL } from "@/data/landing-content";

/**
 * Public terms of use for youngalgy.com, a static personal portfolio.
 *
 * Plain-English, honest about scope: this is a personal site, not a
 * commercial service with users. Governing law: Florida, USA.
 */
const Terms = () => (
  <LegalLayout
    title="Terms"
    description="Terms of use for Alex Holmes's personal portfolio at youngalgy.com."
    lastUpdated="2026-08-29"
  >
    <p>
      <strong>Short version:</strong> youngalgy.com is Alex Holmes&apos;s
      personal portfolio. You&apos;re welcome to look around. Everything is
      provided as-is.
    </p>

    <h2>Accepting these terms</h2>
    <p>
      By using youngalgy.com you agree to these terms and to the{" "}
      <Link to="/privacy">Privacy Policy</Link>. If you don&apos;t agree,
      please don&apos;t use the site.
    </p>

    <h2>The site</h2>
    <p>
      The landing page is an informational portfolio, a record of projects
      I&apos;ve built and roles I&apos;ve held. Details and metrics are
      accurate to the best of my knowledge at the time of writing and may
      change. Nothing here guarantees results or serves as professional advice.
    </p>

    <h2>Intellectual property</h2>
    <p>
      The site&apos;s original copy and design belong to Alex Holmes unless noted.
      Other names and marks belong to their respective owners. They are used for
      identification. Their use does not claim an endorsement.
    </p>

    <h2>External links</h2>
    <p>
      The site links to other websites. I&apos;m not responsible for the content
      or practices of sites I don&apos;t control. Once you leave
      youngalgy.com, that destination&apos;s terms and privacy policy apply.
    </p>

    <h2>Disclaimer &amp; liability</h2>
    <p>
      The site is provided &quot;as is&quot; and &quot;as
      available,&quot; without warranties of any kind. To the fullest extent
      allowed by law, Alex Holmes isn&apos;t liable for any damages
      arising from your use of (or inability to use) the site.
    </p>

    <h2>Governing law</h2>
    <p>
      These terms are governed by the laws of the State of Florida, USA,
      without regard to conflict-of-law rules.
    </p>

    <h2>Changes &amp; contact</h2>
    <p>
      These terms may be updated. The date at the top reflects the latest
      version. Questions go to{" "}
      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
    </p>
  </LegalLayout>
);

export default Terms;
