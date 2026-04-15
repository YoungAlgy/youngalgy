import { STATUS_CONFIG, JobStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: JobStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge className={`${config.className} text-[11px] font-medium px-2 py-0.5 border-0`}>
      {config.label}
    </Badge>
  );
}
