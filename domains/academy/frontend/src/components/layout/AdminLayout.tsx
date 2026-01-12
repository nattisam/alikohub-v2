import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaChalkboardTeacher, FaBook, FaCalendarAlt, FaComments, FaCog, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const AdminLayout = () => {
  const { user: currentUser, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="fixed inset-y-0 left-0 z-30 hidden lg:flex lg:w-64 bg-gradient-to-b from-blue-800 to-indigo-900">
          <div className="w-full p-4">
            <div className="h-10 w-40 bg-gray-200 animate-pulse rounded mb-8" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 bg-gray-200 animate-pulse rounded" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 lg:ml-64">
          <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
                </div>
                <div className="flex space-x-4">
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                  <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
                </div>
              </div>
            </div>
          </header>
          <main className="p-4 pt-16">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  // Define admin navigation items
  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: FaTachometerAlt },
    { path: "/admin/teacher-applications", label: "Teacher Applications", icon: FaChalkboardTeacher },
    { path: "/admin/courses", label: "Manage Courses", icon: FaBook },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed lg:relative inset-y-0 left-0 z-10 w-64 bg-gradient-to-b from-blue-800 to-indigo-900 text-white transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-blue-600">
            <h1 className="text-xl font-bold flex items-center">
              <span>Admin Panel</span>
            </h1>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                        active
                          ? 'bg-white text-blue-800 font-medium shadow-md'
                          : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${active ? 'text-blue-800' : 'text-blue-200'}`} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{currentUser?.firstname} {currentUser?.lastname}</p>
                <p className="text-xs text-blue-200">Admin User</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/auth/login");
                }}
                className="p-2 text-blue-200 hover:bg-blue-700 rounded-full hover:text-white transition-colors"
                title="Logout"
              >
                <FaSignOutAlt size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        <header className="bg-white shadow-md z-0">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-gray-800">
                  {menuItems.find(item => isActive(item.path))?.label || "Admin Dashboard"}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="hidden sm:inline text-sm text-gray-600">
                  Admin: {currentUser?.firstname} {currentUser?.lastname}
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate("/auth/login");
                  }}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-4 pt-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;