import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  PhoneCall,
  CalendarClock,
  FolderKanban,
  Bot,
  Package,
  Settings,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { CapacityWidget } from "@/components/common/ProjectCard";
import { getCapacity } from "@/services/projects";

const NAV = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Calls", url: "/calls", icon: PhoneCall },
  { title: "Follow-ups", url: "/follow-ups", icon: CalendarClock },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "AI Agent", url: "/ai-agent", icon: Bot },
  { title: "Services", url: "/services", icon: Package },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [capacity, setCapacity] = useState(null);

  useEffect(() => {
    getCapacity().then(setCapacity);
  }, []);

  const isActive = (url) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <Link to="/" className="flex items-center gap-2.5 px-1.5 py-1.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold leading-tight">Freelance AI</span>
              <span className="block truncate text-xs text-muted-foreground">Lead Manager</span>
            </span>
          ) : null}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed ? (
        <SidebarFooter className="border-t">
          <CapacityWidget capacity={capacity} compact />
        </SidebarFooter>
      ) : null}
    </Sidebar>
  );
}

export default AppSidebar;
