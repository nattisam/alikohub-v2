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
    <header className="sticky top-0 z-20 ring-1 ring-black/5 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <div>
          <h2 className="text-xl font-semibold text-[#1C1800] leading-snug">
            {userRole === "applicant"
              ? "Discover roles that move your career forward."
              : "Manage roles, applicants, and hiring in one calm workspace."}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <button className="px-4 py-2 text-sm font-medium text-[#0F4875] hover:text-[#1175BD] transition-colors">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="px-4 py-2 text-sm font-medium bg-[#0F4875] text-white rounded-lg hover:bg-[#1175BD] transition-colors">
                  Sign Up
                </button>
              </Link>
            </div>
          ) : (
            <>
              <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-white text-[#1C1800]/70 hover:text-[#0F4875] hover:shadow-xs transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#E6D600]" />
              </button>
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#0F4875] to-[#1175BD] text-white text-xs font-medium shadow-sm hover:opacity-90 transition-opacity"
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
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-border/60">
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
