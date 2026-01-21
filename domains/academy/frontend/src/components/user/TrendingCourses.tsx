import TrendingCourseCard from "./TrendingCourseCard";
import type { Course } from "../common/types.d";
import { useEnrollCourse } from "../../queries/studentCourses";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { enrollmentApi } from "../../api/enrollmentApi";
import { useQuery } from "@tanstack/react-query";

const TrendingCourses = ({ courses }: { courses: Course[] }) => {
  const enrollCourseMutation = useEnrollCourse();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Fetch user's enrolled courses
  const { data: enrolledCourses = [] } = useQuery({
    queryKey: ['userEnrollments', currentUser?.firebaseId],
    queryFn: async () => {
      if (!currentUser) return [];
      try {
        const response = await enrollmentApi.getMyCourses();
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        return [];
      }
    },
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Function to check if user is enrolled in a specific course
  const isUserEnrolled = (courseId: number) => {
    return enrolledCourses.some((enrollment: any) => enrollment.id === courseId);
  };
  
  // Ensure courses is an array
  const validCourses = Array.isArray(courses) ? courses : [];

  const handleEnroll = (courseId: number) => {
    if (currentUser) {
      // Check if user has student active role
      const userActiveRole = currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
      if (userActiveRole === 'STUDENT' || currentUser.globalRole === 'USER') {
        // Check if user is already enrolled in this course
        if (isUserEnrolled(courseId)) {
          // If already enrolled, redirect to dashboard
          navigate("/dashboard");
          return;
        }
        enrollCourseMutation.mutate(courseId);
      } else {
        alert("Only students can enroll in courses. Please switch to student role.");
      }
    } else {
      // Redirect to login page for unauthenticated users
      navigate("/auth/login");
    }
  };

  return (
    <section className="">
      <h2 className="text-center text-2xl lg:text-4xl font-extrabold mt-4">
        Trending Now
      </h2>
      <p className="text-center my-5 text-gray-400 w-[90%] md:w-[50%] mx-auto text-sm ">
        AlikoHub is building Africa's digital future—uniting education, global
        consultancy, and smart construction tools under one seamless platform.
      </p>
      <div className="overflow-x-scroll mx-4 px-1 md:py-4 md:mx-20 flex gap-2 md:gap-10">
        {validCourses.length > 0 ? (
          validCourses.map((course) => (
            <TrendingCourseCard
              key={course.id}
              course={course}
              isEnrolled={isUserEnrolled(course.id)}
              onEnroll={() => handleEnroll(course.id)}
            />
          ))
        ) : (
          <p className="text-center w-full py-4 text-gray-500">No trending courses available</p>
        )}
      </div>
    </section>
  );
};

export default TrendingCourses;