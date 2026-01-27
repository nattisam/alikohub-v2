import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Bell, UserCircle, ChevronDown, LayoutDashboard, User, LogOut } from 'lucide-react';
import { useDashboard, useUser } from '../hooks';
import logo from '../assets/AlikoLogo.svg';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  notificationCount?: number;
}

const Navbar: React.FC<NavbarProps> = () => {
  const { notifications, addNotification, removeNotification } = useDashboard();
  const { currentUser, logout } = useUser();
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isGlobalAdmin = currentUser?.globalRole === 'ADMIN';
  const userRole = currentUser?.role;

  const dashboardPath = useMemo(() => {
    if (isGlobalAdmin || userRole === 'ADMIN') return '/admin';
    if (userRole === 'CONTRACTOR') return '/contractor';
    if (userRole === 'CLIENT') return '/client';
    return '/role-selection';
  }, [isGlobalAdmin, userRole]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setShowOptions(!showOptions);

  const handleNavigate = (path: string) => {
    navigate(path);
    setShowOptions(false);
  };

  const handleBellClick = () => {
    addNotification('New update received');
    setTimeout(() => removeNotification(notifications[notifications.length - 1]?.id || 0), 5000);
  };

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 shadow-sm backdrop-blur md:px-6">
      <Link to="/">
        <img src={logo} alt="logo" className="h-8" />
      </Link>

      <div className="flex items-center gap-3">
        <button
          onClick={handleBellClick}
          className="relative rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600"
        >
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {notifications.length}
            </span>
          )}
        </button>

        {currentUser && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 transition-colors hover:bg-gray-100"
            >
              <UserCircle className="h-6 w-6 text-blue-600" />
              <span className="hidden text-sm font-medium text-gray-700 sm:inline">
                {currentUser.firstname}
              </span>
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
