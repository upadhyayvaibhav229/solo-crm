import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Phone, StickyNote, ArrowRightLeft, CalendarClock, Activity } from "lucide-react";

const ICONS = {
  call: Phone,
  note: StickyNote,
  status: ArrowRightLeft,
  followup: CalendarClock,
};

export function ActivityTimeline({ items }) {
  return (
    <Card className="rounded-xl p-5">
      <h3 className="text-sm font-semibold">Activity timeline</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No activity recorded yet.</p>
      ) : (
        <ol className="mt-4 space-y-4">
          {items.map((item, i) => {
            const Icon = ICONS[item.type] || Activity;
            return (
              <li key={item.id} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                <div className="flex flex-col items-center">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border bg-muted text-muted-foreground">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {i < items.length - 1 ? <span className="mt-1 w-px flex-1 bg-border" /> : null}
                </div>
                <div className={cn("min-w-0", i < items.length - 1 && "pb-1")}>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}

export default ActivityTimeline;
