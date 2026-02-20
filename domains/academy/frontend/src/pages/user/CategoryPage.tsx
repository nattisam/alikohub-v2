import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AuthPromptModal from "../../components/auth/AuthPromptModal";
import {
  Search,
  Filter,
  Star,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useCourses } from "../../hooks/useCourses";

const CATEGORY_INFO = {
  STEM: {
    title: "STEM Courses",
    description:
      "Explore our comprehensive Science, Technology, Engineering, and Mathematics courses designed to build strong foundational knowledge and practical skills.",
    icon: <Award className="w-6 h-6 text-[#17469E]" />,
    logo: "/stemLogo.jpg",
    bgGradient: "from-[#17469E]/5 to-white",
    borderColor: "border-[#17469E]/20",
    textColor: "text-[#17469E]",
  },
  Technology: {
    title: "Technology Courses",
    description:
      "Master modern technology skills, from programming and web development to AI and cloud computing with our expert-led courses.",
    icon: <BookOpen className="w-6 h-6 text-[#F0802D]" />,
    logo: "/techLogo.jpg",
    bgGradient: "from-[#F0802D]/5 to-white",
    borderColor: "border-[#F0802D]/20",
    textColor: "text-[#F0802D]",
  },
  Health: {
    title: "Health & Medicine",
    description:
      "Advance your career in healthcare with our comprehensive medical courses taught by industry professionals.",
    icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
    logo: "/healthLogo.jpg",
    bgGradient: "from-green-600/5 to-white",
    borderColor: "border-green-600/20",
    textColor: "text-green-600",
  },
};

const CategoryPage = () => {
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

  const { user: currentUser } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<{
    id: number;
    title: string;
  } | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`p-8 rounded-2xl mb-8 bg-gradient-to-r ${category.bgGradient} border ${category.borderColor} flex flex-col md:flex-row items-center gap-8`}
        >
          <div className="flex-shrink-0">
            <img
              src={category.logo}
              alt={category.title}
              className="h-32 w-auto object-contain drop-shadow-sm"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {category.title}
              </h1>
            </div>
            <p className="text-gray-600 max-w-3xl text-lg">
              {category.description}
            </p>
          </div>
        </div>

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
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-[#3E92D1] line-clamp-2">
                          {course.title}
                        </h3>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {course.shortDescription}
                      </p>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span>{course.rating?.toFixed(1) || "New"}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-gray-400 mr-1" />
                            <span>{course.enrolledNum || 0}</span>
                          </div>
                        </div>

                        <div className="flex items-center text-sm font-medium text-[#3E92D1] group-hover:underline">
                          View Course <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
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

export default CategoryPage;
