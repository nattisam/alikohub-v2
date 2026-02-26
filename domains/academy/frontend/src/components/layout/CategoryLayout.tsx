import React from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AcademyHeader from "./AcademyHeader";

interface CategoryLayoutProps {
  category: "STEM" | "Technology" | "Health";
}

const CategoryLayout: React.FC<CategoryLayoutProps> = ({ category }) => {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignUpClick = () => navigate("/auth/signup");
  const handleLogout = () => logout();
  const handleLogoutComplete = () => navigate("/");

  const customLinks = [
    { to: `/category/${category}`, label: `${category} Home` },
    { to: `/category/${category}/courses`, label: "Courses" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <AcademyHeader
        currentTab={location.pathname}
        currentUser={currentUser || undefined}
        onSignUpClick={handleSignUpClick}
        onLogout={handleLogout}
        onLogoutComplete={handleLogoutComplete}
        customLinks={customLinks}
      />
      <main className="min-h-screen pt-20">
        <Outlet />
      </main>
    </>
  );
};

export default CategoryLayout;
