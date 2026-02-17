import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  User,
  Menu,
  X,
  Plus,
  GraduationCap,
} from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const StudentDashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: NavItem[] = [
    { path: "/student-dashboard", label: "Overview", icon: LayoutDashboard },
    {
      path: "/student-dashboard/mycourses",
      label: "My Courses",
      icon: BookOpen,
    },
    { path: "/student-dashboard/profile", label: "My Profile", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/student-dashboard") {
      return location.pathname === "/student-dashboard";
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Mobile Toggle Button - specifically for the dashboard sidebar */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-[60] p-4 rounded-full bg-[#3E92D1] text-white shadow-2xl hover:bg-[#2d7bb5] transition-all transform active:scale-95"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[45] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Height adjusted to account for AcademyHeader (h-16) if parent layout doesn't handle it */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-50 lg:z-10 h-screen lg:h-[calc(100vh-64px)] w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-gray-200 bg-[#0C69AD]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 shadow-sm">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Student Hub
              </h1>
              <p className="text-xs text-white/80 leading-tight mt-1">
                Your learning journey starts here
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
          <div>
            <p className="px-3 text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-4">
              Academic
            </p>
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        active
                          ? "bg-[#0C69AD] text-white shadow-md font-semibold"
                          : "text-gray-600 hover:bg-[#0A5FA0] hover:text-white hover:shadow-sm"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Footer Link */}
        <div className="p-4 border-t border-gray-100">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-[#0C69AD] transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span className="truncate">Explore Courses</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto h-full">{children}</div>
      </main>
    </div>
  );
};

export default StudentDashboardLayout;
