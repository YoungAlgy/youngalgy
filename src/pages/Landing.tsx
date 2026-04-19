import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users, Sparkles, LineChart, TrendingUp, Stethoscope,
  Clock, GraduationCap, Mail, Linkedin, MapPin, Github,
} from "lucide-react";

const CONTACT_EMAIL = "alex@avahealth.co";

const heroStats = [
  { icon: Clock, value: "12+", label: "Years Experience" },
  { icon: GraduationCap, value: "B.A.", label: "Psychology, USF" },
];

const timeline = [
  { year: "2014", title: "B.A. Psychology, University of South Florida",
    detail: "Started studying decision-making, motivation, and team dynamics. Foundation for everything that came after." },
  { year: "2015–2020", title: "Sales & recruiting roles",
    detail: "Learned to read accounts, run cycles, and place people. Relationship reps." },
  { year: "2020", title: "Joined Ava Health as a recruiter",
    detail: "Began placing physicians, nurses, and therapists into hospitals and clinics nationwide." },
  { year: "2022", title: "Started building internal tools",
    detail: "Early CRM and dialer integration — because the team needed better than spreadsheets." },
  { year: "2023", title: "Shipped the healthcare CRM platform",
    detail: "React + Node + Supabase. Real searchable provider DB, outreach pipelines, status tracking." },
  { year: "2024", title: "SMS, SEO, and the NPI pipeline",
    detail: "Telnyx 10DLC SMS engine, 1,100+ SEO pages with 123 blog posts, nationwide NPI scraper. 700K+ records." },
  { year: "2025", title: "Money Mitch + Universe XYZ",
    detail: "Built the Money Mitch artist platform; led the $5M+ Lobby Lobsters charity raise on Universe XYZ." },
  { year: "2026", title: "850K+ providers, live trading bots, Job Seeker Pro",
    detail: "Reachable provider count crosses 850K. Algorithmic trading bots running on live Alpaca capital. Shipping weekly." },
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
    title: "Ava Health — CRM Platform (Current)",
    role: "Full-Stack + Sales Operations · 2022–Present",
    description: "Healthcare CRM platform powering outreach to 850K+ medical providers nationwide. Built and shipped the tools the team uses daily.",
    bullets: [
      "Designed and shipped the React + Node + PostgreSQL CRM from scratch",
      "Built nationwide NPI data pipeline — 850K+ verified providers",
      "Wired Telnyx 10DLC SMS engine into provider cadences",
      "Stood up the SEO surface: 1,100+ pages, 123 blog posts indexed",
      "Email branding + drip scheduler for multi-touch outreach",
      "Supabase RLS, view-as roles, internal admin tooling",
    ],
    highlights: ["850K+ Providers", "React + Node", "PostgreSQL", "Supabase", "Telnyx 10DLC"],
    icon: Users,
  },
  {
    title: "Recruiting at Ava Health",
    role: "Healthcare Talent · 2020–Present",
    description: "Sales-first work that funds and informs everything else. Placing NPI-verified physicians, nurses, and therapists.",
    bullets: [
      "NPI-verified physicians, NPs, and therapists placed nationwide",
      "Multi-channel cadences: SMS, email, calls — built the tooling and ran the plays",
      "Email branding for outbound — open and reply rates that hold up",
      "Drip scheduler for long-cycle accounts",
      "End-to-end ownership: sourcing → screen → placement → retention",
    ],
    highlights: ["Healthcare Sales", "Recruiting", "Outreach", "NPI Verified"],
    icon: Stethoscope,
  },
  {
    title: "Money Mitch",
    role: "Artist Management & Platform · 2025–Present",
    description: "Artist management platform for musician Mitch. Sales principles applied to art distribution.",
    bullets: [
      "Built analytics dashboards for streams, drops, and audience growth",
      "Content distribution tooling across platforms",
      "SEO surface for moneymitch.music",
      "View-as + viewer-role vault for team and label access",
      "Release calendar + content pipeline ops",
    ],
    highlights: ["Artist Mgmt", "Analytics", "SEO", "Distribution"],
    icon: Sparkles,
  },
  {
    title: "Universe XYZ — Lobby Lobsters",
    role: "Project Manager · 2025",
    description: "Led a Web3 charity raise that hit $5M+, including a $4.4M NFT drop for Lobby Lobsters.",
    bullets: [
      "Cross-functional program management: engineering, creative, community",
      "Solidity contracts, marketplace launch, drop choreography",
      "Coordinated launch comms across Twitter, Discord, and partner orgs",
      "Drove the campaign through to a $4.4M Lobby Lobsters drop",
      "Total raise across the program: $5M+ for charity",
    ],
    highlights: ["$5M+ Charity", "Solidity", "Web3", "Program Mgmt"],
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
];

