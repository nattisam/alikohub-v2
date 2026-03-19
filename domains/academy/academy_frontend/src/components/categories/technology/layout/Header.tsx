import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/categories/technology/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/categories/technology/ui/navigation-menu";
import { cn } from "@/lib/categories/technology/utils";
import { isFeatureEnabled } from "@/lib/categories/technology/featureFlags";
import logo from "@/assets/categories/technology/logo-full.png";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const programsLinks = [
    {
      title: "All Programs",
      href: "/technology/programs",
      description: "Browse our full catalog of career tracks and courses",
    },
    {
      title: "Career Tracks",
      href: "/technology/programs?tab=career-tracks",
      description: "Mentor-guided bootcamps for career transformation",
    },
    {
      title: "Short Courses",
      href: "/technology/programs?tab=short-courses",
      description: "Focused skill modules for targeted upskilling",
    },
  ];

  const aboutLinks = [
    {
      title: "Career Services",
      href: "/technology/career-services",
      description: "Resume, interviews, and career support",
    },
    {
      title: "Mentors & Instructors",
      href: "/technology/mentors",
      description: "Learn from industry professionals",
    },
    {
      title: "Outcomes & Impact",
      href: "/technology/outcomes",
      description: "Graduate success and program results",
    },
    {
      title: "Partners",
      href: "/technology/partners",
      description: "Our industry and community partners",
    },
    {
      title: "Enterprise Training",
      href: "/technology/enterprise",
      description: "Custom training for organizations",
    },
  ];

  const resourceLinks = [
    {
      title: "Projects & Portfolio",
      href: "/technology/projects",
      description: "Student work and capstone projects",
    },
    ...(isFeatureEnabled("learningPaths")
      ? [
          {
            title: "Learning Paths",
            href: "/technology/learning-paths",
            description: "Curated program sequences for career goals",
          },
        ]
      : []),
    ...(isFeatureEnabled("skillAssessment")
      ? [
          {
            title: "Skill Assessment",
            href: "/technology/skill-assessment",
            description: "Find your recommended programs",
          },
        ]
      : []),
    ...(isFeatureEnabled("programComparison")
      ? [
          {
            title: "Compare Programs",
            href: "/technology/compare",
            description: "Compare up to 3 programs side-by-side",
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-[999] w-full bg-[hsl(210,30%,16%)] backdrop-blur-xl shadow-lg">
      <nav className="container-padding mx-auto flex h-20 max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link to="/technology" className="flex items-center group">
          <img src={logo} alt="Aliko Academy Tech" className="h-12 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Programs */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-aliko-light hover:text-secondary hover:bg-secondary/10 font-medium h-10 transition-colors">
                  Programs
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-2 p-4">
                    {programsLinks.map((link) => (
                      <li key={link.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={link.href}
                            className="block select-none rounded-xl p-4 leading-none no-underline outline-none transition-all hover:bg-gradient-to-r hover:from-secondary/10 hover:to-accent/5 focus:bg-muted group"
                          >
                            <div className="text-sm font-semibold text-foreground group-hover:text-secondary transition-colors">
                              {link.title}
                            </div>
                            <p className="mt-1.5 text-sm text-muted-foreground">
                              {link.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* About */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-aliko-light hover:text-secondary hover:bg-secondary/10 font-medium h-10 transition-colors">
                  About
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-2 p-4">
                    {aboutLinks.map((link) => (
                      <li key={link.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={link.href}
                            className="block select-none rounded-xl p-4 leading-none no-underline outline-none transition-all hover:bg-gradient-to-r hover:from-secondary/10 hover:to-accent/5 focus:bg-muted group"
                          >
                            <div className="text-sm font-semibold text-foreground group-hover:text-secondary transition-colors">
                              {link.title}
                            </div>
                            <p className="mt-1.5 text-sm text-muted-foreground">
                              {link.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Resources */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-aliko-light hover:text-secondary hover:bg-secondary/10 font-medium h-10 transition-colors">
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-2 p-4">
                    {resourceLinks.map((link) => (
                      <li key={link.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={link.href}
                            className="block select-none rounded-xl p-4 leading-none no-underline outline-none transition-all hover:bg-gradient-to-r hover:from-secondary/10 hover:to-accent/5 focus:bg-muted group"
                          >
                            <div className="text-sm font-semibold text-foreground group-hover:text-secondary transition-colors">
                              {link.title}
                            </div>
                            <p className="mt-1.5 text-sm text-muted-foreground">
                              {link.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Direct Links */}
              <NavigationMenuItem>
                <Link
                  to="/technology/admissions"
                  className={cn(
                    "px-4 py-2 text-sm font-medium text-aliko-light hover:text-secondary transition-colors",
                    isActive("/admissions") && "text-secondary font-semibold",
                  )}
                >
                  Admissions
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  to="/technology/tuition"
                  className={cn(
                    "px-4 py-2 text-sm font-medium text-aliko-light hover:text-secondary transition-colors",
                    isActive("/tuition") && "text-secondary font-semibold",
                  )}
                >
                  Tuition
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  to="/technology/hire-graduates"
                  className={cn(
                    "px-4 py-2 text-sm font-medium text-aliko-light hover:text-secondary transition-colors",
                    isActive("/hire-graduates") &&
                      "text-secondary font-semibold",
                  )}
                >
                  Hire Graduates
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <Link to="/technology/student-login">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-accent border-accent/60 bg-accent/10 hover:bg-accent/30 hover:text-white h-10 transition-colors rounded-lg"
            >
              Student Login
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link to="/technology/apply">
            <Button
              size="sm"
              className="bg-secondary hover:bg-secondary/90 text-white font-semibold shadow-md hover:shadow-orange transition-all h-10 px-5 rounded-lg"
            >
              Apply Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2.5 text-aliko-light rounded-xl hover:bg-secondary/10 hover:text-secondary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden absolute left-0 right-0 top-20 z-[100] bg-[hsl(215,28%,14%)] border-t border-border overflow-y-auto"
          style={{ height: "calc(100vh - 5rem)" }}
        >
          <div className="container-padding py-6 space-y-6">
            <div className="space-y-1">
              <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-3 px-4">
                Programs
              </p>
              {programsLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block py-3 px-4 rounded-xl text-base font-medium text-foreground hover:bg-secondary/10 hover:text-secondary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-3 px-4">
                About
              </p>
              {aboutLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block py-3 px-4 rounded-xl text-base font-medium text-foreground hover:bg-secondary/10 hover:text-secondary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-3 px-4">
                Resources
              </p>
              {resourceLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block py-3 px-4 rounded-xl text-base font-medium text-foreground hover:bg-secondary/10 hover:text-secondary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
            </div>

            {/* Direct Links */}
            <div className="space-y-1 pt-4 border-t border-border">
              <Link
                to="/admissions"
                className="block py-3 px-4 rounded-xl text-base font-medium text-foreground hover:bg-secondary/10 hover:text-secondary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admissions
              </Link>
              <Link
                to="/tuition"
                className="block py-3 px-4 rounded-xl text-base font-medium text-foreground hover:bg-secondary/10 hover:text-secondary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tuition
              </Link>
              <Link
                to="/hire-graduates"
                className="block py-3 px-4 rounded-xl text-base font-medium text-foreground hover:bg-secondary/10 hover:text-secondary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Hire Graduates
              </Link>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <Link
                to="/student-login"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant="outline"
                  className="w-full gap-2 h-12 rounded-xl font-medium border-border text-foreground"
                >
                  Student Login
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/apply" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold h-12 rounded-xl shadow-orange mt-3">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
