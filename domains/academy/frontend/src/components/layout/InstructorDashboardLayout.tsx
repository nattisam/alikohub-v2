import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  BarChart3,
  Menu,
  X
} from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const InstructorDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: NavItem[] = [
    { path: "/instructor", label: "Dashboard", icon: LayoutDashboard },
    { path: "/instructor/mycourses", label: "My Courses", icon: BookOpen },
    { path: "/instructor/create-course", label: "Create Course", icon: PlusCircle },
    { path: "/instructor/analytics", label: "Analytics", icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path === "/instructor") {
      return location.pathname === "/instructor";
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-[60] p-4 rounded-full bg-[#F47E28] text-white shadow-2xl hover:bg-[#d96a1a] transition-all transform active:scale-95"
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

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-50 lg:z-10 h-screen lg:h-[calc(100vh-64px)] w-64 bg-[#2e3b4d] border-r border-white/10 transition-all duration-300 ease-in-out flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar Navigation Header (Mobile only) */}
        <div className="lg:hidden px-6 py-6 bg-[#2e3b4d] border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#F47E28] flex items-center justify-center">
              <span className="text-white font-bold text-sm">IH</span>
            </div>
            <span className="font-bold text-white text-lg">Instructor Hub</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
           <p className="px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 lg:hidden">Management</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                  ${
                    active
                      ? "bg-[#3E92D1] text-white shadow-lg shadow-blue-500/20"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon size={18} className={active ? "text-white" : "text-white/30 group-hover:text-white/60"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-gray-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
      </main>
    </div>
  );
};

export default InstructorDashboardLayout;