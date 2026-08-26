import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "./StatusBadge";
import { formatINR, formatDate } from "@/services/api";

export function CapacityWidget({ capacity, compact = false }) {
  if (!capacity) return null;
  const pct = Math.round((capacity.used / capacity.max) * 100);
  return (
    <Card className={compact ? "rounded-xl p-3 shadow-none" : "rounded-xl p-4"}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Capacity
        </p>
        <StatusBadge status={capacity.status} />
      </div>
      <p className="mt-2 text-lg font-bold tabular-nums">
        {capacity.used}/{capacity.max} Project
      </p>
      <Progress value={pct} className="mt-2 h-1.5" />
      {!compact ? (
        <p className="mt-2 text-xs text-muted-foreground">
          {capacity.status === "BUSY"
            ? "Not accepting new projects right now."
            : "Open to take one new project."}
        </p>
      ) : null}
    </Card>
  );
}

export function ProjectCard({ project, onToggleTask }) {
  const done = project.tasks.filter((t) => t.done).length;
  const progress =
    project.progress ?? Math.round((done / (project.tasks.length || 1)) * 100);

  return (
    <Card className="rounded-xl p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{project.name}</h3>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{project.client}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">Value</p>
          <p className="font-semibold tabular-nums">{formatINR(project.value)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Deadline</p>
          <p className="font-medium">{formatDate(project.deadline)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Tasks</p>
          <p className="font-medium tabular-nums">
            {done}/{project.tasks.length}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="font-semibold tabular-nums text-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="mt-1.5 h-2" />
      </div>
      <ul className="mt-4 space-y-1.5">
        {project.tasks.map((task) => (
          <li key={task.id}>
            <button
              type="button"
              disabled={!onToggleTask}
              onClick={() => onToggleTask?.(project.id, task.id)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-muted/60 disabled:hover:bg-transparent"
            >
              <span
                className={`grid h-4 w-4 shrink-0 place-items-center rounded border text-[10px] ${
                  task.done ? "border-primary bg-primary text-primary-foreground" : "border-border"
                }`}
              >
                {task.done ? "✓" : ""}
              </span>
              <span className={task.done ? "text-muted-foreground line-through" : ""}>
                {task.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default ProjectCard;
