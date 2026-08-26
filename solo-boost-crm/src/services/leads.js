import { leads, PIPELINE_STAGES, activityTimeline } from "./mockData";
import { delay, clone } from "./api";

let store = clone(leads);

export const LEAD_STATUSES = PIPELINE_STAGES;

export async function listLeads({ search = "", status = "All", sortBy = "score" } = {}) {
  let rows = clone(store);
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(
      (l) =>
        l.business.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q),
    );
  }
  if (status !== "All") rows = rows.filter((l) => l.status === status);
  rows.sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    if (sortBy === "business") return a.business.localeCompare(b.business);
    if (sortBy === "recent") return (b.lastContact || "").localeCompare(a.lastContact || "");
    return 0;
  });
  return delay(rows);
}

export async function getLead(id) {
  const lead = store.find((l) => l.id === id);
  if (!lead) throw new Error("Lead not found");
  return delay(clone(lead));
}

export async function createLead(payload) {
  const lead = {
    id: `LD-${1009 + store.length}`,
    score: Number(payload.score) || 50,
    status: payload.status || "New",
    lastContact: "",
    nextFollowUp: "",
    instagram: "",
    googleRating: 0,
    reviews: 0,
    notes: payload.notes || "",
    audit: {
      mobileFriendly: false,
      https: false,
      pageSpeed: false,
      seoBasics: false,
      googleBusiness: false,
      onlineOrdering: false,
    },
    ...payload,
  };
  store = [lead, ...store];
  return delay(clone(lead), 500);
}

export async function getLeadActivity(id) {
  return delay(clone(activityTimeline[id] || []));
}

export async function getPipeline() {
  const counts = PIPELINE_STAGES.map((stage) => ({
    stage,
    count: store.filter((l) => l.status === stage).length,
  }));
  return delay(counts);
}

// Mock "AI research" — no external API required.
export async function researchLead(id) {
  const lead = store.find((l) => l.id === id);
  const name = lead ? lead.business : "this business";
  return delay(
    {
      generatedAt: new Date().toISOString(),
      summary: `${name} has steady local demand but a weak digital funnel. Their strongest asset is reputation; the gap is conversion — visitors have no clear way to book, order, or enquire online.`,
      opportunities: [
        "No mobile-optimised landing page for local search traffic",
        "Google Business profile has photos but no website link",
        "Competitors in the same locality rank higher on 'near me' queries",
        "Enquiries handled manually on WhatsApp — no capture or tracking",
      ],
      pitchAngle:
        "Lead with lost enquiries, not design. Quantify: ~40 missed monthly enquiries at their ticket size.",
      suggestedService: "Business Website + SEO",
      suggestedBudget: "₹40,000 – ₹55,000",
      confidence: 82,
    },
    1400,
  );
}

export async function updateLeadStatus(id, status) {
  store = store.map((l) => (l.id === id ? { ...l, status } : l));
  const lead = store.find((l) => l.id === id);
  return delay(clone(lead), 200);
}
