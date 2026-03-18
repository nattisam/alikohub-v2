import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  BarChart2,
  BellRing,
  Settings,
  Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logoLms from "@/assets/logo-lms.png";
import { useUser, useLogout, useSwitchAcademyRole } from "@/hooks/useAuth";
import { toast } from "sonner";

const instructorLinks = [
  { label: "Dashboard", to: "/instructor/lms", icon: LayoutDashboard },
  { label: "My Courses", to: "/instructor/lms/courses", icon: BookOpen },
  { label: "Analytics", to: "/instructor/lms/analytics", icon: BarChart2 },
  { label: "Schedules", to: "/instructor/lms/schedules", icon: BellRing },
];

const InstructorNavbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);
  const { data: user } = useUser();
  const logout = useLogout();
  const { mutate: switchRole, isPending: isSwitching } = useSwitchAcademyRole();

  const userInitials = user
    ? `${user.firstname?.charAt(0) || ""}${user.lastname?.charAt(0) || ""}`.toUpperCase()
    : "I";

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

  const handleSwitchRole = () => {
    switchRole(
      { newRole: "student" },
      {
        onSuccess: () => {
          toast.success("Switched to Student role");
          navigate("/lms");
        },
      },
    );
  };

  return (
    <nav className="sticky top-0 z-50 nav-solid border-b border-border shadow-sm bg-slate-900 text-white">
      <div className="section-container flex items-center justify-between h-16 md:h-20">
        <Link to="/instructor/lms" className="flex items-center">
          <img
            src={logoLms}
            alt="Aliko Academy Instructor"
            className="h-20 md:h-28 w-auto object-contain brightness-0 invert"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {instructorLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-accent flex items-center gap-2 ${
                location.pathname === link.to ? "text-accent" : "text-slate-300"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* User Profile & Role Switcher */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSwitchRole}
            disabled={isSwitching}
            className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white gap-2"
          >
            <Repeat className="w-4 h-4" />
            Switch to Student
          </Button>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Avatar className="h-8 w-8 border border-slate-700">
                <AvatarImage
                  src={user?.profilePicture || ""}
                  alt={user?.firstname}
                />
                <AvatarFallback className="bg-accent/20 text-accent font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 rounded-lg border border-slate-700 shadow-xl py-2 z-[100] text-slate-200">
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-sm font-semibold">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    to="/lms/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-700 transition-colors"
                  >
                    <User className="w-4 h-4" /> Profile Settings
                  </Link>
                  <Link
                    to="/instructor/lms/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Instructor Settings
                  </Link>
                </div>

                <div className="border-t border-slate-700 py-1">
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-slate-700 px-4 pb-4 space-y-3 bg-slate-900">
          {instructorLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 py-3 text-sm font-medium text-slate-300 hover:text-accent"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-700 flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwitchRole}
              disabled={isSwitching}
              className="w-full bg-slate-800 border-slate-700 hover:bg-slate-700 gap-2"
            >
              <Repeat className="w-4 h-4" />
              Switch to Student Role
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => logout()}
            >
              Log Out
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default InstructorNavbar;
