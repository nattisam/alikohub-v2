import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { academyApi } from "../api";
import { useAuth } from "../contexts/AuthContext";
import type { Course, Enrollment } from "../components/types.d";
import { FaStar, FaUsers, FaClock, FaTag, FaDollarSign, FaBook, FaUser, FaPlay, FaFilePdf, FaVideo } from "react-icons/fa";

const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Check if user has selected a role
  const hasRole = currentUser?.academyRole !== undefined;
  const isStudent = currentUser?.academyRole === 'STUDENT';
  
  // Check if user is already enrolled
  // Since the Course type doesn't include enrollments, we'll need to fetch them separately
  const [userEnrollments, setUserEnrollments] = useState<Enrollment[]>([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await academyApi.get(`/academy/courses/${courseId}`);
        setCourse(response.data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);
  
  // Fetch user enrollments
  useEffect(() => {
    const fetchUserEnrollments = async () => {
      if (currentUser) {
        try {
          const response = await academyApi.get("/academy/enrollment/me");
          setUserEnrollments(response.data);
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
      const response = await academyApi.post("/enrollment", {
        courseId: parseInt(courseId || "0"),
      });
      
      if (response.status === 201) {
        // Show success message
        alert("Successfully enrolled in the course!");
        // Refresh course data to show updated enrollment status
        const updatedCourseResponse = await academyApi.get(`/academy/courses/${courseId}`);
        setCourse(updatedCourseResponse.data);
        
        // Also refresh user enrollments to update the isEnrolled state
        const enrollmentResponse = await academyApi.get("/enrollment/me");
        setUserEnrollments(enrollmentResponse.data);
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

  if (loading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Course</h2>
            <p className="text-red-600 mb-4">{error}</p>
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
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-[#E6E9F0] pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/courses"
            className="text-[#E6D600] hover:text-[#D4C400] flex items-center font-semibold text-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Courses
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Course Header */}
          <div className="md:flex">
            {/* Course Image */}
            <div className="md:w-2/5">
              {course.thumbnail ? (
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-64 md:h-96 object-cover"
                />
              ) : (
                <div className="w-full h-64 md:h-96 bg-gradient-to-br from-[#E6D600] to-[#F2F296] flex items-center justify-center">
                  <FaBook className="h-20 w-20 text-white" />
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="p-8 md:w-3/5 bg-gradient-to-br from-white to-gray-50">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {course.title}
                </h1>
                {course.price !== null && course.price > 0 ? (
                  <span className="text-3xl font-bold text-[#E6D600]">
                    ${course.price}
                  </span>
                ) : (
                  <span className="text-3xl font-bold text-[#E6D600]">
                    Free
                  </span>
                )}
              </div>

              {course.shortDescription && (
                <p className="text-gray-600 text-lg mb-6">
                  {course.shortDescription}
                </p>
              )}

              {/* Instructor */}
              {course.instructor && (
                <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex-shrink-0 mr-4">
                    {course.instructor.profilePicture ? (
                      <img 
                        src={course.instructor.profilePicture} 
                        alt={`${course.instructor.firstname} ${course.instructor.lastname}`}
                        className="h-14 w-14 rounded-full object-cover border-2 border-[#E6D600]"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#E6D600] to-[#F2F296] flex items-center justify-center border-2 border-[#E6D600]">
                        <FaUser className="h-7 w-7 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      {course.instructor.firstname} {course.instructor.lastname}
                    </p>
                    {course.instructor.title && (
                      <p className="text-base text-gray-600">
                        {course.instructor.title}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Course Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {course.rating !== null && (
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <FaStar className="text-yellow-400 mr-2 text-xl" />
                    <span className="font-bold text-lg">
                      {course.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                {course.enrolledNum !== null && (
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <FaUsers className="text-[#E6D600] mr-2 text-xl" />
                    <span className="font-bold text-lg">
                      {course.enrolledNum} students
                    </span>
                  </div>
                )}
                {course.estimatedTime && (
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <FaClock className="text-purple-500 mr-2 text-xl" />
                    <span className="font-bold text-lg">
                      {course.estimatedTime} hours
                    </span>
                  </div>
                )}
                {course.targetLevel && (
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <FaTag className="text-blue-500 mr-2 text-xl" />
                    <span className="font-bold text-lg">
                      {course.targetLevel}
                    </span>
                  </div>
                )}
              </div>

              {/* Enrollment Button */}
              <div className="mb-6">
                {isEnrolled ? (
                  <button
                    disabled
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg cursor-not-allowed shadow-lg"
                  >
                    Already Enrolled
                  </button>
                ) : !hasRole ? (
                  // User hasn't selected a role yet
                  <button
                    onClick={() => alert("Please select a role before enrolling in courses.")}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 font-bold text-lg shadow-lg"
                  >
                    Select Role to Enroll
                  </button>
                ) : currentUser?.academyRole === 'INSTRUCTOR' || currentUser?.academyRole === 'ADMIN' ? (
                  <button
                    disabled
                    className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white py-4 rounded-xl font-bold text-lg cursor-not-allowed shadow-lg"
                  >
                    Instructors Cannot Enroll
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-gradient-to-r from-[#E6D600] to-[#F2F296] text-black py-4 rounded-xl hover:from-[#D4C400] hover:to-[#E0E08A] transition-all duration-300 font-bold text-lg disabled:opacity-70 shadow-lg"
                  >
                    {enrolling ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enrolling...
                      </span>
                    ) : (
                      "Enroll in Course"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="p-8 border-t border-gray-200 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Description */}
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#E6D600] to-[#F2F296]">
                  Course Description
                </h2>
                {course.longDescription ? (
                  <div className="prose max-w-none mb-8">
                    <p className="text-gray-700 text-lg whitespace-pre-line">{course.longDescription}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 mb-8 text-lg">No detailed description available for this course.</p>
                )}

                {/* What You'll Learn */}
                {course.conceptsLearned && course.conceptsLearned.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#E6D600] to-[#F2F296]">What You'll Learn</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.conceptsLearned.map((concept, index) => (
                        <li key={index} className="flex items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <svg className="h-6 w-6 text-[#E6D600] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 text-lg">{concept}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prerequisites */}
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#E6D600] to-[#F2F296]">Prerequisites</h3>
                    <ul className="space-y-3">
                      {course.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <svg className="h-6 w-6 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span className="text-gray-700 text-lg">{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills */}
                {course.skills && course.skills.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#E6D600] to-[#F2F296]">Skills Covered</h3>
                    <div className="flex flex-wrap gap-3">
                      {course.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-4 py-2 rounded-full text-lg font-bold bg-gradient-to-r from-[#E6D600] to-[#F2F296] text-black shadow-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Additional Info */}
              <div>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#E6D600] to-[#F2F296]">Course Information</h3>
                  
                  <div className="space-y-4">
                    {course.category && (
                      <div className="p-3 bg-white rounded-lg border border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-500">Category</h4>
                        <p className="mt-1 text-gray-900 font-medium">{course.category}</p>
                      </div>
                    )}
                    
                    {course.targetLevel && (
                      <div className="p-3 bg-white rounded-lg border border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-500">Level</h4>
                        <p className="mt-1 text-gray-900 font-medium">{course.targetLevel}</p>
                      </div>
                    )}
                    
                    {course.estimatedTime && (
                      <div className="p-3 bg-white rounded-lg border border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-500">Estimated Time</h4>
                        <p className="mt-1 text-gray-900 font-medium">{course.estimatedTime} hours</p>
                      </div>
                    )}
                    
                    {course.languages && course.languages.length > 0 && (
                      <div className="p-3 bg-white rounded-lg border border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-500">Languages</h4>
                        <p className="mt-1 text-gray-900 font-medium">{course.languages.join(", ")}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modules Preview - This would need to be fetched separately */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#E6D600] to-[#F2F296]">Course Content</h3>
                  <p className="text-gray-600 mb-4">Preview some of the modules and lessons included in this course:</p>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                      <FaPlay className="text-[#E6D600] mr-3" />
                      <span className="font-medium">Introduction to the Course</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                      <FaVideo className="text-[#E6D600] mr-3" />
                      <span className="font-medium">Lesson 1: Getting Started</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                      <FaFilePdf className="text-[#E6D600] mr-3" />
                      <span className="font-medium">Resource: Course Materials</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;