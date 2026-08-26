import { followUps } from "./mockData";
import { delay, clone } from "./api";

let store = clone(followUps);

export const GROUPS = [
  { key: "overdue", label: "Overdue" },
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "week", label: "This Week" },
  { key: "completed", label: "Completed" },
];

export async function listFollowUps() {
  return delay(clone(store));
}

export async function listGrouped() {
  const rows = clone(store);
  return delay(
    GROUPS.map((g) => ({
      ...g,
      items: rows.filter((r) => (g.key === "completed" ? r.completed : !r.completed && r.due === g.key)),
    })),
  );
}

export async function toggleFollowUp(id) {
  store = store.map((r) =>
    r.id === id ? { ...r, completed: !r.completed, due: r.completed ? "today" : "completed" } : r,
  );
  return delay(clone(store), 150);
}

export async function dueCount() {
  const rows = store.filter((r) => !r.completed && (r.due === "today" || r.due === "overdue"));
  return delay(rows.length);
}
