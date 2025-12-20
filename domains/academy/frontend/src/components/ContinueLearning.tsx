import courseImg from "../assets/courses.png";
import { useState, useEffect } from "react";
import { progressApi } from "../api/progressApi";
import type { CourseProgress } from "../api/progressApi";
import { courseApi } from "../api/courseApi";
import type { Course } from "./types.d.tsx";
import { FaChartLine } from "react-icons/fa";

export default function ContinueLearning({ onviewProgress, onViewCourseContent }: { onviewProgress?: (courseId: number) => void, onViewCourseContent?: (courseId: number) => void }) {
  const [courses, setCourses] = useState<(CourseProgress & { thumbnail?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch student dashboard data which includes progress information
        const response = await progressApi.getStudentDashboard();
        const courseProgressData: CourseProgress[] = response.data;
        
        // Enhance the data with actual course information including thumbnails
        if (courseProgressData.length > 0) {
          // Get detailed course information for each enrolled course
          const courseDetails = await Promise.all(
            courseProgressData.map(async (progress) => {
              try {
                const courseResponse = await courseApi.getCourse(progress.courseId);
                const course: Course = courseResponse.data;
                return {
                  ...progress,
                  course: course.title || progress.course,
                  thumbnail: course.thumbnail // Add thumbnail from course data
                };
              } catch (error) {
                // If we can't get the course details, use the existing data
                return progress;
              }
            })
          );
          setCourses(courseDetails);
        } else {
          setCourses(courseProgressData);
        }
      } catch (err: any) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses");
        // Fallback to dummy data if API fails
        setCourses([
          { courseId: 1, course: "Cloud Practitioner", percentage: 20 },
          { courseId: 2, course: "Azure Fundamentals", percentage: 65 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="w-full mt-6">
        <div className="max-w-[1200px] mx-auto bg-white border border-[#E7E7E7] rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-2xl font-semibold">
              Continue Learning
            </h2>
            <span className="text-gray-500 text-sm md:text-md">
              Loading...
            </span>
          </div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mt-6">
        <div className="max-w-[1200px] mx-auto bg-white border border-[#E7E7E7] rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-2xl font-semibold">
              Continue Learning
            </h2>
            <span className="text-gray-500 text-sm md:text-md">
              Error
            </span>
          </div>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-6">
      <div className="max-w-[1200px] mx-auto bg-white border border-[#E7E7E7] rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg md:text-2xl font-semibold">
            Continue Learning
          </h2>
          <span className="text-gray-500 text-sm md:text-md">
            {courses.length} Enrollments
          </span>
        </div>

        {courses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            You are not enrolled in any courses yet. Check out the courses available below!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.courseId}
                className="bg-white border border-[#E7E7E7] p-4 rounded shadow flex flex-col gap-6"
              >
                <img
                  src={course.thumbnail || "/placeholder-course-image.jpg"} // Use real thumbnail or fallback
                  alt={course.course}
                  className="w-full h-32 object-cover rounded"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-course-image.jpg";
                  }}
                />
                <h3 className="font-semibold">{course.course}</h3>
                <div className="flex flex-col gap-2">
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className="bg-[#E8D90F] h-2 rounded"
                      style={{ width: `${course.percentage}%` }}
                    />
                  </div>
                  <div className="text-left text-sm font-medium">
                    {course.percentage}%
                  </div>
                </div>
                <div className="flex gap-2">
                  {onviewProgress && (
                    <button
                      onClick={() => onviewProgress(course.courseId)}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      <FaChartLine />
                      <span>View Progress</span>
                    </button>
                  )}
                  {onViewCourseContent && (
                    <button
                      onClick={() => onViewCourseContent(course.courseId)}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      <span>View Content</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}