import React, { useEffect, useState, useRef, useMemo } from 'react';
import { FaBell, FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { useDashboard, useUser } from '../hooks';
import logo from '../assets/AlikoLogo.svg';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  notificationCount?: number;
}

const Navbar: React.FC<NavbarProps> = () => {
  const { notifications, addNotification, removeNotification } = useDashboard();
  const { currentUser, logout } = useUser();
  const [showoptions, setShowoptions] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isGlobalAdmin = currentUser?.globalRole === 'ADMIN';
  const userRole = currentUser?.role;

  const dashboardPath = useMemo(() => {
    if (isGlobalAdmin || userRole === 'PROJECT_MANAGER' || userRole === 'ADMIN') return '/admin';
    if (userRole === 'CONTRACTOR') return '/contractor';
    if (userRole === 'CLIENT') return '/client';
    return '/role-selection';
  }, [isGlobalAdmin, userRole]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowoptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setShowoptions(!showoptions);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setShowoptions(false);
  };

  const handleBellClick = () => {
    addNotification('New update received');
    setTimeout(
      () => removeNotification(notifications[notifications.length - 1]?.id || 0),
      5000
    );
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center bg-opacity-90 sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="logo" className="h-8" />
      </Link>

      {/* Title (Desktop only) */}
      <div className="text-blue-600 font-bold text-xl hidden md:block">
        Aliko ConTech
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Bell */}
        <button
          onClick={handleBellClick}
          className="relative p-3 rounded-full
                     hover:bg-gray-100 active:bg-gray-200
                     transition-colors"
        >
          <FaBell className="text-gray-600 text-xl" />
          {notifications.length > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
              {notifications.length}
            </span>
          )}
        </button>

        {/* User dropdown */}
        {currentUser && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 p-2 md:px-3 rounded-full
                         hover:bg-gray-100 active:bg-gray-200
                         transition-colors"
            >
              <FaUserCircle className="text-blue-600 text-2xl" />
              <span className="hidden sm:inline text-sm font-medium text-gray-700">
                {currentUser.firstname}
              </span>
              <FaCaretDown className="text-gray-500" />
            </button>

            {showoptions && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-xl border border-gray-100 py-2 z-[60]">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                    Account
                  </p>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {currentUser.email}
                  </p>
                </div>

                <button
                  onClick={() => handleNavigate(dashboardPath)}
                  className="w-full flex items-center px-4 py-3 text-sm
                             hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  📊 <span className="ml-2">Dashboard</span>
                </button>

                <button
                  onClick={() => handleNavigate(`${dashboardPath}/profile`)}
                  className="w-full flex items-center px-4 py-3 text-sm
                             hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  👤 <span className="ml-2">Profile</span>
                </button>

                {!currentUser?.hasSelectedRole && !isGlobalAdmin && (
                  <button
                    onClick={() => handleNavigate('/role-selection')}
                    className="w-full flex items-center px-4 py-3 text-sm text-blue-600
                               hover:bg-blue-50 active:bg-blue-100 transition-colors border-t"
                  >
                    🔄 <span className="ml-2">Switch Role</span>
                  </button>
                )}

                <button
                  onClick={() => logout()}
                  className="w-full flex items-center px-4 py-3 text-sm text-red-600
                             hover:bg-red-50 active:bg-red-100 transition-colors border-t"
                >
                  🚪 <span className="ml-2">Logout</span>
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
