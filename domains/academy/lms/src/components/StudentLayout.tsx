import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Repeat,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  Menu,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StudentSidebar from "@/components/StudentSidebar";
import { useUser, useSwitchAcademyRole, useLogout } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
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

  const instructorStatus = user?.instructorStatus?.toUpperCase();
  const isInstructor =
    user?.globalRole === "ADMIN" ||
    user?.academyUser?.role === "INSTRUCTOR" ||
    instructorStatus === "ACCEPTED" ||
    instructorStatus === "APPROVED" ||
    instructorStatus === "ACTIVE" ||
    user?.roleStatus?.instructor === "ACTIVE" ||
    user?.roleStatus?.instructor?.toUpperCase() === "ACTIVE";

  const isPending =
    user?.hasTeacherApplication ||
    instructorStatus === "PENDING" ||
    user?.roleStatus?.instructor === "pending" ||
    user?.roleStatus?.instructor?.toUpperCase() === "PENDING";

  const userInitials = user
    ? `${user.firstname?.charAt(0) || ""}${user.lastname?.charAt(0) || ""}`.toUpperCase()
    : "U";

  const handleSwitchRole = () => {
    switchRole(
      { newRole: "instructor" },
      {
        onSuccess: () => {
          toast.success("Switched to Instructor role");
          navigate("/instructor");
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="shrink-0 z-20 bg-background/95 backdrop-blur border-b border-border flex items-center gap-3 px-4 lg:px-5 py-3">
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
              placeholder="Search courses, topics..."
              className="pl-9 h-9 bg-muted border-0 focus-visible:ring-1 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  navigate(
                    `/courses?search=${encodeURIComponent(e.currentTarget.value.trim())}`,
                  );
                }
              }}
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Instructor view / switch */}
            {isInstructor ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwitchRole}
                disabled={isSwitching}
                className="gap-2 text-primary border-primary/30 hover:bg-primary/5 text-xs h-9 hidden sm:flex"
              >
                <Repeat className="w-3.5 h-3.5" />
                Instructor view
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-2 text-primary border-primary/30 hover:bg-primary/5 text-xs h-9 hidden sm:flex"
              >
                <Link to="/instructor/apply">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isPending ? "Application pending" : "Instructor view"}
                </Link>
              </Button>
            )}

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
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium text-foreground">
                  {user ? `${user.firstname} ${user.lastname}` : "Student"}
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
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {user
                            ? `${user.firstname} ${user.lastname}`
                            : "Student"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email || "student@alikohub.com"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile-only: Instructor switch inside dropdown */}
                  <div className="sm:hidden py-1 border-b">
                    {isInstructor ? (
                      <button
                        onClick={() => {
                          handleSwitchRole();
                          setProfileOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors w-full text-left"
                      >
                        <Repeat className="w-4 h-4" /> Instructor view
                      </button>
                    ) : (
                      <Link
                        to="/instructor/apply"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Sparkles className="w-4 h-4" />
                        {isPending ? "Application pending" : "Instructor view"}
                      </Link>
                    )}
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

export default StudentLayout;
