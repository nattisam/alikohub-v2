import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import { enrollmentApi } from "../../api/enrollmentApi";
import { useAuth } from "../../contexts/AuthContext";
import { useCourse } from "../../queries/courseQueries";
import { useCourseModules } from "../../queries/moduleQueries";
import type { Course, Enrollment, CourseModule, CourseLesson } from "../../components/common/types.d";
import { 
  FaStar, FaChevronDown, FaPlay, FaRegHeart, FaShareAlt, 
  FaInfinity, FaCertificate, FaMobileAlt, FaDownload, FaShieldAlt 
} from "react-icons/fa";

const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [enrolling, setEnrolling] = useState(false);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  const { data: course, isLoading, isError } = useCourse(parseInt(courseId || '0'));

  // Check if user has selected a role
  const hasRole = (currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole) !== undefined;
  const isStudent = (currentUser?.academyActiveRole === 'STUDENT' || currentUser?.academyUser?.activeRole === 'STUDENT');
  
  // Check if user is already enrolled
  // Since the Course type doesn't include enrollments, we'll need to fetch them separately
  const [userEnrollments, setUserEnrollments] = useState<Enrollment[]>([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);


  
  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({});
  const [searchFilter, setSearchFilter] = useState('');

  
  // Fetch user enrollments
  useEffect(() => {
    const fetchUserEnrollments = async () => {
      if (currentUser) {
        // Retry function for handling 429 errors
        const fetchWithRetry = async (maxRetries = 3, delay = 1000) => {
          let retries = 0;
          
          while (retries <= maxRetries) {
            try {
              const response = await enrollmentApi.getMyCourses();
              // Handle response structure: if data has items array, use it, otherwise use data directly
              // Assuming response.data is the array of enrollments
              setUserEnrollments(response.data);
              return; // Success, exit the retry loop
            } catch (err: unknown) {
              console.error("Error fetching user enrollments:", err);
              
              // Check if it's a 429 error (Too Many Requests)
              if (err.response?.status === 429 && retries < maxRetries) {
                console.warn(`Rate limited, retrying in ${delay * Math.pow(2, retries)}ms...`);
                // Exponential backoff: wait longer after each retry
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, retries)));
                retries++;
              } else {
                break; // Stop retrying on other errors or max retries reached
              }
            }
          }
        };
        
        try {
          await fetchWithRetry();
        } finally {
          setEnrollmentsLoading(false);
        }
      } else {
        setEnrollmentsLoading(false);
      }
    };
    
    fetchUserEnrollments();
  }, [currentUser]);

  const { data: modulesFromQuery = [], isError: modulesError } = useCourseModules(parseInt(courseId || '0'));
  
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
        const fetchEnrollmentsWithRetry = async (maxRetries = 3, delay = 1000) => {
          let retries = 0;
          
          while (retries <= maxRetries) {
            try {
              const enrollmentResponse = await enrollmentApi.getMyCourses();
              // Handle response structure: if data has items array, use it, otherwise use data directly
              // Assuming response.data is the array of enrollments
              setUserEnrollments(enrollmentResponse.data);
              return; // Success, exit the retry loop
            } catch (err: unknown) {
              console.error("Error refreshing user enrollments after enrollment:", err);
              
              // Check if it's a 429 error (Too Many Requests)
              if (err.response?.status === 429 && retries < maxRetries) {
                console.warn(`Rate limited, retrying in ${delay * Math.pow(2, retries)}ms...`);
                // Exponential backoff: wait longer after each retry
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, retries)));
                retries++;
              } else {
                break; // Stop retrying on other errors or max retries reached
              }
            }
          }
        };
        
        await fetchEnrollmentsWithRetry();
      }
    }
    catch (err: unknown) {
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">

      <div className="max-w-7xl mx-auto px-4 py-24 grid grid-cols-12 gap-8">
        
        {/* LEFT SIDEBAR - Filters */}
        <aside className="hidden lg:block col-span-2 space-y-8">
          <div>
            <h4 className="font-bold mb-4">Filters</h4>
            <input 
              type="text" 
              placeholder="Search in content" 
              className="w-full border rounded-lg p-2 text-xs mb-6" 
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
            
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Category</p>
              {course && (
                <label key={course.category} className="flex items-center justify-between text-sm cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories[course.category] || false}
                      onChange={() => {
                        setSelectedCategories(prev => ({
                          ...prev,
                          [course.category]: !prev[course.category]
                        }));
                      }}
                      className="rounded text-blue-600" 
                    />
                    <span className={selectedCategories[course.category] ? "font-bold" : "text-gray-500"}>{course.category}</span>
                  </div>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                    {course.enrolledNum || 0}
                  </span>
                </label>
              )}
            </div>
          </div>
          <button className="w-full py-2 text-sm font-bold bg-gray-100 rounded-xl hover:bg-gray-200 transition">Clear All Filters</button>
        </aside>

        {/* MAIN CONTENT - Course Info */}
        <main className="col-span-12 lg:col-span-7">
          <div className="bg-[#E9F0F7] rounded-[40px] p-8 md:p-12 relative overflow-hidden mb-12 min-h-[500px]">
             {/* Header Tags */}
             <div className="flex gap-2 mb-6">
                <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-tighter">
                  <FaStar size={8} /> Best Seller
                </span>
                <span className="bg-blue-200 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">New Update</span>
             </div>

             <h1 className="text-5xl font-black text-slate-900 leading-[1.1] mb-6 max-w-md">
                {course.title}
             </h1>
             
             <p className="text-slate-600 text-lg mb-10 max-w-md leading-relaxed">
                {course.shortDescription || "Master the art of high-level business strategy with industry experts. Learn how to navigate complex international markets."}
             </p>

             <div className="flex items-center gap-8 mb-12">
                <div className="flex items-center gap-2">
                   <FaStar className="text-orange-400" />
                   <span className="font-bold text-sm">{(course.rating || 0).toFixed(1)} ({course.enrolledNum || 0} Ratings)</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                     {(course.instructor?.firstname?.charAt(0) || 'U') + (course.instructor?.lastname?.charAt(0) || 'N')}
                   </div>
                   <span className="text-sm font-medium">Instructor: <span className="font-bold">{course.instructor?.firstname} {course.instructor?.lastname}</span></span>
                </div>
             </div>

             {/* Dynamic Stats Grid */}
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
                <div className="bg-white/80 backdrop-blur rounded-2xl p-4 flex items-center gap-3">
                   <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      <FaPlay size={14} />
                   </div>
                   <div>
                      <p className="text-xl font-black">{course.estimatedTime ? Math.floor(course.estimatedTime / 60) + '+' : 'N/A'}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Hours Content</p>
                   </div>
                </div>
                <div className="bg-white/80 backdrop-blur rounded-2xl p-4 flex items-center gap-3">
                   <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                      <FaDownload size={14} />
                   </div>
                   <div>
                      <p className="text-xl font-black">{modulesFromQuery.reduce<number>((total, module: CourseModule) => total + (module.lessons?.length || 0), 0)}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Lessons</p>
                   </div>
                </div>
                <div className="bg-white/80 backdrop-blur rounded-2xl p-4 flex items-center gap-3">
                   <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                      <FaStar size={14} />
                   </div>
                   <div>
                      <p className="text-xl font-black">{course.enrolledNum ? (course.enrolledNum > 1000 ? (course.enrolledNum/1000).toFixed(1) + 'k' : course.enrolledNum) : 'N/A'}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Active Students</p>
                   </div>
                </div>
             </div>

             {/* Video Play Preview (Floating Right) */}
             <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 hidden xl:block w-72">
                <div className="bg-black rounded-3xl aspect-[4/3] relative overflow-hidden border-4 border-white shadow-2xl">
                   <img src={course.thumbnail} className="w-full h-full object-cover opacity-60" alt="preview" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40">
                         <FaPlay className="text-white ml-1" />
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Curriculum Section */}
          <section>
             <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-black text-slate-900">Course Curriculum</h2>
                <span className="text-sm font-bold text-gray-400">Total duration: {course?.estimatedTime ? `${Math.floor(course.estimatedTime / 60)}h ${course.estimatedTime % 60}m` : 'N/A'}</span>
             </div>

             <div className="space-y-4">
                {modulesFromQuery.map((module: CourseModule, idx: number) => {
                  // Calculate lesson count and duration for this module
                  const lessonCount = module.lessons ? module.lessons.length : 0;
                  // Calculate approximate duration based on number of lessons
                  const hours = Math.floor(lessonCount * 0.75);
                  const minutes = (lessonCount * 45) % 60;
                  const duration = hours > 0 ? `${hours}h ${minutes}m` : `${lessonCount * 45}m`; // Approximate 45 min per lesson
                  
                  return (
                    <div key={module.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                      <div className="p-6 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-4">
                          <FaChevronDown className={`text-gray-400 transition ${idx === 0 ? '' : '-rotate-90'}`} />
                          <div>
                             <p className="font-bold text-lg">Module {idx + 1}: {module.title}</p>
                             <p className="text-xs text-gray-400 font-bold">{lessonCount} Lessons • {duration}</p>
                          </div>
                        </div>
                        {idx === 0 && <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white"><FaStar size={10} /></div>}
                      </div>
                      {module.lessons && module.lessons.length > 0 && (
                        <div className="px-6 pb-6 space-y-4 border-t border-gray-50 pt-4">
                          {module.lessons.map((lesson: CourseLesson) => (
                            <div key={lesson.id} className="flex items-center justify-between text-sm font-bold text-gray-600">
                              <div className="flex items-center gap-3">
                                <FaPlay size={12} className="text-blue-600" /> {lesson.title}
                              </div>
                              <span className="text-gray-400">{(lesson.title.length % 12) + 5}:{(lesson.title.length * 7 % 60).toString().padStart(2, '0')}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
             </div>
          </section>
        </main>

        {/* RIGHT SIDEBAR - Purchase Card */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-[32px] shadow-2xl shadow-blue-100 overflow-hidden sticky top-24">
            <div className="h-48 bg-gray-100 overflow-hidden">
                <img src={course.thumbnail} className="w-full h-full object-cover" alt="thumbnail" />
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl font-black">${course.price?.toFixed(2) || "0.00"}</span>
                {course.price && course.price < 500 && (
                  <>
                    <span className="text-gray-400 line-through font-bold">${(course.price * 2.5).toFixed(2)}</span>
                    <span className="text-green-500 font-black text-sm">{Math.round(((course.price * 2.5 - course.price) / (course.price * 2.5)) * 100)}% OFF</span>
                  </>
                )}
              </div>

              <button 
                onClick={() => {
                  if (isEnrolled) {
                    navigate("/dashboard");
                  } else {
                    handleEnroll();
                  }
                }}
                disabled={enrolling}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl mb-4 transition transform active:scale-95 disabled:opacity-50"
              >
                {isEnrolled ? "Go to Dashboard" : enrolling ? "Processing..." : "Enroll Now"}
              </button>

              <div className="flex gap-2 mb-8">
                 <button className="flex-1 bg-gray-50 hover:bg-gray-100 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition">
                    <FaRegHeart className="text-gray-400" /> Wishlist
                 </button>
                 <button className="w-12 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 transition">
                    <FaShareAlt />
                 </button>
              </div>

              <div className="space-y-4 mb-8">
                <p className="font-bold text-sm">This course includes:</p>
                <div className="space-y-3 text-xs font-bold text-slate-600">
                  <div className="flex items-center gap-3"><FaInfinity className="text-blue-600" /> Lifetime access</div>
                  <div className="flex items-center gap-3"><FaCertificate className="text-blue-600" /> Verified Certificate</div>
                  <div className="flex items-center gap-3"><FaMobileAlt className="text-blue-600" /> Access on mobile and TV</div>
                  <div className="flex items-center gap-3"><FaDownload className="text-blue-600" /> {modulesFromQuery.reduce<number>((total, module: CourseModule) => total + (module.lessons?.length || 0), 0)} Downloadable resources</div>
                </div>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-2xl flex gap-3 items-start border border-blue-100">
                 <FaShieldAlt className="text-blue-600 mt-1 shrink-0" />
                 <p className="text-[10px] font-bold text-blue-800 leading-relaxed">
                   30-Day Money-Back Guarantee. No questions asked.
                 </p>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default CourseDetailsPage;