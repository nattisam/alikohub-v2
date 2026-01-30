import { useState, useEffect, useMemo } from "react";
import {
  FaProjectDiagram,
  FaFileAlt,
  FaHome,
  FaBars,
  FaTimes,
  FaUserFriends,
  FaInfoCircle,
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

  const isGlobalAdmin = currentUser?.globalRole === "ADMIN";
  const userRole = currentUser?.role;
  const isAdmin = isGlobalAdmin || userRole === "ADMIN";
  const isContractor = userRole === "CONTRACTOR";
  const isClient = userRole === "CLIENT";

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
        id: "Users",
        label: "Users",
        icon: <FaUserFriends />,
        path: "/admin/users",
      });
      items.push({
        id: "Reports",
        label: "System Reports",
        icon: <FaFileAlt />,
        path: "/admin/reports",
      });
    }

    if (isContractor) {
      // Contractors mainly interact through projects in this simplified version
    }

    if (isClient) {
      // Clients mainly interact through projects in this simplified version
      items.push({
        id: "ContactGuidance",
        label: "Contact & Guidance",
        icon: <FaInfoCircle />,
        path: "/client/contact-guidance",
      });
    }

    return items;
  }, [isAdmin, isContractor, isClient]);

  return (
    <>
      {/* Toggle Button */}
      <button
        id="sidebar-toggle"
        className="md:hidden fixed top-5 left-5 z-50 p-2.5 rounded-lg bg-white text-slate-700 shadow-lg hover:bg-slate-50 transition-colors duration-200"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <aside
        id="sidebar"
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 overflow-y-auto bg-[#2e3b4d] border-r border-white/10 transition-all duration-300 ease-in-out
          ${
            isOpen
              ? "md:translate-x-0 translate-x-0"
              : "md:translate-x-0 -translate-x-full"
          }
        `}
      >
        {/* Header - Matching Academy AdminLayout Logo Style */}
        <div className="sticky top-0 px-6 py-6 bg-[#2e3b4d] border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#3E92D1] flex items-center justify-center">
              <span className="text-white font-bold text-sm">CT</span>
            </div>
            <span className="font-bold text-white text-lg">Con-Tech</span>
          </div>
          <p className="text-xs text-white/50 mt-2 uppercase tracking-wider font-semibold">Navigation</p>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-6">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-[#3E92D1] text-white shadow-md"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <span
                      className={`text-base transition-colors ${
                        isActive ? "text-white" : "text-white/40 group-hover:text-white/80"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;