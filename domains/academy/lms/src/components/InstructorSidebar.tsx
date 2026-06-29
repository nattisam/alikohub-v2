import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BarChart,
  ClipboardList,
  CalendarDays,
  Settings,
  X,
} from "lucide-react";
import logoLms from "@/assets/Aliko Academy LMS Icon.png";
import { cn } from "@/lib/utils";

const mainNav = [
  { label: "Dashboard", to: "/instructor", icon: LayoutDashboard },
  { label: "My Courses", to: "/instructor/courses", icon: BookOpen },
  { label: "Analytics", to: "/instructor/analytics", icon: BarChart },
];

const manageNav = [
  { label: "Submissions", to: "/instructor/submissions", icon: ClipboardList },
  { label: "Schedules", to: "/instructor/schedules", icon: CalendarDays },
  { label: "Settings", to: "/instructor/settings", icon: Settings },
];

interface InstructorSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const InstructorSidebar = ({
  isOpen = false,
  onClose,
}: InstructorSidebarProps) => {
  const location = useLocation();

  const isActive = (to: string) => {
    if (to === "/instructor") return location.pathname === "/instructor";
    return location.pathname.startsWith(to);
  };

  const NavItem = ({
    item,
  }: {
    item: {
      label: string;
      to: string;
      icon: React.ElementType;
      badge?: number;
      external?: boolean;
    };
  }) => {
    const active = isActive(item.to);
    const Icon = item.icon;
    const content = (
      <span
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 w-full border-l-2",
          active
            ? "bg-accent/10 text-accent font-semibold border-accent"
            : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium border-transparent",
        )}
      >
        <Icon className={`w-4 h-4 shrink-0 ${active ? "text-accent" : ""}`} />
        <span className="flex-1">{item.label}</span>
        {item.badge != null && item.badge > 0 && (
          <span className="text-[11px] font-bold bg-accent text-accent-foreground rounded-full px-1.5 py-0.5 leading-none">
            {item.badge}
          </span>
        )}
      </span>
    );

    if (item.external) {
      return (
        <a
          href={item.to}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {content}
        </a>
      );
    }
    return (
      <Link to={item.to} className="block" onClick={onClose}>
        {content}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "w-56 shrink-0 flex flex-col h-screen border-r border-border bg-card z-50",
          // Desktop: always visible
          "hidden lg:flex lg:sticky lg:top-0",
          // Mobile: slide-in overlay
          isOpen && "!flex fixed top-0 left-0 shadow-2xl",
        )}
      >
        {/* Logo + mobile close */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <img
                src={logoLms}
                alt="Aliko Academy"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-foreground font-heading">
                Aliko Academy
              </p>
              <p className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">
                Instructor Console
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 hover:bg-muted rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-6">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide px-3 mb-2">
              Main Menu
            </p>
            <div className="space-y-0.5">
              {mainNav.map((item) => (
                <NavItem key={item.to} item={item} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide px-3 mb-2">
              Manage
            </p>
            <div className="space-y-0.5">
              {manageNav.map((item) => (
                <NavItem key={item.to} item={item} />
              ))}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default InstructorSidebar;
