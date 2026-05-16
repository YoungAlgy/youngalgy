import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { logError } from "@/lib/log";
import { XCircle } from "lucide-react";
import { formatRelativeDate } from "@/lib/dates";
import { displayCompany } from "@/lib/company";

interface Row {
  id: string;
  company: string;
  created_at: string;
  first_reply_at: string | null;
}

export function RejectionLog() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Sort by first_reply_at (when the rejection actually arrived), not
      // created_at (when the app was submitted) — otherwise a fresh
      // rejection of an old app hides behind newer-submitted-but-still-open
      // rows. nullsFirst:false keeps any reply-less rejection at the bottom.
      const { data, error } = await supabase
        .from("opportunities")
        .select("id,company,created_at,first_reply_at")
        .eq("bot_type", "manual")
        .eq("status", "rejected")
        .order("first_reply_at", { ascending: false, nullsFirst: false })
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
                <span className="font-medium truncate">{displayCompany(r.company)}</span>
                <span className="text-xs text-muted-foreground shrink-0 ml-3">
                  {formatRelativeDate(r.first_reply_at ?? r.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
