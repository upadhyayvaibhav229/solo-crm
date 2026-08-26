import { projects } from "./mockData";
import { delay, clone } from "./api";

let store = clone(projects);

export const MAX_CAPACITY = 1;

export function progressOf(project) {
  if (!project.tasks.length) return 0;
  return Math.round((project.tasks.filter((t) => t.done).length / project.tasks.length) * 100);
}

export async function listProjects() {
  return delay(clone(store).map((p) => ({ ...p, progress: progressOf(p) })));
}

export async function getProject(id) {
  const p = store.find((x) => x.id === id);
  if (!p) throw new Error("Project not found");
  return delay({ ...clone(p), progress: progressOf(p) });
}

export async function getActiveProject() {
  const p = store.find((x) => x.status === "Active");
  return delay(p ? { ...clone(p), progress: progressOf(p) } : null);
}

export async function toggleTask(projectId, taskId) {
  store = store.map((p) =>
    p.id === projectId
      ? { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) }
      : p,
  );
  const p = store.find((x) => x.id === projectId);
  return delay({ ...clone(p), progress: progressOf(p) }, 150);
}

export async function getCapacity() {
  const active = store.filter((p) => p.status === "Active").length;
  return delay({
    used: active,
    max: MAX_CAPACITY,
    status: active >= MAX_CAPACITY ? "BUSY" : "AVAILABLE",
  });
}
