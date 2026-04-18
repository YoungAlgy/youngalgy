import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { supabase } from "@/lib/supabase";
import { PieChart as PieIcon } from "lucide-react";

interface Slice { name: string; value: number; }

const COLORS = ["hsl(217 91% 50%)", "hsl(142 71% 45%)", "hsl(38 92% 50%)", "hsl(280 70% 55%)", "hsl(0 72% 51%)"];

export function SourcePieChart() {
  const [data, setData] = useState<Slice[]>([]);

  useEffect(() => {
    async function load() {
      const { data: rows, error } = await supabase
        .from("opportunities")
        .select("source")
        .eq("bot_type", "manual");
      if (error) { console.error(error); return; }
      const counts: Record<string, number> = {};
      (rows ?? []).forEach((r: { source: string | null }) => {
        const k = (r.source || "unknown").toLowerCase();
        counts[k] = (counts[k] || 0) + 1;
      });
      setData(Object.entries(counts).map(([name, value]) => ({ name, value })));
    }
    load();
  }, []);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="border shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <PieIcon className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">By Source</h2>
      </div>
      <div className="h-[200px] w-full">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center pt-12">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={false}>
                {data.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
              </Pie>
              <Tooltip
                formatter={(v: number, n: string) => [`${v} (${total > 0 ? ((v / total) * 100).toFixed(1) : 0}%)`, n]}
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
