import {
  LayoutDashboard,
  GraduationCap,
  CalendarDays,
  Users,
  FileText,
  Building2,
  BookOpen,
  FileEdit,
  LogOut,
  Handshake,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useLogout, useUser } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import logo from "@/assets/categories/health/logo-new.png";

const mainNav = [
  { title: "Dashboard", url: "/health/admin", icon: LayoutDashboard },
  { title: "Programs", url: "/health/admin/programs", icon: GraduationCap },
  { title: "Cohorts", url: "/health/admin/cohorts", icon: CalendarDays },
  { title: "Students", url: "/health/admin/students", icon: Users },
  { title: "Applications", url: "/health/admin/applications", icon: FileText },
  {
    title: "Enterprise Leads",
    url: "/health/admin/enterprise-leads",
    icon: Building2,
  },
  { title: "Exam Prep", url: "/health/admin/exam-prep", icon: BookOpen },
  {
    title: "Institutional",
    url: "/health/admin/institutional",
    icon: Building2,
  },
  { title: "Partners", url: "/health/admin/partners", icon: Building2 },
  { title: "Partnerships", url: "/health/admin/partnerships", icon: Handshake },
  { title: "Content", url: "/health/admin/content", icon: FileEdit },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const signOut = useLogout();

  const isActive = (path: string) =>
    path === "/health/admin"
      ? location.pathname === "/health/admin"
      : location.pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 flex items-center gap-2">
          <img src={logo} alt="Aliko" className="h-8 w-auto" />
          {!collapsed && <span className="font-semibold text-sm">Admin</span>}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && "Sign Out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
