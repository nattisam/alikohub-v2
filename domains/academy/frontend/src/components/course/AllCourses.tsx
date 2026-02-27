import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { courseApi, enrollmentApi } from "../../api/courseApi";
import type { Course } from "../common/types.d";
import { useAuth } from "../../contexts/AuthContext";

import {
  Users,
  Star,
  BookOpen,
  ChevronRight,
  CheckCircle,
  Play,
} from "lucide-react";
import EnrollmentModal from "../instructor/EnrollmentModal";
import { getCourseImageUrl } from "../../utils/imageUtils";

interface AllCoursesProps {
  className?: string;
  onViewCourseContent?: (courseId: number) => void;
  onEnrollmentComplete?: () => void;
}

const AllCourses: React.FC<AllCoursesProps> = ({
  className = "",
  onViewCourseContent,
  onEnrollmentComplete,
}) => {
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [courseToEnroll, setCourseToEnroll] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: courses = [],
    isLoading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ["all-courses"],
    queryFn: async () => {
      const response = await courseApi.getPublishedCourses();
      const responseData = response?.data;
      const coursesData = responseData?.items || responseData;
      return Array.isArray(coursesData) ? coursesData : [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const shouldShowError =
    isError &&
    (queryError as any)?.response?.status !== 404 &&
    (queryError as any)?.response?.status !== 401;

  const { data: enrolledCourseIds = [], isLoading: enrollmentsLoading } =
    useQuery({
      queryKey: ["user-enrollments", currentUser?.firebaseId],
      queryFn: async () => {
        try {
          const enrollmentResponse = await enrollmentApi.getMyEnrollments();
          return enrollmentResponse.data.map(
            (enrollment: { courseId: number }) => enrollment.courseId,
          );
        } catch (enrollmentError) {
          console.error("Error fetching enrollments:", enrollmentError);
          return [];
        }
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: !!currentUser?.firebaseId,
    });

  const enrolledCourses = new Set(enrolledCourseIds);

  const handleEnrollClick = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setCourseToEnroll(courseId);
      setShowEnrollmentModal(true);
    }
  };

  const handleEnrollSuccess = async () => {
    setShowEnrollmentModal(false);
    setCourseToEnroll(null);
    setSelectedCourse(null);
    await queryClient.invalidateQueries({ queryKey: ["user-enrollments"] });
    await queryClient.invalidateQueries({ queryKey: ["all-courses"] });
    if (courseToEnroll && onViewCourseContent) {
      onViewCourseContent(courseToEnroll);
    }
    if (onEnrollmentComplete) {
      onEnrollmentComplete();
    }
  };

  if (isLoading || enrollmentsLoading) {
    return (
      <div
        className={`${className} bg-white rounded-lg shadow-sm border border-gray-100 p-8 flex items-center justify-center`}
      >
        <div className="animate-spin h-6 w-6 border-b-2 border-[#3E92D1] rounded-full" />
      </div>
    );
  }

  if (shouldShowError) {
    return (
      <div
        className={`${className} bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center`}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to load courses
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          There was an issue fetching the course list.
        </p>
        <button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["all-courses"] })
          }
          className="text-[#3E92D1] font-semibold text-sm hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${className} bg-white rounded-lg shadow-sm border border-gray-100 p-6`}
    >
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">All Courses</h2>
          <p className="text-xs text-gray-400 mt-1">
            Explore our latest available training programs
          </p>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
          {courses.length} courses
        </span>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-100 mb-4" />
          <p className="text-gray-500 font-medium">
            No courses available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className="h-44 overflow-hidden relative">
                {course.thumbnail ? (
                  <img
                    src={getCourseImageUrl(course.thumbnail)}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                    <BookOpen size={40} className="text-gray-200" />
                  </div>
                )}
                <div className="absolute bottom-3 right-3">
                  <span className="bg-[#3E92D1] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                    {course.category || "General"}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-[#3E92D1] transition-colors leading-tight">
                  {course.title}
                </h3>

                <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium mb-4">
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>{course.enrolledNum || 0} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star
                      size={12}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <span>{course.rating || "5.0"}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="text-lg font-bold text-gray-900">
                    {course.price && course.price > 0
                      ? `$${(course.price / 100).toFixed(2)}`
                      : "Free"}
                  </div>

                  <div className="flex gap-2">
                    {enrolledCourses.has(course.id) && onViewCourseContent ? (
                      <button
                        className="bg-[#3E92D1] hover:bg-[#327aae] text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                        onClick={() => onViewCourseContent(course.id)}
                      >
                        <Play size={10} className="fill-current" />
                        Learn
                      </button>
                    ) : enrolledCourses.has(course.id) ? (
                      <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold bg-green-50 px-3 py-1.5 rounded-md">
                        <CheckCircle size={12} />
                        Enrolled
                      </span>
                    ) : (
                      <button
                        className="bg-white hover:bg-gray-50 text-[#3E92D1] border border-[#3E92D1] px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5"
                        onClick={() => handleEnrollClick(course.id)}
                      >
                        Enroll
                        <ChevronRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEnrollmentModal && selectedCourse && courseToEnroll && (
        <EnrollmentModal
          courseId={courseToEnroll}
          courseTitle={selectedCourse.title}
          onClose={() => {
            setShowEnrollmentModal(false);
            setCourseToEnroll(null);
            setSelectedCourse(null);
          }}
          onEnrollSuccess={handleEnrollSuccess}
          onEnrollComplete={onEnrollmentComplete}
        />
      )}
    </div>
  );
};

export default AllCourses;
