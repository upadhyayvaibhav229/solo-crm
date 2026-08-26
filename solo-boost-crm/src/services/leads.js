import { delay } from "./api";
import { refreshSession } from "./auth";

const API =
  import.meta.env.VITE_API_URL ||
  `http://${typeof window === "undefined" ? "localhost" : window.location.hostname}:8000/api`;

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Interested",
  "Meeting",
  "Lost",
  "Proposal",
  "Won",
];

async function request(path, options = {}) {
  const makeRequest = () =>
    fetch(`${API}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  let response = await makeRequest();

  if (response.status === 401 && (await refreshSession())) {
    response = await makeRequest();
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Lead request failed");
  }
  return data;
}

function mapLead(lead) {
  return {
    id: String(lead.id),
    business: lead.business_name,
    owner: lead.contact_person || "",
    category: lead.category || "",
    location: lead.location || "",
    phone: lead.phone || "",
    email: lead.email || "",
    website: lead.website || "",
    googleMapsUrl: lead.google_maps_url || "",
    score: lead.lead_score ?? 0,
    status: lead.status || "New",
    priority: lead.priority || "Medium",
    source: lead.source || "manual",
    service: lead.service || "",
    notes: lead.notes || "",
    lastContact: lead.updated_at || lead.created_at || "",
    nextFollowUp: "",
    instagram: "",
    googleRating: 0,
    reviews: 0,
    audit: {
      mobileFriendly: false,
      https: Boolean(lead.website?.startsWith("https://")),
      pageSpeed: false,
      seoBasics: false,
      googleBusiness: Boolean(lead.google_maps_url),
      onlineOrdering: false,
    },
    createdAt: lead.created_at,
    updatedAt: lead.updated_at,
  };
}

function toPayload(payload) {
  return {
    business_name: payload.business,
    contact_person: payload.owner || "",
    category: payload.category || "",
    location: payload.location || "",
    phone: payload.phone || "",
    email: payload.email || "",
    website: payload.website || "",
    lead_score: Number(payload.score) || 0,
    status: payload.status || "New",
    notes: payload.notes || "",
    priority: payload.priority || "Medium",
    source: payload.source || "manual",
    service: payload.service || "",
    google_maps_url: payload.googleMapsUrl || "",
  };
}

export async function listLeads({ search = "", status = "All", sortBy = "score" } = {}) {
  const data = await request("/leads/");
  let rows = (Array.isArray(data) ? data : data?.results || []).map(mapLead);
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter((lead) =>
      [lead.business, lead.category, lead.location].some((value) =>
        value.toLowerCase().includes(q),
      ),
    );
  }
  if (status !== "All") rows = rows.filter((lead) => lead.status === status);
  rows.sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    if (sortBy === "business") return a.business.localeCompare(b.business);
    if (sortBy === "recent") return (b.lastContact || "").localeCompare(a.lastContact || "");
    return 0;
  });
  return rows;
}

export async function getLead(id) {
  return mapLead(await request(`/leads/${id}/`));
}

export async function createLead(payload) {
  return mapLead(
    await request("/leads/", { method: "POST", body: JSON.stringify(toPayload(payload)) }),
  );
}

export async function getLeadActivity() {
  return [];
}

export async function getPipeline() {
  const rows = await listLeads();
  return LEAD_STATUSES.map((stage) => ({
    stage,
    count: rows.filter((lead) => lead.status === stage).length,
  }));
}

export async function researchLead(id) {
  const lead = await getLead(id);
  return delay(
    {
      generatedAt: new Date().toISOString(),
      summary: `${lead.business} has a lead record ready for follow-up.`,
      opportunities: [],
      pitchAngle: "Use the lead details and notes to prepare a targeted outreach.",
      suggestedService: lead.service || "Business Website + SEO",
      suggestedBudget: "",
      confidence: 0,
    },
    300,
  );
}

export async function updateLeadStatus(id, status) {
  return mapLead(
    await request(`/leads/${id}/`, { method: "PATCH", body: JSON.stringify({ status }) }),
  );
}
