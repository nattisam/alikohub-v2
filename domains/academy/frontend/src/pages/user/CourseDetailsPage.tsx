import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { enrollmentApi } from "../../api/enrollmentApi";
import { useAuth } from "../../contexts/AuthContext";
import { useCourse } from "../../queries/courseQueries";
import { useCourseModules } from "../../queries/moduleQueries";
import type { CourseLesson, Course } from "../../components/common/types.d";
import {
  ArrowLeft,
  User,
  Star,
  CheckCircle,
  FileText,
  Video,
  ChevronDown,
  ChevronRight,
  Tv,
  Award,
  Infinity as InfinityIcon,
  Play,
  HelpCircle,
  Lock,
} from "lucide-react";
import StripeCheckoutModal from "../../components/course/StripeCheckoutModal";

const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [enrolling, setEnrolling] = useState(false);
  const { user: currentUser, setRoleModalOpen, logout } = useAuth();
  const navigate = useNavigate();

  const {
    data: course,
    isLoading,
    isError,
    error,
  } = useCourse(parseInt(courseId || "0", 10));

  useEffect(() => {
    if (isError && (error as any)?.response?.status === 401) {
      const timer = setTimeout(() => {
        logout();
        navigate(
          `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`,
        );
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isError, error, navigate, logout]);

  const hasRole = !!(
    currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole
  );
  const isStudent =
    currentUser?.academyActiveRole === "STUDENT" ||
    currentUser?.academyUser?.activeRole === "STUDENT";

  const [userEnrollments, setUserEnrollments] = useState<Course[]>([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<
    Record<number, boolean>
  >({ 1: true }); // Default first open
  const [activeTab, setActiveTab] = useState<
    "curriculum" | "reviews" | "instructor"
  >("curriculum");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchUserEnrollments = async () => {
      if (currentUser) {
        try {
          const response = await enrollmentApi.getMyCourses();
          if (isMounted)
            setUserEnrollments(
              Array.isArray(response?.data) ? response.data : [],
            );
        } catch (err) {
          console.error("Error fetching enrollments", err);
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

  const isEnrolled =
    !enrollmentsLoading &&
    userEnrollments.some((c: Course) => c?.id === course?.id);

  const handleEnroll = async () => {
    if (isEnrolled) {
      navigate(`/student-dashboard/course/${courseId}`);
      return;
    }
    if (!currentUser) return;
    if (!hasRole) {
      setRoleModalOpen(true);
      return;
    }
    if (!isStudent) {
      alert("Only students can enroll.");
      return;
    }
    if (course && course.price && course.price > 0) {
      setIsCheckoutOpen(true);
      return;
    }
    performEnrollment();
  };

  const performEnrollment = async () => {
    if (enrolling || isEnrolled) return;
    try {
      setEnrolling(true);
      const response = await enrollmentApi.createEnrollment({
        courseId: parseInt(courseId || "0", 10),
      });
      if (response?.status === 201 || response?.status === 200) {
        // Manually update the state to avoid redundant GET request
        if (course) {
          setUserEnrollments((prev) => [...prev, course]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEnrolling(false);
    }
  };

  if (isLoading)
    return (
      <div className="h-screen w-full flex items-center justify-center animate-pulse text-[#17469E]">
        Loading Masterclass...
      </div>
    );

  if (isError || !course) {
    const isUnauthorized = (error as any)?.response?.status === 401;

    return (
      <div className="h-screen w-full flex flex-col items-center justify-center text-[#17469E] p-6">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center max-w-md text-center">
          {isUnauthorized ? (
            <>
              <Lock size={48} className="mb-4 text-[#F0802D]" />
              <h2 className="text-2xl font-bold mb-2">Session Expired</h2>
              <p className="text-gray-500 mb-6">
                Your session has expired. Please log in again to continue
                accessing this course.
              </p>
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={() => {
                    logout();
                    navigate(
                      `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`,
                    );
                  }}
                  className="w-full px-8 py-3 bg-[#17469E] text-white rounded-full font-bold hover:bg-[#12367a] transition-colors"
                >
                  Log In Again
                </button>
                <p className="text-xs text-gray-400">
                  Redirecting to login page in 3 seconds...
                </p>
              </div>
            </>
          ) : (
            <>
              <HelpCircle size={48} className="mb-4 text-red-500" />
              <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
              <p className="text-gray-500 mb-6">
                We couldn't find the course you're looking for. It might have
                been removed or the link is incorrect.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-[#17469E] text-white rounded-full font-bold hover:bg-[#12367a] transition-colors"
              >
                Back to Home
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const modules = Array.isArray(modulesFromQuery) ? modulesFromQuery : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] w-full pb-20">
      {/* Header / Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-[13px] text-gray-500 mb-8 font-medium">
          <span
            className="cursor-pointer hover:text-[#17469E]"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          <ChevronRight size={14} />
          <span className="cursor-pointer hover:text-[#17469E]">
            {course.category}
          </span>
          {course.subCategory && (
            <>
              <ChevronRight size={14} />
              <span className="cursor-pointer hover:text-[#17469E]">
                {course.subCategory}
              </span>
            </>
          )}
          <ChevronRight size={14} />
          <span className="text-gray-900 font-semibold">{course.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-8 space-y-8">
            {/* HERO SECTION */}
            <div className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
              <div className="flex gap-3 mb-6">
                {(course.rating || 0) >= 4.5 && (
                  <span className="bg-[#17469E] text-white text-[10px] font-bold px-3 py-1 rounded-md flex items-center gap-1 uppercase">
                    <Star size={10} fill="white" /> Bestseller
                  </span>
                )}
                {course.targetLevel && (
                  <span className="bg-[#F1F5F9] text-gray-600 text-[10px] font-bold px-3 py-1 rounded-md uppercase">
                    {course.targetLevel}
                  </span>
                )}
                <span className="text-gray-600 text-[10px] font-bold px-3 py-1 flex items-center gap-1 uppercase">
                  <Star size={12} className="text-[#F0802D] fill-[#F0802D]" />{" "}
                  {course.rating || "New"} ({course.enrolledNum || 0} reviews)
                </span>
              </div>

              <h1 className="text-5xl font-extrabold text-[#111827] leading-[1.15] mb-6">
                {course.title}
              </h1>

              <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
                {course.shortDescription || course.longDescription}
              </p>
            </div>

            {/* TABS */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100 px-8 pt-6">
                {["Curriculum", "Reviews", "Instructor"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase() as any)}
                    className={`px-6 pb-4 text-sm font-bold transition-all relative ${
                      activeTab === tab.toLowerCase()
                        ? "text-[#17469E]"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab}
                    {activeTab === tab.toLowerCase() && (
                      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#17469E] rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {activeTab === "curriculum" && (
                  <div className="space-y-4">
                    {modules.map((module, idx) => (
                      <div
                        key={module.id}
                        className="border border-gray-100 rounded-2xl overflow-hidden bg-[#FBFBFF]"
                      >
                        <button
                          onClick={() =>
                            setExpandedModules((prev) => ({
                              ...prev,
                              [module.id]: !prev[module.id],
                            }))
                          }
                          className="w-full flex items-center justify-between p-6 text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#17469E] text-white flex items-center justify-center font-bold">
                              {idx + 1}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">
                                {module.title}
                              </h3>
                              <p className="text-xs text-gray-500 font-medium">
                                {module.lessons?.length || 0} Lessons
                              </p>
                            </div>
                          </div>
                          {expandedModules[module.id] ? (
                            <ChevronDown className="text-gray-400" />
                          ) : (
                            <ChevronRight className="text-gray-400" />
                          )}
                        </button>

                        {expandedModules[module.id] && (
                          <div className="px-6 pb-6 space-y-3">
                            {module.lessons?.map((lesson: CourseLesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-50 shadow-sm"
                              >
                                <div className="flex items-center gap-4">
                                  {lesson.type === "VIDEO" ? (
                                    <Play
                                      size={18}
                                      className="text-[#17469E]"
                                    />
                                  ) : (
                                    <FileText
                                      size={18}
                                      className="text-[#17469E]"
                                    />
                                  )}
                                  <span className="text-sm font-semibold text-gray-700">
                                    {lesson.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                                      lesson.type === "VIDEO"
                                        ? "bg-blue-50 text-blue-600"
                                        : "bg-purple-50 text-purple-600"
                                    }`}
                                  >
                                    {lesson.type}
                                  </span>
                                  <span className="text-[11px] text-gray-400 font-medium">
                                    {lesson.duration
                                      ? `${Math.floor(lesson.duration / 60)}:${(lesson.duration % 60).toString().padStart(2, "0")}`
                                      : "05:12"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="mt-12 p-12 border-2 border-dashed border-gray-100 rounded-[32px] text-center">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Star size={32} className="text-gray-300" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">
                        Be the pioneer of this course!
                      </h4>
                      <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                        Share your learning journey and help others by being the
                        first to review this course.
                      </p>
                      <button className="px-8 py-3 border border-gray-200 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors">
                        Write First Review
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star size={32} className="text-gray-300" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">No reviews yet</h4>
                    <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                      Be the pioneer of this course! Share your learning journey
                      and help others by writing the first review.
                    </p>
                    <button className="px-8 py-3 border border-gray-200 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors">
                      Write First Review
                    </button>
                  </div>
                )}

                {activeTab === "instructor" && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center gap-6">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#17469E] to-blue-400 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <img
                          src={
                            course.instructor?.profilePicture ||
                            `https://ui-avatars.com/api/?name=${course.instructor?.firstname}+${course.instructor?.lastname}&background=17469E&color=fff`
                          }
                          alt={course.instructor?.firstname}
                          className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
                        />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {course.instructor?.firstname}{" "}
                          {course.instructor?.lastname}
                        </h3>
                        <p className="text-[#17469E] font-bold text-sm tracking-wide uppercase">
                          {course.instructor?.title || "Lead Instructor"}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-gray-500 text-sm font-medium">
                          <span className="flex items-center gap-1.5">
                            <Star
                              size={14}
                              className="text-[#F0802D] fill-[#F0802D]"
                            />{" "}
                            {course.rating || "New"} Rating
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User size={14} /> {course.enrolledNum || 0}{" "}
                            Students
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                        About the Instructor
                      </h4>
                      <div className="prose max-w-none text-gray-600 leading-relaxed">
                        {course.instructor?.bio ||
                          "No biography available for this instructor yet. They are a dedicated professional committed to sharing their expertise with the AlikoHub community."}
                      </div>
                    </div>

                    {course.instructor?.certifications &&
                      course.instructor.certifications.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-bold text-gray-900">
                            Certifications
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {course.instructor.certifications.map((cert, i) => (
                              <span
                                key={i}
                                className="bg-blue-50 text-[#17469E] text-[11px] font-bold px-3 py-1 rounded-full border border-blue-100"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[32px] shadow-2xl border border-gray-50 overflow-hidden sticky top-8">
              {/* Course Preview Image */}
              <div className="relative aspect-[4/3] bg-[#EED8C5] flex flex-col items-center justify-center p-8 overflow-hidden">
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-md text-[10px] font-bold">
                  Preview Course
                </div>
                <div className="text-center">
                  <h2 className="text-6xl font-black text-white/40 mb-2">
                    course
                  </h2>
                  <p className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                    Course Preview
                  </p>
                  <div className="mt-8 bg-white p-4 rounded-lg shadow-lg w-48 text-left">
                    <div className="h-2 w-12 bg-gray-100 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-black text-[#111827]">
                    ${(course.price || 0) / 100}
                  </span>
                  {course.price && course.price < 50000 && (
                    <>
                      <span className="text-lg text-gray-400 line-through font-medium">
                        ${((course.price * 2.5) / 100).toFixed(2)}
                      </span>
                      <span className="bg-blue-50 text-[#17469E] text-[11px] font-bold px-2 py-1 rounded-md">
                        60% OFF
                      </span>
                    </>
                  )}
                </div>

                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-[#17469E] hover:bg-[#12367a] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/10 mb-4"
                >
                  {isEnrolled ? "Go to Course" : "Enroll Now"}{" "}
                  <ArrowLeft className="rotate-180" size={18} />
                </button>
                <p className="text-[10px] text-gray-400 text-center font-medium mb-8">
                  30-Day Money-Back Guarantee • Lifetime Access
                </p>

                <div className="space-y-5">
                  <h5 className="text-[11px] font-black tracking-widest text-gray-900 uppercase">
                    What's Included
                  </h5>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                      <Video size={18} className="text-[#17469E]" />{" "}
                      {course.estimatedTime || "24"} hours on-demand video
                    </li>
                    {course.skills && course.skills.length > 0 && (
                      <li className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                        <CheckCircle size={18} className="text-[#17469E]" />{" "}
                        {course.skills.length} target skills
                      </li>
                    )}
                    <li className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                      <Tv size={18} className="text-[#17469E]" /> Access on
                      mobile and TV
                    </li>
                    <li className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                      <Award size={18} className="text-[#17469E]" /> Certificate
                      of completion
                    </li>
                    <li className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                      <InfinityIcon size={18} className="text-[#17469E]" /> Full
                      lifetime access
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-10">
                  <button className="py-3 border border-gray-100 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors">
                    Share
                  </button>
                  <button className="py-3 border border-gray-100 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors">
                    Gift Course
                  </button>
                </div>
              </div>
            </div>

            {/* Newsletter Card */}
            <div className="bg-[#17469E] rounded-[32px] p-8 text-white">
              <h4 className="text-xl font-bold mb-2">
                {course.category} Insights
              </h4>
              <p className="text-white/70 text-sm mb-6 leading-relaxed">
                Join our community of learners getting exclusive resources and
                career tips directly from {course.instructor?.firstname}.
              </p>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-sm mb-3 outline-none focus:bg-white/20 transition-all placeholder:text-white/40"
              />
              <button className="w-full bg-white text-[#17469E] py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                Subscribe Free
              </button>
            </div>
          </div>
        </div>
      </div>

      <StripeCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        courseTitle={course.title || "Course"}
        price={course.price || 1999}
        onSuccess={performEnrollment}
      />
    </div>
  );
};

export default CourseDetailsPage;
