import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users, Sparkles, LineChart, TrendingUp, Utensils,
  Clock, Mail, Linkedin, MapPin, Github,
  Send, FileText, DollarSign, Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CONTACT_EMAIL = "alex@avahealth.co";

const heroStats = [
  { icon: Clock, value: "12+", label: "Years" },
  { icon: Send, value: "900K+", label: "Providers" },
  { icon: FileText, value: "1,100+", label: "SEO Pages" },
  { icon: DollarSign, value: "$5M+", label: "Charity Raise" },
  { icon: Rocket, value: "3", label: "Apps Live" },
];

const timeline = [
  { year: "2014", title: "B.A. Psychology, USF",
    detail: "Studied decision-making, motivation, and team dynamics. Foundation for reading people." },
  { year: "2014–2020", title: "Server, Charley's Steakhouse",
    detail: "Six years across every role in the restaurant — kitchen, host, busser, checkout, server. Where I learned to read a room, carry pressure, and hit a rhythm under load." },
  { year: "2015", title: "Music agent + Toggle Money founder",
    detail: "Started managing my brother Money Mitch and founded Toggle Money recording studio in Tampa. He signed with Big Gates Records at 17 on the back of that work." },
  { year: "2019", title: "Road Manager, Big Gates Records + Toggle Town",
    detail: "Bookings, social, point of contact for Mitch under Big Gates. Separately founded Toggle Town — amateur esports channel curating community gameplay." },
  { year: "2020", title: "Holmes Builders Representative",
    detail: "Family construction business — marketing, investor pitch deck, land auctions, and on-site project experience." },
  { year: "2021–2022", title: "Project Manager, Universe XYZ",
    detail: "Led digital collectible drops and the marketplace build. Program raised $5M+ for charity including the $4.4M Lobby Lobsters drop. Founding-collective member of BAYC; seed investor in OpenSea." },
  { year: "2024", title: "Toggle Town trading bots go live",
    detail: "Algorithmic trading on live Alpaca capital — Kalman filter state estimation, HMM regime detection, VWAP bands, drawdown controller. Markets are another system to read and time." },
  { year: "2026", title: "Healthcare Recruiter + CRM Builder, Ava Health",
    detail: "Joined Ava Health on contract placing physicians nationwide + nurses/therapists in FL. Designed and built Ava's entire digital infrastructure: CRM + public provider directory covering 900K+ verified healthcare professionals across all 50 states." },
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
    description: "Place physicians nationwide, and nurses & therapists in Florida. Designed and built Ava Health's entire digital infrastructure: full-stack CRM + public provider directory covering 900K+ verified healthcare professionals across all 50 states.",
    bullets: [
      "Place NPI-verified physicians nationwide + nurses/therapists in FL",
      "Designed and shipped the React + Node + PostgreSQL CRM from scratch",
      "Nationwide NPI data pipeline — 900K+ verified providers",
      "Telnyx 10DLC SMS engine wired into provider cadences",
      "SEO surface across properties: 1,100+ pages, 123 blog posts indexed",
      "Multi-channel outbound: SMS, email, calls — built the tooling + ran the plays",
      "Supabase RLS, view-as roles, billing integrations, internal admin tooling",
    ],
    highlights: ["900K+ Providers", "React + Node", "PostgreSQL", "Supabase", "Telnyx 10DLC", "NPI Verified"],
    icon: Users,
  },
  {
    title: "Money Mitch",
    role: "Agent · 2015–Present · 11 yrs",
    description: "Manage my younger brother's music career (artist name Money Mitch). Built his fanbase from zero — he signed with Big Gates Records at 17. Also designed and built his website and private content vault.",
    bullets: [
      "Guided career from zero to a Big Gates Records deal at 17",
      "\"Flexin' Like Woah\" went viral — hundreds of millions of views, TikTok dance trend",
      "\"Stunting\" exclusive premiere on Worldstar — millions of views",
      "Built moneymitch.music + private content vault (custom web platform)",
      "Handle all SEO and digital presence — landing page, GSC, analytics",
    ],
    highlights: ["Artist Mgmt", "100M+ Views", "Record Deal", "Web Platform"],
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
    title: "Trading Bots / Toggle Town",
    role: "Quant + Systems Builder · 2024–Present",
    description: "Algorithmic trading systems running on live Alpaca capital. Markets are another system to read and time.",
    bullets: [
      "Kalman filter state estimation for price + volatility",
      "HMM regime detection to gate strategy switches",
      "VWAP bands and sector rotation models",
      "Drawdown controller and risk manager on top",
      "Real-time dashboards, backtesting harness, Python pipelines",
    ],
    highlights: ["Python", "Alpaca", "Backtesting", "Kalman + HMM"],
    icon: LineChart,
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
        — and we now have 900K+ providers reachable. Somewhere along the way I realized the
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

      <header className="border-b bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto flex items-center justify-between h-14 px-4">
          <span className="text-lg font-semibold text-foreground">Algernon Holmes</span>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-12 space-y-20">
        {/* Hero */}
        <section id="home" className="text-center space-y-6 py-8">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
            <MapPin className="h-4 w-4" />
            Tampa, FL &nbsp;|&nbsp;
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>
          </p>
          <p className="text-base sm:text-lg text-muted-foreground font-medium">
            👋 Hi, I&apos;m Algy.
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-psychedelic leading-[1.05]">
            Algernon Holmes
          </h1>
          <div className="text-xl sm:text-2xl text-foreground/90 max-w-2xl mx-auto font-semibold leading-snug">
            <p>Sales-first. Builder-brained.</p>
            <p className="text-muted-foreground text-base sm:text-lg font-normal mt-2">
              12 years placing people + shipping the systems that scale the work.
            </p>
          </div>

          {/* Stat band — 5 quantified credentials */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-3xl mx-auto pt-8">
            {heroStats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <Card className="p-4 text-center border bg-card/70 backdrop-blur-sm h-full flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:border-primary/60 hover:shadow-[0_0_24px_hsl(var(--primary)/0.25)] hover:-translate-y-0.5">
                  <s.icon className="h-4 w-4 text-primary mb-1" />
                  <div className="text-2xl sm:text-2xl font-bold text-foreground leading-none">{s.value}</div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* My Story (long-form, clamped) */}
        <Reveal>
          <section id="story" className="space-y-5 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
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
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
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
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
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
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
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
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-psychedelic">
                Want to talk?
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

      <footer className="border-t border-border/50 bg-card/30 py-6 mt-12">
        <div className="container max-w-3xl mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Algernon Holmes</p>
          <a href="/dashboard" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
            Dashboard →
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
