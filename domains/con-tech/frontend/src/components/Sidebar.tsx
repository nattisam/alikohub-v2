import { useState, useEffect, useMemo } from "react";
import {
  FaFolder,
  FaProjectDiagram,
  FaFileAlt,
  FaClipboardList,
  FaDollarSign,
  FaHome,
  FaBars,
  FaTimes,
  FaUserFriends,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../hooks";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useUser();
  const [isOpen, setIsOpen] = useState(true);

  const isGlobalAdmin = currentUser?.globalRole === 'ADMIN';
  const userRole = currentUser?.role;
  const isAdmin = isGlobalAdmin || userRole === 'PROJECT_MANAGER' || userRole === 'ADMIN';
  const isContractor = userRole === 'CONTRACTOR';
  const isClient = userRole === 'CLIENT';

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar when clicking outside (for mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const toggleButton = document.getElementById("sidebar-toggle");

      if (
        isOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        toggleButton &&
        !toggleButton.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const sidebarItems = useMemo(() => {
    const items: SidebarItem[] = [];
    const prefix = isAdmin ? "/admin" : isContractor ? "/contractor" : isClient ? "/client" : "";

    if (!prefix) return items;

    items.push({
      id: "Dashboard",
      label: "Dashboard",
      icon: <FaHome />,
      path: prefix,
    });

    items.push({
      id: "Projects",
      label: "Projects",
      icon: <FaProjectDiagram />,
      path: `${prefix}/projects`,
    });

    if (isAdmin) {
      items.push({
        id: "Contractors",
        label: "Contractors",
        icon: <FaUserFriends />,
        path: "/admin/contractors",
      });
      items.push({
        id: "Clients",
        label: "Clients",
        icon: <FaUserFriends />,
        path: "/admin/clients",
      });
      items.push({
        id: "Reports",
        label: "System Reports",
        icon: <FaFileAlt />,
        path: "/admin/reports",
      });
    }

    if (isContractor) {
      items.push({
        id: "Tasks",
        label: "My Tasks",
        icon: <FaClipboardList />,
        path: "/contractor/tasks",
      });
      items.push({
        id: "Inspections",
        label: "Inspections",
        icon: <FaFileAlt />,
        path: "/contractor/inspections",
      });
      items.push({
        id: "Contracts",
        label: "Contracts",
        icon: <FaFolder />,
        path: "/contractor/contracts",
      });
    }

    if (isClient) {
      items.push({
        id: "Approvals",
        label: "Approvals",
        icon: <FaClipboardList />,
        path: "/client/approvals",
      });
      items.push({
        id: "Financials",
        label: "Financial Tracking",
        icon: <FaDollarSign />,
        path: "/client/financials",
      });
    }

    return items;
  }, [isAdmin, isContractor, isClient]);

  return (
    <>
      {/* Toggle button - visible on mobile and when sidebar is closed */}
      <button
        id="sidebar-toggle"
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed not-md:top-14 md:relative z-40 h-full overflow-auto bg-white shadow-md p-4 transition-all duration-300 ease-in-out ${
          isOpen
            ? "not-md:w-64 translate-x-0"
            : "not-md:opacity-0 -translate-x-full md:translate-x-0 md:w-64"
        } md:block`}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Menu</h2>
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li
              key={item.id}
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <Link
                to={item.path}
                className="flex items-center space-x-2 w-full"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 backdrop-blur-md bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
