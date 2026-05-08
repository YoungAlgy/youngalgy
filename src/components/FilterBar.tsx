import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALL_STATUSES, STATUS_CONFIG, JobStatus } from "@/lib/types";
import { ChevronDown, ChevronUp, X } from "lucide-react";

export type ReplyStateFilter = "all" | "awaiting" | "stale" | "replied";

export interface Filters {
  statuses: JobStatus[];
  sources: string[];
  dateRange: "7" | "30" | "all" | "custom";
  customFrom?: string;
  customTo?: string;
  salaryMin: number;
  hasUrl: boolean;
  replyState: ReplyStateFilter;
}

export const DEFAULT_FILTERS: Filters = {
  statuses: [],
  sources: [],
  dateRange: "all",
  salaryMin: 0,
  hasUrl: false,
  replyState: "all",
};

const REPLY_STATE_OPTIONS: { value: ReplyStateFilter; label: string }[] = [
  { value: "all",      label: "All"             },
  { value: "awaiting", label: "Awaiting reply"  },
  { value: "stale",    label: "Stale (>14d)"    },
  { value: "replied",  label: "Replied"         },
];

interface Props {
  filters: Filters;
  setFilters: (f: Filters) => void;
  availableSources: string[];
  onClear: () => void;
}

export function FilterBar({ filters, setFilters, availableSources, onClear }: Props) {
  const [open, setOpen] = useState(false);

  const activeCount =
    filters.statuses.length +
    filters.sources.length +
    (filters.dateRange !== "all" ? 1 : 0) +
    (filters.salaryMin > 0 ? 1 : 0) +
    (filters.hasUrl ? 1 : 0) +
    (filters.replyState !== "all" ? 1 : 0);

  const toggleStatus = (s: JobStatus) => {
    const exists = filters.statuses.includes(s);
    setFilters({ ...filters, statuses: exists ? filters.statuses.filter((x) => x !== s) : [...filters.statuses, s] });
  };
  const toggleSource = (s: string) => {
    const exists = filters.sources.includes(s);
    setFilters({ ...filters, sources: exists ? filters.sources.filter((x) => x !== s) : [...filters.sources, s] });
  };

  return (
    <Card className="border shadow-sm">
      {/* Header row — two separate interactive elements; can't nest buttons */}
      <div className="flex items-center justify-between p-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 text-sm font-semibold hover:text-foreground/80 transition-colors"
          aria-expanded={open}
          aria-controls="filter-panel"
        >
          Filters
          {activeCount > 0 && (
            <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">{activeCount}</span>
          )}
          {open ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
        </button>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              aria-label="Clear all filters"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </div>
      </div>
      {open && (
        <div id="filter-panel" className="p-4 border-t space-y-4">
          {/* Status multi-select */}
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Status</p>
            <div className="flex flex-wrap gap-2">
              {ALL_STATUSES.map((s) => {
                const active = filters.statuses.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleStatus(s)}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                      active ? STATUS_CONFIG[s].className + " border-transparent" : "bg-card text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {STATUS_CONFIG[s].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reply state — derived from status + first_reply_at + age */}
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Reply state</p>
            <div className="flex flex-wrap gap-2">
              {REPLY_STATE_OPTIONS.map((opt) => {
                const active = filters.replyState === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilters({ ...filters, replyState: opt.value })}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-transparent"
                        : "bg-card text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source multi-select */}
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Source</p>
            <div className="flex flex-wrap gap-2">
              {availableSources.length === 0 && <span className="text-xs text-muted-foreground">No sources yet</span>}
              {availableSources.map((s) => {
                const active = filters.sources.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleSource(s)}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                      active ? "bg-primary text-primary-foreground border-transparent" : "bg-card text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date range + salary + URL */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Date Range</p>
              <Select
                value={filters.dateRange}
                onValueChange={(v) => setFilters({ ...filters, dateRange: v as Filters["dateRange"] })}
              >
                <SelectTrigger className="h-8 text-xs" aria-label="Date range filter"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {filters.dateRange === "custom" && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="date"
                    aria-label="From date"
                    value={filters.customFrom ?? ""}
                    onChange={(e) => setFilters({ ...filters, customFrom: e.target.value })}
                    className="h-8 text-xs px-2 rounded-md border bg-background flex-1"
                  />
                  <input
                    type="date"
                    aria-label="To date"
                    value={filters.customTo ?? ""}
                    onChange={(e) => setFilters({ ...filters, customTo: e.target.value })}
                    className="h-8 text-xs px-2 rounded-md border bg-background flex-1"
                  />
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                Salary Min: ${filters.salaryMin.toLocaleString()}
              </p>
              <Slider
                min={0}
                max={200_000}
                step={5_000}
                value={[filters.salaryMin]}
                onValueChange={(v) => setFilters({ ...filters, salaryMin: v[0] })}
                aria-label="Minimum salary filter"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={filters.hasUrl}
                  onCheckedChange={(c) => setFilters({ ...filters, hasUrl: !!c })}
                />
                Has Apply URL
              </label>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
