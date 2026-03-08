import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Filter, Search, X, Sparkles, BookOpen } from "lucide-react";
import Layout from "@/components/categories/technology/layout/Layout";
import ProgramCard from "@/components/categories/technology/programs/ProgramCard";
import { Button } from "@/components/categories/technology/ui/button";
import { Input } from "@/components/categories/technology/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/categories/technology/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/categories/technology/ui/select";
import DomainSection from "@/components/categories/technology/programs/DomainSection";
import {
  programs,
  getCategories,
  getCareerTrackCategories,
  getShortCourseCategories,
  Category,
  Level,
  DeliveryMode,
  ProgramType,
} from "@/data/categories/technology/programs";

import { useTechCourses } from "@/hooks/categories/technology/useTech";
import { Loader2 } from "lucide-react";

const Programs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: techCoursesData, isLoading } = useTechCourses();

  const apiPrograms = (techCoursesData?.items || []).map((course: any) => ({
    id: course.id,
    title: course.title,
    slug: course.slug || course.id.toString(),
    type: "career_track", // Default for tech category courses
    category: "Software Engineering", // Fallback for API
    short_summary: course.shortDescription,
    description: course.longDescription || course.shortDescription,
    duration: "12 Weeks",
    level: "Beginner",
    deliveryMode: "Online",
    tuition: course.price ? `$${course.price.toLocaleString()}` : "$1,200",
    outcome: "Professional Certificate",
    skills: course.skills || [],
    featured: course.enrolledNum > 5,
    image_url: course.thumbnail,
  }));

  const allPrograms = apiPrograms.length > 0 ? apiPrograms : programs;

  const activeTab =
    (searchParams.get("tab") as "career-tracks" | "short-courses") ||
    "career-tracks";
  const categoryFilter = searchParams.get("category") as Category | null;
  const levelFilter = searchParams.get("level") as Level | null;
  const deliveryFilter = searchParams.get("delivery") as DeliveryMode | null;

  const currentType: ProgramType =
    activeTab === "short-courses" ? "short-course" : "career-track";

  const filteredPrograms = useMemo(() => {
    return allPrograms.filter((program) => {
      // For API programs, we only show them in the 'career-tracks' tab for now
      if (apiPrograms.some((ap) => ap.id === program.id)) {
        if (activeTab !== "career-tracks") return false;
      } else {
        if (program.type !== currentType) return false;
      }

      if (categoryFilter && program.category !== categoryFilter) return false;
      if (levelFilter && program.level !== levelFilter) return false;
      if (deliveryFilter && program.deliveryMode !== deliveryFilter)
        return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          program.title.toLowerCase().includes(query) ||
          program.outcome.toLowerCase().includes(query) ||
          program.skills.some((s) => s.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [
    currentType,
    categoryFilter,
    levelFilter,
    deliveryFilter,
    searchQuery,
    allPrograms,
    activeTab,
  ]);

  const categoriesList =
    activeTab === "short-courses"
      ? getShortCourseCategories()
      : getCareerTrackCategories();

  const programsByCategory = useMemo(() => {
    const grouped: Record<string, typeof programs> = {};
    categoriesList.forEach((cat) => {
      grouped[cat] = filteredPrograms.filter((p) => p.category === cat);
    });
    return grouped;
  }, [filteredPrograms, categoriesList]);

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const setTab = (tab: string) => {
    const newParams = new URLSearchParams();
    if (tab !== "career-tracks") newParams.set("tab", tab);
    setSearchParams(newParams);
    setSearchQuery("");
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams();
    if (activeTab !== "career-tracks") newParams.set("tab", activeTab);
    setSearchParams(newParams);
    setSearchQuery("");
  };

  const hasActiveFilters =
    categoryFilter || levelFilter || deliveryFilter || searchQuery;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[hsl(210,30%,16%)] via-[hsl(215,28%,14%)] to-[hsl(220,25%,11%)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-accent/8 rounded-full blur-[80px]" />
        <div className="container-padding mx-auto max-w-7xl relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-1 bg-secondary rounded-full" />
              <span className="text-secondary font-semibold text-sm">
                Explore Programs
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-accent mb-6">
              Programs & Courses
            </h1>
            <p className="text-xl text-white/70 max-w-2xl leading-relaxed mb-8">
              Explore our comprehensive tech training programs and courses
              designed to advance your career in technology.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                <div>
                  <p className="font-bold text-white">12+</p>
                  <p className="text-sm text-white/60">Training Programs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-bold text-white">6+</p>
                  <p className="text-sm text-white/60">Short Courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs + Filters */}
      <section className="sticky top-20 z-40 bg-[hsl(215,28%,12%)]/95 backdrop-blur-lg border-b border-border py-4 shadow-sm">
        <div className="container-padding mx-auto max-w-7xl">
          {/* Tab Switcher */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex bg-muted rounded-xl p-1">
                <button
                  onClick={() => setTab("career-tracks")}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === "career-tracks"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Career Tracks
                </button>
                <button
                  onClick={() => setTab("short-courses")}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === "short-courses"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Short Courses
                </button>
              </div>

              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <div
                className={`${showFilters ? "flex" : "hidden"} lg:flex flex-wrap gap-2`}
              >
                <Select
                  value={categoryFilter || "all"}
                  onValueChange={(v) =>
                    updateFilter("category", v === "all" ? null : v)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Domains</SelectItem>
                    {categoriesList.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={levelFilter || "all"}
                  onValueChange={(v) =>
                    updateFilter("level", v === "all" ? null : v)
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              <span className="text-sm text-muted-foreground ml-2">
                {filteredPrograms.length} program
                {filteredPrograms.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Catalog */}
      <section className="section-padding min-h-[400px]">
        <div className="container-padding mx-auto max-w-7xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="h-10 w-10 text-accent animate-spin" />
              <p className="text-white/60 animate-pulse font-medium">
                Loading programs...
              </p>
            </div>
          ) : (
            <>
              {" "}
              {/* Start Fragment */}
              {activeTab === "short-courses" &&
                !categoryFilter &&
                !searchQuery && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Short Courses (Stackable)
                    </h2>
                    <p className="text-muted-foreground">
                      Learn one skill fast or stack courses into a complete
                      career path.
                    </p>
                  </div>
                )}
              {categoryFilter || searchQuery ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))}
                  {filteredPrograms.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">
                        No programs match your filters.
                      </p>
                      <Button variant="link" onClick={clearFilters}>
                        Clear filters
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const sideBySide = [
                      "Cybersecurity",
                      "Low-Code & Business Apps",
                    ];
                    const regularCategories = categoriesList.filter(
                      (c) => !sideBySide.includes(c),
                    );
                    const pairedCategories = categoriesList.filter((c) =>
                      sideBySide.includes(c),
                    );

                    return (
                      <>
                        {regularCategories.map((category) => {
                          const categoryPrograms = programsByCategory[category];
                          if (
                            !categoryPrograms ||
                            categoryPrograms.length === 0
                          )
                            return null;
                          return (
                            <DomainSection
                              key={category}
                              category={category}
                              programs={categoryPrograms}
                              showViewAll={false}
                            />
                          );
                        })}
                        {pairedCategories.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {pairedCategories.map((category) => {
                              const categoryPrograms =
                                programsByCategory[category];
                              if (
                                !categoryPrograms ||
                                categoryPrograms.length === 0
                              )
                                return null;
                              return (
                                <div key={category} className="min-w-0">
                                  <DomainSection
                                    category={category}
                                    programs={categoryPrograms}
                                    showViewAll={false}
                                    compact
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Programs;
