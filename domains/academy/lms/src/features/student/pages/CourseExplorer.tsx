import { useState, useEffect } from "react";
import { Search, Clock, BarChart, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudentLayout from "@/features/student/components/StudentLayout";
import {
  useCourses,
  useCoursesByCategory,
  useCoursesByDifficulty,
} from "@/hooks/useAcademy";
import { Link, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const streams = ["All", "Health", "Technology", "STEM"];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const LmsExplore = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [activeStream, setActiveStream] = useState("All");
  const [activeLevel, setActiveLevel] = useState("All Levels");

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) setSearch(q);
  }, [searchParams]);

  // Fetch all published courses
  const { data: allCoursesData, isLoading: isLoadingAll } = useCourses(
    { status: "PUBLISHED", page: 1, pageSize: 20 },
    { enabled: activeStream === "All" && activeLevel === "All Levels" },
  );

  // Fetch courses by category
  const { data: categoryCoursesData, isLoading: isLoadingCategory } =
    useCoursesByCategory(
      activeStream !== "All" ? activeStream : "",
      { page: 1, pageSize: 20 },
      { enabled: activeStream !== "All" && activeLevel === "All Levels" },
    );

  // Fetch courses by difficulty
  const { data: difficultyCoursesData, isLoading: isLoadingDifficulty } =
    useCoursesByDifficulty(
      activeLevel !== "All Levels" ? activeLevel : "",
      { page: 1, pageSize: 20 },
      { enabled: activeLevel !== "All Levels" && activeStream === "All" },
    );

  // Determine active dataset
  let data;
  let isLoading;

  if (activeStream !== "All" && activeLevel !== "All Levels") {
    // If both are selected, we will fetch by category and filter locally by difficulty
    // or fetch ALL and filter both. Let's fetch by category and filter by difficulty.
    data = categoryCoursesData;
    isLoading = isLoadingCategory;
  } else if (activeStream !== "All") {
    data = categoryCoursesData;
    isLoading = isLoadingCategory;
  } else if (activeLevel !== "All Levels") {
    data = difficultyCoursesData;
    isLoading = isLoadingDifficulty;
  } else {
    data = allCoursesData;
    isLoading = isLoadingAll;
  }

  const courses = Array.isArray(data) ? data : (data as any)?.courses || [];

  const filtered = courses.filter((c: any) => {
    let matchLevel = true;
    let matchStream = true;

    if (activeStream !== "All" && activeLevel !== "All Levels") {
      // Data is from category, we need to filter by difficulty
      matchLevel = c.difficulty?.toUpperCase() === activeLevel.toUpperCase();
    }

    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());

    return matchLevel && matchStream && matchSearch;
  });

  return (
    <StudentLayout>
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 to-slate-900 border-b py-10">
        <div className="section-container relative z-10">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-6">
            Explore Courses
          </h1>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />

            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-0 bg-white/10 backdrop-blur-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all focus:bg-white/20"
            />
          </div>
        </div>
      </div>

      <div className="section-container py-8 pb-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex gap-2">
            {streams.map((s) => (
              <button
                key={s}
                onClick={() => setActiveStream(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeStream === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setActiveLevel(l)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeLevel === l
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Course Grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course: any) => (
              <div
                key={course.id}
                className="bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="h-40 overflow-hidden relative">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Search className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}

                  <span
                    className={`absolute top-3 left-3 text-xs font-medium px-3 py-1 rounded-full stream-${course.category?.toLowerCase()}`}
                  >
                    {course.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    {course.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />{" "}
                      {course.estimatedTime || "8 weeks"}
                    </span>

                    <span className="flex items-center gap-1">
                      <BarChart className="w-3 h-3" /> {course.difficulty}
                    </span>

                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />{" "}
                      {course.enrollmentCount || 0} learners
                    </span>

                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-accent" />{" "}
                      {course.rating || "4.8"}
                    </span>
                  </div>

                  <Button size="sm" className="w-full" asChild>
                    <Link to={`/courses/${course.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No courses found matching your filters.
          </p>
        )}
      </div>
    </StudentLayout>
  );
};

export default LmsExplore;
