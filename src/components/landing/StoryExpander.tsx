import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Expandable "My Story" prose section.
 *
 * Shows the first two paragraphs always; the remaining five paragraphs
 * are revealed by a "Read the rest" button. The hidden block uses a
 * max-height transition so the expansion is animated.
 *
 * The copy lives here (not in src/data) because it's heavily formatted
 * JSX with em-dashes, apostrophes, and inline emphasis — putting it in
 * a .ts data file would lose that ergonomics. The component IS the content.
 *
 * Extracted from Landing.tsx during the 2026-04-29 cleanup.
 */
export function StoryExpander() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-4 text-foreground/90 leading-relaxed">
      <p>
        I studied Psychology at the University of South Florida because I wanted to understand
        how people make decisions and what makes a team actually move. That question never went
        away — it just kept finding new shapes.
      </p>
      <p>
        My first real ground was recruiting and healthcare staffing. I learned how to read an
        account, when to push, when to wait, and how to move product through relationships
        instead of around them. Sales fundamentals: listen first, follow through, do what you
        said you would.
      </p>

      <div
        className={cn(
          "space-y-4 overflow-hidden transition-all duration-500",
          expanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <p>
          The current chapter is Ava Health. I came in to place physicians, nurses, and therapists
          — and we now have 850K+ providers reachable. Somewhere along the way I realized the
          team needed better tools than what existed. So I started building. The CRM, the outreach
          automation, the Telnyx 10DLC SMS engine, an SEO surface that&apos;s 1,100+ pages and 204
          blog posts deep, a nationwide NPI data pipeline. Full-stack by necessity, sales-first
          by instinct.
        </p>
        <p>
          On the side I built Money Mitch — an artist management platform for musician Mitch.
          Same playbook, different industry: analytics dashboards, content distribution tooling,
          SEO for moneymitch.music, a view-as + viewer-role vault for the team. Sales and
          distribution principles apply to art too.
        </p>
        <p>
          Then there&apos;s Toggle Town — quant trading bots running on live Alpaca capital. Kalman
          filter state estimation, HMM regime detection, VWAP bands, sector rotation, a drawdown
          controller riding on top. Markets are another system to read and time. I treat them
          like accounts.
        </p>
        <p>
          On Universe XYZ I ran a Web3 charity program that raised more than $5M, including a
          $4.4M Lobby Lobsters NFT drop. Cross-functional program management at internet scale —
          engineering, creative, community, comms — pushed through a marketplace launch and
          landed it.
        </p>
        <p>
          Why I&apos;m here: sales, CS, and talent work still come first. That&apos;s the spine. But I
          bring the tools too. Relationship-driven, systems-building, ships fast, shows up early.
          If the team needs the playbook and the platform, I can do both.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors underline underline-offset-4 decoration-dotted"
      >
        {expanded ? "Show less ↑" : "Read the rest ↓"}
      </button>
    </div>
  );
}
