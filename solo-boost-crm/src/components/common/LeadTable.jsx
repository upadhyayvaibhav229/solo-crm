import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import LeadScoreBadge from "./LeadScoreBadge";
import StatusBadge from "./StatusBadge";
import { formatDate } from "@/services/api";
import { ArrowUpDown, ExternalLink, Phone } from "lucide-react";

const COLUMNS = [
  { key: "business", label: "Business", sortable: true },
  { key: "category", label: "Category" },
  { key: "location", label: "Location" },
  { key: "score", label: "Score", sortable: true },
  { key: "website", label: "Website" },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status" },
  { key: "recent", label: "Last Contact", sortable: true },
  { key: "next", label: "Next Follow-up" },
];

export function LeadTable({ leads, sortBy, onSort }) {
  return (
    <Card className="hidden overflow-hidden rounded-xl p-0 md:block">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              {COLUMNS.map((col) => (
                <TableHead key={col.key} className="whitespace-nowrap text-xs">
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => onSort?.(col.key)}
                      className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                    >
                      {col.label}
                      <ArrowUpDown
                        className={sortBy === col.key ? "h-3 w-3 text-primary" : "h-3 w-3 opacity-40"}
                      />
                    </button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id} className="hover:bg-muted/40">
                <TableCell className="min-w-[190px] font-medium">
                  <Link
                    to="/leads/$leadId"
                    params={{ leadId: lead.id }}
                    className="hover:text-primary hover:underline"
                  >
                    {lead.business}
                  </Link>
                  <p className="text-xs text-muted-foreground">{lead.owner}</p>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {lead.category}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {lead.location}
                </TableCell>
                <TableCell>
                  <LeadScoreBadge score={lead.score} />
                </TableCell>
                <TableCell className="text-sm">
                  {lead.website ? (
                    <a
                      href={`https://${lead.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Visit <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No site</span>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
                  {lead.phone}
                </TableCell>
                <TableCell>
                  <StatusBadge status={lead.status} />
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {formatDate(lead.lastContact)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {formatDate(lead.nextFollowUp)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export function LeadCard({ lead }) {
  return (
    <Card className="rounded-xl p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <Link
            to="/leads/$leadId"
            params={{ leadId: lead.id }}
            className="block truncate font-semibold hover:text-primary"
          >
            {lead.business}
          </Link>
          <p className="truncate text-xs text-muted-foreground">
            {lead.category} · {lead.location}
          </p>
        </div>
        <LeadScoreBadge score={lead.score} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={lead.status} />
        <span className="text-xs text-muted-foreground">
          Next: {formatDate(lead.nextFollowUp)}
        </span>
      </div>
      <div className="mt-4 flex gap-2">
        <Button asChild size="sm" variant="outline" className="flex-1">
          <a href={`tel:${lead.phone.replace(/\s/g, "")}`}>
            <Phone className="mr-1.5 h-3.5 w-3.5" /> Call
          </a>
        </Button>
        <Button asChild size="sm" className="flex-1">
          <Link to="/leads/$leadId" params={{ leadId: lead.id }}>
            Details
          </Link>
        </Button>
      </div>
    </Card>
  );
}

export default LeadTable;
