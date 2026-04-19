import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { logError } from "@/lib/log";
import { XCircle } from "lucide-react";
import { formatRelativeDate } from "@/lib/dates";

interface Row {
  id: string;
  company: string;
  created_at: string;
}

export function RejectionLog() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("opportunities")
        .select("id,company,created_at")
        .eq("bot_type", "manual")
        .eq("status", "rejected")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) logError("rejection log");
      else setRows((data as Row[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <Card className="border shadow-sm">
      <div className="flex items-center gap-2 p-4 border-b">
        <XCircle className="h-4 w-4 text-destructive" />
        <h2 className="text-sm font-semibold">Recent Rejections</h2>
        <span className="ml-auto text-xs text-muted-foreground">{rows.length}</span>
      </div>
      <div className="p-3">
        {loading ? (
          <p className="text-xs text-muted-foreground p-2">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-xs text-muted-foreground p-2">No rejections yet.</p>
        ) : (
          <ul className="divide-y">
            {rows.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-1.5 px-1 text-sm">
                <span className="font-medium truncate">{r.company}</span>
                <span className="text-xs text-muted-foreground shrink-0 ml-3">
                  {formatRelativeDate(r.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
