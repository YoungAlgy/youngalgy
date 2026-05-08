import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { SkullCrest } from "@/components/SkullCrest";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Mail,
  Linkedin,
  MapPin,
  Github,
  ArrowUpRight,
  Printer,
  Briefcase,
} from "lucide-react";
import {
  CONTACT_EMAIL,
  heroChips,
  recruiterTags,
  salesSkills,
  techSkills,
} from "@/data/landing-content";
import { timeline } from "@/data/timeline";
import { work } from "@/data/work";
import { SectionDivider } from "@/components/landing/SectionDivider";
import { Reveal } from "@/components/landing/Reveal";
import { SectionNav } from "@/components/landing/SectionNav";
import { StoryExpander } from "@/components/landing/StoryExpander";
import { SkillsMarquee } from "@/components/landing/SkillsMarquee";

/* ============ page ============ */

const Landing = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* Skip-to-content link for keyboard users — visually hidden until focused.
          Per WCAG 2.4.1 (Bypass Blocks): keyboard users can jump past the
          header + section nav rail straight to the main content. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        Skip to content
      </a>
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

      <main id="main-content" className="container max-w-5xl mx-auto px-4 py-10 sm:py-12 space-y-20">
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

          {/* Crest + wordmark row — psychedelic skull crest as hero centerpiece. */}
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-start gap-6 sm:gap-10">
            <div className="relative w-[clamp(11rem,22vw,18rem)] aspect-square shrink-0 motion-safe:animate-[float_8s_ease-in-out_infinite]">
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
