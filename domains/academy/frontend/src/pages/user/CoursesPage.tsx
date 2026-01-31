import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import type { Course } from "../../components/common/types.d";
import { 
  Search, 
  Filter, 
  SortAsc, 
  BookOpen, 
  Star, 
  Users, 
  Clock, 
  ChevronRight
} from "lucide-react";
import { courseApi } from "../../api/courseApi";

const CoursesPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [searchParams] = useSearchParams();

  const userId = currentUser?.firebaseId || currentUser?.id;
  const userRole = currentUser?.academyRole || currentUser?.currentRole;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await courseApi.getPublishedCourses();
        const responseData = response?.data;
        const coursesData = responseData?.items || responseData;
        if (Array.isArray(coursesData)) {
          setCourses(coursesData);
        } else {
          setCourses([]);
        }
      } catch (err: any) {
        if (err?.response?.status === 401) {
          setCourses([]);
        } else if (err?.response?.status === 429) {
          setError("Too many requests. Please try again in a moment.");
        } else {
          setError("Failed to load courses. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [userId, userRole]);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const categories = ["All", ...Array.from(new Set(courses.map(course => course.category || "Uncategorized")))];

  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.instructor?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
        case "oldest":
          return new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime();
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-[#3E92D1] rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="mb-10 text-left max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Browse All Courses
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Expand your knowledge with our expert-led courses. Find the perfect path to elevate your skills and career.
          </p>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            
            {/* Search */}
            <div className="md:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Search size={14} className="text-gray-400" />
                Search Courses
              </label>
              <input
                type="text"
                placeholder="Search by title, instructor, or description..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#3E92D1] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Filter size={14} className="text-gray-400" />
                Category
              </label>
              <select
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#3E92D1] transition-all"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <SortAsc size={14} className="text-gray-400" />
                Sort By
              </label>
              <select
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#3E92D1] transition-all"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">
            Showing <span className="text-gray-900">{filteredCourses.length}</span> of {courses.length} courses
          </p>
          {searchTerm && (
            <button 
               onClick={() => setSearchTerm("")}
               className="text-xs text-[#3E92D1] hover:underline"
            >
               Clear filters
            </button>
          )}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link 
                key={course.id} 
                to={`/courses/${course.id}`}
                className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
              >
                {/* Image Section */}
                <div className="h-48 overflow-hidden relative">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                       <BookOpen size={48} className="text-gray-200" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                     <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-gray-700 shadow-sm border border-gray-100">
                        {course.category || "General"}
                     </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-[#3E92D1] transition-colors">
                      {course.title}
                    </h3>
                  </div>

                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {course.shortDescription}
                  </p>

                  <div className="mt-auto space-y-4">
                    {/* Meta Meta Meta */}
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        {course.rating?.toFixed(1) || "5.0"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {course.enrolledNum || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {course.estimatedTime || 10}h
                      </span>
                    </div>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="text-xl font-bold text-gray-900">
                        {course.price && course.price > 0 ? `$${course.price}` : "Free"}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold text-[#3E92D1]">
                         Details
                         <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-16 text-center">
            <div className="mx-auto h-16 w-16 text-gray-200 mb-4 flex items-center justify-center bg-gray-50 rounded-full">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              We couldn't find any courses matching your current filters. Try adjusting your search or category.
            </p>
            <button
               onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
               }}
               className="bg-[#3E92D1] text-white px-6 py-2.5 rounded-md hover:bg-[#327aae] transition-colors font-medium text-sm"
            >
               Reset all filters
            </button>
          </div>
        )}
        
        {/* Newsletter / CTA Section matched to con-tech footer-ish style */}
        <div className="mt-20 bg-[#3E92D1] rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Start your learning journey today</h2>
              <p className="text-white/80 leading-relaxed capitalize">
                 Join thousands of students and instructors on Aliko Academy. Get certificate for every course you complete.
              </p>
           </div>
           <button className="whitespace-nowrap px-8 py-3 bg-white text-[#3E92D1] font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-xl shadow-blue-900/10">
              Create an Account
           </button>
        </div>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="fixed bottom-6 right-6 bg-red-50 border border-red-200 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
           <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
           <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;