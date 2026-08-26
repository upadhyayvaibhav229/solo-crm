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
import StatusBadge from "./StatusBadge";
import { formatDateTime, formatDuration } from "@/services/api";

export function CallTable({ calls, onSelect }) {
  return (
    <Card className="overflow-hidden rounded-xl p-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs">Business</TableHead>
              <TableHead className="text-xs">Date &amp; Time</TableHead>
              <TableHead className="text-xs">Duration</TableHead>
              <TableHead className="text-xs">Result</TableHead>
              <TableHead className="min-w-[280px] text-xs">AI Summary</TableHead>
              <TableHead className="text-right text-xs">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.map((call) => (
              <TableRow key={call.id} className="hover:bg-muted/40">
                <TableCell className="whitespace-nowrap font-medium">{call.business}</TableCell>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {formatDateTime(call.date)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm tabular-nums">
                  {formatDuration(call.duration)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={call.result} />
                </TableCell>
                <TableCell className="max-w-[420px] text-sm text-muted-foreground">
                  <span className="line-clamp-2">{call.summary}</span>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => onSelect(call)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export default CallTable;
