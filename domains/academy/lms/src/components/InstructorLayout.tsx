import React, { useState, useRef, useEffect } from "react";
import { Search, Repeat, User, LogOut, ChevronDown, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InstructorSidebar from "@/components/InstructorSidebar";
import { useUser, useSwitchAcademyRole, useLogout } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const InstructorLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { mutate: switchRole, isPending: isSwitching } = useSwitchAcademyRole();
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const logout = useLogout();

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

  const userInitials = user
    ? `${user.firstname?.charAt(0) || ""}${user.lastname?.charAt(0) || ""}`.toUpperCase()
    : "U";

  const handleSwitchRole = () => {
    switchRole(
      { newRole: "student" },
      {
        onSuccess: () => {
          toast.success("Switched to Student role");
          navigate("/dashboard");
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <InstructorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="shrink-0 z-20 bg-white backdrop-blur border-b border-border flex items-center gap-3 px-4 lg:px-5 py-3">
          {/* Hamburger - mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-1 hover:bg-muted rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search courses, students..."
              className="pl-9 h-9 bg-muted border-0 focus-visible:ring-1 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  navigate(
                    `/instructor/courses?search=${encodeURIComponent(e.currentTarget.value.trim())}`,
                  );
                }
              }}
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Student view switch */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwitchRole}
              disabled={isSwitching}
              className="gap-2 text-accent border-accent/30 hover:bg-accent/5 text-xs h-9 hidden sm:flex"
            >
              <Repeat className="w-3.5 h-3.5" />
              Student view
            </Button>

            {/* Avatar Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage
                    src={user?.profilePicture || undefined}
                    alt={user?.firstname}
                  />
                  <AvatarFallback className="bg-accent/10 text-accent text-xs font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium text-foreground">
                  {user ? `${user.firstname} ${user.lastname}` : "Instructor"}
                </span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-lg border shadow-lg py-2 z-[100]">
                  <div className="px-4 py-3 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage
                          src={user?.profilePicture || undefined}
                          alt={user?.firstname}
                        />
                        <AvatarFallback className="bg-accent/10 text-accent font-bold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {user
                            ? `${user.firstname} ${user.lastname}`
                            : "Instructor"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email || "instructor@alikohub.com"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile-only: Student switch inside dropdown */}
                  <div className="sm:hidden py-1 border-b">
                    <button
                      onClick={() => {
                        handleSwitchRole();
                        setProfileOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors w-full text-left"
                    >
                      <Repeat className="w-4 h-4" /> Student view
                    </button>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <User className="w-4 h-4" /> Profile
                    </Link>
                  </div>

                  <div className="border-t py-1">
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default InstructorLayout;
