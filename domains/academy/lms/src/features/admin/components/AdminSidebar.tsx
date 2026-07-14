import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  BookOpen,
  CreditCard,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoLms from "@/assets/Aliko Academy LMS Icon.png";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  {
    label: "Course Reviews",
    href: "/admin",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    label: "Teacher Applications",
    href: "/admin/applications",
    icon: <Users className="w-5 h-5 text-[#3070f6]" />,
  },
  {
    label: "Announcements",
    href: "/admin/announcements",
    icon: <Megaphone className="w-5 h-5 text-[#f59e0b]" />,
  },
  {
    label: "Platform Analytics",
    href: "/admin/analytics",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: "Platform Payments",
    href: "/admin/transactions",
    icon: <CreditCard className="w-5 h-5" />,
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: (state: boolean) => void;
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (href: string) => {
    if (href === "/admin") {
      return (
        pathname === "/admin" ||
        pathname === "/admin/" ||
        pathname === "/admin/courses"
      );
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Sidebar Container */}
      <div
        className={cn(
          "bg-white dark:bg-[#27272a] border-r border-zinc-200 dark:border-[#3f3f46] transition-all duration-300 flex flex-col min-h-screen sticky top-0 z-50 shadow-xl shrink-0",
          // Desktop: Full width
          "lg:w-64",
          // Mobile: Toggleable icon-only sidebar (w-20)
          "w-20 fixed inset-y-0 left-0 lg:sticky -translate-x-full lg:translate-x-0",
          isOpen && "translate-x-0",
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center h-20 border-b border-zinc-200 dark:border-[#3f3f46] transition-colors duration-300">
          <Link to="/admin" className="flex items-center justify-center">
            <img
              src={logoLms}
              alt="Aliko Academy Admin"
              className="hidden lg:block max-h-12 w-auto object-contain"
            />

            <div className="lg:hidden flex items-center justify-center w-full">
              <img
                src={logoLms}
                alt="Aliko Academy Admin"
                className="w-12 h-auto object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-8 overflow-y-auto">
          <div className="space-y-2">
            {mainNavItems.map((item) => {
              const itemIsActive = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => onToggle(false)}
                  title={item.label} // Tooltip is important since text is hidden on mobile
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300",
                    "text-sm font-semibold",
                    itemIsActive
                      ? "bg-[#3BC1A8] text-white shadow-lg shadow-[#3BC1A8]/20"
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#3f3f46]/50 hover:text-zinc-900 dark:hover:text-white",
                    "justify-center lg:justify-start",
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {/* Text hidden on mobile, shown on desktop */}
                  <span className="hidden lg:inline whitespace-nowrap">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Overlay for mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[45] lg:hidden backdrop-blur-sm transition-all animate-in fade-in duration-300"
          onClick={() => onToggle(false)}
        />
      )}
    </>
  );
}
