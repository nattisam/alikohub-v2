import Hero from "../../components/user/Hero";
import Faq from "../../components/user/Faq";
import TrendingCourses from "../../components/user/TrendingCourses";
import DeliveryMethod from "../../components/course/DeliveryMethod";
import Testimonials from "../../components/user/Testimonials";
import CourseStats from "../../components/instructor/CourseStats";
import ExploreCategories from "../../components/user/ExploreCategories"; 
import {
  useTrendingCourses,
  useAllCourses,
} from "../../queries/studentCourses";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../../hooks/useCourses";
import ErrorState from "../../components/states/ErrorState";
import studentsHero from "../../assets/hero.jpg";

const AcademyHomePage = () => {
  const { data: courses = [] } = useAllCourses();
  const trendingCourses = useTrendingCourses(courses);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const {
    courses: allCourses,
    loading,
    error,
    filterCoursesByCategory,
  } = useCourses();

  const handleGetStarted = () => {
    navigate(currentUser ? "/dashboard" : "/auth/login");
  };

  return (
    <div className="overflow-x-hidden">
      <div className="bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300">
        <Hero>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left */}
            <div className="w-full lg:w-1/2 space-y-2 text-center lg:text-left">
              <div className="inline-block px-3 py-1 bg-black/10 text-black text-xs font-semibold rounded-full uppercase tracking-wider">
                AlikoHub Academy
              </div>
              <h1 className="text-3xl md:text-6xl font-bold text-black tracking-tight leading-tight">
                Learn In-Demand <br className="hidden md:block" />
                <span className="text-[#F0802D]">Tech Skills.</span>
                <br />
                Build Your Future.
              </h1>

              <p className="text-black/70 text-base md:text-lg max-w-lg mx-auto lg:mx-0">
                Access comprehensive training in AI, STEM, and Software
                Engineering. Developed by industry experts to help you stay
                ahead.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-4">
                <button
                  onClick={handleGetStarted}
                  className="px-6 py-3 bg-[#17469E] text-white font-medium rounded-lg hover:bg-[#044C96] transition-all text-sm"
                >
                  Browse Courses
                </button>
                <button className="px-6 py-3 bg-black/10 text-black font-medium rounded-lg border border-black/20 hover:bg-black/20 transition-all text-sm">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right */}
            <div className="w-full lg:w-1/2">
              <div className="relative p-2 bg-black/5 rounded-2xl border border-black/10">
                <img
                  src={studentsHero}
                  alt="Students learning"
                  className="block w-full h-[400px] rounded-xl shadow-sm object-cover border border-black/10"
                />

                <div className="mt-4 flex items-center justify-between px-4 py-3 bg-black/10 rounded-lg border border-black/20 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-bold text-black">
                      500+ Courses Available
                    </span>
                  </div>
                  <div className="text-xs text-black/60 font-medium">
                    Topics:{" "}
                    <span className="text-black font-semibold">
                      Technology, STEM, Health
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Hero>
      </div>

      {/* Explore Categories / Top Cards */}
      <ExploreCategories filterCoursesByCategory={filterCoursesByCategory} />

      {/* Trending Courses */}
      <TrendingCourses courses={trendingCourses || []} />

      {/* Course Stats */}
      {!loading && !error && allCourses.length > 0 && (
        <CourseStats courses={allCourses} />
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-4xl mx-auto py-10">
          <ErrorState
            message={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      )}

      <DeliveryMethod />
      <Testimonials />
      <Faq />
    </div>
  );
};

export default AcademyHomePage;
