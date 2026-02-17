import Hero from "../../components/user/Hero";
import Faq from "../../components/user/Faq";
import TrendingCourses from "../../components/user/TrendingCourses";
import DeliveryMethod from "../../components/course/DeliveryMethod";
import Testimonials from "../../components/user/Testimonials";
import ExploreCategories from "../../components/user/ExploreCategories";
import RoleSelection from "../../components/user/RoleSelection";
import {
  useTrendingCourses,
  useAllCourses,
} from "../../queries/studentCourses";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../../hooks/useCourses";

import studentsHero from "../../assets/hero.jpg";

const AcademyHomePage = () => {
  const { data: courses = [] } = useAllCourses();
  const trendingCourses = useTrendingCourses(courses);
  const navigate = useNavigate();

  const { filterCoursesByCategory } = useCourses();

  return (
    <div className="overflow-x-hidden">
      <div className="relative pt-8 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300">
        <Hero>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left */}
            <div className="w-full lg:w-1/2 space-y-2 text-center lg:text-left relative">
              {/* Decorative element for text */}
              <div
                className="absolute -top-10 -left-10 w-40 h-40 opacity-10 rounded-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #000000 1px, transparent 1px)",
                  backgroundSize: "12px 12px",
                }}
              ></div>

              <div className="inline-block px-3 py-1 bg-black/10 text-black text-xs font-semibold rounded-full uppercase tracking-wider relative z-10">
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
                  onClick={() => navigate("/about")}
                  className="px-6 py-3 bg-[#17469E] text-white font-medium rounded-lg hover:bg-[#044C96] transition-all text-sm"
                >
                  Learn More
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="px-6 py-3 bg-black/10 text-black font-medium rounded-lg border border-black/20 hover:bg-black/20 transition-all text-sm"
                >
                  Get in Touch
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
              </div>
            </div>
          </div>
        </Hero>
      </div>

      {/* Explore Categories / Top Cards */}
      <ExploreCategories filterCoursesByCategory={filterCoursesByCategory} />

      {/* Role Selection - shown for authenticated users */}
      <RoleSelection />

      {/* Trending Courses */}
      <TrendingCourses courses={trendingCourses || []} />

      {/* Error State */}

      <DeliveryMethod />
      <Testimonials />
      <Faq />
    </div>
  );
};

export default AcademyHomePage;
