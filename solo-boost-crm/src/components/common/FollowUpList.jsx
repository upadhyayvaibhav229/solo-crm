import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@tanstack/react-router";
import StatusBadge from "./StatusBadge";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FollowUpList({ items, onToggle, onEdit, onDelete, showGroup = false }) {
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const completed = item.status === "completed";

        return (
          <Card
            key={item.id}
            className={cn(
              "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl p-3.5 shadow-none",
              completed && "opacity-60",
            )}
          >
            <Checkbox
              checked={item.status === "completed"}
              onCheckedChange={() => onToggle?.(item)}
              aria-label="Mark follow-up complete"
            />
            <div className="min-w-0">
              <p
                className={cn(
                  "truncate text-sm font-medium",
                  completed && "line-through decoration-muted-foreground",
                )}
              >
                {item.title}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                <Link
                  to="/leads/$leadId"
                  params={{ leadId: String(item.lead) }}
                  className="hover:text-primary hover:underline"
                >
                  {item.business}
                </Link>

                <span className="mx-1.5">·</span>

                <Clock className="mr-1 inline h-3 w-3" />

                {new Date(item.due_date).toLocaleString()}

                {showGroup && <span className="ml-1.5 capitalize">({item.status})</span>}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <StatusBadge status={item.status} />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(item)}
                aria-label="Edit follow-up"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onDelete?.(item)}
                aria-label="Delete follow-up"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default FollowUpList;
