import { useState, useEffect, useMemo } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StatsCards } from "@/components/StatsCards";
import { JobTable } from "@/components/JobTable";
import { KanbanBoard } from "@/components/KanbanBoard";
import { AddJobDialog } from "@/components/AddJobDialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Search, LayoutList, Columns3, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Job, JobStatus, Opportunity, mapOpportunityToJob } from "@/lib/types";

type ViewMode = "table" | "kanban";

const Index = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [view, setView] = useState<ViewMode>("table");

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .order("score", { ascending: false })
        .limit(100);

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

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchesSearch = !search || j.company.toLowerCase().includes(search.toLowerCase()) || j.position.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || j.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  const handleAdd = (job: Job) => setJobs((prev) => [job, ...prev]);
  const handleDelete = (id: string) => setJobs((prev) => prev.filter((j) => j.id !== id));
  const handleStatusChange = (id: string, status: JobStatus) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2.5">
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
        <StatsCards jobs={jobs} />

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All statuses" />
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
          </div>
          <AddJobDialog onAdd={handleAdd} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : view === "table" ? (
          <Card className="border shadow-sm overflow-hidden">
            <JobTable jobs={filtered} onDelete={handleDelete} />
          </Card>
        ) : (
          <KanbanBoard jobs={filtered} onStatusChange={handleStatusChange} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
};

export default Index;
