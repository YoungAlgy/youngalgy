import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "li_quota_hit_at";
const RESET_HOURS = 24;

function timeLeft(hitAt: number): { ms: number; label: string } {
  const target = hitAt + RESET_HOURS * 3600_000;
  const ms = target - Date.now();
  if (ms <= 0) return { ms: 0, label: "" };
  const h = Math.floor(ms / 3600_000);
  const m = Math.floor((ms % 3600_000) / 60_000);
  return { ms, label: `${h}h ${m}m` };
}

export function LinkedInQuotaWidget() {
  const [hitAt, setHitAt] = useState<number | null>(() => {
    const v = localStorage.getItem(STORAGE_KEY);
    return v ? Number(v) : null;
  });
  const [, setTick] = useState(0);

  useEffect(() => {
    if (hitAt === null) return;
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, [hitAt]);

  const left = hitAt !== null ? timeLeft(hitAt) : { ms: 0, label: "" };
  const blocked = left.ms > 0;

  const markHit = () => {
    const now = Date.now();
    localStorage.setItem(STORAGE_KEY, String(now));
    setHitAt(now);
    toast.success("Quota hit logged");
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHitAt(null);
    toast.success("Quota cleared");
  };

  return (
    <Card className="border shadow-sm p-3 flex items-center gap-3">
      <Linkedin className="h-4 w-4 text-primary shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          LinkedIn Easy Apply quota
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              blocked ? "bg-warning" : "bg-success"
            }`}
          />
          <span className="text-sm font-medium">
            {blocked ? `Resets in ${left.label}` : "Available"}
          </span>
        </div>
      </div>
      {blocked ? (
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1" onClick={reset}>
          <RotateCcw className="h-3 w-3" /> Reset
        </Button>
      ) : (
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={markHit}>
          Hit quota
        </Button>
      )}
    </Card>
  );
}
