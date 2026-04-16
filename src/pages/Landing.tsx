import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Briefcase, Code2, Database, Brain, TrendingUp, Users,
  Globe, ArrowRight, Sparkles, BarChart3, FileText, Clock,
} from "lucide-react";

const stats = [
  { icon: Briefcase, value: "1,000+", label: "Jobs Tracked" },
  { icon: Globe, value: "10", label: "Sources" },
  { icon: FileText, value: "300+", label: "Cover Letters" },
  { icon: Clock, value: "12+", label: "Years Experience" },
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
    role: "NFT Platform Developer",
    description: "Developed NFT marketplace and auction platform that helped raise $2M+ for charity through digital art sales.",
    highlights: ["$2M+ Charity", "Solidity", "Web3"],
  },
  {
    title: "Money Mitch",
    role: "Artist Management & Tech",
    description: "Managed digital presence and built tech tools for artist management including analytics dashboards and content distribution.",
    highlights: ["Artist Mgmt", "Analytics", "SEO"],
  },
];

const projects = [
  { icon: Brain, title: "AI Job Pipeline", desc: "Automated job discovery, scoring, and cover letter generation across 10+ sources" },
  { icon: Users, title: "Ava Health CRM", desc: "Healthcare provider CRM with 700K records and outreach automation" },
  { icon: TrendingUp, title: "Trading Bots", desc: "Algorithmic trading systems with real-time market analysis" },
  { icon: Sparkles, title: "Money Mitch", desc: "Artist management platform with analytics and content tools" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2.5">
            <Briefcase className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">Young Algy</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-12 space-y-20">
        {/* Hero */}
        <section className="text-center space-y-6 py-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Open to Opportunities
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Alexander Holmes
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Full-Stack Developer & Healthcare Recruiter
          </p>

          {/* Stats */}
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
        <section className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground">About</h2>
          <p className="text-muted-foreground leading-relaxed">
            I'm a full-stack developer with 12+ years of experience building scalable web applications, 
            CRM platforms, and AI-powered automation tools. I specialize in React, Node.js, Python, and 
            cloud infrastructure. Currently focused on AI-driven job search automation and healthcare 
            technology solutions.
          </p>
        </section>

        {/* Skills */}
        <section className="space-y-4">
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
        <section className="space-y-6">
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
        <section className="space-y-6">
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

        {/* CTA */}
        <section className="text-center py-8">
          <Button size="lg" className="gap-2 text-base" onClick={() => navigate("/dashboard")}>
            View Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </section>
      </main>
    </div>
  );
};

export default Landing;
