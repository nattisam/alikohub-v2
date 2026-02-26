import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Globe,
} from "lucide-react";
import CategoryHero from "../../components/user/CategoryHero";
import AcademyHeader from "../../components/layout/AcademyHeader";
import AcademyFooter from "../../components/layout/AcademyFooter";
import CertificationProcess from "../../components/user/CertificationProcess";
import CertificateValidation from "./CertificateValidation";

const CATEGORY_INFO = {
  STEM: {
    title: "Master STEM Fundamentals",
    description:
      "Dive into Science, Technology, Engineering, and Mathematics. Our courses are designed to bridge the gap between theory and industry application.",
    icon: <Award className="w-6 h-6 text-[#17469E]" />,
    logo: "/stemLogo.jpg",
    bgGradient: "from-[#17469E]/5 to-white",
    borderColor: "border-[#17469E]/20",
    textColor: "text-[#17469E]",
    heroImage: "/stemHero.jpg",
    stats: [
      { label: "Active Students", value: "2.4k+" },
      { label: "Certifications", value: "150+" },
      { label: "Completion Rate", value: "94%" },
    ],
    features: [
      "Industry-standard Labs",
      "Expert Researchers",
      "Career Placement Support",
    ],
  },
  Technology: {
    title: "Build the Future with Tech",
    description:
      "From Fullstack Development to AI Engineering, master the skills that power the modern world. Learn from silicon valley veterans.",
    icon: <BookOpen className="w-6 h-6 text-[#F0802D]" />,
    logo: "/techLogo.jpg",
    bgGradient: "from-[#F0802D]/5 to-white",
    borderColor: "border-[#F0802D]/20",
    textColor: "text-[#F0802D]",
    heroImage: "/techHero.jpg",
    stats: [
      { label: "Tech Mentors", value: "85+" },
      { label: "Partner Companies", value: "40+" },
      { label: "Average Salary", value: "$95k" },
    ],
    features: ["Hands-on Coding", "Portfolio Reviews", "Real-world Projects"],
  },
  Health: {
    title: "Advance Your Medical Career",
    description:
      "Comprehensive healthcare training and medical certifications. Join the next generation of healthcare professionals with AlikoHub.",
    icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
    logo: "/healthLogo.jpg",
    bgGradient: "from-green-600/5 to-white",
    borderColor: "border-green-600/20",
    textColor: "text-green-600",
    heroImage: "/healthHero.jpg",
    stats: [
      { label: "Clinical Partners", value: "30+" },
      { label: "Medical Modules", value: "200+" },
      { label: "Success Rate", value: "98%" },
    ],
    features: [
      "Certified Instructors",
      "Interactive Simulation",
      "Global Recognition",
    ],
  },
};

const CategoryPage = () => {
  const { categoryName } = useParams<{
    categoryName: keyof typeof CATEGORY_INFO;
  }>();

  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignUpClick = () => navigate("/auth/signup");
  const handleLogout = () => logout();
  const handleLogoutComplete = () => navigate("/");

  const category = categoryName && CATEGORY_INFO[categoryName];

  if (!category) {
    return <div>Category not found</div>;
  }

  const categoryPath = `/category/${categoryName}`;
  const customLinks = [
    { to: categoryPath, label: "Overview" },
    { to: `${categoryPath}/courses`, label: "Courses" },
    { to: "/webinars", label: "Webinars" },
    { to: "/about", label: "About" },
  ];

  const brandColor =
    categoryName === "STEM"
      ? "text-[#17469E]"
      : categoryName === "Technology"
        ? "text-[#F0802D]"
        : "text-green-600";

  const brandSecondary =
    categoryName === "STEM"
      ? "#FDC500"
      : categoryName === "Technology"
        ? "#F0802D"
        : "#10b981"; // Green-500 equivalent

  return (
    <div className="min-h-screen bg-white">
      <AcademyHeader
        currentTab={location.pathname}
        currentUser={currentUser || undefined}
        onSignUpClick={handleSignUpClick}
        onLogout={handleLogout}
        onLogoutComplete={handleLogoutComplete}
        customLinks={customLinks}
      />

      <div className="pt-20">
        <CategoryHero
          category={categoryName as any}
          title={category.title}
          description={category.description}
          image={category.heroImage}
        />
      </div>

      <CertificationProcess />

      <CertificateValidation />

      <AcademyFooter />
    </div>
  );
};

export default CategoryPage;
