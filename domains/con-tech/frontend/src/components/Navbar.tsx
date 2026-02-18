import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  UserCircle,
  ChevronDown,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { useUser } from "../hooks";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { currentUser, logout } = useUser();
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isGlobalAdmin = currentUser?.globalRole === "ADMIN";
  const userRole = currentUser?.role;

  const dashboardPath = useMemo(() => {
    if (isGlobalAdmin || userRole === "ADMIN") return "/admin";
    if (userRole === "CONTRACTOR") return "/contractor";
    if (userRole === "CLIENT") return "/client";
    return "/";
  }, [isGlobalAdmin, userRole]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setShowOptions(!showOptions);

  const handleNavigate = (path: string) => {
    navigate(path);
    setShowOptions(false);
  };

  return (
    <nav className="sticky top-0 z-20 flex h-[73px] items-center justify-between border-b border-gray-300 bg-[#FFFFFF] px-4 shadow-none md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 md:hidden transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 rounded bg-[#3E92D1] flex items-center justify-center">
            <span className="text-white font-bold text-sm">CT</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">Con-Tech</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {currentUser && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 transition-colors hover:bg-gray-100"
            >
              <UserCircle className="h-6 w-6 text-blue-600" />
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-sm font-bold text-gray-900">
                  {currentUser.firstName}
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-400">
                  {userRole?.toLowerCase()}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {showOptions && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                <div className="mb-1 border-b border-gray-100 px-4 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Account
                  </p>
                  <p className="truncate text-sm font-medium text-gray-800">
                    {currentUser.email}
                  </p>
                </div>

                <button
                  onClick={() => handleNavigate(dashboardPath)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </button>

                <button
                  onClick={() => handleNavigate(`${dashboardPath}/profile`)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>

                <button
                  onClick={() => logout()}
                  className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
