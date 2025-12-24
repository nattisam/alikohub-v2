import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaUser, FaChalkboardTeacher, FaGraduationCap, FaSignOutAlt, FaBars, FaTimes, FaBook, FaCaretDown, FaSpinner, FaCog, FaTachometerAlt } from "react-icons/fa";
import logo from "../assets/logo.svg";

interface AcademyHeaderProps {
  currentTab: string;
  currentUser?: any; // Using any for now to avoid complex type definitions
  onSignUpClick?: () => void;
  onLogout?: () => void;
  onLogoutComplete?: () => void;
}

const AcademyHeader: React.FC<AcademyHeaderProps> = ({
  currentTab,
  currentUser,
  onSignUpClick,
  onLogout,
  onLogoutComplete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, switchRole, isRoleSwitching, refreshProfile } = useAuth();
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const handleLogout = () => {
    
    // Call the logout function from context
    logout();
    
    // Call the onLogout callback if provided
    if (onLogout) {
      onLogout();
    }
    
    // Navigate to home page
    navigate("/");
    
    // Call the onLogoutComplete callback if provided
    if (onLogoutComplete) {
      onLogoutComplete();
    }
  };



  const handleRoleChange = (role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') => {
    if (currentUser) {
      switchRole(role);
      setIsRoleDropdownOpen(false);
    }
  };


  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img className="h-8 w-auto" src={logo} alt="AlikoHub Academy" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`${
                currentTab === "/" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`${
                currentTab === "/about" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              About
            </Link>
            <Link
              to="/courses"
              className={`${
                currentTab === "/courses" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              } px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center`}
            >
              Courses
            </Link>
            
            <Link
              to="/contact"
              className={`${
                currentTab === "/contact" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Contact
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                {/* User Info and Role */}
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                  {/* Role Selector */}
                  <div className="relative" ref={roleDropdownRef}>
                    {currentUser.hasSelectedRole ? (
                      <div className="flex items-center space-x-1 text-sm font-medium text-gray-700">
                        <span>
                          Role: {(currentUser.currentRole || currentUser.academyRole) === "STUDENT" && "Student"}
                          {(currentUser.currentRole || currentUser.academyRole) === "INSTRUCTOR" && "Instructor"}
                          {(currentUser.currentRole || currentUser.academyRole) === "ADMIN" && "Admin"}
                        </span>
                        {/* Show indicator if instructor role is pending or rejected */}
                        {(currentUser.currentRole || currentUser.academyRole) === "INSTRUCTOR" && 
                         currentUser.roleStatus?.instructor === "pending" && (
                          <span className="inline-block ml-1 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            Pending
                          </span>
                        )}
                        {(currentUser.currentRole || currentUser.academyRole) === "INSTRUCTOR" && 
                         currentUser.roleStatus?.instructor === "rejected" && (
                          <span className="inline-block ml-1 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            Rejected
                          </span>
                        )}
                        {(currentUser.currentRole || currentUser.academyRole) === "INSTRUCTOR" && 
                         currentUser.roleStatus?.instructor === "pending" && (
                          <button 
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (refreshProfile) {
                                await refreshProfile();
                              }
                            }}
                            className="ml-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-0.5 rounded transition-colors"
                          >
                            Refresh
                          </button>
                        )}
                        {currentUser.availableRoles && currentUser.availableRoles.length > 1 && (
                          <>
                            <button 
                              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                              className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                              aria-label="Role selector"
                            >
                              <FaCaretDown className="ml-1" />
                            </button>
                            
                            {isRoleDropdownOpen && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                {currentUser.availableRoles.map((role) => {
                                  // Don't show instructor role in dropdown if status is rejected
                                  if (role === "INSTRUCTOR" && currentUser.roleStatus?.instructor === "rejected") {
                                    return null;
                                  }
                                  
                                  return (
                                    <button
                                      key={role}
                                      onClick={() => handleRoleChange(role)}
                                      disabled={isRoleSwitching || (role === "INSTRUCTOR" && currentUser.roleStatus?.instructor !== "active")}
                                      className={`block w-full text-left px-4 py-2 text-sm ${currentUser.currentRole === role ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'} ${(isRoleSwitching || (role === "INSTRUCTOR" && currentUser.roleStatus?.instructor !== "active")) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                      {role === "STUDENT" && "Student"}
                                      {role === "INSTRUCTOR" && (
                                        <span className="flex justify-between items-center w-full">
                                          <span>
                                            Instructor 
                                            {currentUser.roleStatus?.instructor === "pending" && " (Pending)"}
                                            {currentUser.roleStatus?.instructor === "rejected" && " (Rejected)"}
                                          </span>
                                          {currentUser.roleStatus?.instructor === "pending" && (
                                            <button 
                                              onClick={async (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (refreshProfile) {
                                                  await refreshProfile();
                                                }
                                              }}
                                              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-0.5 rounded transition-colors ml-2"
                                            >
                                              Refresh
                                            </button>
                                          )}
                                        </span>
                                      )}
                                      {role === "ADMIN" && "Admin"}
                                      {isRoleSwitching && currentUser.currentRole === role && (
                                        <span className="ml-2">
                                          <FaSpinner className="inline animate-spin text-xs" />
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        )}

                      </div>
                    ) : (
                      <Link
                        to="/dashboard"
                        className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                      >
                        Choose Role
                      </Link>
                    )}
                  </div>
                </div>
                                
                                {/* User Avatar Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors"
                  >
                    {currentUser.profilePicture ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={currentUser.profilePicture}
                        alt="Profile"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {currentUser.firstname}
                    </span>
                    <FaCaretDown className="text-gray-500" />
                  </button>
                  
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaTachometerAlt className="mr-3 text-gray-500" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaUser className="mr-3 text-gray-500" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaCog className="mr-3 text-gray-500" />
                        Settings
                      </Link>
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="mr-3" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/auth/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <button
                  onClick={onSignUpClick}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className={`${
                  currentTab === "/" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className={`${
                  currentTab === "/courses" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                } block px-3 py-2 rounded-md text-base font-medium flex items-center`}
              >
                <FaBook className="mr-2" />
                Courses
              </Link>
              <Link
                to="/about"
                className={`${
                  currentTab === "/about" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`${
                  currentTab === "/contact" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                Contact
              </Link>
              {currentUser && (
                <>
                  <div className="px-3 py-2 border-t border-gray-200 mt-2">
                    {/* Mobile Role Selector */}
                    <div className="mb-3 relative" ref={roleDropdownRef}>
                      {currentUser.hasSelectedRole ? (
                        <div className="text-sm font-medium text-gray-700">
                          Role: {(currentUser.currentRole || currentUser.academyRole) === "STUDENT" ? "Student" : (currentUser.currentRole || currentUser.academyRole) === "INSTRUCTOR" ? "Instructor" : "Admin"}
                          {/* Show indicator if instructor role is pending */}
                          {(currentUser.currentRole || currentUser.academyRole) === "INSTRUCTOR" && 
                           currentUser.roleStatus?.instructor === "pending" && (
                            <span className="inline-block ml-1 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              Pending
                            </span>
                          )}
                          {(currentUser.currentRole || currentUser.academyRole) === "INSTRUCTOR" && 
                           currentUser.roleStatus?.instructor === "pending" && (
                            <button 
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (refreshProfile) {
                                  await refreshProfile();
                                }
                              }}
                              className="ml-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-0.5 rounded transition-colors"
                            >
                              Refresh
                            </button>
                          )}
                          {currentUser.availableRoles && currentUser.availableRoles.length > 1 && (
                            <>
                              <button 
                                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none ml-2"
                                aria-label="Role selector"
                              >
                                <FaCaretDown className="ml-1" />
                              </button>
                              
                              {isRoleDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                  {currentUser.availableRoles.map((role) => {
                                    // Don't show instructor role in dropdown if status is rejected
                                    if (role === "INSTRUCTOR" && currentUser.roleStatus?.instructor === "rejected") {
                                      return null;
                                    }
                                    
                                    return (
                                      <button
                                        key={role}
                                        onClick={() => handleRoleChange(role)}
                                        disabled={isRoleSwitching || (role === "INSTRUCTOR" && currentUser.roleStatus?.instructor !== "active")}
                                        className={`block w-full text-left px-4 py-2 text-sm ${currentUser.currentRole === role ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'} ${(isRoleSwitching || (role === "INSTRUCTOR" && currentUser.roleStatus?.instructor !== "active")) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                      >
                                        {role === "STUDENT" && "Student"}
                                        {role === "INSTRUCTOR" && (
                                          <span className="flex justify-between items-center w-full">
                                            <span>
                                              Instructor 
                                              {currentUser.roleStatus?.instructor === "pending" && " (Pending)"}
                                              {currentUser.roleStatus?.instructor === "rejected" && " (Rejected)"}
                                            </span>
                                            {currentUser.roleStatus?.instructor === "pending" && (
                                              <button 
                                                onClick={async (e) => {
                                                  e.preventDefault();
                                                  e.stopPropagation();
                                                  if (refreshProfile) {
                                                    await refreshProfile();
                                                  }
                                                }}
                                                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-0.5 rounded transition-colors ml-2"
                                              >
                                                Refresh
                                              </button>
                                            )}
                                          </span>
                                        )}
                                        {role === "ADMIN" && "Admin"}
                                        {isRoleSwitching && currentUser.currentRole === role && (
                                          <span className="ml-2">
                                            <FaSpinner className="inline animate-spin text-xs" />
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          )}

                        </div>
                      ) : (
                        <Link
                          to="/dashboard"
                          className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors inline-block"
                        >
                          Choose Role
                        </Link>
                      )}
                    </div>
                    
                    {/* User Avatar and Name */}
                    <div className="flex items-center space-x-2 mb-3">
                      {currentUser.profilePicture ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={currentUser.profilePicture}
                          alt="Profile"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaUser className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {currentUser.firstname}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-gray-700 hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                    >
                      <FaSignOutAlt className="inline mr-2" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
              {!currentUser && (
                <>
                  <Link
                    to="/auth/login"
                    className="text-gray-700 hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Login
                  </Link>
                  <button
                    onClick={onSignUpClick}
                    className="w-full text-left text-gray-700 hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AcademyHeader;