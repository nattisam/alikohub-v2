import Hero from "../components/Hero.tsx";
import Faq from "../components/Faq.tsx";
import TrendingCourses from "../components/TrendingCourses.tsx";
import SearchBar from "../components/SearchBar.tsx";
import DeliveryMethod from "../components/DeliveryMethod.tsx";
import Testimonials from "../components/Testimonials.tsx";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AcademyHomePage = () => {
  const navigate = useNavigate();

  // Empty arrays for public display
  const trendingCourses: any[] = [];
  const categories: string[] = ["Technology", "STEM", "Health"];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <Hero>
        <div className="relative mt-96 md:mt-0 pb-36 md:pb-0 max-h-screen z-20 max-w-3xl w-full text-left">
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white lg:text-[#1C1800]"
            style={{ textShadow: "2px 2px 4px gray" }}
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
              onClick={() => navigate("/auth/login")}
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
                  onFocus={() => navigate("/auth/login")}
                />
                <button className="bg-transparent border-0 h-full">
                  <FaSearch className="text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Hero>

      {/* Main Content */}
      <div className="overflow-hidden">
        {/* Trending Courses */}
        <TrendingCourses courses={trendingCourses} />

        {/* Explore Sections */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Explore Our Sections
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category) => (
                <div
                  key={category}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg cursor-pointer"
                  onClick={() => navigate("/auth/login")}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {category} Courses
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Explore curated {category.toLowerCase()} learning paths.
                    </p>
                    <span className="text-blue-600 font-medium">
                      View courses →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <h2 className="m-5 font-sans text-4xl font-extrabold">
          Explore Our Courses
        </h2>
        {/* Search Bar */}
        <SearchBar />

        {/* Delivery & Testimonials */}
        <DeliveryMethod />
        <Testimonials />
      </div>

      {/* FAQ Section */}
      <Faq />
    </div>
  );
};

export default AcademyHomePage;
