import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatINR } from "@/services/api";
import { Clock } from "lucide-react";

export function ServiceCard({ service, onToggle }) {
  return (
    <Card className="flex flex-col rounded-xl p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <h3 className="min-w-0 text-base font-semibold">{service.name}</h3>
        <div className="flex shrink-0 items-center gap-2">
          <Label htmlFor={`svc-${service.id}`} className="text-xs text-muted-foreground">
            {service.active ? "Active" : "Off"}
          </Label>
          <Switch
            id={`svc-${service.id}`}
            checked={service.active}
            onCheckedChange={() => onToggle?.(service.id)}
          />
        </div>
      </div>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{service.description}</p>
      <div className="mt-4 flex items-end justify-between border-t pt-4">
        <p className="text-lg font-bold tabular-nums">{formatINR(service.price)}</p>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> {service.delivery}
        </p>
      </div>
    </Card>
  );
}

export default ServiceCard;
