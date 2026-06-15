import { useState } from "react";
import { ArrowRight, ChevronLeft, Loader2 } from "lucide-react";
import {
  Code2,
  BarChart3,
  Brain,
  Cloud,
  Layers,
  Shield,
  FolderOpen,
} from "lucide-react";
import { useTechCourses } from "@/hooks/categories/technology/useTech";
import ProgramCard from "@/components/categories/technology/programs/ProgramCard";
import { Button } from "@/components/categories/technology/ui/button";

import heroSoftwareEngineering from "@/assets/categories/technology/hero-software-engineering.jpg";
import heroDataAnalytics from "@/assets/categories/technology/hero-data-analytics.jpg";
import heroAiMl from "@/assets/categories/technology/hero-ai-ml.jpg";
import heroCloudEngineering from "@/assets/categories/technology/hero-cloud-engineering.jpg";
import heroCybersecurity from "@/assets/categories/technology/hero-cybersecurity.jpg";
import heroLowcode from "@/assets/categories/technology/hero-lowcode.jpg";

// ─── Category definitions ────────────────────────────────────────────────────

interface SubCategory {
  name: string;
  icon: React.ElementType;
  gradient: string;
  hoverRing: string;
  image: string;
  keywords: string[];
}

const SUB_CATEGORIES: SubCategory[] = [
  {
    name: "Software Engineering",
    icon: Code2,
    gradient: "from-aliko-orange/80 to-aliko-orange/40",
    hoverRing: "hover:ring-aliko-orange/60",
    image: heroSoftwareEngineering,
    keywords: [
      "software",
      "engineer",
      "engineering",
      "web",
      "frontend",
      "front-end",
      "backend",
      "back-end",
      "fullstack",
      "full-stack",
      "full stack",
      "react",
      "node",
      "javascript",
      "typescript",
      "python",
      "html",
      "css",
      "programming",
      "developer",
      "development",
      "api",
      "database",
      "sql",
      "testing",
      "system design",
      "java",
      "kotlin",
      "swift",
      "php",
      "ruby",
      "golang",
      "rust",
      "c++",
      "c#",
    ],
  },
  {
    name: "Data & Analytics",
    icon: BarChart3,
    gradient: "from-aliko-blue/80 to-aliko-blue/40",
    hoverRing: "hover:ring-aliko-blue/60",
    image: heroDataAnalytics,
    keywords: [
      "data",
      "analytics",
      "analysis",
      "analyst",
      "excel",
      "power bi",
      "tableau",
      "statistics",
      "reporting",
      "dashboard",
      "visualization",
      "etl",
      "data engineering",
      "data pipeline",
      "spark",
      "hadoop",
    ],
  },
  {
    name: "AI & Machine Learning",
    icon: Brain,
    gradient: "from-purple-600/80 to-aliko-blue/40",
    hoverRing: "hover:ring-purple-500/60",
    image: heroAiMl,
    keywords: [
      "artificial intelligence",
      "machine learning",
      "deep learning",
      "neural network",
      "nlp",
      "natural language",
      "computer vision",
      "generative ai",
      "genai",
      "llm",
      "large language model",
      "prompt engineering",
      "ai engineer",
      "ml engineer",
      "tensorflow",
      "pytorch",
      "scikit",
      "regression",
      "classification",
    ],
  },
  {
    name: "Cloud & DevOps",
    icon: Cloud,
    gradient: "from-aliko-blue/80 to-aliko-orange/40",
    hoverRing: "hover:ring-aliko-blue/60",
    image: heroCloudEngineering,
    keywords: [
      "cloud",
      "devops",
      "aws",
      "azure",
      "gcp",
      "google cloud",
      "kubernetes",
      "docker",
      "ci/cd",
      "continuous integration",
      "infrastructure",
      "terraform",
      "ansible",
      "linux",
      "server",
      "deployment",
      "microservices",
    ],
  },
  {
    name: "Low-Code & Business Apps",
    icon: Layers,
    gradient: "from-aliko-orange/80 to-aliko-blue/40",
    hoverRing: "hover:ring-aliko-orange/60",
    image: heroLowcode,
    keywords: [
      "low-code",
      "lowcode",
      "no-code",
      "nocode",
      "power apps",
      "power platform",
      "power automate",
      "dynamics",
      "salesforce",
      "sharepoint",
      "zapier",
      "business apps",
      "app maker",
      "automation",
      "workflow",
    ],
  },
  {
    name: "Cybersecurity",
    icon: Shield,
    gradient: "from-red-700/80 to-aliko-orange/40",
    hoverRing: "hover:ring-red-500/60",
    image: heroCybersecurity,
    keywords: [
      "cybersecurity",
      "security",
      "ethical hacking",
      "penetration testing",
      "pentest",
      "soc",
      "threat",
      "vulnerability",
      "firewall",
      "network security",
      "compliance",
      "encryption",
      "incident response",
      "forensics",
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Return the first matching sub-category name for a course, or "Other".
 * Matches against title + shortDescription + longDescription + category field.
 */
function classifyCourse(course: any): string {
  const haystack = [
    course.title ?? "",
    course.shortDescription ?? "",
    course.longDescription ?? "",
    course.description ?? "",
    course.category ?? "",
  ]
    .join(" ")
    .toLowerCase();

  // Evaluate in an order that prioritizes specific domains before general ones
  // to prevent terms like "engineer" from putting Cloud or Data into Software Engineering
  const evalOrder = [
    "AI & Machine Learning",
    "Cloud & DevOps",
    "Data & Analytics",
    "Cybersecurity",
    "Low-Code & Business Apps",
    "Software Engineering",
  ];

  for (const catName of evalOrder) {
    const cat = SUB_CATEGORIES.find((c) => c.name === catName);
    if (cat && cat.keywords.some((kw) => haystack.includes(kw))) {
      return cat.name;
    }
  }
  return "Other";
}

/** Transform a raw API course into what ProgramCard expects (same shape as Programs.tsx). */
function toProgramShape(course: any): any {
  return {
    id: String(course.id),
    title: course.title,
    slug: course.slug || String(course.id),
    type: "career-track",
    category: course.category || "Software Engineering",
    description: course.longDescription || course.shortDescription || "",
    duration: course.estimatedTime || "12 Weeks",
    level: course.level || "Beginner",
    deliveryMode: course.deliveryMode || "Online",
    tuition: course.price ?? 1200,
    outcome:
      course.outcome || course.shortDescription || "Professional Certificate",
    skills: course.skills || [],
    image_url: course.thumbnail,
    startDate: "Rolling Admission",
    weeklyHours: "10-15 hrs/week",
  };
}

// ─── Sub-component: Category card ────────────────────────────────────────────

interface CategoryCardProps {
  category: SubCategory;
  count: number;
  onClick: () => void;
}

const CategoryCard = ({ category, count, onClick }: CategoryCardProps) => {
  const Icon = category.icon;
  return (
    <button
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden aspect-[4/3] ring-2 ring-transparent ${category.hoverRing} transition-all duration-500 text-left w-full`}
    >
      <img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${category.gradient} via-black/50 to-black/20`}
      />

      <div className="relative h-full flex flex-col justify-end p-5 md:p-6">
        {/* Bottom: title + CTA */}
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white leading-tight mb-2">
            {category.name}
          </h3>
          <span className="inline-flex items-center text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
            Explore
            <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </button>
  );
};

// ─── "Other" category card ────────────────────────────────────────────────────

const OtherCard = ({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="group relative rounded-2xl overflow-hidden aspect-[4/3] ring-2 ring-transparent hover:ring-white/30 transition-all duration-500 text-left w-full bg-white/5 border border-white/10 hover:border-white/20"
  >
    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
      <FolderOpen className="w-32 h-32 text-white" />
    </div>
    <div className="relative h-full flex flex-col justify-end p-5 md:p-6">
      <div>
        <h3 className="text-lg md:text-xl font-bold text-white/80 leading-tight mb-2">
          Other
        </h3>
        <span className="inline-flex items-center text-sm font-semibold text-white/60 group-hover:text-white/80 transition-colors">
          Browse courses
          <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </div>
  </button>
);

// ─── Main component ───────────────────────────────────────────────────────────

const CourseCategorySection = () => {
  const { data: rawCourses = [], isLoading } = useTechCourses();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Skip courses with no useful data
  const courses: any[] = Array.isArray(rawCourses) ? rawCourses : [];

  // Build a map: category name → courses[]
  const grouped = courses.reduce<Record<string, any[]>>((acc, course) => {
    const cat = classifyCourse(course);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(course);
    return acc;
  }, {});

  const selectedCourses = selectedCategory
    ? (grouped[selectedCategory] ?? [])
    : [];

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section className="section-padding bg-gradient-to-b from-[hsl(207,45%,16%)] to-[hsl(207,50%,12%)]">
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="h-10 w-10 text-accent animate-spin" />
          <p className="text-white/60 font-medium animate-pulse">
            Loading tech programs...
          </p>
        </div>
      </section>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  // We want to show categories even if there are 0 total courses

  // ── Course list view (a category was selected) ─────────────────────────────
  if (selectedCategory !== null) {
    return (
      <section className="section-padding bg-gradient-to-b from-[hsl(207,45%,16%)] to-[hsl(207,50%,12%)] border-b border-white/5">
        <div className="container-padding mx-auto max-w-7xl">
          {/* Back + heading */}
          <div className="flex items-center gap-4 mb-10">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors group"
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              All Categories
            </button>
            <span className="text-white/20">/</span>
            <h2 className="text-white font-bold text-xl">{selectedCategory}</h2>
            <span className="text-xs font-black text-white/50 bg-white/10 border border-white/10 px-2.5 py-1 rounded-full">
              {selectedCourses.length}{" "}
              {selectedCourses.length === 1 ? "course" : "courses"}
            </span>
          </div>

          {/* Course grid */}
          {selectedCourses.length === 0 ? (
            <div className="text-center py-20 text-white/40 font-medium">
              No courses available in this category yet.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {selectedCourses.map((course) => (
                <ProgramCard key={course.id} program={toProgramShape(course)} />
              ))}
            </div>
          )}

          {/* Back link at bottom */}
          <div className="mt-10 text-center">
            <Button
              variant="ghost"
              onClick={() => setSelectedCategory(null)}
              className="text-white/50 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to all categories
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // ── Category grid view (default) ───────────────────────────────────────────
  const hasOther = (grouped["Other"]?.length ?? 0) > 0;

  return (
    <section className="section-padding bg-gradient-to-b from-[hsl(207,45%,16%)] to-[hsl(207,50%,12%)] relative border-b border-white/5">
      <div className="container-padding mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-sm font-bold text-secondary uppercase tracking-widest mb-4">
            Explore by Domain
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            {courses.length} courses across {Object.keys(grouped).length}{" "}
            domains — pick a category to see what's available.
          </p>
        </div>

        {/* Category cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {SUB_CATEGORIES.map((cat) => {
            const count = grouped[cat.name]?.length ?? 0;
            return (
              <CategoryCard
                key={cat.name}
                category={cat}
                count={count}
                onClick={() => setSelectedCategory(cat.name)}
              />
            );
          })}

          {hasOther && (
            <OtherCard
              count={grouped["Other"].length}
              onClick={() => setSelectedCategory("Other")}
            />
          )}
        </div>

        {/* Footer hint */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/40">
            Click a category to explore its courses
          </p>
        </div>
      </div>
    </section>
  );
};

export default CourseCategorySection;
