import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Target, IndianRupee, CheckCircle2 } from "lucide-react";
import { researchLead } from "@/services/leads";

export function AIResearchPanel({ leadId }) {
  const [state, setState] = useState("idle");
  const [result, setResult] = useState(null);

  const run = async () => {
    setState("loading");
    try {
      const data = await researchLead(leadId);
      setResult(data);
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <Card className="rounded-xl p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-primary" /> AI research
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Runs locally on mock data in V1 — no external API needed.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={run} disabled={state === "loading"}>
          {state === "loading" ? "Researching…" : result ? "Re-run" : "Run research"}
        </Button>
      </div>

      {state === "idle" ? (
        <p className="mt-4 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          No research yet. Run it to generate a pitch angle, gaps and a suggested budget.
        </p>
      ) : null}

      {state === "loading" ? (
        <div className="mt-4 space-y-3">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      ) : null}

      {state === "error" ? (
        <p className="mt-4 text-sm text-destructive">Something went wrong. Please try again.</p>
      ) : null}

      {state === "done" && result ? (
        <div className="mt-4 space-y-4">
          <p className="text-sm leading-relaxed">{result.summary}</p>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Gaps &amp; opportunities
            </p>
            <ul className="mt-2 space-y-1.5">
              {result.opportunities.map((o) => (
                <li key={o} className="flex gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{o}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Target className="h-3.5 w-3.5" /> Suggested service
              </p>
              <p className="mt-1 text-sm font-semibold">{result.suggestedService}</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <IndianRupee className="h-3.5 w-3.5" /> Budget range
              </p>
              <p className="mt-1 text-sm font-semibold tabular-nums">{result.suggestedBudget}</p>
            </div>
          </div>
          <div className="rounded-lg border-l-2 border-primary bg-primary/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Pitch angle</p>
            <p className="mt-1 text-sm">{result.pitchAngle}</p>
          </div>
          <p className="text-xs text-muted-foreground">Confidence {result.confidence}%</p>
        </div>
      ) : null}
    </Card>
  );
}

export default AIResearchPanel;
