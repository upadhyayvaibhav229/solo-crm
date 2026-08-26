import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PageHeader from "@/components/layout/PageHeader";
import FollowUpList from "@/components/common/FollowUpList";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import { ListSkeleton } from "@/components/common/LoadingSkeleton";
import {
  createFollowUp,
  deleteFollowUp,
  listGrouped,
  toggleFollowUp,
  updateFollowUp,
} from "@/services/followups";
import { listLeads } from "@/services/leads";
import { CalendarClock, Plus } from "lucide-react";

export const Route = createFileRoute("/follow-ups/")({
  head: () => ({
    meta: [
      { title: "Follow-ups — Freelance AI Lead Manager" },
      {
        name: "description",
        content: "Follow-up tasks grouped by overdue, today, tomorrow and this week.",
      },
      { property: "og:title", content: "Follow-ups — Freelance AI Lead Manager" },
      {
        property: "og:description",
        content: "Follow-up tasks grouped by overdue, today, tomorrow and this week.",
      },
    ],
  }),
  component: FollowUpsPage,
});

function FollowUpsPage() {
  const [state, setState] = useState("loading");
  const [groups, setGroups] = useState([]);
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ lead: "", title: "", due_date: "", notes: "" });
  const openCreate = () => {
    setEditing(null);
    setForm({ lead: "", title: "", due_date: "", notes: "" });
    setOpen(true);
  };

  const load = () => {
    setState("loading");
    listGrouped()
      .then((g) => {
        setGroups(g);
        setState("done");
      })
      .catch(() => setState("error"));
  };

  useEffect(() => {
    load();
    listLeads()
      .then(setLeads)
      .catch(() => setLeads([]));
  }, []);

  const onToggle = (item) => {
    toggleFollowUp(item).then(load);
  };

  const onDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    try {
      await deleteFollowUp(item.id);
      load();
    } catch (error) {
      window.alert(error.message || "Could not delete follow-up");
    }
  };

  const onEdit = (item) => {
    setEditing(item);
    setForm({
      lead: String(item.lead),
      title: item.title,
      due_date: new Date(item.due_date).toISOString().slice(0, 16),
      notes: item.notes || "",
    });
    setOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        lead: Number(form.lead),
        due_date: new Date(form.due_date).toISOString(),
      };
      if (editing) await updateFollowUp(editing.id, payload);
      else await createFollowUp(payload);
      setForm({ lead: "", title: "", due_date: "", notes: "" });
      setEditing(null);
      setOpen(false);
      load();
    } catch (error) {
      window.alert(error.message || "Could not create follow-up");
    } finally {
      setSaving(false);
    }
  };

  const pending = groups
    .filter((g) => g.key !== "completed")
    .reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Follow-ups"
        description={`${pending} open task${pending === 1 ? "" : "s"}`}
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-1.5 h-4 w-4" /> Add follow-up
          </Button>
        }
      />

      {state === "loading" ? <ListSkeleton rows={6} /> : null}
      {state === "error" ? <ErrorState onRetry={load} /> : null}

      {state === "done" ? (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.key} className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight">{group.label}</h2>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {group.items.length}
                </span>
              </div>
              {group.items.length === 0 ? (
                <Card className="rounded-xl border-dashed p-5 text-sm text-muted-foreground">
                  Nothing here.
                </Card>
              ) : (
                <FollowUpList
                  items={group.items}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              )}
            </section>
          ))}
          {groups.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title="No follow-ups"
              description="You're all clear."
            />
          ) : null}
        </div>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit follow-up" : "Add follow-up"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="followup-lead">Lead</Label>
              <select
                id="followup-lead"
                required
                value={form.lead}
                onChange={(event) => setForm({ ...form, lead: event.target.value })}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="">Select a lead</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.business}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="followup-title">Title</Label>
              <Input
                id="followup-title"
                required
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Send proposal"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="followup-due">Due date</Label>
              <Input
                id="followup-due"
                required
                type="datetime-local"
                value={form.due_date}
                onChange={(event) => setForm({ ...form, due_date: event.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="followup-notes">Notes</Label>
              <Textarea
                id="followup-notes"
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editing ? "Save changes" : "Add follow-up"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
