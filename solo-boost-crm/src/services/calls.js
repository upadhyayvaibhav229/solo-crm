import { refreshSession } from "./auth";

const API =
  import.meta.env.VITE_API_URL ||
  `http://${typeof window === "undefined" ? "localhost" : window.location.hostname}:8000/api`;

export const CALL_RESULTS = [
  "Interested",
  "Meeting Booked",
  "Callback Requested",
  "Not Interested",
  "No Answer",
];

async function request(path, options = {}) {
  const makeRequest = () =>
    fetch(`${API}${path}`, {
      ...options,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });
  let response = await makeRequest();
  if (response.status === 401 && (await refreshSession())) response = await makeRequest();
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detail || data?.message || "Call request failed");
  return data;
}

function mapCall(call) {
  return {
    id: String(call.id),
    leadId: call.lead,
    business: call.business_name || call.lead_name || call.lead?.business_name || "Unknown lead",
    date: call.created_at || call.updated_at || "",
    duration: Number(call.duration || 0),
    result: call.result || "No Answer",
    summary: call.summary || "",
    nextAction: call.next_action || "",
    transcript: Array.isArray(call.transcript) ? call.transcript : [],
    type: call.call_type || call.type || "manual",
  };
}

export async function listCalls({ search = "", result = "All" } = {}) {
  const data = await request("/leads/calls/");
  let rows = (Array.isArray(data) ? data : data?.results || []).map(mapCall);
  if (search) rows = rows.filter((call) => call.business.toLowerCase().includes(search.toLowerCase()));
  if (result !== "All") rows = rows.filter((call) => call.result === result);
  return rows.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getCallStats() {
  const rows = await listCalls();
  return {
    total: rows.length,
    interested: rows.filter((call) => call.result === "Interested").length,
    meetings: rows.filter((call) => call.result === "Meeting Booked").length,
    avgDuration: Math.round(rows.reduce((sum, call) => sum + call.duration, 0) / (rows.length || 1)),
  };
}

export async function createCall(payload) {
  return mapCall(await request("/leads/calls/", { method: "POST", body: JSON.stringify(payload) }));
}

export async function updateCall(id, payload) {
  return mapCall(await request(`/leads/calls/${id}/`, { method: "PATCH", body: JSON.stringify(payload) }));
}

export async function deleteCall(id) {
  await request(`/leads/calls/${id}/`, { method: "DELETE" });
}

export { mapCall };
