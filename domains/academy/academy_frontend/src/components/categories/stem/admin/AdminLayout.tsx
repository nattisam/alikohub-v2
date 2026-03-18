import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  MessageSquare,
  Users,
  ScrollText,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/categories/stem/ui/button";
import { cn } from "@/lib/categories/stem/utils";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Programs", href: "/admin/programs", icon: BookOpen },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Audit Log", href: "/admin/audit", icon: ScrollText },
];

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-divider bg-card flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-divider">
          <Link to="/stem" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Site
          </Link>
          <h2 className="font-display text-lg font-bold text-primary mt-3">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-divider">
          <p className="text-xs text-muted-foreground px-4 py-2">Admin Panel</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b border-divider px-8 py-5">
          <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
