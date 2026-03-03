import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  Globe,
  Menu,
  X,
  ExternalLink,
  LogOut,
} from "lucide-react";
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
import alikohubLogo from "@/assets/alikohub-logo.png";
import { useUser, useLogout } from "@/features/auth/hooks/useAuth";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Ventures", href: "/programs" },
  { label: "Partnership", href: "/partnership" },
  { label: "Career", href: "https://career.alikohub.com/", external: true },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const user = useUser();
  const logout = useLogout();

  const userInitials = user
    ? `${user.firstname?.charAt(0) || ""}${user.lastname?.charAt(0) || ""}`.toUpperCase()
    : "U";

  return (
    <>
      {/* Top bar */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-6">
            <a
              href="mailto:info@alikohub.com"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">info@alikohub.com</span>
            </a>
            <a
              href="tel:+12063535373"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">+1 206 353 5373</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            <span>English</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={alikohubLogo} alt="AlikoHub" className="h-16" />
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          {/* Desktop CTA / User Profile */}
          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
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
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-amber-light shadow-[var(--shadow-amber)]"
                >
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border/50 lg:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-6">
                {user && (
                  <div className="flex items-center gap-3 px-3 py-4 mb-2 bg-muted/30 rounded-xl border border-border/50">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage
                        src={user.profilePicture || ""}
                        alt={user.firstname}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">
                        {user.firstname} {user.lastname}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}

                {navLinks.map((link) =>
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.href}
                      className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:text-primary ${
                        location.pathname === link.href
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ),
                )}

                <div className="flex flex-col gap-3 pt-4 border-t border-border/50 mt-2">
                  {user ? (
                    <>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                      >
                        Log Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="flex-1"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button
                        size="sm"
                        asChild
                        className="flex-1 bg-primary text-primary-foreground"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Link to="/register">Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
