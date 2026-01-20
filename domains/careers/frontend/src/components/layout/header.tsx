import { Bell, User, LogOut } from "lucide-react"
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/auth-context";
import { Link } from "react-router-dom";

interface HeaderProps {
  userRole: "recruiter" | "admin" | "applicant"
}

export function Header({ userRole }: HeaderProps) {

  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout, isAuthenticated } = useAuth();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 border-b border-gray-200 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900 leading-snug">
            {userRole === "applicant"
              ? "Discover roles that move your career forward."
              : "Manage roles, applicants, and hiring in one calm workspace."}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <button className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-[#0C69AD] transition-colors duration-300">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="px-4 py-2.5 text-sm font-medium bg-[#0C69AD] text-white rounded-xl hover:bg-[#0A5FA0] hover:shadow-md transition-all duration-300">
                  Sign Up
                </button>
              </Link>
            </div>
          ) : (
            <>
              <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-indigo-600 hover:border-indigo-500/30 hover:shadow-sm transition-all duration-300">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500" />
              </button>
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white text-sm font-medium shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                  }}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <User className="w-4 h-4" />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50 border border-gray-100">
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
