import TrendingCourseCard from "./TrendingCourseCard";
import type { Course } from "../common/types.d";
import { useEnrollCourse } from "../../queries/studentCourses";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { enrollmentApi } from "../../api/enrollmentApi";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import AuthPromptModal from "../auth/AuthPromptModal";

const TrendingCourses = ({ courses }: { courses: Course[] }) => {
  const enrollCourseMutation = useEnrollCourse();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<{
    id: number;
    title: string;
  } | null>(null);

  // Fetch user's enrolled courses
  const { data: enrolledCourses = [] } = useQuery({
    queryKey: ["userEnrollments", currentUser?.firebaseId],
    queryFn: async () => {
      if (!currentUser) return [];
      try {
        const response = await enrollmentApi.getMyCourses();
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        return [];
      }
    },
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check if user is enrolled in a specific course
  const isUserEnrolled = (courseId: number) =>
    enrolledCourses.some((enrollment: any) => enrollment.id === courseId);

  const validCourses = Array.isArray(courses) ? courses : [];

  const handleEnroll = (courseId: number) => {
    if (currentUser) {
      const userActiveRole =
        currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
      if (userActiveRole === "STUDENT" || currentUser.globalRole === "USER") {
        if (isUserEnrolled(courseId)) {
          navigate("/dashboard");
          return;
        }
        enrollCourseMutation.mutate(courseId);
      } else {
        alert(
          "Only students can enroll in courses. Please switch to student role.",
        );
      }
    } else {
      setSelectedCourse({
        id: courseId,
        title:
          validCourses.find((c) => c.id === courseId)?.title || "this course",
      });
    }
  };

  const handleViewDetails = (courseId: number, title: string) => {
    if (currentUser) {
      navigate(`/courses/${courseId}`);
    } else {
      setSelectedCourse({ id: courseId, title });
    }
  };

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-center text-2xl md:text-4xl font-bold text-gray-800 mb-4">
          Most Popular <span className="text-[#17469E]">Courses</span>
        </h2>

        <p className="text-center mt-4 text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
          AlikoHub is building Africa's digital future—uniting education, global
          consultancy, and smart construction tools under one seamless platform.
        </p>

        <div className="mt-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 md:gap-10 px-2 md:px-4">
            {validCourses.length > 0 ? (
              validCourses.map((course) => (
                <TrendingCourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={isUserEnrolled(course.id)}
                  onEnroll={() => handleEnroll(course.id)}
                  onViewDetails={() =>
                    handleViewDetails(course.id, course.title)
                  }
                />
              ))
            ) : (
              <p className="text-center w-full py-6 text-gray-400">
                No trending courses available
              </p>
            )}
          </div>
        </div>
      </div>

      <AuthPromptModal
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        courseTitle={selectedCourse?.title}
        courseId={selectedCourse?.id}
      />
    </section>
  );
};

export default TrendingCourses;