const salesSkills = ["CRM", "Outreach", "SMS / Telnyx", "Recruiting", "Healthcare", "Customer Success"];
const techSkills = ["React", "Node.js", "TypeScript", "Python", "Supabase", "PostgreSQL", "AI / ML", "SEO"];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto flex items-center justify-between h-14 px-4">
          <span className="text-lg font-semibold text-foreground">Alexander Holmes</span>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-12 space-y-20">
        {/* Hero */}
        <section className="text-center space-y-6 py-8">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
            <MapPin className="h-4 w-4" />
            Tampa, FL &nbsp;|&nbsp;
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Alexander Holmes
          </h1>
          <div className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto space-y-1">
            <p>Sales, Customer Success &amp; Talent pro who ships the tools.</p>
            <p>12+ years placing talent + building the systems that scale the work.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-6">
            {heroStats.map((s) => (
              <Card key={s.label} className="p-4 text-center border bg-card">
                <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </Card>
            ))}
          </div>
        </section>

        {/* My Story (long-form) */}
        <section id="story" className="space-y-5 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground">My Story</h2>
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
          </div>

          <div className="pt-2">
            <Button asChild variant="outline" className="gap-2">
              <a href={`mailto:${CONTACT_EMAIL}`}>
                <Mail className="h-4 w-4" /> Email Me
              </a>
            </Button>
          </div>
        </section>

        {/* Timeline */}
        <section id="timeline" className="space-y-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground">Timeline</h2>
          <ol className="relative border-l border-border ml-3 space-y-6">
            {timeline.map((t) => (
              <li key={t.year} className="pl-6">
                <span className="absolute -left-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                <p className="text-sm font-bold text-primary">{t.year}</p>
                <p className="text-base font-semibold text-foreground mt-0.5">{t.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{t.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Skills */}
        <section id="skills" className="space-y-5 max-w-2xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Skills</h2>
            <p className="text-sm text-muted-foreground mt-1">Tools I reach for daily</p>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Sales + CS</p>
              <div className="flex flex-wrap gap-2">
                {salesSkills.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-md bg-primary/10 text-primary font-medium text-sm border border-primary/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tech</p>
              <div className="flex flex-wrap gap-2">
                {techSkills.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground font-medium text-sm border border-border">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience & Projects */}
        <section id="work" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Experience &amp; Projects</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {work.map((w) => (
              <Card key={w.title} className="p-6 border bg-card space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
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
                    <span key={h} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-medium">
                      {h}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="space-y-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5 border bg-card flex items-center gap-3 min-w-0">
              <Mail className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  title={CONTACT_EMAIL}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors block truncate"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </Card>
            <Card className="p-5 border bg-card flex items-center gap-3 min-w-0">
              <Linkedin className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">LinkedIn</p>
                <a
                  href="https://linkedin.com/in/youngalgy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors block truncate"
                >
                  linkedin.com/in/youngalgy
                </a>
              </div>
            </Card>
            <Card className="p-5 border bg-card flex items-center gap-3 min-w-0">
              <Github className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">GitHub</p>
                <a
                  href="https://github.com/youngalgy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors block truncate"
                >
                  github.com/youngalgy
                </a>
              </div>
            </Card>
            <Card className="p-5 border bg-card flex items-center gap-3 min-w-0">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium text-foreground">Tampa, FL</p>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card/50 py-6 mt-12">
        <div className="container max-w-3xl mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Alexander Holmes</p>
          <a href="/dashboard" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
            Dashboard
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
