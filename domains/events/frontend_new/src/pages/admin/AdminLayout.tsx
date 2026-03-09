import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Calendar, Users, Ticket, Mail, BarChart3, Settings,
  ChevronLeft, ChevronRight, LogOut, ClipboardCheck, Heart, Menu, X, Image
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { label: "Events", icon: Calendar, href: "/admin/events" },
  { label: "Attendees / Guests", icon: Users, href: "/admin/attendees" },
  { label: "Tickets", icon: Ticket, href: "/admin/tickets" },
  { label: "RSVPs", icon: Heart, href: "/admin/rsvps" },
  { label: "Check-in", icon: ClipboardCheck, href: "/admin/checkin" },
  { label: "Messaging", icon: Mail, href: "/admin/messaging" },
  { label: "Media", icon: Image, href: "/admin/media" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-14 flex items-center px-4 justify-between">
        <button onClick={() => setMobileOpen(!mobileOpen)}><Menu className="w-5 h-5" /></button>
        <span className="font-display font-bold text-primary">Admin Dashboard</span>
        <div />
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col
        ${collapsed ? "w-16" : "w-60"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && <span className="font-display font-bold text-primary text-sm">Aliko Admin</span>}
          <button onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }} className="hidden lg:block">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden"><X className="w-4 h-4" /></button>
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-body transition-colors ${
                  active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                } ${collapsed ? "justify-center px-2" : ""}`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          {!collapsed && profile && (
            <p className="text-xs text-muted-foreground font-body mb-2 truncate">{profile.email}</p>
          )}
          <Button variant="ghost" size="sm" onClick={handleSignOut} className={`font-body text-xs w-full ${collapsed ? "px-2" : ""}`}>
            <LogOut className="w-3.5 h-3.5" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {mobileOpen && <div className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main content */}
      <main className={`flex-1 min-h-screen pt-14 lg:pt-0 ${collapsed ? "lg:ml-0" : "lg:ml-0"}`}>
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
