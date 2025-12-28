import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { Course } from "../components/types.d";
import { FaBook, FaStar, FaUsers, FaClock, FaTag, FaDollarSign, FaUser } from "react-icons/fa";
import { courseApi } from "../api/courseApi";

const CoursesPage: React.FC = () => {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [searchParams] = useSearchParams();

  // Check if user has selected a role
  const hasRole = currentUser?.academyRole !== undefined;
  const isStudent = currentUser?.academyRole === 'STUDENT';

  // Fetch all published courses (requires authentication)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        
        const response = await courseApi.getPublishedCourses();
        console.log("Courses API Response:", response.data);
        
        // Handle different response formats
        const coursesData = response.data.items || response.data;
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (err: any) {
        console.error("Error fetching courses:", err);
        
        // Check if it's a 401 error (unauthorized)
        if (err?.response?.status === 401) {
          // For 401 errors, we still try to continue but with empty courses
          // This allows the page to render without showing login prompts
          setCourses([]);
        } else {
          setError("Failed to load courses. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentUser]);

  // Set category from URL params if available
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Get unique categories from courses
  const categories = ["All", ...Array.from(new Set(courses.map(course => course.category || "Uncategorized")))];

  // Filter and sort courses
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
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // Show a general error message without login prompts
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Courses</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Courses</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive collection of courses taught by industry experts. 
            Find the perfect course to advance your skills and career.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Courses
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by title, description, or instructor..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sort"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Course Image */}
                <div className="h-48 overflow-hidden">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FaBook className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>
                    {course.price !== null && course.price > 0 ? (
                      <span className="text-lg font-bold text-green-600">
                        ${course.price}
                      </span>
                    ) : (
                      <span className="text-lg font-bold text-blue-600">
                        Free
                      </span>
                    )}
                  </div>

                  {course.shortDescription && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.shortDescription}
                    </p>
                  )}

                  {/* Instructor */}
                  {course.instructor && (
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 mr-3">
                        {course.instructor.profilePicture ? (
                          <img 
                            src={course.instructor.profilePicture} 
                            alt={`${course.instructor.firstname} ${course.instructor.lastname}`}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <FaUser className="h-4 w-4 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {course.instructor.firstname} {course.instructor.lastname}
                        </p>
                        {course.instructor.title && (
                          <p className="text-xs text-gray-500">
                            {course.instructor.title}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Course Metadata */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.category && (
                      <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        <FaTag className="mr-1" />
                        {course.category}
                      </span>
                    )}
                    {course.targetLevel && (
                      <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {course.targetLevel}
                      </span>
                    )}
                    {course.estimatedTime && (
                      <span className="inline-flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        <FaClock className="mr-1" />
                        {course.estimatedTime} hours
                      </span>
                    )}
                  </div>

                  {/* Ratings and Enrollments */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {course.rating?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                    {course.enrolledNum !== null && (
                      <div className="flex items-center text-sm text-gray-500">
                        <FaUsers className="mr-1" />
                        {course.enrolledNum}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/academy/courses/${course.id}`}
                    className="w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors block font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== "All" 
                ? "Try adjusting your search or filter criteria" 
                : "No courses are currently available"}
            </p>
            {(searchTerm || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;