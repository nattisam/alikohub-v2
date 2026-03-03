import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

const AdminLayout = () => {
  const { user: currentUser, logout, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="fixed inset-y-0 left-0 z-30 hidden lg:flex lg:w-64 bg-[#0D72BA]">
          <div className="w-full p-6">
            <div className="h-10 w-40 bg-white/10 animate-pulse rounded mb-8" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-white/10 animate-pulse rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 lg:ml-64">
          <header className="sticky top-0 border-b border-border bg-card px-4 md:px-8 py-4 flex items-center justify-between h-[73px]">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-lg" />
          </header>
          <main className="p-4 md:p-8">
            <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
          </main>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      path: "/admin/teacher-applications",
      label: "Teacher Applications",
      icon: <Users className="w-5 h-5" />,
    },
    {
      path: "/admin/courses",
      label: "Manage Courses",
      icon: <BookOpen className="w-5 h-5" />,
    },
  ];

  const NavLink = ({ item }: { item: (typeof menuItems)[0] }) => {
    const active = isActive(item.path);
    return (
      <Link
        to={item.path}
        onClick={() => setSidebarOpen(false)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium",
          active
            ? "bg-[#3E92D1] text-white shadow-md"
            : "text-white/70 hover:bg-white/10 hover:text-white",
        )}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 right-0 z-40 lg:hidden bg-white border-b border-border flex items-center justify-between p-4">
        <h1 className="text-lg font-bold text-[#0D72BA]">Admin Panel</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-[#2e3b4d] border-r border-sidebar-border",
          "flex flex-col gap-6 p-6 overflow-y-auto",
          "transition-all duration-300 z-30",
          "lg:sticky lg:translate-x-0 lg:top-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="hidden lg:flex items-center gap-2 pb-4 border-b border-white/10">
          <div className="w-8 h-8 rounded bg-[#3E92D1] flex items-center justify-center">
            <span className="text-white font-bold text-sm">AP</span>
          </div>
          <span className="font-bold text-white text-lg">Admin Panel</span>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>
        </nav>

        {/* User Info */}
        <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-[#3E92D1] flex items-center justify-center text-white text-sm font-bold">
              {currentUser?.firstname?.[0] || "A"}
              {currentUser?.lastname?.[0] || "U"}
            </div>
            <div className="text-sm truncate">
              <div className="font-medium text-white truncate">
                {currentUser?.firstname} {currentUser?.lastname}
              </div>
              <div className="text-xs text-white/50 truncate">
                {currentUser?.email || "admin@example.com"}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 border-b border-gray-300 bg-[#FFFFFF] px-4 md:px-8 py-4 flex items-center justify-end">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all font-semibold"
              onClick={() => {
                logout();
              }}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
