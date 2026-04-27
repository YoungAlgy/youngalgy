import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { SkullCrest } from "@/components/SkullCrest";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users, Sparkles, LineChart, TrendingUp, Utensils, HardHat,
  Mail, Linkedin, MapPin, Github, Music, Gem,
  FileText, Rocket, ArrowUpRight, Printer, Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CONTACT_EMAIL = "youngalgy@gmail.com";

// Tag chips that replace the older numbered "01–05" stat grid.
// Hero body copy already says "12 years placing + shipping" — so the
// chips skip restating that and instead anchor the 5 worlds I operate in.
const heroChips = [
  "Healthcare Recruiter",
  "CRM Builder",
  "Trader / Quant",
  "Music Industry",
  "Web3 Founding Member",
];

const recruiterTags = [
  "Tampa, FL",
  "Open to roles",
  "Sales / CS / Product / Ops",
  "Fortune 1000 ready",
];

const timeline = [
  { year: "2014–2020", title: "Server, Charley's Steakhouse",
    detail: "Six years across every role in the restaurant — kitchen, host, busser, checkout, server. Where I learned to read a room, carry pressure, and hit a rhythm under load." },
  { year: "2014–2017", title: "A.A. Psychology, St. Petersburg College",
    detail: "Dual enrolled my senior year of high school; finished the associate's before transferring." },
  { year: "2015", title: "Music agent + Toggle Money founder",
    detail: "Started managing my brother Money Mitch and founded Toggle Money recording studio in Tampa. He signed with Big Gates Records at 17 on the back of that work." },
  { year: "2017–2020", title: "B.A. Psychology, USF",
    detail: "Transferred to the University of South Florida. Focused on decision-making, motivation, and team dynamics — the foundation for everything that came after." },
  { year: "2019", title: "Road Manager, Big Gates Records + Toggle Town",
    detail: "Bookings, social, point of contact for Mitch under Big Gates. Separately founded Toggle Town — amateur esports channel curating community gameplay." },
  { year: "2020", title: "Holmes Builders Representative",
    detail: "Family construction business — marketing, investor pitch deck, land auctions, and on-site project experience." },
  { year: "2021", title: "Angel investor",
    detail: "Started angel-investing through my network of celebrities, traders, and operators. Constantly scouting innovative teams to back early." },
  { year: "2021–2022", title: "Project Manager, Universe XYZ",
    detail: "Led digital collectible drops and the marketplace build. Program raised $5M+ for charity including the $4.4M Lobby Lobsters drop. Founding-collective member of BAYC; seed investor in OpenSea." },
  { year: "2025", title: "Toggle Town trading bots go live",
    detail: "Algorithmic trading on live Alpaca capital — Kalman filter state estimation, HMM regime detection, VWAP bands, drawdown controller. Markets are another system to read and time." },
  { year: "2026", title: "Healthcare Recruiter + CRM Builder, Ava Health",
    detail: "Joined Ava Health on contract placing physicians nationwide + nurses/therapists in FL. Designed and built Ava's entire digital infrastructure: CRM + public provider directory covering 850K+ verified healthcare professionals across all 50 states." },
];

interface WorkItem {
  title: string;
  role: string;
  description: string;
  bullets: string[];
  highlights: string[];
  icon: typeof Users;
}

