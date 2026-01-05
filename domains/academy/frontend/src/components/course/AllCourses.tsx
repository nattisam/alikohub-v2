import { useState, useEffect } from "react";
import { courseApi, enrollmentApi } from "../../api/courseApi";
import type { Course } from "../types.d";
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState<number | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<number>>(new Set());
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [courseToEnroll, setCourseToEnroll] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);

  useEffect(() => {
    const fetchCoursesAndEnrollments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all courses
        const response = await courseApi.getCourses();
        console.log("Courses API Response:", response);
        const coursesData = response.data.items || response.data;
        setCourses(coursesData);
        
        // Fetch user's enrollments to show which courses are already enrolled
        try {
          const enrollmentResponse = await enrollmentApi.getMyEnrollments();
          const enrolledCourseIds = new Set(
            enrollmentResponse.data.map((enrollment: any) => enrollment.courseId)
          );
          setEnrolledCourses(enrolledCourseIds);
        } catch (enrollmentError) {
          console.error("Error fetching enrollments:", enrollmentError);
        }
      } catch (err: any) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndEnrollments();
  }, []);

  const handleEnrollClick = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setCourseToEnroll(courseId);
      setShowEnrollmentModal(true);
    }
  };

  const handleEnrollSuccess = () => {
    // Update the enrolled courses state
    if (courseToEnroll) {
      setEnrolledCourses(prev => new Set(prev).add(courseToEnroll));
    }
    
    // If there's a onViewCourseContent function, call it to show the course content
    if (courseToEnroll && onViewCourseContent) {
      // Close the modal first
      setShowEnrollmentModal(false);
      setCourseToEnroll(null);
      setSelectedCourse(null);
      
      // Then show the course content
      onViewCourseContent(courseToEnroll);
    }
    
    // Call the enrollment complete callback if provided
    if (onEnrollmentComplete) {
      onEnrollmentComplete();
    }
  };

  const handleConfirmEnroll = async () => {
    if (courseToEnroll === null) return;
    
    setEnrolling(courseToEnroll);
    
    try {
      // Simplified enrollment - just need courseId, backend will handle cohort logic
      const enrollmentData = {
        courseId: courseToEnroll
        // No need to specify cohortId, backend will allow direct course enrollment
      };
      
      console.log("Enrollment data being sent:", enrollmentData);
      
      // Try to enroll
      const enrollResponse = await enrollmentApi.createEnrollment(enrollmentData);
      console.log("Enrollment response:", enrollResponse);
      
      // Update the enrolled courses state
      setEnrolledCourses(prev => new Set(prev).add(courseToEnroll));
      
      // Show success message
      alert("Successfully enrolled in the course!");
    } catch (err: any) {
      console.error("Error enrolling in course:", err);
      console.error("Error response:", err.response);
      
      // Try to get a more detailed error message
      let errorMessage = "Failed to enroll in course. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`Failed to enroll in course: ${errorMessage}`);
    } finally {
      setEnrolling(null);
      setCourseToEnroll(null);
      setSelectedCourse(null);
    }
  };

  if (loading) {
    return (
      <div className={`${className} bg-white rounded-lg shadow p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">All Courses</h2>
        </div>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-white rounded-lg shadow p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">All Courses</h2>
        </div>
        <p className="text-red-500">{error}</p>
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
                        disabled={enrolling === course.id}
                        data-prevent-menu-close
                      >
                        {enrolling === course.id ? "Enrolling..." : "Enroll"}
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
