import { Link } from "react-router-dom";
import { LegalLayout } from "@/components/landing/LegalLayout";
import { CONTACT_EMAIL } from "@/data/landing-content";

/**
 * Privacy policy for youngalgy.com, a personal site with an explorable House.
 *
 * Written to match what the site actually does — no boilerplate about data
 * we don't collect. Update if/when a contact form, signup, or third-party
 * tracker is added.
 */
const Privacy = () => (
  <LegalLayout
    title="Privacy"
    description="Privacy policy for youngalgy.com."
    lastUpdated="2026-09-04"
  >
    <p>
      <strong>Short version:</strong> youngalgy.com is a personal site run by
      Alexander &quot;Alex&quot; Holmes in Tampa, Florida. The site has no signup or
      contact form. Its hosting and font services receive standard request data when the page loads.
    </p>

    <h2>Who runs this site</h2>
    <p>
      youngalgy.com is Alex Holmes&apos;s personal site, containing an explorable
      Algy&apos;s House and music by Young Algy. Questions go to{" "}
      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
    </p>

    <h2>The site</h2>
    <p>
      The page at <code>youngalgy.com</code> has no signup or account system.
      Contact happens by email. The site does not set advertising cookies or run
      fingerprinting. The House stores your mute and music-volume preference in{" "}
      <code>localStorage</code> as <code>youngalgy:house-audio</code>. It also
      keeps your current room and position in tab <code>sessionStorage</code> so
      you can resume the House while the tab is open. This information stays in
      your browser and is not sent to me.
    </p>
    <p>
      The site is hosted on <strong>Cloudflare Pages</strong> and runs no
      analytics or tracking scripts. Cloudflare may process standard request
      data such as your IP address and browser information for delivery and security.
    </p>

    <h2>Third parties</h2>
    <p>
      <strong>Cloudflare Pages</strong> hosts and delivers the site.
      <strong> Google Fonts</strong> provides some typefaces and may receive
      standard request data when your browser downloads them. The site does not embed
      an advertising network.
    </p>

    <h2>Cookies &amp; storage</h2>
    <p>
      The site does not set advertising or cross-site tracking cookies. Browser
      storage includes the House audio preference and current House room and
      position described above. Legal and retired pages also use the existing{" "}
      <code>landing-mode</code> theme preference. These settings stay in your
      browser and are not used for advertising or cross-site tracking.
    </p>

    <h2>Your choices</h2>
    <p>
      You can clear the House audio, room, position, and theme settings through
      your browser. If you&apos;ve
      emailed me, you can ask me to delete that correspondence at{" "}
      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
    </p>

    <h2>Changes</h2>
    <p>
      This page will be updated if the site&apos;s data use changes. The date at
      the top shows the latest version. See the{" "}
      <Link to="/terms">Terms</Link> for the rules of use.
    </p>
  </LegalLayout>
);

export default Privacy;