const work: WorkItem[] = [
  {
    title: "Ava Health — Recruiter + CRM Builder (Current)",
    role: "Contract · 2026–Present",
    description: "Place physicians nationwide, and nurses & therapists in Florida. Designed and built Ava Health's entire digital infrastructure: full-stack CRM + public provider directory covering 850K+ verified healthcare professionals across all 50 states.",
    bullets: [
      "Place NPI-verified physicians nationwide + nurses/therapists in FL",
      "Designed and shipped the React + Node + PostgreSQL CRM from scratch",
      "Nationwide NPI data pipeline — 850K+ verified providers",
      "Telnyx 10DLC SMS engine wired into provider cadences",
      "SEO surface across properties: 1,100+ pages, 123 blog posts indexed",
      "Multi-channel outbound: SMS, email, calls — built the tooling + ran the plays",
      "Supabase RLS, view-as roles, billing integrations, internal admin tooling",
    ],
    highlights: ["850K+ Providers", "React + Node", "PostgreSQL", "Supabase", "Telnyx 10DLC", "NPI Verified"],
    icon: Users,
  },
  {
    title: "Money Mitch + Big Gates Records",
    role: "Agent + Road Manager · 2015–Present · 11 yrs",
    description: "Manage my younger brother's music career (artist name Money Mitch). Built his fanbase from zero — he signed with Big Gates Records at 17. Road Manager for bookings, social, and label point-of-contact. Also designed and built his website and private content vault.",
    bullets: [
      "Guided career from zero to a Big Gates Records deal at 17",
      "\"Flexin' Like Woah\" went viral — hundreds of millions of views, TikTok dance trend",
      "\"Stunting\" exclusive premiere on Worldstar — millions of views",
      "Built moneymitch.music + private content vault (custom web platform)",
      "Road Manager under Big Gates: bookings, social, label point-of-contact",
      "Handle all SEO and digital presence — landing page, GSC, analytics",
    ],
    highlights: ["Artist Mgmt", "100M+ Views", "Record Deal", "Road Mgr", "Web Platform"],
    icon: Sparkles,
  },
  {
    title: "Universe XYZ — Lobby Lobsters",
    role: "Project Manager (Full-time) · 2021–2022",
    description: "Oversaw digital collectible drops and the marketplace build. Program raised $5M+ for charity including the $4.4M Lobby Lobsters drop. Founding-collective member of Bored Ape Yacht Club; seed investor in OpenSea.",
    bullets: [
      "Cross-functional program management: engineering, creative, community, comms",
      "Solidity contracts, marketplace launch, drop choreography",
      "Multiple successful drops — sold out, raised millions in revenue",
      "$4.4M Lobby Lobsters drop, $5M+ total charity raise",
      "Founding collective member of Bored Ape Yacht Club",
      "Seed investor in OpenSea",
    ],
    highlights: ["$5M+ Charity", "Solidity", "Web3", "BAYC Founding", "OpenSea Seed"],
    icon: TrendingUp,
  },
  {
    title: "Angel Investor",
    role: "Private · 2021–Present",
    description: "Angel investing through a network of celebrities, traders, and business operators. Constantly scouting innovative teams — tech, crypto, culture — to back early.",
    bullets: [
      "Network-driven deal flow across tech, trading, and culture operators",
      "Seed-stage checks into teams with strong operator-founders",
      "OpenSea seed + BAYC founding collective sit alongside this work",
      "Pattern-match on product, timing, and whether the founder can sell",
    ],
    highlights: ["Seed Stage", "Web3", "Tech", "Network"],
    icon: Gem,
  },
  {
    title: "Toggle Money — Recording Studio",
    role: "Founder · 2015–Present · Tampa, FL",
    description: "Founded a Tampa-based recording studio that empowers local artists with resources and opportunities. Engineer and manage sessions, handle mixing and mastering, and connect songwriters, producers, cinematographers, and performers to push each other's work forward.",
    bullets: [
      "Engineer + manage recording sessions for Tampa-area artists",
      "Mix + master tracks in Pro Tools",
      "Connect songwriters, producers, cinematographers, and performers",
      "Offer financial support to help artists thrive",
    ],
    highlights: ["Recording", "Pro Tools", "Mix/Master", "Tampa Music"],
    icon: Music,
  },
  {
    title: "Toggle Town — Trading Bots + Esports",
    role: "Founder · 2019–Present · Trading live since 2025",
    description: "Started as an amateur esports channel in 2019 curating community gameplay. Evolved into the home for my algorithmic trading systems, now running on live Alpaca capital.",
    bullets: [
      "Esports channel curating community gameplay (2019 origin)",
      "Kalman filter state estimation for price + volatility",
      "HMM regime detection to gate strategy switches",
      "VWAP bands and sector rotation models",
      "Drawdown controller and risk manager on top",
      "Real-time dashboards, backtesting harness, Python pipelines",
    ],
    highlights: ["Python", "Alpaca", "Backtesting", "Kalman + HMM", "Esports"],
    icon: LineChart,
  },
  {
    title: "Holmes Builders",
    role: "Representative · 2020–Present",
    description: "Represent the family-owned construction business. Marketing strategies (social, word-of-mouth), investor pitch deck, participating in land auctions, and hands-on time on-site during project completions.",
    bullets: [
      "Marketing strategies across social and word-of-mouth",
      "Designed and built the company's investor pitch deck",
      "Participate in land auctions for site acquisition",
      "On-site during project completions — real industry reps",
    ],
    highlights: ["Family Business", "Construction", "Marketing", "Tampa"],
    icon: HardHat,
  },
  {
    title: "Server — Charley's Steakhouse",
    role: "Full-time · 2014–2020 · 6 years",
    description: "Six years at Tampa's flagship steakhouse. Experience in every position in the restaurant — kitchen, host stand, bussing, checkouts, and serving. Where the service-instincts started.",
    bullets: [
      "Every role in the house: kitchen, host, busser, checkout, server",
      "Ran full sections under pressure — speed, accuracy, presence",
      "Nightly reps with people, money, and operations",
      "Foundation for the sales and client work that came after",
    ],
    highlights: ["6 Years", "Fine Dining", "Service", "Tampa"],
    icon: Utensils,
  },
];

