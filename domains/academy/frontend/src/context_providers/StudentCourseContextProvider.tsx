import React, { useContext, useEffect, useState } from "react";
import type { Course } from "../components/types.d";
import { StudentCourseContext } from "../contexts/StudentCoursesContext";
import { useAuth } from "../contexts/AuthContext";
import { enrollmentApi } from "../api/enrollmentApi";
import { courseApi } from "../api/courseApi";

// Helper function to convert enrollment course data to Course interface
const convertEnrollmentCourseToCourse = (enrollmentCourse: any): Course => {
  return {
    id: enrollmentCourse.id,
    title: enrollmentCourse.title,
    longDescription: enrollmentCourse.shortDescription || "",
    shortDescription: enrollmentCourse.shortDescription || "",
    thumbnail: enrollmentCourse.thumbnail,
    category: enrollmentCourse.category as "Technology" | "STEM" | "Health",
    instructorId: "", // This will be filled when we fetch full course data
    status: "PUBLISHED",
    skills: [],
    conceptsLearned: [],
    estimatedTime: null,
    targetLevel: enrollmentCourse.level || null,
    enrolledNum: 0,
    rating: enrollmentCourse.rating || null,
    price: enrollmentCourse.price || null,
    progress: null,
    prerequisites: [],
    languages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    instructor: {
      id: 0,
      firebaseId: "",
      firstname: "",
      lastname: "",
      email: "",
      globalRole: "USER",
      role: "INSTRUCTOR",
      bio: null,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  };
};

export const StudentCoursesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user: currentUser } = useAuth();
  const [trendingCourses, setTrendingCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  
  const enrollCourse = async (courseId: number) => {
    try {
      // For direct enrollment without cohort selection
      const enrollmentData = {
        courseId: courseId
        // No cohortId specified for direct enrollment
      };
      
      console.log("Enrollment data being sent:", enrollmentData);
      
      const response = await enrollmentApi.createEnrollment(enrollmentData);
      console.log("Enrollment successful:", response.data);
      
      // Show success message
      alert("Successfully enrolled in the course!");
      
      // Update the course enrollment count
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === courseId 
            ? { ...course, enrolledNum: (course.enrolledNum || 0) + 1 }
            : course
        )
      );
      
      // Refresh enrolled courses
      if (currentUser) {
        await getEnrolledCourses(currentUser.firebaseId);
      }
      
      return true;
    } catch (e: any) {
      console.error("Enrollment failed:", e);
      
      // Provide more specific error messages
      if (e.response?.status === 409) {
        alert("You are already enrolled in this course!");
      } else if (e.response?.status === 404) {
        alert("Course not found. Please try again.");
      } else if (e.response?.status === 403) {
        alert("You don't have permission to enroll in this course.");
      } else {
        alert("Enrollment failed. Please try again later.");
      }
      
      return false;
    }
  };
  
  const getEnrolledCourses = async (userId: string): Promise<void> => {
    try {
      const response = await enrollmentApi.getEnrollmentsByUserId(userId);
      // Extract course data from the enrollment response and convert to Course interface
      const coursesData = response.data.map(enrollment => 
        convertEnrollmentCourseToCourse(enrollment.course)
      );
      setEnrolledCourses(coursesData);
    } catch (e) {
      console.error("Failed to fetch enrolled courses:", e);
      setEnrolledCourses([]);
    }
  };
  
  const getSimilarCourses = (refCourse: Course): Course[] => {
    if (!Array.isArray(courses)) return [];
    
    return courses.filter(course => {
      if (course.category === refCourse.category && course.id !== refCourse.id) {
        return refCourse.skills.some(skill => course.skills.includes(skill));
      }
      return false;
    });
  };
  
  const getTrendingCourses = async (): Promise<void> => {
    try {
      // For now, we'll use the regular courses endpoint as trending courses
      // In a real implementation, this would be a separate endpoint
      // Only fetch published courses for trending
      const response = await courseApi.getCourses({ status: "PUBLISHED" });
      // Handle either { items: Course[] } or Course[]
      const payload = (response.data && response.data.items) ? response.data.items : response.data;
      const coursesData = Array.isArray(payload) ? payload : [];
      setTrendingCourses(coursesData.slice(0, 5));
    } catch (e) {
      console.error("Failed to fetch trending courses:", e);
      setTrendingCourses([]);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Only fetch published courses for the homepage
        const response = await courseApi.getCourses({ status: "PUBLISHED" });
        // Handle either { items: Course[] } or Course[]
        const payload = (response.data && response.data.items) ? response.data.items : response.data;
        setCourses(Array.isArray(payload) ? payload : []);
      } catch (e) {
        console.error("Failed to fetch courses:", e);
        setCourses([]);
      }
    };
    
    fetchCourses();
    getTrendingCourses();
  }, []);
  
  useEffect(() => {
    if (currentUser) {
      getEnrolledCourses(currentUser.firebaseId);
    }
  }, [currentUser]);
  
  return (
    <StudentCourseContext.Provider
      value={{ 
        courses: Array.isArray(courses) ? courses : [],
        trendingCourses: Array.isArray(trendingCourses) ? trendingCourses : [],
        setCourses, 
        enrollCourse, 
        getSimilarCourses, 
        enrolledCourses: Array.isArray(enrolledCourses) ? enrolledCourses : []
      }}
    >
      {children}
    </StudentCourseContext.Provider>
  );
};