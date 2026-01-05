import Hero from "../../components/user/Hero.tsx";
import Faq from "../../components/user/Faq.tsx";
import TrendingCourses from "../../components/user/TrendingCourses.tsx";
import SearchBar from "../../components/user/SearchBar.tsx";
import DeliveryMethod from "../../components/course/DeliveryMethod.tsx";
import CoursesList from "../../components/course/CoursesList.tsx";
import Testimonials from "../../components/user/Testimonials.tsx";
import CourseStats from "../../components/instructor/CourseStats.tsx"; 
import { FaSearch, FaBook } from "react-icons/fa";
import { useTrendingCourses, useAllCourses } from "../../queries/studentCourses";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../../hooks/useCourses"; 

const AcademyHomePage = () => {
  const { data: trendingCourses = [], isLoading: isLoadingTrending } = useTrendingCourses();
  const { data: courses = [], isLoading: isLoadingCourses } = useAllCourses();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Use the new custom hook for course fetching
  const { 
    courses: allCourses, // Renamed to avoid conflict with useStudentCourses().courses
    categories, 
    loading, 
    error, 
    filterCoursesByCategory 
  } = useCourses();

  // Ensure courses is an array before trying to filter it
  const validCourses = Array.isArray(courses) ? courses : [];
  const validTrendingCourses = Array.isArray(trendingCourses) ? trendingCourses : [];

  const handleGetStarted = () => {
    if (currentUser) {
      navigate("/dashboard");
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <div className="pt-16">
      <Hero>
        <div className="relative mt-96 pb-36 md:pb-0 max-h-screen md:mt-0 z-20 max-w-3xl w-full text-left">
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white  lg:text-[#1C1800]"
            style={{ textShadow: "2px 2px 4px gray", letterSpacing: "1px" }}
          >
            Learn In-Demand{" "}
            <span className="lg:text-[#1175BD] text-[#E6D600]">
              Tech Skills
            </span>
            . Build Your Future.
          </h1>

          <div className="flex flex-col sm:flex-row items-start lg:items-center space-y-5 sm:space-y-0 sm:space-x-6 mt-10">
            <button 
              className="bg-gradient-to-r from-[#E6D600] to-[#F2F296] h-10 w-40 rounded-full"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
            <div className="flex items-center">
              <select className="bg-[#38A1FF] h-10 px-4 rounded-l-full text-white flex items-center gap-5">
                <option>Explore</option>
                <option>Technology</option>
                <option>STEM</option>
                <option>Health</option>
              </select>
              <div className="flex items-center bg-[#9C9C9C]/76 h-10 lg:w-72 w-56 px-4 rounded-r-xl">
                <input
                  className="bg-transparent flex-grow placeholder:text-white outline-none placeholder:text-sm"
                  placeholder="Search for courses"
                />
                <button className="bg-transparent border-0 h-full">
                  <FaSearch className="text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Hero>
      <div className="overflow-hidden">
        <TrendingCourses courses={validTrendingCourses} />
        
        {/* Explore Our Sections */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Explore Our Sections</h2>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading categories...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {categories.map((category) => {
                  const categoryCourses = filterCoursesByCategory(category);
                  return (
                    <div 
                      key={category} 
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/courses?category=${category}`)}
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{category} Courses</h3>
                        <p className="text-gray-600 mb-4">
                          Discover our comprehensive {category.toLowerCase()} courses taught by industry experts.
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-600 font-medium">
                            {categoryCourses.length} courses
                          </span>
                          <button className="text-blue-600 hover:text-blue-800 font-medium">
                            Explore →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
        
        <h2 className="m-5 font-sans text-4xl font-extrabold">
          Explore Our Courses
        </h2>
        
        {/* Course Statistics */}
        {!loading && !error && allCourses.length > 0 && (
          <div className="mx-5 mb-8">
            <CourseStats courses={allCourses} />
          </div>
        )}
        
        <SearchBar />
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading courses...</span>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-5 mb-5">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {/* Render course lists dynamically based on fetched categories */}
        {!loading && !error && categories.length > 0 && (
          categories.map((category) => {
            const categoryCourses = filterCoursesByCategory(category);
            // Only render the category if it has courses
            if (categoryCourses.length > 0) {
              return (
                <CoursesList
                  key={category}
                  courses={categoryCourses}
                  category={`${category} Courses`}
                />
              );
            }
            return null;
          })
        )}
        
        {/* No courses message */}
        {!loading && !error && categories.length === 0 && (
          <div className="text-center py-12">
            <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Courses Available</h3>
            <p className="text-gray-500">Check back later for new courses!</p>
          </div>
        )}
        <DeliveryMethod />
        <Testimonials />
      </div>
      <Faq />
    </div>
  );
};

export default AcademyHomePage;