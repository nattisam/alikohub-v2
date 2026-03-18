import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, User, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser, useLogout } from "@/hooks/useAuth";

interface AdminHeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { data: user } = useUser();
  const isAdmin = user?.globalRole === "ADMIN";
  const logout = useLogout();

  const userInitials = user
    ? `${user.firstname?.charAt(0) || ""}${user.lastname?.charAt(0) || ""}`.toUpperCase()
    : "A";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white px-4 md:px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
        )}
        <h1 className="text-lg md:text-xl font-bold text-slate-800">
          {title || "Dashboard"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Avatar className="h-8 w-8 border border-slate-200">
              <AvatarImage
                src={user?.profilePicture || ""}
                alt={user?.firstname}
              />
              <AvatarFallback className="bg-primary/20 text-primary font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start text-left">
              <span className="text-sm font-semibold text-slate-800 leading-tight">
                {user?.firstname}
              </span>
              <span className="text-[10px] text-slate-500 leading-tight">
                Admin
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 text-slate-800 animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold">
                  {user?.firstname} {user?.lastname}
                </p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-500" /> Go to Website
                </Link>
                {!isAdmin && (
                  <Link
                    to="/lms"
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-500" /> Switch to
                    Student
                  </Link>
                )}
              </div>

              <div className="border-t border-slate-100 py-1">
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left font-medium"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
