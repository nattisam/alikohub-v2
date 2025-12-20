import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { academyApi } from "../api";
import { useUser } from "../hooks/useUser";
import type { Course, Enrollment } from "../components/types.d";
import { FaStar, FaUsers, FaClock, FaTag, FaDollarSign, FaBook, FaUser, FaPlay, FaFilePdf, FaVideo } from "react-icons/fa";

const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  // Check if user is already enrolled
  // Since the Course type doesn't include enrollments, we'll need to fetch them separately
  const [userEnrollments, setUserEnrollments] = useState<Enrollment[]>([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await academyApi.get(`/courses/${courseId}`);
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
          const response = await academyApi.get("/enrollment/me");
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

    try {
      setEnrolling(true);
      // Create enrollment for the current user
      const response = await academyApi.post("/enrollment", {
        courseId: parseInt(courseId || "0"),
      });
      
      if (response.status === 201) {
        alert("Successfully enrolled in the course!");
        // Refresh course data to show updated enrollment status
        const response = await academyApi.get(`/courses/${courseId}`);
        setCourse(response.data);
      }
    } catch (err: any) {
      console.error("Error enrolling in course:", err);
      alert("Failed to enroll in course. " + (err.response?.data?.message || "Please try again."));
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
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/courses"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Courses
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Course Header */}
          <div className="md:flex">
            {/* Course Image */}
            <div className="md:w-2/5">
              {course.thumbnail ? (
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-64 md:h-full object-cover"
                />
              ) : (
                <div className="w-full h-64 md:h-full bg-gray-200 flex items-center justify-center">
                  <FaBook className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="p-6 md:w-3/5">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {course.title}
                </h1>
                {course.price !== null && course.price > 0 ? (
                  <span className="text-2xl font-bold text-green-600">
                    ${course.price}
                  </span>
                ) : (
                  <span className="text-2xl font-bold text-blue-600">
                    Free
                  </span>
                )}
              </div>

              {course.shortDescription && (
                <p className="text-gray-600 mb-6">
                  {course.shortDescription}
                </p>
              )}

              {/* Instructor */}
              {course.instructor && (
                <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mr-4">
                    {course.instructor.profilePicture ? (
                      <img 
                        src={course.instructor.profilePicture} 
                        alt={`${course.instructor.firstname} ${course.instructor.lastname}`}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="h-6 w-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {course.instructor.firstname} {course.instructor.lastname}
                    </p>
                    {course.instructor.title && (
                      <p className="text-sm text-gray-500">
                        {course.instructor.title}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Course Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {course.rating !== null && (
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-medium">
                      {course.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                {course.enrolledNum !== null && (
                  <div className="flex items-center">
                    <FaUsers className="text-blue-500 mr-1" />
                    <span className="font-medium">
                      {course.enrolledNum} students
                    </span>
                  </div>
                )}
                {course.estimatedTime && (
                  <div className="flex items-center">
                    <FaClock className="text-green-500 mr-1" />
                    <span className="font-medium">
                      {course.estimatedTime} hours
                    </span>
                  </div>
                )}
                {course.targetLevel && (
                  <div className="flex items-center">
                    <FaTag className="text-purple-500 mr-1" />
                    <span className="font-medium">
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
                    className="w-full bg-green-600 text-white py-3 rounded-md font-medium cursor-not-allowed"
                  >
                    Already Enrolled
                  </button>
                ) : currentUser?.academyRole === 'INSTRUCTOR' || currentUser?.academyRole === 'ADMIN' ? (
                  <button
                    disabled
                    className="w-full bg-gray-400 text-white py-3 rounded-md font-medium cursor-not-allowed"
                  >
                    Instructors Cannot Enroll
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {enrolling ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          <div className="p-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Description */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Course Description</h2>
                {course.longDescription ? (
                  <div className="prose max-w-none mb-8">
                    <p className="text-gray-700 whitespace-pre-line">{course.longDescription}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 mb-8">No detailed description available for this course.</p>
                )}

                {/* What You'll Learn */}
                {course.conceptsLearned && course.conceptsLearned.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">What You'll Learn</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {course.conceptsLearned.map((concept, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{concept}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prerequisites */}
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites</h3>
                    <ul className="space-y-2">
                      {course.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span className="text-gray-700">{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills */}
                {course.skills && course.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills Covered</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
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
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
                  
                  <div className="space-y-4">
                    {course.category && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Category</h4>
                        <p className="mt-1 text-gray-900">{course.category}</p>
                      </div>
                    )}
                    
                    {course.targetLevel && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Level</h4>
                        <p className="mt-1 text-gray-900">{course.targetLevel}</p>
                      </div>
                    )}
                    
                    {course.estimatedTime && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Estimated Time</h4>
                        <p className="mt-1 text-gray-900">{course.estimatedTime} hours</p>
                      </div>
                    )}
                    
                    {course.languages && course.languages.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Languages</h4>
                        <p className="mt-1 text-gray-900">{course.languages.join(", ")}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modules Preview - This would need to be fetched separately */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h3>
                  <p className="text-gray-600">Course modules and lessons will be available after enrollment.</p>
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