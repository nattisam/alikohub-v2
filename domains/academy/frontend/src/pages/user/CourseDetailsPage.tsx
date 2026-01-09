import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import { enrollmentApi } from "../../api/enrollmentApi";
import { useAuth } from "../../contexts/AuthContext";
import { useCourse } from "../../queries/courseQueries";
import { useCourseModulesOnly } from "../../queries/moduleDetailQueries";
import type { Course, Enrollment, CourseModule, CourseLesson } from "../../components/common/types.d";
import { FaStar, FaUsers, FaClock, FaTag, FaBook, FaUser, FaPlay, FaFilePdf, FaVideo } from "react-icons/fa";

const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [enrolling, setEnrolling] = useState(false);
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const { data: course, isLoading, isError, error: queryError } = useCourse(parseInt(courseId || '0'));

  // Check if user has selected a role
  const hasRole = currentUser?.academyRole !== undefined;
  const isStudent = currentUser?.academyRole === 'STUDENT';
  
  // Check if user is already enrolled
  // Since the Course type doesn't include enrollments, we'll need to fetch them separately
  const [userEnrollments, setUserEnrollments] = useState<Enrollment[]>([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);

  // State for modules and lessons
  const [lessonsByModule, setLessonsByModule] = useState<Record<number, CourseLesson[]>>({});


  
  // Fetch user enrollments
  useEffect(() => {
    const fetchUserEnrollments = async () => {
      if (currentUser) {
        try {
          const response = await enrollmentApi.getMyCourses();
          // Handle response structure: if data has items array, use it, otherwise use data directly
          if (response.data.items && Array.isArray(response.data.items)) {
            setUserEnrollments(response.data.items);
          } else {
            // If response is directly the array of enrollments
            setUserEnrollments(response.data);
          }
        } catch (err) {
          console.error("Error fetching user enrollments:", err);
        } finally {
          setEnrollmentsLoading(false);
        }
      } else {
        setEnrollmentsLoading(false);
      }
    };
    
    fetchUserEnrollments();
  }, [currentUser]);

  const { data: modulesFromQuery = [], isLoading: areModulesLoading, isError: modulesError } = useCourseModulesOnly(parseInt(courseId || '0'));
  
  if (modulesError) {
    console.error("Error fetching course modules");
  }

  const handleEnroll = async () => {
    if (!currentUser) {
      navigate("/auth/login");
      return;
    }

    // Check if user has selected a role
    if (!hasRole) {
      alert("Please select a role before enrolling in courses.");
      navigate("/role");
      return;
    }

    // Check if user is a student
    if (!isStudent) {
      alert("Only students can enroll in courses. Please select the student role.");
      navigate("/role");
      return;
    }

    try {
      setEnrolling(true);
      // Create enrollment for the current user
      const response = await enrollmentApi.createEnrollment({
        courseId: parseInt(courseId || "0"),
      });
      
      if (response.status === 201) {
        // Show success message
        alert("Successfully enrolled in the course!");
        
        // Also refresh user enrollments to update the isEnrolled state
        const enrollmentResponse = await enrollmentApi.getMyCourses();
        // Handle response structure: if data has items array, use it, otherwise use data directly
        if (enrollmentResponse.data.items && Array.isArray(enrollmentResponse.data.items)) {
          setUserEnrollments(enrollmentResponse.data.items);
        } else {
          // If response is directly the array of enrollments
          setUserEnrollments(enrollmentResponse.data);
        }
      }
    } catch (err: any) {
      console.error("Error enrolling in course:", err);
      
      // Check for specific error types
      if (err.response?.status === 409) {
        alert("You are already enrolled in this course.");
      } else {
        alert("Failed to enroll in course. " + (err.response?.data?.message || "Please try again."));
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading course details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Course</h2>
            <p className="text-red-600 mb-4">Failed to load course details. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">Course Not Found</h2>
            <p className="text-yellow-600 mb-4">The course you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/courses"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block"
            >
              Browse All Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isEnrolled = !enrollmentsLoading && userEnrollments.some(
    (enrollment: Enrollment) => enrollment.courseId === course.id
  );

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#EFF6FF] pt-20">
    <div className="container mx-auto px-4 py-10">

      {/* Back Button */}
      <div className="mb-8">
        <Link
          to="/courses"
          className="text-[#0D72BA] hover:text-[#094F87] flex items-center font-semibold text-lg transition"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Courses
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(13,114,186,0.25)] overflow-hidden border border-gray-200">

        {/* Header */}
        <div className="md:flex">

          {/* Image */}
          <div className="md:w-2/5">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-64 md:h-80 object-cover"
              />
            ) : (
              <div className="w-full h-72 md:h-full bg-gradient-to-br from-[#F47E28] to-[#0D72BA] flex items-center justify-center">
                <FaBook className="h-20 w-20 text-white opacity-90" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-10 md:w-3/5 bg-gradient-to-br from-white via-[#F8FAFC] to-[#EFF6FF]">

            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                {course.title}
              </h1>
              <span className="text-3xl font-extrabold text-[#F47E28]">
                {course.price && course.price > 0 ? `$${course.price}` : "Free"}
              </span>
            </div>

            {course.shortDescription && (
              <p className="text-gray-600 text-base mb-6">
                {course.shortDescription}
              </p>
            )}

            {/* Instructor */}
            {course.instructor && (
              <div className="flex items-center mb-6 p-4 rounded-xl bg-white/70 backdrop-blur border border-gray-200 shadow-sm">
                <div className="mr-4">
                  {course.instructor.profilePicture ? (
                    <img
                      src={course.instructor.profilePicture}
                      alt=""
                      className="h-14 w-14 rounded-full object-cover border-2 border-[#0D72BA]"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#0D72BA] to-[#F47E28] flex items-center justify-center">
                      <FaUser className="text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    {course.instructor.firstname} {course.instructor.lastname}
                  </p>
                  {course.instructor.title && (
                    <p className="text-sm text-gray-600">
                      {course.instructor.title}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {course.rating !== null && (
                <div className="flex items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <FaStar className="text-[#F47E28] mr-2" />
                  <span className="font-bold">{course.rating.toFixed(1)}</span>
                </div>
              )}
              {course.enrolledNum !== null && (
                <div className="flex items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <FaUsers className="text-[#0D72BA] mr-2" />
                  <span className="font-bold">{course.enrolledNum}</span>
                </div>
              )}
              {course.estimatedTime && (
                <div className="flex items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <FaClock className="text-indigo-500 mr-2" />
                  <span className="font-bold">{course.estimatedTime}h</span>
                </div>
              )}
              {course.targetLevel && (
                <div className="flex items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <FaTag className="text-sky-500 mr-2" />
                  <span className="font-bold">{course.targetLevel}</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <div>
              {isEnrolled ? (
                <button
                  onClick={() => navigate(`/student-dashboard/mycourses/${course.id}/modules`)}
                  className="w-full bg-[#0D72BA] text-white py-3 rounded-xl font-bold hover:bg-[#095A92] transition shadow-lg"
                >
                  Go to Course
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-gradient-to-r from-[#F47E28] to-[#0D72BA] text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition shadow-xl disabled:opacity-70"
                >
                  {enrolling ? "Enrolling..." : "Enroll in Course"}
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Details */}
        <div className="p-8 border-t border-gray-200 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Description */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-extrabold text-[#0D72BA] mb-3 after:block after:w-12 after:h-1 after:bg-[#F47E28] after:mt-2">
                Course Description
              </h2>
              <p className="text-gray-700 text-base whitespace-pre-line">
                {course.longDescription}
              </p>
            </div>

            {/* Modules */}
            <div className="bg-[#F8FAFC] rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-[#0D72BA] mb-3">
                Course Content
              </h3>

              {modulesFromQuery.map(module => (
                <div key={module.id} className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
                  <div className="p-4 bg-white font-semibold flex items-center">
                    <FaPlay className="text-[#F47E28] mr-2" />
                    {module.title}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
);

};

export default CourseDetailsPage;