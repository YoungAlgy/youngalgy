import { supabase } from "./supabase";

// Columns in the order we want them to appear in the CSV export.
// Extra columns present in the DB but not listed here are appended after.
const PREFERRED_ORDER = [
  "id", "company", "title", "status", "source", "bot_type",
  "location", "salary_low", "score",
  "url", "notes", "reasoning", "cover_letter", "proposal",
  "first_reply_at", "reply_kind", "created_at",
];

function toCsvCell(val: unknown): string {
  if (val === null || val === undefined) return "";
  const s = typeof val === "object" ? JSON.stringify(val) : String(val);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function exportOpportunitiesCsv() {
  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = data ?? [];
  if (rows.length === 0) {
    triggerDownload(new Blob(["(no rows)"], { type: "text/csv" }));
    return;
  }
  const allKeys = Object.keys(rows[0]);
  const headers = [
    ...PREFERRED_ORDER.filter((k) => allKeys.includes(k)),
    ...allKeys.filter((k) => !PREFERRED_ORDER.includes(k)),
  ];
  const lines = [
    headers.join(","),
    ...rows.map((r: Record<string, unknown>) => headers.map((h) => toCsvCell(r[h])).join(",")),
  ];
  triggerDownload(new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }));
}

function triggerDownload(blob: Blob) {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `opportunities_${yyyy}${mm}${dd}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
