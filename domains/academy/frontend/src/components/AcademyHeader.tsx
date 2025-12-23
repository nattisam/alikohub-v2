import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaUser, FaChalkboardTeacher, FaGraduationCap, FaSignOutAlt, FaBars, FaTimes, FaBook } from "react-icons/fa";
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
  console.log('AcademyHeader: Rendering with props:', { currentTab, currentUser, onSignUpClick, onLogout, onLogoutComplete });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };



  const handleLogout = () => {
    console.log('AcademyHeader: handleLogout called');
    
    // Call the logout function from context
    console.log('AcademyHeader: Calling logout from auth context');
    logout();
    
    // Call the onLogout callback if provided
    if (onLogout) {
      console.log('AcademyHeader: Calling onLogout callback');
      onLogout();
    }
    
    // Navigate to home page
    console.log('AcademyHeader: Navigating to home page');
    navigate("/");
    
    // Call the onLogoutComplete callback if provided
    if (onLogoutComplete) {
      console.log('AcademyHeader: Calling onLogoutComplete callback');
      onLogoutComplete();
    }
  };



  const handleChooseRoleClick = () => {
    // Navigate to dashboard where role selection will be shown
    navigate("/dashboard");
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
                          Role: {currentUser.academyRole === "STUDENT" && "Student"}
                          {currentUser.academyRole === "INSTRUCTOR" && "Instructor"}
                          {currentUser.academyRole === "ADMIN" && "Admin"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Role: Not selected</span>
                        <button 
                          onClick={handleChooseRoleClick}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded-md"
                        >
                          Choose role
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                              
                {/* User Avatar and Name */}
                <div className="flex items-center space-x-2">
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
                              

                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700"
                  title="Sign out"
                >
                  <FaSignOutAlt className="h-5 w-5" />
                </button>
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
                          Role: {currentUser.academyRole === "STUDENT" ? "Student" : currentUser.academyRole === "INSTRUCTOR" ? "Instructor" : "Admin"}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">Role: Not selected</span>
                          <button 
                            onClick={handleChooseRoleClick}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded-md"
                          >
                            Choose role
                          </button>
                        </div>
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