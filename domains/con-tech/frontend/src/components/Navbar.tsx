import React, { useEffect, useState, useRef } from 'react';
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
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/"><img src={logo} alt='logo onclick move to home' /></Link>
      <div className="text-blue-500 font-bold text-xl">Dashboard</div>
      <div className="flex items-center space-x-4">
        <div className="relative cursor-pointer" onClick={handleBellClick}>
          <FaBell className="text-gray-600 text-lg" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </div>
        {currentUser && (
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center space-x-1"
              onClick={toggleDropdown}
            >
              <FaUserCircle className="text-gray-600 text-2xl" />
              <FaCaretDown size={12} />
            </button>
            
            {showoptions && (
              <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg p-4 z-10 min-w-48">
                <div className="flex flex-col items-center justify-between mb-4 space-y-2">
                  <button 
                    onClick={() => handleNavigate('/dashboard')} 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => handleNavigate('/profile')} 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                  >
                    Profile
                  </button>
                  
                  {/* Show Choose Role button if user hasn't selected a role */}
                  {!currentUser?.hasSelectedRole && (
                    <button 
                      onClick={() => handleNavigate('/role-selection')} 
                      className="w-full text-left px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
                    >
                      Choose Role
                    </button>
                  )}
                  
                  <button 
                    onClick={() => logout()} 
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;