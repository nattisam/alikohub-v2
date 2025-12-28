import { useEffect, useState } from "react";
import type { Course, ITeachingSchedule } from "../components/types.d";
import { InstructorCourseContext } from "../contexts/InstructorCourseContext";
import { academyApi } from "../api";
import { useAuth } from "../contexts/AuthContext";

export const InstructorCoursesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { user: currentUser } = useAuth();
  const [creatingCourse, setCreatingCourse] = useState({
    loading: false,
    error: false,
    errorMessage: "",
  });
  const [teachingSchedules, setTeachingSchedules] = useState<
    ITeachingSchedule[]
  >([]);
  const [updatingCourse, setUpdatingCourse] = useState({
    loading: false,
    error: false,
    errorMessage: "",
  });
  const [removingCourse, setRemovingCourse] = useState({
    loading: false,
    error: false,
    errorMessage: "",
  });
  const [courses, setCourses] = useState<Course[]>([]);

  // Fetch teaching schedules from backend
  const fetchTeachingSchedules = async () => {
    try {
      const response = await academyApi.get("/academy/teaching-schedules/instructor");
      setTeachingSchedules(response.data);
    } catch (error) {
      console.error("Error fetching teaching schedules:", error);
      // Fallback to empty array for non-instructors, mock data for others
      // Check if it's a 403/401 error which indicates user doesn't have permission
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        // User doesn't have permission (not an instructor), set empty array
        setTeachingSchedules([]);
      } else {
        // Other error, fallback to mock data
        const mockSchedules: ITeachingSchedule[] = [
          {
            title: "AWS Fundamentals",
            startTime: "2025-09-19T04:45:00.000z",
            endTime: "2025-09-19T08:45:00.000z",
            type: "Live",
          },
          {
            title: "Cloud Security",
            startTime: "2025-09-19T06:45:00.000z",
            endTime: "2025-09-19T08:45:00.000z",
            type: "Q&A",
          },
          {
            title: "DevOps Essentials",
            startTime: "2025-09-20T06:45:00.000z",
            endTime: "2025-09-20T08:45:00.000z",
            type: "Recording",
          },
          {
            title: "DevOps Essentials",
            startTime: "2025-09-21T06:45:00.000z",
            endTime: "2025-09-21T08:45:00.000z",
            type: "Recording",
          },
        ];
        setTeachingSchedules(mockSchedules);
      }
    }
  };

  const addTeachingSchedules = (teachingSchedule: ITeachingSchedule) => {
    setTeachingSchedules((prev) => [...prev, teachingSchedule]);
  };

  // Fetch courses from backend based on user role
  const fetchCourses = async () => {
    try {
      if (!currentUser) return;
      
      let response;
      
      if (currentUser.academyRole === 'INSTRUCTOR') {
        // Fetch courses where the current user is the instructor
        response = await academyApi.get("/academy/courses", {
          params: { instructorId: currentUser.firebaseId }
        });
      } else if (currentUser.academyRole === 'ADMIN') {
        // Admin can see all courses
        response = await academyApi.get("/courses");
      } else {
        // For students or other roles, return empty array for now
        setCourses([]);
        return;
      }
      
      // Handle different response formats
      const coursesData = response.data.items || response.data;
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      // Fallback to empty array if API fails
      setCourses([]);
    }
  };

  const createCourse = async (newCourse: Partial<Course>) => {
    try {
      setCreatingCourse({ loading: true, error: false, errorMessage: "" });
      
      // Log the incoming course data for debugging
      console.log("InstructorCourseContextProvider - Creating course with data:", newCourse);
      
      // Prepare the course data according to CreateCourseDto
      const courseData = {
        title: newCourse.title || "",
        shortDescription: newCourse.shortDescription || "",
        longDescription: newCourse.longDescription || "",
        thumbnail: newCourse.thumbnail || "", // Add thumbnail property
        category: newCourse.category || "Technology",
        // Set status to PUBLISHED by default so courses appear on homepage immediately
        status: "PUBLISHED",
        skills: newCourse.skills || [],
        conceptsLearned: newCourse.conceptsLearned || [],
        estimatedTime: newCourse.estimatedTime || undefined,
        targetLevel: newCourse.targetLevel || undefined,
        prerequisites: newCourse.prerequisites || [],
        languages: newCourse.languages || [],
        // Include the createDefaultCohort property
        createDefaultCohort: newCourse.createDefaultCohort || false,
      };
      
      const response = await academyApi.post("/courses", courseData);
      
      if (response.data) {
        const course = response.data;
        setCourses((prevCourses) => [...prevCourses, course as Course]);
        // Refresh the courses list to ensure consistency
        fetchCourses();
        return course.id;
      }
      return -1;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to create course";
      setCreatingCourse((prev) => ({ ...prev, error: true, errorMessage }));
      console.error("Error creating course:", error);
      return -1;
    } finally {
      setCreatingCourse((prev) => ({ ...prev, loading: false }));
    }
  };

  const updateCourse = async (updatedCourse: Partial<Course>) => {
    try {
      setUpdatingCourse({ loading: true, error: false, errorMessage: "" });
      
      // Log the incoming update data for debugging
      console.log("InstructorCourseContextProvider - Updating course with data:", updatedCourse);
      
      // Prepare the update data according to UpdateCourseDto
      const updateData = {
        title: updatedCourse.title,
        shortDescription: updatedCourse.shortDescription,
        longDescription: updatedCourse.longDescription,
        thumbnail: updatedCourse.thumbnail, // Add thumbnail property
        category: updatedCourse.category,
        status: updatedCourse.status,
        skills: updatedCourse.skills,
        conceptsLearned: updatedCourse.conceptsLearned,
        estimatedTime: updatedCourse.estimatedTime,
        targetLevel: updatedCourse.targetLevel,
        prerequisites: updatedCourse.prerequisites,
        languages: updatedCourse.languages,
      };
      
      const response = await academyApi.patch(`/courses/${updatedCourse.id}`, updateData);
      
      if (response.data) {
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === updatedCourse.id ? ({ ...response.data } as Course) : course
          )
        );
        // Refresh the courses list to ensure consistency
        fetchCourses();
        return true;
      }
      return false;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update course";
      setUpdatingCourse((prev) => ({ ...prev, error: true, errorMessage }));
      console.error("Error updating course:", error);
      return false;
    } finally {
      setUpdatingCourse((prev) => ({ ...prev, loading: false }));
    }
  };

  const removeCourse = async (courseId: number) => {
    try {
      setRemovingCourse({ loading: true, error: false, errorMessage: "" });
      await academyApi.delete(`/courses/${courseId}`);
      
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== courseId)
      );
      // Refresh the courses list to ensure consistency
      fetchCourses();
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete course";
      setRemovingCourse((prev) => ({ ...prev, error: true, errorMessage }));
      console.error("Error removing course:", error);
      return false;
    } finally {
      setRemovingCourse((prev) => ({ ...prev, loading: false }));
    }
  };

  // Load data when component mounts or user changes - only for instructors and admins
  useEffect(() => {
    if (currentUser && (currentUser.academyRole === 'INSTRUCTOR' || currentUser.academyRole === 'ADMIN')) {
      fetchCourses();
      fetchTeachingSchedules();
    } else {
      // For non-instructors, set empty arrays to prevent errors
      setCourses([]);
      setTeachingSchedules([]);
    }
  }, [currentUser]);

  return (
    <InstructorCourseContext.Provider
      value={{
        creatingCourse,
        removingCourse,
        updatingCourse,
        courses,
        createCourse,
        updateCourse,
        teachingSchedules,
        addTeachingSchedules,
        removeCourse,
      }}
    >
      {children}
    </InstructorCourseContext.Provider>
  );
};