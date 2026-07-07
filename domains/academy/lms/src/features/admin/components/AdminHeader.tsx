import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, User, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser, useLogout } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/features/admin/components/ThemeToggle";

interface AdminHeaderProps {
  title?: string;
  onMenuClick?: () => void;
  darkTheme?: boolean;
}

export function AdminHeader({
  title,
  onMenuClick,
  darkTheme,
}: AdminHeaderProps) {
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
    <header
      className={cn(
        "sticky top-0 z-40 border-b px-4 md:px-8 py-4 flex items-center justify-between shadow-sm transition-colors duration-300",
        darkTheme
          ? "bg-[#222222] border-[#333333]"
          : "bg-white border-zinc-200",
      )}
    >
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className={cn(
              "lg:hidden p-2 rounded-lg transition-all duration-300 border",
              darkTheme
                ? "hover:bg-[#333333] border-[#444] text-slate-300"
                : "hover:bg-slate-100 border-zinc-200 text-slate-600",
            )}
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1
          className={cn(
            "text-lg md:text-xl font-bold transition-all duration-300",
            darkTheme ? "text-white" : "text-slate-800",
          )}
        >
          {title || "Dashboard"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={cn(
              "flex items-center gap-2 px-2 py-1 rounded-lg transition-colors duration-300",
              darkTheme ? "hover:bg-[#333333]" : "hover:bg-slate-100",
            )}
          >
            <Avatar
              className={cn(
                "h-8 w-8 border transition-all duration-300",
                darkTheme ? "border-[#444]" : "border-zinc-200",
              )}
            >
              <AvatarImage
                src={user?.profilePicture || undefined}
                alt={user?.firstname}
              />
              <AvatarFallback className="bg-primary/20 text-primary font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start text-left">
              <span
                className={cn(
                  "text-sm font-semibold leading-tight transition-colors duration-300",
                  darkTheme ? "text-white" : "text-slate-800",
                )}
              >
                {user?.firstname || "Global Admin"}
              </span>
              <span
                className={cn(
                  "text-[10px] leading-tight transition-colors duration-300",
                  darkTheme ? "text-slate-400" : "text-slate-500",
                )}
              >
                Administrator
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-colors duration-300",
                darkTheme ? "text-slate-400" : "text-slate-400",
              )}
            />
          </button>

          {profileOpen && (
            <div
              className={cn(
                "absolute right-0 top-full mt-2 w-56 rounded-xl border shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-200",
                darkTheme
                  ? "bg-[#27272a] border-[#3f3f46] text-zinc-200"
                  : "bg-white border-slate-200 text-slate-800",
              )}
            >
              <div
                className={cn(
                  "px-4 py-3 border-b",
                  darkTheme ? "border-[#3f3f46]" : "border-slate-100",
                )}
              >
                <p
                  className={cn(
                    "text-sm font-semibold",
                    darkTheme && "text-white",
                  )}
                >
                  {user?.firstname} {user?.lastname}
                </p>
                <p
                  className={cn(
                    "text-xs truncate",
                    darkTheme ? "text-zinc-400" : "text-slate-500",
                  )}
                >
                  {user?.email}
                </p>
              </div>

              <div className="py-1">
                {!isAdmin && (
                  <Link
                    to="/lms"
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 text-sm transition-colors",
                      darkTheme
                        ? "hover:bg-[#3f3f46] text-zinc-300"
                        : "hover:bg-slate-50 text-slate-700",
                    )}
                  >
                    <ShieldCheck
                      className={cn(
                        "w-4 h-4",
                        darkTheme ? "text-zinc-400" : "text-slate-500",
                      )}
                    />{" "}
                    Switch to Student
                  </Link>
                )}
              </div>

              <div
                className={cn(
                  "border-t py-1",
                  darkTheme ? "border-[#3f3f46]" : "border-slate-100",
                )}
              >
                <button
                  onClick={() => logout()}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 text-sm transition-colors w-full text-left font-medium",
                    darkTheme
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-red-600 hover:bg-red-50",
                  )}
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
