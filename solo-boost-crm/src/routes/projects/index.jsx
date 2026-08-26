import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageHeader from "@/components/layout/PageHeader";
import { ProjectCard, CapacityWidget } from "@/components/common/ProjectCard";
import StatusBadge from "@/components/common/StatusBadge";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import { listProjects, getCapacity, toggleTask, progressOf } from "@/services/projects";
import { formatINR, formatDate } from "@/services/api";
import { FolderKanban } from "lucide-react";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Freelance AI Lead Manager" },
      { name: "description", content: "One active project at a time with task checklist and capacity tracking." },
      { property: "og:title", content: "Projects — Freelance AI Lead Manager" },
      {
        property: "og:description",
        content: "One active project at a time with task checklist and capacity tracking.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [state, setState] = useState("loading");
  const [projects, setProjects] = useState([]);
  const [capacity, setCapacity] = useState(null);

  const load = () => {
    setState("loading");
    Promise.all([listProjects(), getCapacity()])
      .then(([p, c]) => {
        setProjects(p);
        setCapacity(c);
        setState("done");
      })
      .catch(() => setState("error"));
  };

  useEffect(load, []);

  const active = projects.find((p) => p.status === "Active");

  const onToggleTask = (projectId, taskId) => {
    toggleTask(projectId, taskId).then((updated) => {
      setProjects((rows) => rows.map((p) => (p.id === updated.id ? updated : p)));
    });
  };

  if (state === "loading") return <CardSkeleton count={4} />;
  if (state === "error") return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Projects" description="You take one client project at a time — by design." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {active ? (
            <ProjectCard project={active} onToggleTask={onToggleTask} />
          ) : (
            <EmptyState
              icon={FolderKanban}
              title="No active project"
              description="Your slot is free — close a proposal to start one."
            />
          )}
        </div>
        <CapacityWidget capacity={capacity} />
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">All projects</h2>
        <Card className="overflow-hidden rounded-xl p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs">Project</TableHead>
                  <TableHead className="text-xs">Client</TableHead>
                  <TableHead className="text-xs">Value</TableHead>
                  <TableHead className="text-xs">Start</TableHead>
                  <TableHead className="text-xs">Deadline</TableHead>
                  <TableHead className="text-xs">Progress</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {p.client}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm tabular-nums">
                      {formatINR(p.value)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(p.startDate)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(p.deadline)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm tabular-nums">
                      {progressOf(p)}%
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
