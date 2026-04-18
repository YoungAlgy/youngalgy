import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { supabase } from "@/lib/supabase";
import { logError } from "@/lib/log";
import { DollarSign } from "lucide-react";

interface Bucket { band: string; count: number; }

const BANDS: { label: string; min: number; max: number }[] = [
  { label: "0-60K",    min: 1,      max: 60_000 },
  { label: "60-80K",   min: 60_000, max: 80_000 },
  { label: "80-100K",  min: 80_000, max: 100_000 },
  { label: "100-125K", min: 100_000, max: 125_000 },
  { label: "125-150K", min: 125_000, max: 150_000 },
  { label: "150K+",    min: 150_000, max: Infinity },
];

export function SalaryHistogram() {
  const [data, setData] = useState<Bucket[]>(BANDS.map((b) => ({ band: b.label, count: 0 })));

  useEffect(() => {
    async function load() {
      const { data: rows, error } = await supabase
        .from("opportunities")
        .select("salary_low")
        .eq("bot_type", "manual")
        .gt("salary_low", 0);
      if (error) { logError("salary histogram"); return; }
      const buckets = BANDS.map((b) => ({ band: b.label, count: 0 }));
      (rows ?? []).forEach((r: { salary_low: number | null }) => {
        const v = r.salary_low ?? 0;
        if (v <= 0) return;
        const idx = BANDS.findIndex((b) => v >= b.min && v < b.max);
        if (idx >= 0) buckets[idx].count += 1;
      });
      setData(buckets);
    }
    load();
  }, []);

  return (
    <Card className="border shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Salary Distribution</h2>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="band" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
