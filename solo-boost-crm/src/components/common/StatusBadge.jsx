import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  New: "bg-muted text-muted-foreground border-border",
  Contacted: "bg-secondary text-secondary-foreground border-border",
  Interested: "bg-primary/10 text-primary border-primary/20",
  Meeting: "bg-primary/15 text-primary border-primary/25",
  Proposal: "bg-warning/15 text-warning border-warning/25",
  Won: "bg-success/15 text-success border-success/25",
  Lost: "bg-destructive/10 text-destructive border-destructive/20",
  Active: "bg-primary/10 text-primary border-primary/20",
  Completed: "bg-success/15 text-success border-success/25",
  AVAILABLE: "bg-success/15 text-success border-success/25",
  BUSY: "bg-warning/15 text-warning border-warning/25",
  "Meeting Booked": "bg-primary/15 text-primary border-primary/25",
  "Callback Requested": "bg-warning/15 text-warning border-warning/25",
  "Not Interested": "bg-destructive/10 text-destructive border-destructive/20",
  "No Answer": "bg-muted text-muted-foreground border-border",
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/15 text-warning border-warning/25",
  Low: "bg-muted text-muted-foreground border-border",
  "Not Connected": "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status] || STATUS_STYLES.New,
        className,
      )}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
