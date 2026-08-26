import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Bot, Send } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

export const Route = createFileRoute("/ai-agent")({
  head: () => ({
    meta: [
      { title: "AI Agent — Freelance AI Lead Manager" },
      { name: "description", content: "Configure the calling agent's instructions and test replies in a simulator." },
      { property: "og:title", content: "AI Agent — Freelance AI Lead Manager" },
      {
        property: "og:description",
        content: "Configure the calling agent's instructions and test replies in a simulator.",
      },
    ],
  }),
  component: AiAgentPage,
});

const DEFAULT_INSTRUCTIONS = `You are calling on behalf of Vaibhav, a freelance web developer in Indore.
Goal: qualify the business and book a 15-minute call.

Rules:
- Speak in simple Hinglish if the lead switches to Hindi.
- Open with a specific website gap, never a generic pitch.
- Quote ranges only: ₹24,000 – ₹55,000 depending on scope.
- If the lead is busy, ask for a callback slot and end politely.
- Never promise timelines under 7 days.`;

const CANNED = [
  "Namaste! I'm calling about your business website — is now a good time?",
  "I noticed your site isn't mobile friendly, which is where most local searches come from.",
  "Typically a project like this runs ₹40,000 to ₹55,000 with SEO included.",
  "Great — I'll book a 15-minute call and send a short proposal before that.",
];

function AiAgentPage() {
  const [active, setActive] = useState(true);
  const [instructions, setInstructions] = useState(DEFAULT_INSTRUCTIONS);
  const [voice, setVoice] = useState("Aria (Indian English)");
  const [messages, setMessages] = useState([
    { from: "agent", text: CANNED[0] },
  ]);
  const [input, setInput] = useState("");

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const next = [...messages, { from: "lead", text: input.trim() }];
    const reply = CANNED[(next.filter((m) => m.from === "agent").length) % CANNED.length];
    setMessages([...next, { from: "agent", text: reply }]);
    setInput("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Agent"
        description="The script and voice your calling agent uses."
        actions={
          <Button size="sm" onClick={() => toast.success("Agent instructions saved locally")}>
            Save changes
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-xl p-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">Outbound calling agent</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {active ? "Active — will place queued calls" : "Paused — no calls will be placed"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant={active ? "default" : "secondary"}>{active ? "ACTIVE" : "PAUSED"}</Badge>
                <Switch checked={active} onCheckedChange={setActive} aria-label="Toggle agent" />
              </div>
            </div>
          </Card>

          <Card className="rounded-xl p-5">
            <Label htmlFor="instructions" className="text-sm font-semibold">
              Agent instructions
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Plain-language rules the agent follows on every call.
            </p>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={14}
              className="mt-3 font-mono text-xs"
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="voice">Voice</Label>
                <Input id="voice" value={voice} onChange={(e) => setVoice(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="caps">Daily call cap</Label>
                <Input id="caps" type="number" defaultValue={15} />
              </div>
            </div>
          </Card>
        </div>

        <Card className="flex h-fit flex-col rounded-xl p-5">
          <h2 className="text-sm font-semibold">Conversation simulator</h2>
          <p className="mt-1 text-xs text-muted-foreground">Mock replies — no calls are placed.</p>
          <div className="mt-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  m.from === "agent"
                    ? "bg-muted text-foreground"
                    : "ml-auto bg-primary text-primary-foreground"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={send} className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Reply as the lead…"
              className="h-9"
            />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
