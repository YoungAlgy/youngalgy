import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { Job } from "@/lib/types";
import { MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobTableProps {
  jobs: Job[];
  onDelete: (id: string) => void;
}

export function JobTable({ jobs, onDelete }: JobTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No jobs found</p>
        <p className="text-sm mt-1">Add a job or adjust your filters.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id} className="group">
                <TableCell className="font-medium">{job.company}</TableCell>
                <TableCell>{job.position}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="h-3 w-3" /> {job.location}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{job.salary || "—"}</TableCell>
                <TableCell><StatusBadge status={job.status} /></TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(job.appliedDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(job.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="bg-card border rounded-lg p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{job.company}</p>
                <p className="text-sm text-muted-foreground">{job.position}</p>
              </div>
              <StatusBadge status={job.status} />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
              <span>{job.salary || ""}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{new Date(job.appliedDate).toLocaleDateString()}</span>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => onDelete(job.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
