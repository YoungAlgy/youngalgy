import { memo, useMemo } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Job, JobStatus, STATUS_CONFIG } from "@/lib/types";
import { MapPin, ExternalLink, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { formatRelativeDate } from "@/lib/dates";

const COLUMNS: JobStatus[] = ["applied", "phone_screen", "interview", "offer", "rejected"];

interface KanbanBoardProps {
  jobs: Job[];
  onStatusChange: (id: string, status: JobStatus) => void;
  onEdit?: (job: Job) => void;
}

function KanbanBoardImpl({ jobs, onStatusChange, onEdit }: KanbanBoardProps) {
  const columns = useMemo(() =>
    COLUMNS.map((status) => ({
      status,
      config: STATUS_CONFIG[status],
      jobs: jobs.filter((j) => j.status === status),
    })),
    [jobs],
  );

  const jobIndex = useMemo(() => {
    const m = new Map<string, Job>();
    for (const j of jobs) m.set(j.id, j);
    return m;
  }, [jobs]);

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const jobId = result.draggableId;
    const newStatus = result.destination.droppableId as JobStatus;
    const job = jobIndex.get(jobId);
    if (!job || job.status === newStatus) return;
    onStatusChange(jobId, newStatus);
    const { error } = await supabase.from("opportunities").update({ status: newStatus }).eq("id", jobId);
    if (error) {
      onStatusChange(jobId, job.status); // revert
      toast.error("Failed to update status");
    } else {
      toast.success(`Status → ${STATUS_CONFIG[newStatus].label}`);
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4 min-h-[60vh]">
        {columns.map((col) => (
          <div key={col.status} className="flex-shrink-0 w-64 flex flex-col">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${col.config.className.split(" ")[0]}`} />
              <h3 className="text-sm font-semibold text-foreground">{col.config.label}</h3>
              <span className="text-xs text-muted-foreground ml-auto">{col.jobs.length}</span>
            </div>
            <Droppable droppableId={col.status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 rounded-lg border p-2 space-y-2 transition-colors ${
                    snapshot.isDraggingOver ? "bg-accent/60 border-primary/30" : "bg-muted/30 border-border"
                  }`}
                >
                  {col.jobs.map((job, index) => (
                    <Draggable key={job.id} draggableId={job.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`group rounded-md border bg-card p-3 space-y-2 shadow-sm transition-shadow ${
                            snapshot.isDragging ? "shadow-lg ring-2 ring-primary/20" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate text-foreground">{job.company}</p>
                              <p className="text-xs text-muted-foreground truncate">{job.position}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {job.score != null && (
                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                                  job.score >= 9 ? "bg-success text-success-foreground" :
                                  job.score >= 7 ? "bg-warning text-warning-foreground" :
                                  "bg-secondary text-secondary-foreground"
                                }`}>
                                  {job.score}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1 min-w-0">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">{job.location}</span>
                            </span>
                            <span className="shrink-0">{formatRelativeDate(job.appliedDate)}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {job.salary && job.salaryRaw && job.salaryRaw > 0 ? job.salary : "—"}
                          </div>
                          <div className="flex justify-end gap-1.5">
                            {onEdit && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => onEdit(job)}
                                title="Edit"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            )}
                            {job.url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-xs gap-1"
                                onClick={() => window.open(job.url, "_blank")}
                              >
                                Apply <ExternalLink className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

export const KanbanBoard = memo(KanbanBoardImpl);
