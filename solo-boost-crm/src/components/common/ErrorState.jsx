import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function ErrorState({ onRetry, message = "Something went wrong. Please try again." }) {
  return (
    <Card className="flex flex-col items-center justify-center rounded-xl px-6 py-12 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-sm font-semibold">{message}</h3>
      {onRetry ? (
        <Button className="mt-5" size="sm" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </Card>
  );
}

export default ErrorState;
