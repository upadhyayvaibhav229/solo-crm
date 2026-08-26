import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import PageHeader from "@/components/layout/PageHeader";
import { useTheme } from "@/components/theme-provider";
import { formatINR } from "@/services/api";
import { servicesCatalog } from "@/services/mockData";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Freelance AI Lead Manager" },
      { name: "description", content: "Profile, calling, AI agent, services, notifications and appearance settings." },
      { property: "og:title", content: "Settings — Freelance AI Lead Manager" },
      {
        property: "og:description",
        content: "Profile, calling, AI agent, services, notifications and appearance settings.",
      },
    ],
  }),
  component: SettingsPage,
});

function Row({ title, description, children }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const save = () => toast.success("Settings saved locally");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Everything is stored locally in V1."
        actions={
          <Button size="sm" onClick={save}>
            Save changes
          </Button>
        }
      />

      <Tabs defaultValue="profile">
        <TabsList className="flex h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="calling">Calling</TabsTrigger>
          <TabsTrigger value="agent">AI Agent</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="rounded-xl p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" defaultValue="Vaibhav Upadhyay" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="vaibhav@buildwithv.in" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue="+91 99999 12345" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">Base city</Label>
                <Input id="city" defaultValue="Indore, MP" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="bio">Short bio</Label>
                <Textarea id="bio" rows={3} defaultValue="Freelance web developer building fast, conversion-focused websites for Indian small businesses." />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="calling">
          <Card className="divide-y rounded-xl p-5">
            <Row title="Caller ID" description="Number shown to leads">
              <Input className="w-48" defaultValue="+91 99999 12345" />
            </Row>
            <Row title="Calling window" description="Local time only">
              <Input className="w-48" defaultValue="10:00 AM – 7:00 PM" />
            </Row>
            <Row title="Daily call limit">
              <Input type="number" className="w-24" defaultValue={15} />
            </Row>
            <Row title="Record calls" description="Store audio for review">
              <Switch defaultChecked />
            </Row>
          </Card>
        </TabsContent>

        <TabsContent value="agent">
          <Card className="divide-y rounded-xl p-5">
            <Row title="Agent enabled" description="Place queued outbound calls">
              <Switch defaultChecked />
            </Row>
            <Row title="Voice">
              <Input className="w-56" defaultValue="Aria (Indian English)" />
            </Row>
            <Row title="Hinglish switching" description="Follow the lead's language">
              <Switch defaultChecked />
            </Row>
            <Row title="Auto-create follow-ups" description="After every interested call">
              <Switch defaultChecked />
            </Row>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card className="divide-y rounded-xl p-5">
            {servicesCatalog.map((s) => (
              <Row key={s.id} title={s.name} description={`${formatINR(s.price)} · ${s.delivery}`}>
                <Switch defaultChecked={s.active} />
              </Row>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="divide-y rounded-xl p-5">
            <Row title="Email alerts" description="Daily digest at 9 AM">
              <Switch defaultChecked />
            </Row>
            <Row title="WhatsApp alerts" description="Hot lead and meeting alerts">
              <Switch defaultChecked />
            </Row>
            <Row title="Follow-up reminders" description="30 minutes before due time">
              <Switch defaultChecked />
            </Row>
            <Row title="Weekly summary">
              <Switch />
            </Row>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="divide-y rounded-xl p-5">
            <Row title="Dark mode" description={`Currently using the ${theme} theme`}>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </Row>
            <Row title="Compact tables" description="Denser row height">
              <Switch />
            </Row>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="rounded-xl p-5">
            <p className="text-sm font-semibold">Backend</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Data currently comes from local mock services. Point them at your Django REST API later.
            </p>
            <Separator className="my-4" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="api">API base URL</Label>
                <Input id="api" placeholder="https://api.buildwithv.in" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="token">API token</Label>
                <Input id="token" type="password" placeholder="••••••••" />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
