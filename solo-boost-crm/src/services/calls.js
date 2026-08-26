import { calls } from "./mockData";
import { delay, clone } from "./api";

let store = clone(calls);

export async function listCalls({ search = "", result = "All" } = {}) {
  let rows = clone(store);
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter((c) => c.business.toLowerCase().includes(q));
  }
  if (result !== "All") rows = rows.filter((c) => c.result === result);
  rows.sort((a, b) => b.date.localeCompare(a.date));
  return delay(rows);
}

export async function getCallStats() {
  const total = store.length;
  const interested = store.filter((c) => c.result === "Interested").length;
  const meetings = store.filter((c) => c.result === "Meeting Booked").length;
  const avg = Math.round(store.reduce((s, c) => s + c.duration, 0) / (total || 1));
  return delay({ total, interested, meetings, avgDuration: avg });
}

export const CALL_RESULTS = [
  "Interested",
  "Meeting Booked",
  "Callback Requested",
  "Not Interested",
  "No Answer",
];