const salesSkills = ["CRM", "Outreach", "SMS / Telnyx", "Recruiting", "Healthcare", "Customer Success", "Prospecting", "Cold Outreach", "Account Management"];
const techSkills = ["React", "Node.js", "TypeScript", "Python", "Supabase", "PostgreSQL", "AI / ML", "SEO", "Vite", "Tailwind", "Solidity"];

const navSections = [
  { id: "story", label: "Story" },
  { id: "timeline", label: "Timeline" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

/* ============ helper components ============ */

function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2" aria-hidden>
      <svg viewBox="0 0 80 8" className="w-20 h-2 text-primary/40">
        <path d="M0,4 Q10,0 20,4 T40,4 T60,4 T80,4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary/70">
        <path d="M13 2L4.09 12.97L11 13L10 22L18.91 10.03L12 10L13 2Z" fill="currentColor" />
      </svg>
      <svg viewBox="0 0 80 8" className="w-20 h-2 text-primary/40">
        <path d="M0,4 Q10,8 20,4 T40,4 T60,4 T80,4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

function SectionNav() {
  const [active, setActive] = useState<string>("story");
  useEffect(() => {
    const ids = navSections.map((s) => s.id);
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return (
    <nav
      aria-label="Section navigation"
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-20 flex-col gap-3 text-xs font-semibold uppercase tracking-widest"
    >
      {navSections.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={cn(
              "group flex items-center gap-3 transition-colors duration-200 rounded-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "h-px transition-all duration-300",
                isActive ? "w-10 bg-primary shadow-[0_0_10px_hsl(var(--primary))]" : "w-5 bg-muted-foreground/40 group-hover:w-7 group-hover:bg-foreground/60",
              )}
            />
            <span>{s.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

function StoryExpander() {
  const [expanded, setExpanded] = useState(false);
  const short = (
    <>
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
    </>
  );
  const rest = (
    <>
      <p>
        The current chapter is Ava Health. I came in to place physicians, nurses, and therapists
        — and we now have 850K+ providers reachable. Somewhere along the way I realized the
        team needed better tools than what existed. So I started building. The CRM, the outreach
        automation, the Telnyx 10DLC SMS engine, an SEO surface that&apos;s 1,100+ pages and 123
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
    </>
  );
  return (
    <div className="space-y-4 text-foreground/90 leading-relaxed">
      {short}
      <div
        className={cn(
          "space-y-4 overflow-hidden transition-all duration-500",
          expanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {rest}
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

function SkillsMarquee({ items, direction = "left", speed = 35 }: { items: string[]; direction?: "left" | "right"; speed?: number }) {
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden mask-edges py-2">
      <div
        className={cn(
          "flex gap-3 whitespace-nowrap w-max",
          direction === "left" ? "animate-marquee" : "animate-marquee-reverse",
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {loop.map((s, i) => (
          <span
            key={`${s}-${i}`}
            className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/30 shrink-0"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============ page ============ */

const Landing = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <SectionNav />

      <header className="border-b border-border/60 bg-background/70 backdrop-blur-lg sticky top-0 z-20 print-hide">
        <div className="container max-w-5xl mx-auto flex items-center justify-between h-16 px-4">
          <a href="/" aria-label="Home">
            <Logo variant="full" size="md" />
          </a>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex gap-1.5 text-xs font-semibold tracking-wide uppercase"
              onClick={() => window.print()}
              title="Download or print this page as PDF"
            >
              <Printer className="h-3.5 w-3.5" /> PDF
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs font-semibold tracking-wide uppercase"
              title="Job tracker — password protected"
            >
              <a href="/dashboard">
                <Briefcase className="h-3.5 w-3.5" /> Dashboard
              </a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex gap-1.5 text-xs font-semibold tracking-wide uppercase">
              <a href={`mailto:${CONTACT_EMAIL}`}>
                <Mail className="h-3.5 w-3.5" /> Contact
              </a>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-10 sm:py-12 space-y-20">
        {/* Hero — tile + wordmark, recruiter strip, numbered stat row */}
        <section id="home" className="relative space-y-8 sm:space-y-10 py-6 sm:py-10">
          {/* Radial flare bg */}
          <div
            aria-hidden
            className="absolute -top-8 -right-10 -z-10 h-80 w-[32rem] max-w-full bg-gradient-to-br from-primary/25 via-primary/10 to-transparent blur-3xl rounded-full"
          />

          {/* Recruiter-intent strip */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {recruiterTags[0]}
            </span>
            {recruiterTags.slice(1).map((t) => (
              <span key={t} className="inline-flex items-center gap-5 before:content-['·'] before:text-muted-foreground/40 before:-ml-3">
                {t}
              </span>
            ))}
          </div>

          {/* Crest + wordmark row — psychedelic skull crest as hero centerpiece.
              Uses <picture> so a future /public/hero-art.png will auto-take over
              without a code push; the SVG SkullCrest is the always-shipped fallback. */}
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-start gap-6 sm:gap-10">
            <div className="relative w-[clamp(11rem,22vw,18rem)] aspect-square shrink-0 motion-safe:animate-[float_8s_ease-in-out_infinite]">
              <picture>
                <source srcSet="/hero-art.png" type="image/png" />
                <img
                  src="/hero-art.png"
                  alt=""
                  className="hidden"
                  onError={(e) => { (e.currentTarget.parentElement as HTMLElement | null)?.querySelector('svg')?.classList.remove('hidden'); }}
                />
              </picture>
              {/* SVG fallback — always rendered behind the <picture>; if PNG loads it sits on top */}
              <SkullCrest className="absolute inset-0 drop-shadow-[0_18px_60px_hsl(328_95%_55%/0.55)]" />
            </div>

            <div className="space-y-4 min-w-0">
              <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.28em] text-primary">
                <span className="h-px w-6 sm:w-10 bg-primary" />
                Portfolio / 2026
              </div>

              <h1 className="font-display font-black uppercase text-[clamp(2.5rem,7.5vw,5.25rem)] text-psychedelic leading-[0.9] tracking-[-0.03em] hero-title pb-1">
                Algernon
                <br />
                Holmes
                <span className="text-primary">.</span>
              </h1>

              <p className="text-2xl sm:text-3xl font-display font-bold text-foreground/95 leading-tight">
                Sales-first<span className="text-primary">.</span>{" "}
                Builder-brained<span className="text-primary">.</span>
              </p>

              <p className="text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed">
                12 years placing people + shipping the systems that scale the work.
                Currently healthcare recruiter and CRM builder at Ava Health.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                <Button asChild size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold uppercase tracking-widest px-6 glow-primary">
                  <a href="#work">
                    See the work <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 border-border hover:border-primary/60 hover:bg-primary/5 font-display font-bold uppercase tracking-widest">
                  <a href={`mailto:${CONTACT_EMAIL}`}>
                    <Mail className="h-4 w-4" /> Get in touch
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Identity chips — replaced the older numbered 01–05 stat grid.
              Hero body already states the 12-year + Ava Health anchor; chips
              tag the 5 worlds I operate in without restating numbers. */}
          <Reveal>
            <div className="flex flex-wrap gap-2 sm:gap-2.5 pt-2">
              {heroChips.map((c, i) => (
                <span
                  key={c}
                  className="inline-flex items-center px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em] hover:bg-primary/10 hover:border-primary/50 transition-colors"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </section>

        <SectionDivider />

        {/* My Story (long-form, clamped) */}
        <Reveal>
          <section id="story" className="space-y-5 max-w-2xl mx-auto">
            <h2 className="font-display text-4xl sm:text-5xl font-black uppercase text-psychedelic tracking-[-0.02em]">
              My Story <span className="text-primary">.</span>
            </h2>
            <StoryExpander />

            <div className="pt-2">
              <Button asChild variant="outline" className="gap-2 border-primary/40 hover:bg-primary/10 hover:border-primary">
                <a href={`mailto:${CONTACT_EMAIL}`}>
                  <Mail className="h-4 w-4" /> Email Me
                </a>
              </Button>
            </div>
          </section>
        </Reveal>

        <SectionDivider />

        {/* Timeline — vertical split */}
        <Reveal>
          <section id="timeline" className="space-y-6 max-w-2xl mx-auto">
            <h2 className="font-display text-4xl sm:text-5xl font-black uppercase text-psychedelic tracking-[-0.02em]">
              Timeline <span className="text-primary">.</span>
            </h2>
            <div className="space-y-0">
              {timeline.map((t, i) => (
                <div key={t.year} className="grid grid-cols-[3.5rem_1fr] sm:grid-cols-[6rem_1fr] gap-3 sm:gap-5">
                  <div className="text-right pt-1">
                    <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wider">{t.year}</span>
                  </div>
                  <div
                    className={cn(
                      "relative pl-6 pb-8",
                      i !== timeline.length - 1 &&
                        "before:absolute before:left-0 before:top-3 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-primary/60 before:to-primary/10",
                    )}
                  >
                    <span className="absolute -left-[5px] top-2 w-[11px] h-[11px] rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
                    <p className="text-base font-semibold text-foreground leading-snug">{t.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{t.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <SectionDivider />

        {/* Skills — marquee */}
        <Reveal>
          <section id="skills" className="space-y-5 max-w-3xl mx-auto">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl font-black uppercase text-psychedelic tracking-[-0.02em]">
                Skills <span className="text-primary">.</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Tools I reach for daily</p>
            </div>
            <div className="space-y-3 -mx-4 sm:mx-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-4 sm:px-0">Sales + CS</p>
                <SkillsMarquee items={salesSkills} direction="left" speed={40} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-4 sm:px-0">Tech</p>
                <SkillsMarquee items={techSkills} direction="right" speed={45} />
              </div>
            </div>
          </section>
        </Reveal>

        <SectionDivider />

        {/* Experience & Projects */}
        <Reveal>
          <section id="work" className="space-y-6">
            <h2 className="font-display text-4xl sm:text-5xl font-black uppercase text-psychedelic tracking-[-0.02em]">
              Experience &amp; Projects <span className="text-primary">.</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {work.map((w, i) => (
                <Reveal key={w.title} delay={i * 60}>
                  <Card className="group p-6 border bg-card/80 backdrop-blur-sm space-y-3 h-full transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_0_32px_hsl(var(--primary)/0.3)]">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-primary/15 shrink-0 transition-colors group-hover:bg-primary/25">
                        <w.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-foreground">{w.title}</h3>
                        <p className="text-sm text-primary font-medium">{w.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{w.description}</p>
                    <ul className="space-y-1.5 text-sm text-foreground/85">
                      {w.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="text-primary mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {w.highlights.map((h) => (
                        <span key={h} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-medium border border-primary/20">
                          {h}
                        </span>
                      ))}
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>

        <SectionDivider />

        {/* Contact — bigger footer moment */}
        <Reveal>
          <section id="contact" className="space-y-8 max-w-3xl mx-auto text-center pt-4">
            <div className="space-y-3">
              <h2 className="font-display text-5xl sm:text-6xl font-black uppercase tracking-[-0.02em] text-psychedelic hero-title pb-2">
                Let&apos;s talk.
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
                I&apos;m open to sales / CS / talent roles, builder roles, or a mix of both.
                Fastest way to reach me is email.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button asChild size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-[0_0_24px_hsl(var(--primary)/0.5)]">
                <a href={`mailto:${CONTACT_EMAIL}`}>
                  <Mail className="h-4 w-4" /> {CONTACT_EMAIL}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 border-primary/40 hover:bg-primary/10 hover:border-primary">
                <a href="https://linkedin.com/in/youngalgy" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 border-primary/40 hover:bg-primary/10 hover:border-primary">
                <a href="https://github.com/youngalgy" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground pt-4 flex items-center justify-center gap-2">
              <MapPin className="h-3 w-3" /> Tampa, FL
            </p>
          </section>
        </Reveal>
      </main>

      <footer className="border-t border-border/50 bg-card/30 py-6 mt-12 print-hide">
        <div className="container max-w-3xl mx-auto px-4 flex items-center justify-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Algernon Holmes</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
