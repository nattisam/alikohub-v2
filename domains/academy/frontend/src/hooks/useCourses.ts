import { useState, useEffect } from "react";
import type { Course } from "../components/types.d";
import { courseApi } from "../api/courseApi";

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoursesAndCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all published courses
        const response = await courseApi.getCourses({ status: "PUBLISHED" });
        
        // Handle different response formats
        const coursesData = response.data.items || response.data;
        const fetchedCourses = Array.isArray(coursesData) ? coursesData : [];
        
        setCourses(fetchedCourses);
        
        // Extract unique categories from the fetched courses
        // Only include valid categories that match the expected types
        const validCategories = ['Technology', 'STEM', 'Health'];
        const uniqueCategories = Array.from(
          new Set(
            fetchedCourses
              .map(course => course.category)
              .filter((category): category is string => 
                typeof category === 'string' && 
                category.length > 0 && 
                validCategories.includes(category)
              )
          )
        );
        
        setCategories(uniqueCategories);
        
      } catch (error: any) {
        console.error("Failed to fetch courses:", error);
        
        // Check if it's a 401 error (unauthorized)
        if (error?.response?.status === 401) {
          setError("Please log in to view courses.");
          // Fallback to default categories if not authenticated
          setCategories(["Technology", "STEM", "Health"]);
        } else {
          setError("Failed to load courses. Please try again later.");
          // Fallback to default categories if API fails
          setCategories(["Technology", "STEM", "Health"]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndCategories();
  }, []);

  const filterCoursesByCategory = (targetCategory: string) => {
    // Only include courses with valid categories
    const validCategories = ['Technology', 'STEM', 'Health'];
    return courses.filter((course) => {
      if (!course.category || !validCategories.includes(course.category)) return false;
      return course.category.toLowerCase() === targetCategory.toLowerCase();
    });
  };

  return { courses, categories, loading, error, filterCoursesByCategory };
};