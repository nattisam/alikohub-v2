import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { enrollmentApi } from "../../api/enrollmentApi";
import { useAuth } from "../../contexts/AuthContext";
import { useCourse } from "../../queries/courseQueries";
import { useCourseModules } from "../../queries/moduleQueries";
import type {
  CourseModule,
  CourseLesson,
  Course,
} from "../../components/common/types.d";
import {
  ArrowLeft,
  Clock,
  User,
  Star,
  CheckCircle,
  FileText,
  Video,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Download,
  Share2,
} from "lucide-react";

const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [enrolling, setEnrolling] = useState(false);
  const { user: currentUser, setRoleModalOpen } = useAuth();
  const navigate = useNavigate();

  const {
    data: course,
    isLoading,
    isError,
  } = useCourse(parseInt(courseId || "0", 10));

  // Check if user has selected a role
  const hasRole = !!(
    currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole
  );
  const isStudent =
    currentUser?.academyActiveRole === "STUDENT" ||
    currentUser?.academyUser?.activeRole === "STUDENT";

  // Check if user is already enrolled
  const [userEnrollments, setUserEnrollments] = useState<Course[]>([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<
    Record<number, boolean>
  >({});
  const [activeTab, setActiveTab] = useState<"curriculum" | "reviews">(
    "curriculum",
  );

  // Fetch user enrollments (Preserved Logic with Retry)
  useEffect(() => {
    let isMounted = true;
    const fetchUserEnrollments = async () => {
      if (currentUser) {
        const fetchWithRetry = async (maxRetries = 3, delay = 1000) => {
          let retries = 0;

          while (retries <= maxRetries) {
            try {
              const response = await enrollmentApi.getMyCourses();
              if (isMounted) {
                setUserEnrollments(
                  Array.isArray(response?.data) ? response.data : [],
                );
              }
              return;
            } catch (err: any) {
              console.error("Error fetching user enrollments:", err);
              if (err.response?.status === 429 && retries < maxRetries) {
                await new Promise((resolve) =>
                  setTimeout(resolve, delay * Math.pow(2, retries)),
                );
                retries++;
              } else {
                break;
              }
            }
          }
        };

        try {
          await fetchWithRetry();
        } finally {
          if (isMounted) setEnrollmentsLoading(false);
        }
      } else {
        if (isMounted) setEnrollmentsLoading(false);
      }
    };

    fetchUserEnrollments();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const { data: modulesFromQuery = [] } = useCourseModules(
    parseInt(courseId || "0", 10),
  );

  const handleEnroll = async () => {
    if (!currentUser) {
      navigate("/auth/login");
      return;
    }

    if (!hasRole) {
      alert("Please select a role before enrolling in courses.");
      setRoleModalOpen(true);
      return;
    }

    if (!isStudent) {
      alert(
        "Only students can enroll in courses. Please select the student role.",
      );
      return;
    }

    try {
      setEnrolling(true);
      const response = await enrollmentApi.createEnrollment({
        courseId: parseInt(courseId || "0", 10),
      });

      if (response?.status === 201) {
        alert("Successfully enrolled in the course!");
        if (course) {
          setUserEnrollments((prev) => {
            if (prev.some((c) => c.id === course.id)) return prev;
            return [...prev, course];
          });
        }
        // Refresh enrollments
        try {
          const enrollmentResponse = await enrollmentApi.getMyCourses();
          if (Array.isArray(enrollmentResponse?.data)) {
            setUserEnrollments(enrollmentResponse.data);
          }
        } catch (e) {
          console.error("Error refreshing enrollments", e);
        }
      }
    } catch (err: any) {
      console.error("Error enrolling in course:", err);
      if (err.response?.status === 409) {
        alert("You are already enrolled in this course.");
      } else {
        alert(
          "Failed to enroll in course. " +
            (err.response?.data?.message || "Please try again."),
        );
      }
    } finally {
      setEnrolling(false);
    }
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const isEnrolled =
    !enrollmentsLoading &&
    Array.isArray(userEnrollments) &&
    userEnrollments.some((c: Course) => c?.id === course?.id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E92D1]"></div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Course Not Found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="text-[#3E92D1] hover:underline"
          >
            Back home
          </button>
        </div>
      </div>
    );
  }

  const modules = Array.isArray(modulesFromQuery) ? modulesFromQuery : [];
  const totalLessons = modules.reduce(
    (acc, m) => acc + (m?.lessons?.length || 0),
    0,
  );
  const estimatedHours = course?.estimatedTime
    ? Math.floor(course.estimatedTime / 60)
    : 0;

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                    {course.title}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${!course.price || course.price === 0 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                    >
                      {!course.price || course.price === 0 ? "Free" : "Paid"}
                    </span>
                  </h1>

                  <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      {course.instructor?.firstname}{" "}
                      {course.instructor?.lastname}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      {estimatedHours}h{" "}
                      {course.estimatedTime ? course.estimatedTime % 60 : 0}m
                    </span>
                    <span className="flex items-center gap-2">
                      <Star
                        size={16}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      {course.rating?.toFixed(1) || "New"} (
                      {course.enrolledNum || 0} enrolled)
                    </span>
                  </div>

                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {course.shortDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex gap-6 text-sm font-medium">
                <button
                  onClick={() => setActiveTab("curriculum")}
                  className={`pb-3 border-b-2 ${activeTab === "curriculum" ? "border-[#3E92D1] text-[#3E92D1]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                >
                  Curriculum
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`pb-3 border-b-2 ${activeTab === "reviews" ? "border-[#3E92D1] text-[#3E92D1]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                >
                  Overview & Reviews
                </button>
              </nav>
            </div>

            {/* Tab Content: Curriculum */}
            {activeTab === "curriculum" && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Course Content
                  </h2>
                  <div className="text-sm text-gray-500">
                    {modules.length} Modules • {totalLessons} Lessons
                  </div>
                </div>

                <div className="space-y-4">
                  {modules.map((module: CourseModule, idx) => (
                    <div
                      key={module.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          {expandedModules[module.id] ? (
                            <ChevronDown size={18} className="text-gray-500" />
                          ) : (
                            <ChevronRight size={18} className="text-gray-500" />
                          )}
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Module {idx + 1}: {module.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {module.lessons?.length || 0} Lessons
                            </p>
                          </div>
                        </div>
                      </button>

                      {expandedModules[module.id] && (
                        <div className="divide-y divide-gray-100 bg-white">
                          {module.lessons?.map((lesson: CourseLesson) => (
                            <div
                              key={lesson.id}
                              className="p-3 pl-12 flex items-center justify-between hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                {lesson.type === "VIDEO" ? (
                                  <Video size={16} className="text-blue-500" />
                                ) : (
                                  <FileText
                                    size={16}
                                    className="text-gray-400"
                                  />
                                )}
                                <span className="text-sm text-gray-700">
                                  {lesson.title}
                                </span>
                              </div>
                              <span className="text-xs text-gray-400">
                                {lesson.duration
                                  ? `${lesson.duration}m`
                                  : "15m"}
                              </span>
                            </div>
                          ))}
                          {(!module.lessons || module.lessons.length === 0) && (
                            <div className="p-4 pl-12 text-sm text-gray-400 italic">
                              No lessons available in this module yet.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Content: Placeholder for Review tab */}
            {activeTab === "reviews" && (
              <div className="bg-white rounded-lg shadow p-6 text-center py-12 text-gray-500">
                <div className="flex justify-center mb-4">
                  <Star size={40} className="text-gray-300" />
                </div>
                <p>Details and reviews functionality coming soon.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Enrollment Card */}
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <div className="aspect-video rounded-md bg-gray-100 mb-6 overflow-hidden">
                <img
                  src={
                    course.thumbnail ||
                    "https://via.placeholder.com/400x225?text=Course+Preview"
                  }
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {course.price && course.price > 0
                      ? `$${course.price.toFixed(2)}`
                      : "Free"}
                  </span>
                </div>
                {course.price && course.price > 0 && (
                  <p className="text-sm text-gray-500">
                    One-time payment. Lifetime access.
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  if (!isEnrolled) {
                    handleEnroll();
                  }
                }}
                disabled={enrolling || isEnrolled}
                className={`w-full py-2.5 px-4 rounded-md font-medium text-sm flex items-center justify-center gap-2 mb-4 transition-colors ${
                  isEnrolled
                    ? "bg-green-600 text-white cursor-not-allowed opacity-90"
                    : "bg-[#3E92D1] hover:bg-[#327aae] text-white"
                } ${enrolling ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                {isEnrolled ? (
                  <>
                    <CheckCircle size={18} /> Enrolled
                  </>
                ) : enrolling ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>{" "}
                    Processing...
                  </>
                ) : (
                  "Enroll Now"
                )}
              </button>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                  <Share2 size={16} /> Share
                </button>
                <button className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                  <CheckCircle size={16} /> Wishlist
                </button>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-4">
                <h4 className="font-semibold text-sm text-gray-900">
                  This course includes:
                </h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-3">
                    <Video size={16} className="text-gray-400" />
                    {estimatedHours} hours on-demand video
                  </li>
                  <li className="flex items-center gap-3">
                    <FileText size={16} className="text-gray-400" />
                    {totalLessons} lessons
                  </li>
                  <li className="flex items-center gap-3">
                    <Download size={16} className="text-gray-400" />
                    Downloadable resources
                  </li>
                  <li className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-gray-400" />
                    Certificate of completion
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
