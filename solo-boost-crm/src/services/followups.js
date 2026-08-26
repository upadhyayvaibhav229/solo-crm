import { refreshSession } from "./auth";

const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  `http://${typeof window === "undefined" ? "localhost" : window.location.hostname}:8000`;
export const GROUPS = [
  { key: "overdue", label: "Overdue" },
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "week", label: "This Week" },
  { key: "completed", label: "Completed" },
];

export async function listFollowUps() {
  return getFollowUps();
}

async function request(path, options = {}) {
  const makeRequest = () =>
    fetch(`${BACKEND_URL}/api/leads${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

  let response = await makeRequest();
  if (response.status === 401 && (await refreshSession())) response = await makeRequest();

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detail || "Follow-up request failed");
  return data;
}

export async function listGrouped() {
  const rows = await getFollowUps();
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(startOfToday);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endOfWeek = new Date(startOfToday);
  endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));

  return GROUPS.map((group) => ({
    ...group,
    items: rows.filter((row) => {
      if (group.key === "completed") return row.status === "completed";
      if (row.status === "completed") return false;
      const dueDate = new Date(row.due_date);
      if (group.key === "overdue") return dueDate < startOfToday;
      if (group.key === "today") return dueDate >= startOfToday && dueDate < tomorrow;
      if (group.key === "tomorrow") {
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
        return dueDate >= tomorrow && dueDate < dayAfterTomorrow;
      }
      return dueDate >= tomorrow && dueDate <= endOfWeek;
    }),
  }));
}

export async function toggleFollowUp(item) {
  return updateFollowUp(item.id, {
    status: item.status === "completed" ? "pending" : "completed",
  });
}

export async function getFollowUps() {
  return request("/followups/");
}

export async function createFollowUp(data) {
  return request("/followups/", { method: "POST", body: JSON.stringify(data) });
}

export async function updateFollowUp(id, data) {
  return request(`/followups/${id}/`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function deleteFollowUp(id) {
  await request(`/followups/${id}/`, { method: "DELETE" });
}
