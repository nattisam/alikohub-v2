import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AuthPromptModal from "../../components/auth/AuthPromptModal";
import {
  Search,
  Filter,
  Award,
  BookOpen,
  CheckCircle2,
  Zap,
  Clock,
} from "lucide-react";
import { useCourses } from "../../hooks/useCourses";
import { getCourseImageUrl } from "../../utils/imageUtils";
import AcademyHeader from "../../components/layout/AcademyHeader";

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

const CategoryCoursesPage = () => {
  const { categoryName } = useParams<{
    categoryName: keyof typeof CATEGORY_INFO;
  }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    level: [] as string[],
    duration: "",
    rating: 0,
  });

  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const handleSignUpClick = () => navigate("/auth/signup");
  const handleLogout = () => logout();
  const handleLogoutComplete = () => navigate("/");

  const category = categoryName && CATEGORY_INFO[categoryName];

  const handleCourseClick = (e: React.MouseEvent, course: any) => {
    if (!currentUser) {
      e.preventDefault();
      setSelectedCourse({ id: course.id, title: course.title });
    }
  };

  if (!category) {
    return <div>Category not found</div>;
  }

  // Get courses and filter by category
  const { courses = [], loading } = useCourses();

  const filteredCourses = courses
    .filter(
      (course) =>
        course.category?.toLowerCase() === categoryName?.toLowerCase(),
    )
    .filter(
      (course) =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.shortDescription
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
          );
        case "popular":
          return (b.enrolledNum || 0) - (a.enrolledNum || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  const categoryPath = `/category/${categoryName}`;
  const customLinks = [
    { to: categoryPath, label: "Overview" },
    { to: `/category/${categoryName}/courses`, label: "Courses" },
    { to: "/webinars", label: "Webinars" },
    { to: "/about", label: "About" },
  ];

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

      <div className="pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" /> Filters
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Sort By</h4>
                  <select
                    className="w-full p-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-[#3E92D1] focus:border-transparent"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Duration</h4>
                  <select
                    className="w-full p-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-[#3E92D1] focus:border-transparent"
                    value={filters.duration}
                    onChange={(e) =>
                      setFilters({ ...filters, duration: e.target.value })
                    }
                  >
                    <option value="">Any Duration</option>
                    <option value="<1h">Less than 1 hour</option>
                    <option value="1-3h">1-3 hours</option>
                    <option value="3-6h">3-6 hours</option>
                    <option value="6h+">6+ hours</option>
                  </select>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Level</h4>
                  <div className="space-y-2">
                    {["Beginner", "Intermediate", "Advanced"].map((level) => (
                      <label
                        key={level}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-[#3E92D1] focus:ring-[#3E92D1]"
                          checked={filters.level.includes(level)}
                          onChange={(e) => {
                            const newLevels = e.target.checked
                              ? [...filters.level, level]
                              : filters.level.filter((l) => l !== level);
                            setFilters({ ...filters, level: newLevels });
                          }}
                        />
                        {level}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Grid */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${category.title.toLowerCase()}...`}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3E92D1] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredCourses.length}{" "}
                {filteredCourses.length === 1 ? "course" : "courses"} found
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilters({ level: [], duration: "", rating: 0 });
                  setSortBy("newest");
                }}
                className="text-sm text-[#3E92D1] hover:underline"
              >
                Clear all filters
              </button>
            </div>

            {/* Courses Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse"
                  >
                    <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    onClick={(e) => handleCourseClick(e, course)}
                    className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    <div className="h-40 bg-gray-100 overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={getCourseImageUrl(course.thumbnail)}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="p-8">
                      <div className="flex items-center gap-2 mb-4">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                            course.targetLevel === "Advanced"
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {course.targetLevel === "Advanced"
                            ? "Advanced"
                            : "Core"}
                        </span>
                      </div>

                      <h3 className="font-black text-2xl text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                        {course.shortDescription}
                      </p>

                      <div className="grid grid-cols-3 gap-2 mb-8 items-center border-t border-gray-50 pt-6">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                          <Clock size={12} />
                          {course.estimatedTime
                            ? `${course.estimatedTime}m`
                            : "12 Weeks"}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                          <Zap size={12} />
                          {course.targetLevel || "Beginner"}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                          <Award size={12} />
                          {course.subCategory || "Certification"}
                        </div>
                      </div>

                      <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 font-black text-xs uppercase tracking-widest rounded-lg transition-colors border border-gray-100">
                        View Curriculum
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No courses found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({ level: [], duration: "", rating: 0 });
                  }}
                  className="px-4 py-2 bg-[#3E92D1] text-white rounded-md hover:bg-[#2c7bbf] transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthPromptModal
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        courseTitle={selectedCourse?.title}
        courseId={selectedCourse?.id}
      />
    </div>
  );
};

export default CategoryCoursesPage;
