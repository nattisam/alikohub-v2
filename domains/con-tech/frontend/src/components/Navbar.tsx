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
    if (isGlobalAdmin || userRole === 'PROJECT_MANAGER' || userRole === 'ADMIN') return "/admin";
    if (userRole === 'CONTRACTOR') return "/contractor";
    if (userRole === 'CLIENT') return "/client";
    return "/role-selection";
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
    setTimeout(() => removeNotification(notifications[notifications.length - 1]?.id || 0), 5000);
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center bg-opacity-90 sticky top-0 z-50">
      <Link to="/"><img src={logo} alt='logo' className="h-8" /></Link>
      <div className="text-blue-600 font-bold text-xl hidden md:block">Aliko ConTech</div>
      <div className="flex items-center space-x-4">
        <div className="relative cursor-pointer" onClick={handleBellClick}>
          <FaBell className="text-gray-600 text-lg hover:text-blue-500 transition-colors" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
              {notifications.length}
            </span>
          )}
        </div>
        {currentUser && (
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 p-1 rounded-full px-3 transition-colors border border-gray-200"
              onClick={toggleDropdown}
            >
              <FaUserCircle className="text-blue-600 text-2xl" />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">{currentUser.firstname}</span>
              <FaCaretDown size={12} className="text-gray-500" />
            </button>
            
            {showoptions && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-xl border border-gray-100 py-2 z-[60] overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Account</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{currentUser.email}</p>
                </div>
                
                <button 
                  onClick={() => handleNavigate(dashboardPath)} 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center"
                >
                  <span className="mr-2">📊</span> Dashboard
                </button>
                <button 
                  onClick={() => handleNavigate(`${dashboardPath}/profile`)} 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center"
                >
                  <span className="mr-2">👤</span> Profile
                </button>
                
                {!currentUser?.hasSelectedRole && !isGlobalAdmin && (
                  <button 
                    onClick={() => handleNavigate('/role-selection')} 
                    className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium transition-colors border-t border-gray-50 flex items-center"
                  >
                    <span className="mr-2">🔄</span> Switch Role
                  </button>
                )}
                
                <button 
                  onClick={() => logout()} 
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 flex items-center"
                >
                  <span className="mr-2">🚪</span> Logout
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