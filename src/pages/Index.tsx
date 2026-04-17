import { useState, useEffect, useMemo } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StatsCards } from "@/components/StatsCards";
import { JobTable } from "@/components/JobTable";
import { KanbanBoard } from "@/components/KanbanBoard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Search, LayoutList, Columns3, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Job, JobStatus, Opportunity, mapOpportunityToJob } from "@/lib/types";

type ViewMode = "table" | "kanban";
type SortKey = "score" | "date" | "salary";

const Index = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [botTypeFilter, setBotTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("score");
  const [view, setView] = useState<ViewMode>("table");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .order("score", { ascending: false })
        .limit(500);

      if (error) {
        console.error("Failed to fetch opportunities:", error);
        setLoading(false);
        return;
      }

      setJobs((data as Opportunity[]).map(mapOpportunityToJob));
      setLoading(false);
    }
    fetchJobs();
  }, []);

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
      return 0;
    });

    return result;
  }, [jobs, search, statusFilter, sourceFilter, botTypeFilter, sortBy]);

  const handleStatusChange = (id: string, status: JobStatus) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2.5">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Briefcase className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Young Algy</h1>
          </div>
          <div className="flex items-center gap-2">
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
            <JobTable jobs={filtered} onStatusChange={handleStatusChange} />
          </Card>
        ) : (
          <KanbanBoard jobs={filtered} onStatusChange={handleStatusChange} />
        )}
      </main>
    </div>
  );
};

export default Index;
