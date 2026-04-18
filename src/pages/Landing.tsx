import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, Users, Sparkles, LineChart,
  Clock, Database, Layers, GraduationCap,
  Mail, Linkedin, MapPin, Menu, X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
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

const experiences = [
  {
    title: "Ava Health CRM",
    role: "Full-Stack Developer",
    description: "Built a healthcare CRM platform managing 700K+ medical providers with advanced search, outreach automation, and analytics.",
    highlights: ["700K+ Providers", "React + Node", "PostgreSQL"],
  },
  {
    title: "Universe XYZ",
    role: "Project Manager",
    description: "Led digital collectible drops raising $5M+ for charity, including Lobby Lobsters at $4.4M. Managed cross-functional engineering, creative, and community teams through marketplace launch.",
    highlights: ["$5M+ Charity", "Solidity", "Web3"],
  },
  {
    title: "Money Mitch",
    role: "Artist Management & Tech",
    description: "Managed digital presence and built tech tools for artist management including analytics dashboards and content distribution.",
    highlights: ["Artist Mgmt", "Analytics", "SEO"],
  },
];

const projects = [
  { icon: Users, title: "Ava Health CRM", desc: "Healthcare provider CRM with 700K records and outreach automation" },
  { icon: TrendingUp, title: "Trading Bots", desc: "Algorithmic trading systems with real-time market analysis" },
  { icon: Sparkles, title: "Money Mitch", desc: "Artist management platform with analytics and content tools" },
  { icon: LineChart, title: "Trading Systems", desc: "Algorithmic trading bots running on live capital with real-time dashboards, backtesting, and regime detection." },
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
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4" />
            Tampa, FL &nbsp;|&nbsp;
            <a href="mailto:alex@avahealth.co" className="text-primary hover:underline">alex@avahealth.co</a>
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Alexander Holmes
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Sales, Customer Success & Talent Professional
          </p>

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

        {/* Experience */}
        <section id="experience" className="space-y-6 scroll-mt-20">
          <h2 className="text-2xl font-bold text-foreground">Experience</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {experiences.map((exp) => (
              <Card key={exp.title} className="p-6 border bg-card space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{exp.title}</h3>
                  <p className="text-sm text-primary font-medium">{exp.role}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.highlights.map((h) => (
                    <span key={h} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-medium">
                      {h}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="space-y-6 scroll-mt-20">
          <h2 className="text-2xl font-bold text-foreground">Projects</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <Card key={p.title} className="p-6 border bg-card flex gap-4 items-start">
                <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                  <p.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="space-y-6 scroll-mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5 border bg-card flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <a href="mailto:alex@avahealth.co" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  alex@avahealth.co
                </a>
              </div>
            </Card>
            <Card className="p-5 border bg-card flex items-center gap-3">
              <Linkedin className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">LinkedIn</p>
                <a href="https://linkedin.com/in/youngalgy" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  linkedin.com/in/youngalgy
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
