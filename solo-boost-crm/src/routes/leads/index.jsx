import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Search, Users } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import LeadTable, { LeadCard } from "@/components/common/LeadTable";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { TableSkeleton } from "@/components/common/LoadingSkeleton";
import { listLeads, createLead, LEAD_STATUSES } from "@/services/leads";

export const Route = createFileRoute("/leads/")({
  head: () => ({
    meta: [
      { title: "Leads — Freelance AI Lead Manager" },
      { name: "description", content: "Filter, score and track every business lead in your pipeline." },
      { property: "og:title", content: "Leads — Freelance AI Lead Manager" },
      {
        property: "og:description",
        content: "Filter, score and track every business lead in your pipeline.",
      },
    ],
  }),
  component: LeadsPage,
});

const EMPTY_FORM = {
  business: "",
  owner: "",
  category: "",
  location: "",
  phone: "",
  email: "",
  website: "",
  status: "New",
  score: 50,
  notes: "",
};

function LeadsPage() {
  const [state, setState] = useState("loading");
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sortBy, setSortBy] = useState("score");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setState("loading");
    listLeads({ search, status, sortBy })
      .then((data) => {
        setRows(data);
        setState("done");
      })
      .catch(() => setState("error"));
  };

  useEffect(() => {
    const t = setTimeout(load, 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, sortBy]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.business.trim()) {
      toast.error("Business name is required");
      return;
    }
    setSaving(true);
    try {
      await createLead(form);
      toast.success(`${form.business} added to pipeline`);
      setForm(EMPTY_FORM);
      setOpen(false);
      load();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description={`${rows.length} lead${rows.length === 1 ? "" : "s"} in view`}
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Lead
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by business, category or city"
            className="h-9 rounded-lg pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All statuses</SelectItem>
            {LEAD_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-9 w-full sm:w-44">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="score">Sort: Lead score</SelectItem>
            <SelectItem value="business">Sort: Business A–Z</SelectItem>
            <SelectItem value="recent">Sort: Last contact</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {state === "loading" ? <TableSkeleton rows={6} cols={6} /> : null}
      {state === "error" ? <ErrorState onRetry={load} /> : null}

      {state === "done" && rows.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No leads match this view"
          description="Try clearing filters, or add a new business you want to pitch."
          actionLabel="Add Lead"
          onAction={() => setOpen(true)}
        />
      ) : null}

      {state === "done" && rows.length > 0 ? (
        <>
          <LeadTable leads={rows} sortBy={sortBy} onSort={setSortBy} />
          <div className="grid gap-3 md:hidden">
            {rows.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        </>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add lead</DialogTitle>
            <DialogDescription>Stored locally in V1. Saves to your API later.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="business">Business name</Label>
                <Input id="business" value={form.business} onChange={set("business")} placeholder="Sharma Sweets" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="owner">Owner</Label>
                <Input id="owner" value={form.owner} onChange={set("owner")} placeholder="Rakesh Sharma" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={form.category} onChange={set("category")} placeholder="Restaurant" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={form.location} onChange={set("location")} placeholder="Indore, MP" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={set("phone")} placeholder="+91 98260 41122" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={form.email} onChange={set("email")} placeholder="owner@business.in" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website">Website</Label>
                <Input id="website" value={form.website} onChange={set("website")} placeholder="business.in" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="score">Lead score</Label>
                <Input id="score" type="number" min="0" max="100" value={form.score} onChange={set("score")} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" value={form.notes} onChange={set("notes")} rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Add lead"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
