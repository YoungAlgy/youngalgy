import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ghost, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { logError } from "@/lib/log";
import { toast } from "sonner";
import { Job, JobStatus, isStale } from "@/lib/types";

interface Props {
  jobs: Job[];
  /** Days-since-applied threshold for "stale". Default 14. */
  thresholdDays?: number;
  /** Optional callback to update parent state after the sweep. */
  onSwept?: (updatedIds: string[]) => void;
}

/**
 * Bulk-marks all stale (>thresholdDays, no reply, still 'applied') opportunities
 * as 'ghosted' in one click. This fixes the funnel-honesty problem where 98%+
 * of "Awaiting Reply" is actually silent ghosting that was never recorded.
 *
 * Renders nothing when there's nothing to sweep — the card only appears when
 * stale work exists. Clicking shows a confirm step (irreversible) before firing.
 */
export function StaleSweepCard({ jobs, thresholdDays = 14, onSwept }: Props) {
  const staleJobs = useMemo(
    () =>
      jobs.filter((j) =>
        isStale(
          {
            status: j.status,
            first_reply_at: j.firstReplyAt ?? null,
            created_at: j.appliedDate,
          },
          thresholdDays,
        ),
      ),
    [jobs, thresholdDays],
  );

  const [confirming, setConfirming] = useState(false);
  const [sweeping, setSweeping] = useState(false);

  if (staleJobs.length === 0) return null;

  async function handleSweep() {
    setSweeping(true);
    const ids = staleJobs.map((j) => j.id);
    // Batch in chunks of 100 to stay under any PostgREST IN-list practical limit.
    const CHUNK = 100;
    const updated: string[] = [];
    try {
      for (let i = 0; i < ids.length; i += CHUNK) {
        const slice = ids.slice(i, i + CHUNK);
        const { error } = await supabase
          .from("opportunities")
          .update({ status: "ghosted" as JobStatus })
          .in("id", slice);
        if (error) {
          logError("stale sweep chunk", error);
          throw error;
        }
        updated.push(...slice);
      }
      toast.success(`Marked ${updated.length} stale apps as ghosted.`);
      onSwept?.(updated);
    } catch (err) {
      logError("stale sweep", err);
      toast.error(`Sweep failed after ${updated.length}/${ids.length}.`);
    } finally {
      setSweeping(false);
      setConfirming(false);
    }
  }

  return (
    <Card className="border border-warning/40 bg-warning/5 shadow-sm">
      <div className="flex items-center gap-3 p-4">
        <Ghost className="h-5 w-5 text-warning shrink-0" aria-hidden />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">
            {staleJobs.length} apps stuck in &ldquo;Applied&rdquo; for &gt;{thresholdDays} days with no reply
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            These are almost certainly silent ghosts. Mark them ghosted to keep the funnel honest.
          </p>
        </div>
        {!confirming ? (
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 border-warning/40 text-warning hover:bg-warning/10 hover:text-warning shrink-0"
            onClick={() => setConfirming(true)}
            disabled={sweeping}
          >
            <Ghost className="h-3.5 w-3.5" />
            Mark all ghosted
          </Button>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => setConfirming(false)}
              disabled={sweeping}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-8 gap-1.5 bg-warning text-warning-foreground hover:bg-warning/90"
              onClick={handleSweep}
              disabled={sweeping}
            >
              {sweeping ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Ghost className="h-3.5 w-3.5" />}
              Confirm: mark {staleJobs.length} ghosted
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
