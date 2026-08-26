import { Card } from "@/components/ui/card";
import { PIPELINE_STAGES } from "@/services/mockData";
import { cn } from "@/lib/utils";

const TONES = {
  New: "border-border",
  Contacted: "border-border",
  Interested: "border-primary/40",
  Meeting: "border-primary/50",
  Proposal: "border-warning/50",
  Won: "border-success/50",
  Lost: "border-destructive/40",
};

export function PipelineBoard({ pipeline }) {
  const max = Math.max(1, ...pipeline.map((p) => p.count));
  return (
    <Card className="rounded-xl p-5">
      <h3 className="text-sm font-semibold">Pipeline snapshot</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {PIPELINE_STAGES.join(" → ")}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
        {pipeline.map((stage) => (
          <div
            key={stage.stage}
            className={cn("rounded-xl border bg-muted/30 p-3", TONES[stage.stage])}
          >
            <p className="truncate text-xs font-medium text-muted-foreground">{stage.stage}</p>
            <p className="mt-1.5 text-xl font-bold tabular-nums">{stage.count}</p>
            <div className="mt-2 h-1 rounded-full bg-border">
              <div
                className="h-1 rounded-full bg-primary"
                style={{ width: `${(stage.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default PipelineBoard;
