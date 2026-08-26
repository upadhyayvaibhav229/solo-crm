import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { PhoneCall, Search, Play, PhoneOff } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/common/StatCard";
import CallTable from "@/components/common/CallTable";
import StatusBadge from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { TableSkeleton } from "@/components/common/LoadingSkeleton";
import { listCalls, getCallStats, CALL_RESULTS } from "@/services/calls";
import { formatDateTime, formatDuration } from "@/services/api";

export const Route = createFileRoute("/calls/")({
  head: () => ({
    meta: [
      { title: "Calls — Freelance AI Lead Manager" },
      { name: "description", content: "Every AI and manual call with transcripts, outcomes and next actions." },
      { property: "og:title", content: "Calls — Freelance AI Lead Manager" },
      {
        property: "og:description",
        content: "Every AI and manual call with transcripts, outcomes and next actions.",
      },
    ],
  }),
  component: CallsPage,
});

function CallsPage() {
  const [state, setState] = useState("loading");
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState("All");
  const [selected, setSelected] = useState(null);

  const load = () => {
    setState("loading");
    Promise.all([listCalls({ search, result }), getCallStats()])
      .then(([data, s]) => {
        setRows(data);
        setStats(s);
        setState("done");
      })
      .catch(() => setState("error"));
  };

  useEffect(() => {
    const t = setTimeout(load, 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, result]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calls"
        description="AI-assisted outreach history and outcomes."
        actions={
          <Button size="sm" onClick={() => toast.info("AI calling connects in a later version.")}>
            <PhoneCall className="mr-1.5 h-4 w-4" /> Start AI Call
          </Button>
        }
      />

      {stats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Calls" value={stats.total} icon={PhoneCall} />
          <StatCard label="Interested" value={stats.interested} tone="success" />
          <StatCard label="Meetings Booked" value={stats.meetings} tone="primary" />
          <StatCard label="Avg Duration" value={formatDuration(stats.avgDuration)} />
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search calls by business"
            className="h-9 rounded-lg pl-9"
          />
        </div>
        <Select value={result} onValueChange={setResult}>
          <SelectTrigger className="h-9 w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All outcomes</SelectItem>
            {CALL_RESULTS.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {state === "loading" ? <TableSkeleton rows={5} cols={6} /> : null}
      {state === "error" ? <ErrorState onRetry={load} /> : null}
      {state === "done" && rows.length === 0 ? (
        <EmptyState icon={PhoneOff} title="No calls found" description="Try a different filter." />
      ) : null}
      {state === "done" && rows.length > 0 ? <CallTable calls={rows} onSelect={setSelected} /> : null}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.business}</DialogTitle>
                <DialogDescription>
                  {formatDateTime(selected.date)} · {formatDuration(selected.duration)}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={selected.result} />
                <Badge variant="secondary">{selected.id}</Badge>
              </div>

              <Card className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 shrink-0"
                  onClick={() => toast.info("Recording playback is not wired up yet.")}
                >
                  <Play className="h-4 w-4" />
                </Button>
                <div className="min-w-0 flex-1">
                  <div className="h-1.5 w-full rounded-full bg-border">
                    <div className="h-1.5 w-0 rounded-full bg-primary" />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Recording placeholder · {formatDuration(selected.duration)}
                  </p>
                </div>
              </Card>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  AI summary
                </p>
                <p className="mt-1.5 text-sm">{selected.summary}</p>
              </div>

              {selected.nextAction ? (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Next action
                  </p>
                  <p className="mt-1.5 text-sm font-medium">{selected.nextAction}</p>
                </div>
              ) : null}

              <Separator />

              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Transcript
                </p>
                {(selected.transcript || []).map((line, i) => (
                  <div key={i} className="flex gap-3">
                    <span
                      className={`h-fit shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${
                        line.speaker === "AI"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {line.speaker}
                    </span>
                    <p className="min-w-0 text-sm">{line.text}</p>
                  </div>
                ))}
                {!selected.transcript?.length ? (
                  <p className="text-sm text-muted-foreground">No transcript for this call.</p>
                ) : null}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
