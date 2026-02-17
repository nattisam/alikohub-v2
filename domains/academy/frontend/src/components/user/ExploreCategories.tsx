import { useNavigate } from "react-router-dom";

interface ExploreCategoriesProps {
  filterCoursesByCategory: (category: string) => any[];
  loading?: boolean;
}

const CATEGORIES = [
  {
    name: "STEM",
    image: "/stemLogo.jpg",
    description:
      "Explore Science, Technology, Engineering, and Mathematics fundamentals.",
    color: "from-[#17469E]/10 to-transparent",
    borderColor: "hover:border-[#17469E]/50",
    route: "/courses?category=STEM",
  },
  {
    name: "Tech",
    image: "/techLogo.jpg",
    description:
      "Master modern technology skills, from programming to system design.",
    color: "from-[#F0802D]/10 to-transparent",
    borderColor: "hover:border-[#F0802D]/50",
    route: "/courses?category=Technology",
  },
  {
    name: "Health",
    image: "/healthLogo.jpg",
    description:
      "Advance your career in healthcare with our comprehensive medical courses.",
    color: "from-green-600/10 to-transparent",
    borderColor: "hover:border-green-600/50",
    route: "/courses?category=Health",
  },
];

const ExploreCategories: React.FC<ExploreCategoriesProps> = ({
  filterCoursesByCategory,
}) => {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 py-12 -mt-10 md:-mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            // Try both Tech and Technology for the count
            const count =
              filterCoursesByCategory(cat.name).length ||
              (cat.name === "Tech"
                ? filterCoursesByCategory("Technology").length
                : 0);

            return (
              <div
                key={cat.name}
                onClick={() => navigate(cat.route)}
                className={`group relative bg-white border border-gray-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden ${cat.borderColor}`}
              >
                {/* Background Decoration */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} rounded-bl-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}
                />

                <div className="relative z-10">
                  <div className="relative h-20 mb-6">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="absolute -top-4 -left-2 h-20 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-[#17469E] transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-400">
                      {count} Courses
                    </span>
                    <span className="flex items-center gap-2 text-[#F0802D] font-bold group-hover:translate-x-2 transition-transform">
                      Explore <span className="text-xl">→</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExploreCategories;
