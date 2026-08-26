import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function StatCard({ label, value, icon: Icon, hint, tone = "default", className }) {
  const tones = {
    default: "text-foreground",
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  };
  return (
    <Card className={cn("rounded-xl p-4 shadow-sm", className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className={cn("mt-2 truncate text-2xl font-bold tracking-tight", tones[tone])}>{value}</p>
          {hint ? <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        {Icon ? (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
      </div>
    </Card>
  );
}

export default StatCard;
