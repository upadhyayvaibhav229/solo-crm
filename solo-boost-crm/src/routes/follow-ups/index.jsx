import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/layout/PageHeader";
import FollowUpList from "@/components/common/FollowUpList";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import { ListSkeleton } from "@/components/common/LoadingSkeleton";
import { listGrouped, toggleFollowUp } from "@/services/followups";
import { CalendarClock } from "lucide-react";

export const Route = createFileRoute("/follow-ups/")({
  head: () => ({
    meta: [
      { title: "Follow-ups — Freelance AI Lead Manager" },
      { name: "description", content: "Follow-up tasks grouped by overdue, today, tomorrow and this week." },
      { property: "og:title", content: "Follow-ups — Freelance AI Lead Manager" },
      {
        property: "og:description",
        content: "Follow-up tasks grouped by overdue, today, tomorrow and this week.",
      },
    ],
  }),
  component: FollowUpsPage,
});

function FollowUpsPage() {
  const [state, setState] = useState("loading");
  const [groups, setGroups] = useState([]);

  const load = () => {
    setState("loading");
    listGrouped()
      .then((g) => {
        setGroups(g);
        setState("done");
      })
      .catch(() => setState("error"));
  };

  useEffect(load, []);

  const onToggle = (id) => {
    toggleFollowUp(id).then(load);
  };

  const pending = groups
    .filter((g) => g.key !== "completed")
    .reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Follow-ups" description={`${pending} open task${pending === 1 ? "" : "s"}`} />

      {state === "loading" ? <ListSkeleton rows={6} /> : null}
      {state === "error" ? <ErrorState onRetry={load} /> : null}

      {state === "done" ? (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.key} className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight">{group.label}</h2>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {group.items.length}
                </span>
              </div>
              {group.items.length === 0 ? (
                <Card className="rounded-xl border-dashed p-5 text-sm text-muted-foreground">
                  Nothing here.
                </Card>
              ) : (
                <FollowUpList items={group.items} onToggle={onToggle} />
              )}
            </section>
          ))}
          {groups.length === 0 ? (
            <EmptyState icon={CalendarClock} title="No follow-ups" description="You're all clear." />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
