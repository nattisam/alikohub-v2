import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logoAcademy from "@/assets/logo-aliko-academy.png";
import { useUser, useLogout } from "@/hooks/useAuth";
import { useAccessLms } from "@/hooks/useAccessLms";
import { toast } from "sonner";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { data: user } = useUser();
  const isAdmin = user?.globalRole === "ADMIN";
  const logout = useLogout();
  const { accessLms, isLoading } = useAccessLms();

  const userInitials = user
    ? `${user.firstname?.charAt(0) || ""}${user.lastname?.charAt(0) || ""}`.toUpperCase()
    : "U";

  const instructorStatus = user?.instructorStatus?.toUpperCase();
  const isPendingInstructor =
    user?.hasTeacherApplication ||
    instructorStatus === "PENDING" ||
    user?.roleStatus?.instructor?.toUpperCase() === "PENDING";

  const dynamicLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Streams", to: "/#streams" },
    { label: "Contact", to: "/contact" },
    {
      label: isPendingInstructor
        ? "Application Pending"
        : "Apply for Instructor",
      to: "/apply-instructor",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 nav-solid border-b border-border shadow-sm">
      <div className="section-container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center">
          <img
            src={logoAcademy}
            alt="Aliko Academy"
            className="h-10 md:h-12 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {dynamicLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
              {link.label === "Application Pending" && (
                <span className="ml-2 inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {isAdmin ? (
                <Button size="sm" asChild>
                  <Link to="/admin">Admin Panel</Link>
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled={isLoading}
                  onClick={(e) => {
                    e.preventDefault();
                    accessLms();
                  }}
                >
                  {isLoading ? "Accessing..." : "Access LMS"}
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10 border border-border shadow-sm">
                      <AvatarImage
                        src={user.profilePicture || ""}
                        alt={user.firstname}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstname} {user.lastname}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/lms">Access LMS</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t px-4 pb-4 space-y-3">
          {dynamicLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            {user ? (
              <>
                <div className="flex flex-col w-full gap-2">
                  {isAdmin ? (
                    <Button size="sm" className="w-full" asChild>
                      <Link to="/admin" onClick={() => setOpen(false)}>
                        Admin Panel
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={isLoading}
                      onClick={() => {
                        accessLms();
                        setOpen(false);
                      }}
                    >
                      {isLoading ? "Accessing..." : "Access LMS"}
                    </Button>
                  )}

                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                  >
                    Log Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  asChild
                >
                  <Link to="/login" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link to="/lms" onClick={() => setOpen(false)}>
                    Access LMS
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
