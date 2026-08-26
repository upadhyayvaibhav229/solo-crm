import { leads } from "./mockData";
import { delay } from "./api";

export async function getKpis() {
  const total = leads.length;
  const hot = leads.filter((l) => l.score >= 75).length;
  const interested = leads.filter((l) => l.status === "Interested").length;
  const meetings = leads.filter((l) => l.status === "Meeting").length;
  const won = leads.filter((l) => l.status === "Won").length;
  return delay({
    totalLeads: total,
    hotLeads: hot,
    callsThisWeek: 41,
    interested,
    meetings,
    followUpsDue: 3,
    conversionRate: Math.round((won / total) * 100),
    activeProject: "Bansal Coaching",
  });
}
