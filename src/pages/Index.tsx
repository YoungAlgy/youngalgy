import { useState, useEffect, useMemo, useCallback } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StatsCards } from "@/components/StatsCards";
import { JobTable } from "@/components/JobTable";
import { CompanyTable } from "@/components/CompanyTable";
import { KanbanBoard } from "@/components/KanbanBoard";
import { InterviewScheduler } from "@/components/InterviewScheduler";
import { DailyAppsChart } from "@/components/DailyAppsChart";
import { PipelineFunnel } from "@/components/PipelineFunnel";
import { SourcePieChart } from "@/components/SourcePieChart";
import { SalaryHistogram } from "@/components/SalaryHistogram";
import { RejectionLog } from "@/components/RejectionLog";
import { FilterBar, Filters, DEFAULT_FILTERS } from "@/components/FilterBar";
import { EditJobDrawer } from "@/components/EditJobDrawer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search, LayoutList, Columns3, Loader2, ArrowLeft, Download, Building2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { supabase } from "@/lib/supabase";
import { Job, JobStatus, Opportunity, mapOpportunityToJob } from "@/lib/types";
import {
  filtersFromParams,
  paramsFromFilters,
  type ViewMode,
  type SortKey,
} from "@/lib/url-filters";
import { exportOpportunitiesCsv } from "@/lib/csv";
import { logError } from "@/lib/log";
import { toast } from "sonner";

// Polling interval. Bumped from 30s -> 90s on 2026-04-27 as part of the
// disk-IO cleanup — the Supabase project warned about its IO budget. With
// the analytics widgets now deriving from the in-memory jobs array (no
// per-widget queries), 90s is plenty for "kanban stays warm" UX.
const REFRESH_MS = 90_000;

function SectionHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-baseline gap-3 pt-2">
      <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{title}</h2>
      {hint && <span className="text-xs text-muted-foreground/70">{hint}</span>}
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interviewCompanies, setInterviewCompanies] = useState<Set<string>>(new Set());
  const [interviewCount, setInterviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [filters, setFilters] = useState<Filters>(filtersFromParams(searchParams));
  const [funnelStage, setFunnelStage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>((searchParams.get("sort") as SortKey) || "score");
  // Default view = Board (kanban). Honor URL override.
  const [view, setView] = useState<ViewMode>((searchParams.get("view") as ViewMode) || "kanban");
  const [exporting, setExporting] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const navigate = useNavigate();

  const fetchJobs = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);

    // Try the new schema first (first_reply_at + reply_kind from
    // 20260427_reply_tracking.sql). If those columns aren't deployed yet
    // we'll get PostgREST error 42703 and retry without them so the UI
    // keeps working during the migration window.
    const COLS_NEW = "id,title,company,location,salary_low,score,status,source,bot_type,url,notes,reasoning,cover_letter,proposal,created_at,first_reply_at,reply_kind";
    const COLS_OLD = "id,title,company,location,salary_low,score,status,source,bot_type,url,notes,reasoning,cover_letter,proposal,created_at";

    let [oppRes, intRes] = await Promise.all([
      supabase
        .from("opportunities")
        .select(COLS_NEW)
        .eq("bot_type", "manual")
        .order("score", { ascending: false })
        .limit(500),
      supabase.from("interviews").select("company"),
    ]);

    // Graceful fallback: schema not yet migrated -> retry with old column set
    if (oppRes.error && (oppRes.error as { code?: string })?.code === "42703") {
      const retry = await supabase
        .from("opportunities")
        .select(COLS_OLD)
        .eq("bot_type", "manual")
        .order("score", { ascending: false })
        .limit(500);
      oppRes = retry;
    }

    if (oppRes.error) {
      logError("fetch opportunities");
      if (!silent) setLoading(false);
      return;
    }

    const intRows = ((intRes.data as { company: string }[] | null) ?? []);
    const intCompanies = new Set(
      intRows.map((r) => r.company?.trim().toLowerCase()).filter(Boolean),
    );
    setInterviewCompanies(intCompanies);
    setInterviewCount(intRows.length);

    // Derive effective status: presence in interviews table promotes to "interview"
    // (unless the opportunity is already in a later/terminal stage).
    const TERMINAL: JobStatus[] = ["offer", "rejected", "ghosted", "withdrew"];
    const mapped = (oppRes.data as Opportunity[]).map(mapOpportunityToJob).map((j) => {
      if (
        intCompanies.has(j.company.trim().toLowerCase()) &&
        !TERMINAL.includes(j.status) &&
        j.status !== "interview"
      ) {
        return { ...j, status: "interview" as JobStatus };
      }
      return j;
    });
    setJobs(mapped);
    if (!silent) setLoading(false);
  }, []);

  useEffect(() => {
    fetchJobs();
    const id = setInterval(() => {
      // Skip polling when the tab isn't visible — saves Supabase quota and
      // avoids hammering the DB in background tabs.
      if (document.visibilityState === "visible") fetchJobs(true);
    }, REFRESH_MS);
    const onVis = () => {
      if (document.visibilityState === "visible") fetchJobs(true);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [fetchJobs]);

  // Sync URL when filters/search/view/sort change
  useEffect(() => {
    setSearchParams(paramsFromFilters(filters, search, view, sortBy), { replace: true });
  }, [filters, search, view, sortBy, setSearchParams]);

  const sources = useMemo(
    () => [...new Set(jobs.map((j) => j.source).filter((s): s is string => !!s))].sort(),
    [jobs]
  );

  const filtered = useMemo(() => {
    const now = Date.now();
    let cutoff: number | null = null;
    if (filters.dateRange === "7") cutoff = now - 7 * 86400_000;
    else if (filters.dateRange === "30") cutoff = now - 30 * 86400_000;
    const customFromMs = filters.customFrom ? new Date(filters.customFrom).getTime() : null;
    const customToMs = filters.customTo ? new Date(filters.customTo).getTime() + 86400_000 : null;

    const result = jobs.filter((j) => {
      const matchesSearch = !search ||
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        j.position.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(j.status);
      const matchesSource = filters.sources.length === 0 || (j.source ? filters.sources.includes(j.source) : false);
      const t = new Date(j.appliedDate).getTime();
      let matchesDate = true;
      if (cutoff !== null) matchesDate = t >= cutoff;
      else if (filters.dateRange === "custom") {
        matchesDate = (customFromMs === null || t >= customFromMs) && (customToMs === null || t < customToMs);
      }
      const matchesSalary = filters.salaryMin === 0 || (j.salaryRaw ?? 0) >= filters.salaryMin;
      const matchesUrl = !filters.hasUrl || !!j.url;
      const matchesFunnel = !funnelStage || j.status === funnelStage;

      // Reply-state filter: derives from status + firstReplyAt + age
      let matchesReplyState = true;
      if (filters.replyState !== "all") {
        const isApplied = j.status === "applied";
        const hasReply = !!j.firstReplyAt;
        if (filters.replyState === "awaiting") {
          matchesReplyState = isApplied && !hasReply;
        } else if (filters.replyState === "replied") {
          matchesReplyState = hasReply;
        } else if (filters.replyState === "stale") {
          const ageMs = now - t;
          const STALE_MS = 14 * 86400_000;
          matchesReplyState = isApplied && !hasReply && ageMs >= STALE_MS;
        }
      }

      return matchesSearch && matchesStatus && matchesSource && matchesDate && matchesSalary && matchesUrl && matchesFunnel && matchesReplyState;
    });

    const byDateDesc = (a: Job, b: Job) =>
      new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
    result.sort((a, b) => {
      if (sortBy === "score") {
        const diff = (b.score ?? -1) - (a.score ?? -1);
        return diff !== 0 ? diff : byDateDesc(a, b);
      }
      if (sortBy === "salary") {
        const diff = (b.salaryRaw ?? 0) - (a.salaryRaw ?? 0);
        return diff !== 0 ? diff : byDateDesc(a, b);
      }
      if (sortBy === "days") return byDateDesc(b, a);
      return byDateDesc(a, b);
    });

    return result;
  }, [jobs, search, filters, sortBy, funnelStage]);

  const handleStatusChange = (id: string, status: JobStatus) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
  };

  const handleNotesChange = (id: string, notes: string) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, notes } : j)));
  };

  const handleEditSaved = (id: string, patch: Partial<Job>) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  };

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
    setFunnelStage(null);
  }, []);

  async function handleExport() {
    setExporting(true);
    try {
      await exportOpportunitiesCsv();
      toast.success("CSV exported");
    } catch (e) {
      logError("export csv", e);
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  }

  const ViewToggle = (
    <div className="inline-flex items-center rounded-md border bg-muted p-0.5">
      <Button variant={view === "kanban" ? "default" : "ghost"} size="sm" className="h-8 px-3 gap-1.5 text-xs" onClick={() => setView("kanban")}>
        <Columns3 className="h-3.5 w-3.5" /> Board
      </Button>
      <Button variant={view === "table" ? "default" : "ghost"} size="sm" className="h-8 px-3 gap-1.5 text-xs" onClick={() => setView("table")}>
        <LayoutList className="h-3.5 w-3.5" /> By Job
      </Button>
      <Button variant={view === "company" ? "default" : "ghost"} size="sm" className="h-8 px-3 gap-1.5 text-xs" onClick={() => setView("company")}>
        <Building2 className="h-3.5 w-3.5" /> By Company
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="container max-w-screen-2xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/")} aria-label="Back to home">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Logo variant="full" size="md" />
            <span className="hidden sm:inline-flex text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-primary px-2 py-1 rounded border border-primary/30 bg-primary/5 ml-2">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-semibold border-border hover:border-primary/50"
              onClick={handleExport}
              disabled={exporting}
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container max-w-screen-2xl mx-auto px-4 py-6 space-y-8">
        {/* SECTION: Snapshot */}
        <section className="space-y-4">
          <SectionHeading title="Snapshot" hint="Top-of-funnel + recent rejections" />
          <StatsCards jobs={jobs} interviewCount={interviewCount} />
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <PipelineFunnel jobs={jobs} interviewCount={interviewCount} onStageClick={setFunnelStage} activeStage={funnelStage} />
            <RejectionLog />
          </div>
        </section>

        {/* SECTION: In Motion */}
        <section className="space-y-4">
          <SectionHeading title="In Motion" hint="Active interviews" />
          <InterviewScheduler />
        </section>

        {/* SECTION: Trends */}
        <section className="space-y-4">
          <SectionHeading title="Trends" hint="Daily volume, source mix, salary spread" />
          <div className="grid gap-4 lg:grid-cols-2">
            <DailyAppsChart jobs={jobs} />
            <SourcePieChart jobs={jobs} />
          </div>
          <SalaryHistogram jobs={jobs} />
        </section>

        {/* SECTION: All Applications */}
        <section className="space-y-4">
          <SectionHeading title="All Applications" hint="Filter, search, edit" />

          <FilterBar
            filters={filters}
            setFilters={setFilters}
            availableSources={sources}
            onClear={() => setFilters(DEFAULT_FILTERS)}
          />

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="View mode">
            <span className="text-xs font-medium text-muted-foreground mr-1" aria-hidden="true">View:</span>
            {ViewToggle}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-xs sm:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                aria-label="Search applications by title or company"
                placeholder="Search title or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
              <SelectTrigger className="w-full sm:w-[160px]" aria-label="Sort applications">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Sort: Score</SelectItem>
                <SelectItem value="date">Sort: Date</SelectItem>
                <SelectItem value="salary">Sort: Salary</SelectItem>
                <SelectItem value="days">Sort: Days Since</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : view === "kanban" ? (
            <KanbanBoard jobs={filtered} onStatusChange={handleStatusChange} onEdit={setEditJob} />
          ) : view === "table" ? (
            <Card className="border shadow-sm overflow-hidden">
              <JobTable
                jobs={filtered}
                onStatusChange={handleStatusChange}
                onNotesChange={handleNotesChange}
                onEdit={setEditJob}
                onClearFilters={handleClearFilters}
              />
            </Card>
          ) : (
            <Card className="border shadow-sm overflow-hidden">
              <CompanyTable jobs={filtered} onEdit={setEditJob} onClearFilters={handleClearFilters} />
            </Card>
          )}
        </section>
      </main>

      <EditJobDrawer
        job={editJob}
        onClose={() => setEditJob(null)}
        onSaved={handleEditSaved}
      />
    </div>
  );
};

export default Index;
