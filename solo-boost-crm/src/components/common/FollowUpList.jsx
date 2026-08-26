import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@tanstack/react-router";
import StatusBadge from "./StatusBadge";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export function FollowUpList({ items, onToggle, showGroup = false }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Card
          key={item.id}
          className={cn(
            "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl p-3.5 shadow-none",
            item.completed && "opacity-60",
          )}
        >
          <Checkbox
            checked={item.completed}
            onCheckedChange={() => onToggle?.(item.id)}
            aria-label="Mark follow-up complete"
          />
          <div className="min-w-0">
            <p
              className={cn(
                "truncate text-sm font-medium",
                item.completed && "line-through decoration-muted-foreground",
              )}
            >
              {item.task}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              <Link
                to="/leads/$leadId"
                params={{ leadId: item.leadId }}
                className="hover:text-primary hover:underline"
              >
                {item.business}
              </Link>
              <span className="mx-1.5">·</span>
              <Clock className="mr-1 inline h-3 w-3" />
              {item.time}
              {showGroup ? <span className="ml-1.5 capitalize">({item.due})</span> : null}
            </p>
          </div>
          <StatusBadge status={item.priority} />
        </Card>
      ))}
    </div>
  );
}

export default FollowUpList;
