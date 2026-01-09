import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FiHome,
  FiBookOpen,
  FiAward,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const BRAND_BLUE = "#0D72BA";
const BRAND_ORANGE = "#F47E28";

const StudentDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/student-dashboard", label: "Dashboard", icon: FiHome },
    { path: "/student-dashboard/mycourses", label: "Courses", icon: FiBookOpen },
    { path: "/student-dashboard/certificates", label: "Certificates", icon: FiAward },
    { path: "/student-dashboard/profile", label: "Profile", icon: FiUser },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white shadow-md">


        {/* Logo / Title */}
        <div
          className="px-6 py-5 text-xl font-bold text-gray-900"
        >
          Student Hub
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${
                    isActive(item.path)
                      ? "text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}
                style={{
                  backgroundColor: isActive(item.path) ? BRAND_BLUE : "transparent",
                }}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="px-4 py-4 border-t space-y-2 text-sm">
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            <FiSettings size={16} />
            Settings
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">

        <div className="grid grid-cols-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center py-2 text-xs transition"
                style={{ color: active ? BRAND_BLUE : "#6B7280" }}
              >
                <Icon size={20} />
                <span className="mt-1">{item.label}</span>
                {active && (
                  <span
                    className="mt-1 h-1 w-6 rounded-full"
                    style={{ backgroundColor: BRAND_ORANGE }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
    </div>
  );
};

export default StudentDashboardLayout;
