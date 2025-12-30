import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const StudentDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items
  const navItems = [
    { path: "/student-dashboard", label: "Dashboard", icon: "📊" },
    { path: "/student-dashboard/mycourses", label: "My Courses", icon: "📚" },
    { path: "/student-dashboard/progress", label: "Progress", icon: "📈" },
    { path: "/student-dashboard/certificates", label: "Certificates", icon: "📜" },
    { path: "/student-dashboard/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r-gray-700 hidden lg:flex flex-col">
        <div className="px-6 py-5 font-bold text-xl">Student Hub</div>
        <nav className="flex-1 px-4 space-y-2 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 text-gray-500 text-sm border-t-gray-50">
          <button 
            className="w-full text-left hover:text-gray-700"
            onClick={() => {
              // Navigate to settings page
              navigate('/settings');
            }}
          >
            Settings
          </button>
          <button 
            className="w-full text-left mt-2 hover:text-gray-700"
            onClick={() => {
              // Use the logout function from auth context
              logout();
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 text-xs ${
                location.pathname === item.path
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
    </div>
  );
};

export default StudentDashboardLayout;