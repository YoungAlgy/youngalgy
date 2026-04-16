import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Job, JobStatus, STATUS_CONFIG } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLUMNS: JobStatus[] = ["saved", "applied", "interview", "offer", "rejected"];

function daysSince(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

interface KanbanBoardProps {
  jobs: Job[];
  onStatusChange: (id: string, status: JobStatus) => void;
}

export function KanbanBoard({ jobs, onStatusChange }: KanbanBoardProps) {
  const columns = COLUMNS.map((status) => ({
    status,
    config: STATUS_CONFIG[status],
    jobs: jobs.filter((j) => j.status === status),
  }));

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const jobId = result.draggableId;
    const newStatus = result.destination.droppableId as JobStatus;
    onStatusChange(jobId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4 min-h-[60vh]">
        {columns.map((col) => (
          <div key={col.status} className="flex-shrink-0 w-64 flex flex-col">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${col.config.className}`} />
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
                          className={`rounded-md border bg-card p-3 space-y-2 shadow-sm transition-shadow ${
                            snapshot.isDragging ? "shadow-lg ring-2 ring-primary/20" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate text-foreground">{job.company}</p>
                              <p className="text-xs text-muted-foreground truncate">{job.position}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
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
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate max-w-[100px]">{job.location}</span>
                            </span>
                            <span>{daysSince(job.appliedDate)}d ago</span>
                          </div>
                          {job.url && (
                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-xs gap-1"
                                onClick={() => window.open(job.url, "_blank")}
                              >
                                Apply <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
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
