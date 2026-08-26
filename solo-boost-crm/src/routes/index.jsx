import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/common/StatCard";
import PipelineBoard from "@/components/common/PipelineBoard";
import LeadTable from "@/components/common/LeadTable";
import CallTable from "@/components/common/CallTable";
import FollowUpList from "@/components/common/FollowUpList";
import { ProjectCard } from "@/components/common/ProjectCard";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { CardSkeleton, TableSkeleton } from "@/components/common/LoadingSkeleton";
import { getKpis } from "@/services/dashboard";
import { listLeads, getPipeline } from "@/services/leads";
import { listCalls } from "@/services/calls";
import { listFollowUps, toggleFollowUp } from "@/services/followups";
import { getActiveProject } from "@/services/projects";
import { getWeeklyActivity } from "@/services/notifications";
import {
  FolderKanban,
  Users,
  Flame,
  PhoneCall,
  ThumbsUp,
  CalendarCheck,
  BellRing,
  TrendingUp,
  CalendarClock,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Freelance AI Lead Manager" },
      {
        name: "description",
        content: "Pipeline, calls, follow-ups and active project at a glance.",
      },
      { property: "og:title", content: "Dashboard — Freelance AI Lead Manager" },
      {
        property: "og:description",
        content: "Pipeline, calls, follow-ups and active project at a glance.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [state, setState] = useState("loading");
  const [data, setData] = useState(null);

  const load = () => {
    setState("loading");
    Promise.all([
      getKpis(),
      listLeads({ sortBy: "recent" }),
      getPipeline(),
      listCalls(),
      listFollowUps(),
      getActiveProject(),
      getWeeklyActivity(),
    ])
      .then(([kpis, leads, pipeline, calls, followUps, project, activity]) => {
        setData({ kpis, leads, pipeline, calls, followUps, project, activity });
        setState("done");
      })
      .catch(() => setState("error"));
  };

  useEffect(load, []);

  const onToggleFollowUp = (id) => {
    toggleFollowUp(id).then((rows) => setData((d) => ({ ...d, followUps: rows })));
  };

  if (state === "error") return <ErrorState onRetry={load} />;

  if (state === "loading") {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Loading your workspace…" />
        <CardSkeleton count={8} />
        <TableSkeleton />
      </div>
    );
  }

  const { kpis, leads, pipeline, calls, followUps, project, activity } = data;
  const dueFollowUps = followUps.filter((f) => !f.completed && ["today", "overdue"].includes(f.due));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Wednesday, 12 August 2026 · Everything that needs you today."
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link to="/calls">Call log</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/leads">Manage leads</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Project"
          value={kpis.activeProject}
          hint="1 of 1 slot used"
          icon={FolderKanban}
          tone="primary"
        />
        <StatCard label="Total Leads" value={kpis.totalLeads} hint="All time" icon={Users} />
        <StatCard label="Hot Leads" value={kpis.hotLeads} hint="Score 75+" icon={Flame} tone="success" />
        <StatCard label="Calls This Week" value={kpis.callsThisWeek} hint="AI + manual" icon={PhoneCall} />
        <StatCard label="Interested" value={kpis.interested} hint="Awaiting proposal" icon={ThumbsUp} />
        <StatCard label="Meetings" value={kpis.meetings} hint="Scheduled" icon={CalendarCheck} />
        <StatCard
          label="Follow-ups Due"
          value={kpis.followUpsDue}
          hint="Today + overdue"
          icon={BellRing}
          tone="warning"
        />
        <StatCard
          label="Conversion Rate"
          value={`${kpis.conversionRate}%`}
          hint="Leads → Won"
          icon={TrendingUp}
          tone="primary"
        />
      </div>

      <PipelineBoard pipeline={pipeline} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold">Weekly activity</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Calls made vs new leads added</p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activity} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.5rem",
                    color: "var(--popover-foreground)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="calls" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="leads" fill="var(--muted-foreground)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-6">
          {project ? (
            <ProjectCard project={project} />
          ) : (
            <EmptyState
              icon={FolderKanban}
              title="No active project"
              description="You have a free slot. Convert a proposal to fill it."
              actionLabel="View leads"
            />
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Recent leads</h2>
          <Link to="/leads" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        {leads.length === 0 ? (
          <EmptyState title="No leads yet" description="Add your first lead to start the pipeline." />
        ) : (
          <>
            <LeadTable leads={leads.slice(0, 5)} />
            <div className="grid gap-3 md:hidden">
              {leads.slice(0, 5).map((lead) => (
                <Card key={lead.id} className="rounded-xl p-4">
                  <p className="truncate font-medium">{lead.business}</p>
                  <p className="text-xs text-muted-foreground">{lead.location}</p>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Recent calls</h2>
            <Link to="/calls" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {calls.length === 0 ? (
            <EmptyState icon={PhoneCall} title="No calls logged" description="Calls appear here once made." />
          ) : (
            <CallTable calls={calls.slice(0, 4)} onSelect={() => {}} />
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Upcoming follow-ups</h2>
            <Link to="/follow-ups" className="text-sm font-medium text-primary hover:underline">
              All
            </Link>
          </div>
          {dueFollowUps.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title="Nothing due"
              description="No follow-ups pending today."
            />
          ) : (
            <FollowUpList items={dueFollowUps} onToggle={onToggleFollowUp} showGroup />
          )}
        </div>
      </div>
    </div>
  );
}

