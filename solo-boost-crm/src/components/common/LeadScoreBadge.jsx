import { cn } from "@/lib/utils";

export function LeadScoreBadge({ score, className }) {
  const tone =
    score >= 75
      ? "bg-success/15 text-success border-success/25"
      : score >= 50
        ? "bg-warning/15 text-warning border-warning/25"
        : "bg-destructive/10 text-destructive border-destructive/20";
  const label = score >= 75 ? "Hot" : score >= 50 ? "Warm" : "Cold";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums",
        tone,
        className,
      )}
      title={`${label} lead`}
    >
      {score}
      <span className="font-medium opacity-70">{label}</span>
    </span>
  );
}

export default LeadScoreBadge;
