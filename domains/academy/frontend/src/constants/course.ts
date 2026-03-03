/**
 * Constants for course-related data.
 */
export const COURSE_CATEGORIES = [
  "Technology",
  "STEM",
  "Health",
] as const;

export const DEFAULT_CATEGORIES = ["STEM", "Technology", "Health"];

export type CourseCategory = (typeof COURSE_CATEGORIES)[number];

export const COURSE_LOGOS: Record<string, string> = {
  STEM: "/stemLogo.jpg",
  Technology: "/techLogo.jpg",
  Tech: "/techLogo.jpg",
  Health: "/healthLogo.jpg",
};

export const COURSE_HERO_IMAGES: Record<string, string> = {
  STEM: "/stemHero.jpg",
  Technology: "/techHero.jpg",
  Health: "/healthHero.jpg",
};

export const COURSE_BRAND_COLORS: Record<
  string,
  { accent: string; btn: string }
> = {
  STEM: {
    accent: "text-[#3B82F6]",
    btn: "bg-[#3B82F6] hover:bg-[#2563EB]",
  },
  Technology: {
    accent: "text-[#F0802D]",
    btn: "bg-[#F0802D] hover:bg-[#d97328]",
  },
  Health: {
    accent: "text-[#00A89E]",
    btn: "bg-[#00A89E] hover:bg-[#008c83]",
  },
};
