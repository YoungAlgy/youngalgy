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
import { FilterBar, Filters, DEFAULT_FILTERS } from "@/components/FilterBar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Search, LayoutList, Columns3, Loader2, ArrowLeft, Download, Building2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Job, JobStatus, Opportunity, mapOpportunityToJob } from "@/lib/types";
import { exportOpportunitiesCsv } from "@/lib/csv";
import { logError } from "@/lib/log";
import { toast } from "sonner";

type ViewMode = "table" | "kanban" | "company";
type SortKey = "score" | "date" | "salary" | "days";

const REFRESH_MS = 30_000;

// --- URL <-> Filters serialization ---
function filtersFromParams(p: URLSearchParams): Filters {
  return {
    statuses: (p.get("status")?.split(",").filter(Boolean) as JobStatus[]) ?? [],
    sources: p.get("source")?.split(",").filter(Boolean) ?? [],
    dateRange: (p.get("range") as Filters["dateRange"]) || "all",
    customFrom: p.get("from") ?? undefined,
    customTo: p.get("to") ?? undefined,
    salaryMin: Number(p.get("salaryMin") ?? "0") || 0,
    hasUrl: p.get("hasUrl") === "1",
  };
}

function paramsFromFilters(f: Filters, search: string, view: ViewMode, sortBy: SortKey): URLSearchParams {
  const p = new URLSearchParams();
  if (f.statuses.length) p.set("status", f.statuses.join(","));
  if (f.sources.length) p.set("source", f.sources.join(","));
  if (f.dateRange !== "all") p.set("range", f.dateRange);
  if (f.customFrom) p.set("from", f.customFrom);
  if (f.customTo) p.set("to", f.customTo);
  if (f.salaryMin > 0) p.set("salaryMin", String(f.salaryMin));
  if (f.hasUrl) p.set("hasUrl", "1");
  if (search) p.set("q", search);
  if (view !== "table") p.set("view", view);
  if (sortBy !== "score") p.set("sort", sortBy);
  return p;
}

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [filters, setFilters] = useState<Filters>(filtersFromParams(searchParams));
  const [funnelStage, setFunnelStage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>((searchParams.get("sort") as SortKey) || "score");
  const [view, setView] = useState<ViewMode>((searchParams.get("view") as ViewMode) || "table");
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();

  const fetchJobs = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    // Explicit column list — never select('*') so we don't over-fetch sensitive fields by accident.
    const { data, error } = await supabase
      .from("opportunities")
      .select("id,title,company,location,salary_low,score,status,source,bot_type,url,notes,reasoning,cover_letter,proposal,created_at")
      .eq("bot_type", "manual")
      .order("score", { ascending: false })
      .limit(500);

    if (error) {
      logError("fetch opportunities");
      if (!silent) setLoading(false);
      return;
    }

    setJobs((data as Opportunity[]).map(mapOpportunityToJob));
    if (!silent) setLoading(false);
  }, []);

  useEffect(() => {
    fetchJobs();
    const id = setInterval(() => fetchJobs(true), REFRESH_MS);
    return () => clearInterval(id);
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

    let result = jobs.filter((j) => {
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
      return matchesSearch && matchesStatus && matchesSource && matchesDate && matchesSalary && matchesUrl && matchesFunnel;
    });

    result.sort((a, b) => {
      if (sortBy === "score") return (b.score ?? -1) - (a.score ?? -1);
      if (sortBy === "salary") return (b.salaryRaw ?? 0) - (a.salaryRaw ?? 0);
      return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
    });

    return result;
  }, [jobs, search, filters, sortBy, funnelStage]);

  const handleStatusChange = (id: string, status: JobStatus) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
  };

  const handleNotesChange = (id: string, notes: string) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, notes } : j)));
  };

  async function handleExport() {
    setExporting(true);
    try {
      await exportOpportunitiesCsv();
      toast.success("CSV exported");
    } catch (e) {
      console.error(e);
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2.5">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Briefcase className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Alexander Holmes</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={handleExport}
              disabled={exporting}
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <div className="hidden sm:flex items-center rounded-md border bg-muted p-0.5">
              <Button variant={view === "table" ? "default" : "ghost"} size="sm" className="h-7 px-2.5 gap-1.5 text-xs" onClick={() => setView("table")}>
                <LayoutList className="h-3.5 w-3.5" /><span className="hidden md:inline">By Job</span>
              </Button>
              <Button variant={view === "company" ? "default" : "ghost"} size="sm" className="h-7 px-2.5 gap-1.5 text-xs" onClick={() => setView("company")}>
                <Building2 className="h-3.5 w-3.5" /><span className="hidden md:inline">By Company</span>
              </Button>
              <Button variant={view === "kanban" ? "default" : "ghost"} size="sm" className="h-7 px-2.5 gap-1.5 text-xs" onClick={() => setView("kanban")}>
                <Columns3 className="h-3.5 w-3.5" /><span className="hidden md:inline">Board</span>
              </Button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        <StatsCards />

        <PipelineFunnel onStageClick={setFunnelStage} activeStage={funnelStage} />

        <InterviewScheduler />

        <div className="grid gap-4 lg:grid-cols-2">
          <DailyAppsChart />
          <SourcePieChart />
        </div>

        <SalaryHistogram />

        <FilterBar
          filters={filters}
          setFilters={setFilters}
          availableSources={sources}
          onClear={() => setFilters(DEFAULT_FILTERS)}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search title or company..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Sort: Score</SelectItem>
              <SelectItem value="date">Sort: Date</SelectItem>
              <SelectItem value="salary">Sort: Salary</SelectItem>
              <SelectItem value="days">Sort: Days Since</SelectItem>
            </SelectContent>
          </Select>
          <div className="sm:hidden flex items-center rounded-md border bg-muted p-0.5">
            <Button variant={view === "table" ? "default" : "ghost"} size="sm" className="h-7 flex-1 text-xs" onClick={() => setView("table")}>By Job</Button>
            <Button variant={view === "company" ? "default" : "ghost"} size="sm" className="h-7 flex-1 text-xs" onClick={() => setView("company")}>By Company</Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : view === "table" ? (
          <Card className="border shadow-sm overflow-hidden">
            <JobTable jobs={filtered} onStatusChange={handleStatusChange} onNotesChange={handleNotesChange} />
          </Card>
        ) : view === "company" ? (
          <Card className="border shadow-sm overflow-hidden">
            <CompanyTable jobs={filtered} />
          </Card>
        ) : (
          <KanbanBoard jobs={filtered} onStatusChange={handleStatusChange} />
        )}
      </main>
    </div>
  );
};

export default Index;
