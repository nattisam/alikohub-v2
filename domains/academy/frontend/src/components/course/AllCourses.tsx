import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { courseApi, enrollmentApi } from "../../api/courseApi";
import type { Course } from "../common/types.d";
import { useAuth } from "../../contexts/AuthContext";

import courseImg from "../../assets/courses.png";
import { FaUsers, FaStar } from "react-icons/fa";
import EnrollmentModal from "../instructor/EnrollmentModal";

interface AllCoursesProps {
  className?: string;
  onViewCourseContent?: (courseId: number) => void;
  onEnrollmentComplete?: () => void; // Add this new prop
}

const AllCourses: React.FC<AllCoursesProps> = ({ 
  className = "", 
  onViewCourseContent,
  onEnrollmentComplete // Add this new prop
}) => {
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [courseToEnroll, setCourseToEnroll] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const { user: currentUser } = useAuth();
  
  // Get the query client to manually invalidate queries
  const queryClient = useQueryClient();
  
  const {
    data: courses = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ["all-courses"],
    queryFn: async () => {
      const response = await courseApi.getPublishedCourses();
      const coursesData = response.data.items || response.data;
      return Array.isArray(coursesData) ? coursesData : [];
    },
    staleTime: 5 * 60 * 1000,      // 5 minutes - conservative cache setting
    gcTime: 10 * 60 * 1000,        // 10 minutes - garbage collection time
    refetchOnWindowFocus: false,
    retry: (failureCount, error: { response?: { status: number } }) => {
      // Don't retry on 429 - let axios handle it
      if (error?.response?.status === 429) {
        return false;
      }
      return failureCount < 1;
    },
  });
  
  // Fetch user's enrollments to show which courses are already enrolled
  const {
    data: enrolledCourseIds = [],
    isLoading: enrollmentsLoading
  } = useQuery({
    queryKey: ["user-enrollments", currentUser?.firebaseId],
    queryFn: async () => {
      try {
        const enrollmentResponse = await enrollmentApi.getMyEnrollments();
        return enrollmentResponse.data.map((enrollment: { courseId: number }) => enrollment.courseId);
      } catch (enrollmentError) {
        console.error("Error fetching enrollments:", enrollmentError);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,      // 5 minutes - conservative cache setting
    gcTime: 10 * 60 * 1000,        // 10 minutes - garbage collection time
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!currentUser?.firebaseId, // Only run if user is authenticated
  });
  
  const enrolledCourses = new Set(enrolledCourseIds);

  const handleEnrollClick = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setCourseToEnroll(courseId);
      setShowEnrollmentModal(true);
    }
  };

  const handleEnrollSuccess = async () => {
    // Close the modal first
    setShowEnrollmentModal(false);
    setCourseToEnroll(null);
    setSelectedCourse(null);
    
    // Invalidate the enrollment query to refetch the updated data
    await queryClient.invalidateQueries({ queryKey: ["user-enrollments"] });
    await queryClient.invalidateQueries({ queryKey: ["all-courses"] });
    
    // If there's a onViewCourseContent function, call it to show the course content
    if (courseToEnroll && onViewCourseContent) {
      onViewCourseContent(courseToEnroll);
    }
    
    // Call the enrollment complete callback if provided
    if (onEnrollmentComplete) {
      onEnrollmentComplete();
    }
  };

  if (isLoading || enrollmentsLoading) {
    return (
      <div className={`${className} bg-white rounded-lg shadow p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">All Courses</h2>
        </div>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`${className} bg-white rounded-lg shadow p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">All Courses</h2>
        </div>
        <p className="text-red-500">Failed to load courses</p>
      </div>
    );
  }

  return (
    <div className={`${className} bg-white rounded-lg shadow p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">All Courses</h2>
        <span className="text-gray-500 text-sm">
          {courses.length} courses available
        </span>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No courses available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={courseImg}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                {course.shortDescription && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {course.shortDescription}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <FaUsers className="mr-1" />
                    <span>{course.enrolledNum || 0} students</span>
                  </div>
                  {course.rating && (
                    <div className="flex items-center">
                      <FaStar className="mr-1 text-yellow-500" />
                      <span>{course.rating}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-blue-600">
                    {course.price && course.price > 0 ? `$${course.price}` : "Free"}
                  </div>
                  <div className="flex gap-2">
                    {enrolledCourses.has(course.id) && onViewCourseContent && (
                      <button 
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
                        onClick={() => onViewCourseContent(course.id)}
                      >
                        View Content
                      </button>
                    )}
                    {enrolledCourses.has(course.id) ? (
                      <button 
                        className="bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors cursor-default"
                        disabled
                      >
                        Enrolled
                      </button>
                    ) : (
                      <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                        onClick={() => handleEnrollClick(course.id)}
                        data-prevent-menu-close
                      >
                        Enroll
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Enrollment Modal */}
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
          onEnrollComplete={onEnrollmentComplete} // Pass the callback
        />
      )}
    </div>
  );
}

export default AllCourses;
