import { useState, useEffect, useMemo, useCallback } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StatsCards } from "@/components/StatsCards";
import { JobTable } from "@/components/JobTable";
import { KanbanBoard } from "@/components/KanbanBoard";
import { InterviewScheduler } from "@/components/InterviewScheduler";
import { DailyAppsChart } from "@/components/DailyAppsChart";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Search, LayoutList, Columns3, Loader2, ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Job, JobStatus, Opportunity, mapOpportunityToJob } from "@/lib/types";
import { exportOpportunitiesCsv } from "@/lib/csv";
import { toast } from "sonner";

type ViewMode = "table" | "kanban";
type SortKey = "score" | "date" | "salary" | "days";

const REFRESH_MS = 30_000;

const Index = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [botTypeFilter, setBotTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("score");
  const [view, setView] = useState<ViewMode>("table");
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();

  const fetchJobs = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .order("score", { ascending: false })
      .limit(500);

    if (error) {
      console.error("Failed to fetch opportunities:", error);
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

  const sources = useMemo(() => [...new Set(jobs.map(j => j.source).filter(Boolean))].sort(), [jobs]);
  const botTypes = useMemo(() => [...new Set(jobs.map(j => j.botType).filter(Boolean))].sort(), [jobs]);

  const filtered = useMemo(() => {
    let result = jobs.filter((j) => {
      const matchesSearch = !search ||
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        j.position.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || j.status === statusFilter;
      const matchesSource = sourceFilter === "all" || j.source === sourceFilter;
      const matchesBotType = botTypeFilter === "all" || j.botType === botTypeFilter;
      return matchesSearch && matchesStatus && matchesSource && matchesBotType;
    });

    result.sort((a, b) => {
      if (sortBy === "score") return (b.score ?? -1) - (a.score ?? -1);
      if (sortBy === "date") return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      if (sortBy === "salary") return (b.salaryRaw ?? 0) - (a.salaryRaw ?? 0);
      if (sortBy === "days") return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      return 0;
    });

    return result;
  }, [jobs, search, statusFilter, sourceFilter, botTypeFilter, sortBy]);

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
            <div className="flex items-center rounded-md border bg-muted p-0.5">
              <Button variant={view === "table" ? "default" : "ghost"} size="sm" className="h-7 px-2.5 gap-1.5 text-xs" onClick={() => setView("table")}>
                <LayoutList className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Table</span>
              </Button>
              <Button variant={view === "kanban" ? "default" : "ghost"} size="sm" className="h-7 px-2.5 gap-1.5 text-xs" onClick={() => setView("kanban")}>
                <Columns3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Board</span>
              </Button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        <StatsCards />

        <InterviewScheduler />

        <DailyAppsChart />

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full sm:max-w-xs sm:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search title or company..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="saved">Saved</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.map((s) => (
                  <SelectItem key={s} value={s!}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={botTypeFilter} onValueChange={setBotTypeFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Bot Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bots</SelectItem>
                {botTypes.map((b) => (
                  <SelectItem key={b} value={b!}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
              <SelectTrigger className="w-full sm:w-[140px]">
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
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : view === "table" ? (
          <Card className="border shadow-sm overflow-hidden">
            <JobTable jobs={filtered} onStatusChange={handleStatusChange} onNotesChange={handleNotesChange} />
          </Card>
        ) : (
          <KanbanBoard jobs={filtered} onStatusChange={handleStatusChange} />
        )}
      </main>
    </div>
  );
};

export default Index;
