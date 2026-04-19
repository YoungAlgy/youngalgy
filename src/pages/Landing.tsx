import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, Users, Sparkles, LineChart,
  Clock, Database, Layers, GraduationCap,
  Mail, Linkedin, MapPin, Menu, X, Download, Github,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

const stats = [
  { icon: Clock, value: "12+", label: "Years Experience" },
  { icon: Database, value: "850K+", label: "Records Managed" },
  { icon: Layers, value: "4", label: "Projects Built" },
  { icon: GraduationCap, value: "B.A.", label: "Psychology, USF" },
];

const skills = [
  "React", "Node.js", "Python", "TypeScript",
  "AI / ML", "Supabase", "PostgreSQL", "CRM",
  "SEO", "Trading Bots",
];

interface WorkItem {
  title: string;
  role: string;
  description: string;
  highlights: string[];
  icon: typeof Users;
}

const work: WorkItem[] = [
  {
    title: "Ava Health CRM (Current)",
    role: "Full-Stack + Sales Operations",
    description: "Healthcare CRM platform managing 850K+ medical providers with advanced search, outreach automation, and analytics. Built and shipped the tools the team uses daily.",
    highlights: ["850K+ Providers", "React + Node", "PostgreSQL", "Supabase"],
    icon: Users,
  },
  {
    title: "Money Mitch",
    role: "Artist Management & Tech",
    description: "Artist management platform for musician Mitch. Built analytics dashboards, content distribution tooling, and SEO dashboards to grow audience and revenue.",
    highlights: ["Artist Mgmt", "Analytics", "SEO"],
    icon: Sparkles,
  },
  {
    title: "Universe XYZ — Lobby Lobsters",
    role: "Project Manager",
    description: "Led digital collectible drops raising $5M+ for charity, including Lobby Lobsters at $4.4M. Managed cross-functional engineering, creative, and community teams through marketplace launch.",
    highlights: ["$5M+ Charity", "Solidity", "Web3"],
    icon: TrendingUp,
  },
  {
    title: "Trading Bots",
    role: "Quant / Systems Builder",
    description: "Algorithmic trading systems (Kalman filter, HMM regime detection, VWAP) running on live Alpaca capital. Real-time dashboards, backtesting, and Python pipelines.",
    highlights: ["Python", "Alpaca", "Backtesting"],
    icon: LineChart,
  },
];

const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const Landing = () => {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setMobileNavOpen(false);
    scrollTo(href);
  };

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
          <span className="text-lg font-semibold text-foreground">Alexander Holmes</span>
          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setMobileNavOpen((o) => !o)}
              aria-label="Toggle navigation"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {mobileNavOpen && (
          <nav className="md:hidden border-t bg-card">
            <div className="container max-w-6xl mx-auto px-4 py-2 flex flex-col">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-12 space-y-20">
        {/* Hero */}
        <section className="text-center space-y-6 py-12">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
            <MapPin className="h-4 w-4" />
            Tampa, FL &nbsp;|&nbsp;
            <a href="mailto:youngalgy@gmail.com" className="text-primary hover:underline">youngalgy@gmail.com</a>
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Alexander Holmes
          </h1>
          <div className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto space-y-1">
            <p>Sales, Customer Success &amp; Talent pro who ships the tools.</p>
            <p>12+ years placing talent + building the systems that scale the work.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {/* TODO: drop Alexander_Holmes_Resume.pdf into /public for this link to resolve */}
            <Button asChild size="lg" className="gap-2">
              <a href="/Alexander_Holmes_Resume.pdf" download>
                <Download className="h-4 w-4" /> Download Resume (PDF)
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <a href="mailto:youngalgy@gmail.com">
                <Mail className="h-4 w-4" /> Email Me
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8">
            {stats.map((s) => (
              <Card key={s.label} className="p-4 text-center border bg-card">
                <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </Card>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="space-y-4 max-w-3xl mx-auto scroll-mt-20">
          <h2 className="text-2xl font-bold text-foreground">About</h2>
          <p className="text-muted-foreground leading-relaxed">
            Relationship-driven sales, customer success, and recruiting professional with 12+ years of experience placing healthcare providers at Ava Health and building the tools the team uses. Psychology background from USF, I read people, I move product, and I build the systems that make it repeatable.
          </p>
        </section>

        {/* Skills */}
        <section id="skills" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-bold text-foreground">Skills</h2>
          <p className="text-sm text-muted-foreground">Tools I reach for daily</p>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm border border-border"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Experience & Projects (merged) */}
        <section id="work" className="space-y-6 scroll-mt-20">
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
                <div className="flex flex-wrap gap-2">
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
        <section id="contact" className="space-y-6 scroll-mt-20 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5 border bg-card flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <a href="mailto:youngalgy@gmail.com" className="text-sm font-medium text-foreground hover:text-primary transition-colors break-all">
                  youngalgy@gmail.com
                </a>
              </div>
            </Card>
            <Card className="p-5 border bg-card flex items-center gap-3">
              <Linkedin className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">LinkedIn</p>
                <a href="https://linkedin.com/in/youngalgy" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  linkedin.com/in/youngalgy
                </a>
              </div>
            </Card>
            <Card className="p-5 border bg-card flex items-center gap-3">
              <Github className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">GitHub</p>
                <a href="https://github.com/youngalgy" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  github.com/youngalgy
                </a>
              </div>
            </Card>
            <Card className="p-5 border bg-card flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium text-foreground">Tampa, FL</p>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-6">
        <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Alexander Holmes</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            Dashboard
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
