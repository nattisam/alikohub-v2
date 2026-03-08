import {
  LayoutDashboard,
  GraduationCap,
  Users,
  ClipboardList,
  Handshake,
  HeadphonesIcon,
  BarChart3,
  Shield,
  ScrollText,
  LogOut,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/categories/technology/useAuth';
import logo from '@/assets/categories/technology/logo-full.png';
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
} from '@/components/categories/technology/ui/sidebar';
import { Button } from '@/components/categories/technology/ui/button';

type AppRole = 'super_admin' | 'program_admin' | 'enrollment_officer' | 'instructor' | 'support';

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  roles: AppRole[]; // empty = all roles
}

const navItems: NavItem[] = [
  { title: 'Dashboard', url: '/technology/admin', icon: LayoutDashboard, roles: [] },
  { title: 'Programs', url: '/technology/admin/programs', icon: GraduationCap, roles: ['super_admin', 'program_admin'] },
  { title: 'Cohorts', url: '/technology/admin/cohorts', icon: Users, roles: ['super_admin', 'program_admin', 'enrollment_officer'] },
  { title: 'Applications', url: '/technology/admin/applications', icon: ClipboardList, roles: ['super_admin', 'enrollment_officer'] },
  { title: 'Partners', url: '/technology/admin/partners', icon: Handshake, roles: ['super_admin'] },
  { title: 'Support', url: '/technology/admin/support', icon: HeadphonesIcon, roles: ['super_admin', 'support'] },
  { title: 'Reports', url: '/technology/admin/reports', icon: BarChart3, roles: ['super_admin'] },
  { title: 'Users', url: '/technology/admin/users', icon: Shield, roles: ['super_admin'] },
  { title: 'Audit Logs', url: '/technology/admin/audit-logs', icon: ScrollText, roles: ['super_admin'] },
];

const AdminSidebar = () => {
  const { user, signOut, hasRole } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  const visibleItems = navItems.filter(item => {
    if (item.roles.length === 0) return true;
    return item.roles.some(role => hasRole(role));
  });

  const isActive = (url: string) => {
    if (url === '/technology/admin') return location.pathname === '/technology/admin';
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        {!collapsed && (
          <img src={logo} alt="Aliko Academy" className="h-8" />
        )}
        {collapsed && (
          <div className="flex justify-center">
            <LayoutDashboard className="h-5 w-5 text-sidebar-foreground" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url} end={item.url === '/technology/admin'}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="mb-2 px-2">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.fullName || user.email}</p>
            <p className="text-xs text-muted-foreground truncate">{user.roles[0]?.replace('_', ' ') || 'No role'}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'default'}
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
