import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  X,
  Globe,
  Phone,
  Mail,
  MapPin,
  Star,
  Instagram,
  PhoneCall,
} from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import LeadScoreBadge from "@/components/common/LeadScoreBadge";
import ActivityTimeline from "@/components/common/ActivityTimeline";
import AIResearchPanel from "@/components/common/AIResearchPanel";
import ErrorState from "@/components/common/ErrorState";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import { getLead, getLeadActivity, updateLeadStatus, LEAD_STATUSES } from "@/services/leads";
import { formatDate } from "@/services/api";

export const Route = createFileRoute("/leads/$leadId")({
  head: () => ({
    meta: [
      { title: "Lead detail — Freelance AI Lead Manager" },
      { name: "description", content: "Business profile, website audit checklist and lead activity." },
      { property: "og:title", content: "Lead detail — Freelance AI Lead Manager" },
      {
        property: "og:description",
        content: "Business profile, website audit checklist and lead activity.",
      },
    ],
  }),
  component: LeadDetailPage,
});

const AUDIT_LABELS = {
  mobileFriendly: "Mobile friendly",
  https: "HTTPS / SSL secured",
  pageSpeed: "Fast page speed",
  seoBasics: "SEO basics in place",
  googleBusiness: "Google Business profile",
  onlineOrdering: "Online ordering / booking",
};

function LeadDetailPage() {
  const { leadId } = Route.useParams();
  const [state, setState] = useState("loading");
  const [lead, setLead] = useState(null);
  const [activity, setActivity] = useState([]);

  const load = () => {
    setState("loading");
    Promise.all([getLead(leadId), getLeadActivity(leadId)])
      .then(([l, a]) => {
        if (!l) {
          setState("error");
          return;
        }
        setLead(l);
        setActivity(a);
        setState("done");
      })
      .catch(() => setState("error"));
  };

  useEffect(load, [leadId]);

  const changeStatus = (value) => {
    updateLeadStatus(leadId, value).then((updated) => {
      setLead(updated);
      toast.success(`Status updated to ${value}`);
    });
  };

  if (state === "loading") return <CardSkeleton count={4} />;
  if (state === "error") return <ErrorState message="We couldn't load this lead." onRetry={load} />;

  const auditEntries = Object.entries(lead.audit || {});
  const gaps = auditEntries.filter(([, ok]) => !ok).length;

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/leads">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to leads
        </Link>
      </Button>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:flex sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{lead.business}</h1>
            <LeadScoreBadge score={lead.score} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {lead.category} · {lead.owner}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Select value={lead.status} onValueChange={changeStatus}>
            <SelectTrigger className="h-9 w-40">
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
          <Button size="sm" onClick={() => toast.info("AI calling connects in a later version.")}>
            <PhoneCall className="mr-1.5 h-4 w-4" /> Start AI Call
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-xl p-5">
            <h2 className="text-sm font-semibold">Business profile</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Detail icon={Phone} label="Phone" value={lead.phone} />
              <Detail icon={Mail} label="Email" value={lead.email} />
              <Detail icon={MapPin} label="Location" value={lead.location} />
              <Detail icon={Globe} label="Website" value={lead.website || "No website"} />
              <Detail
                icon={Star}
                label="Google rating"
                value={lead.googleRating ? `${lead.googleRating} (${lead.reviews} reviews)` : "—"}
              />
              <Detail icon={Instagram} label="Instagram" value={lead.instagram || "—"} />
            </div>
            <Separator className="my-5" />
            <div className="grid gap-4 sm:grid-cols-3">
              <Detail label="Status" value={<StatusBadge status={lead.status} />} />
              <Detail label="Last contact" value={formatDate(lead.lastContact)} />
              <Detail label="Next follow-up" value={formatDate(lead.nextFollowUp)} />
            </div>
            {lead.notes ? (
              <>
                <Separator className="my-5" />
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Notes
                </p>
                <p className="mt-1.5 text-sm">{lead.notes}</p>
              </>
            ) : null}
          </Card>

          <Card className="rounded-xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">Website audit checklist</h2>
              <span className="text-xs text-muted-foreground">
                {gaps} gap{gaps === 1 ? "" : "s"} to pitch
              </span>
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {auditEntries.map(([key, ok]) => (
                <li
                  key={key}
                  className="flex items-center gap-2.5 rounded-lg border bg-muted/30 px-3 py-2.5 text-sm"
                >
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                      ok ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                    }`}
                  >
                    {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </span>
                  <span className="min-w-0 truncate">{AUDIT_LABELS[key] || key}</span>
                </li>
              ))}
            </ul>
          </Card>

          <AIResearchPanel leadId={lead.id} />
        </div>

        <div className="space-y-6">
          <ActivityTimeline items={activity} />
        </div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
        {label}
      </p>
      <div className="mt-1 truncate text-sm font-medium">{value}</div>
    </div>
  );
}
