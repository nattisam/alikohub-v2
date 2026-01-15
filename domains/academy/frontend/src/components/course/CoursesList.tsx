import { useEnrollCourse } from "../../queries/studentCourses";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CourseCard from "../student/StudentCourseCard";
import type { Course } from "../types.d";
import { enrollmentApi } from "../../api/enrollmentApi";
import { useQuery } from "@tanstack/react-query";

const CoursesList = ({
  courses,
  category,
}: {
  courses: Course[];
  category: string;
}) => {
  const cardWidth = window.innerWidth / 4;
  const enrollCourseMutation = useEnrollCourse();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Fetch user's enrolled courses
  const { data: enrolledCourses = [], isLoading: enrolledCoursesLoading } = useQuery({
    queryKey: ['userEnrollments', currentUser?.firebaseId],
    queryFn: async () => {
      if (!currentUser) return [];
      try {
        const response = await enrollmentApi.getMyCourses();
        return Array.isArray(response.data.items) ? response.data.items : response.data;
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

  return (
    <section className="py-4">
      <h2 className="font-semibold md:text-2xl  px-5 my-3">{category}</h2>
      <div className="overflow-x-scroll p-4 mx-4 md:mx-20  flex gap-10">
        {validCourses.length > 0 ? (
          validCourses.map((course) => (
            <CourseCard
              key={course.id}
              className={`rounded-xl overflow-clip min-w-[16rem] md:w-[${cardWidth}] flex flex-col justify-between bg-[#F5F8F3] shadow-md shadow-black`}
              course={course}
              isEnrolled={isUserEnrolled(course.id)}
              onEnroll={() => {
                if (currentUser) {
                  // Check if user has student active role
                  const userActiveRole = currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
                  if (userActiveRole === 'STUDENT' || currentUser.globalRole === 'USER') {
                    // Check if user is already enrolled in this course
                    if (isUserEnrolled(course.id)) {
                      // If already enrolled, redirect to dashboard
                      navigate("/dashboard");
                      return;
                    }
                    enrollCourseMutation.mutate(course.id);
                  } else {
                    alert("Only students can enroll in courses. Please switch to student role.");
                  }
                } else {
                  // Redirect to login page for unauthenticated users
                  navigate("/auth/login");
                }
              }}
            />
          ))
        ) : (
          <p className="text-gray-500 py-4">No courses available in this category</p>
        )}
      </div>
    </section>
  );
};

export default CoursesList;