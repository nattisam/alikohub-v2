import type { Course } from "../common/types.d.tsx";
import type { EnrollmentWithCourse } from "../../api/enrollmentApi";
import { FaChartLine } from "react-icons/fa";
import { getCourseImageUrl } from "../../utils/imageUtils";
interface ContinueLearningProps {
  courses: Array<Course | EnrollmentWithCourse>;
  isLoading?: boolean;
  errorMessage?: string | null;
  onviewProgress?: (courseId: number) => void;
  onViewCourseContent?: (courseId: number) => void;
}

const isEnrollmentWithCourse = (
  item: Course | EnrollmentWithCourse,
): item is EnrollmentWithCourse => {
  return (item as EnrollmentWithCourse).course !== undefined;
};

export default function ContinueLearning({
  courses,
  isLoading = false,
  errorMessage = null,
  onviewProgress,
  onViewCourseContent,
}: ContinueLearningProps) {
  if (isLoading) {
    return (
      <div className="w-full mt-6">
        <div className="max-w-[1200px] mx-auto bg-white border border-[#E7E7E7] rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-2xl font-semibold">
              Continue Learning
            </h2>
            <span className="text-gray-500 text-sm md:text-md">Loading...</span>
          </div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="w-full mt-6">
        <div className="max-w-[1200px] mx-auto bg-white border border-[#E7E7E7] rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-2xl font-semibold">
              Continue Learning
            </h2>
            <span className="text-gray-500 text-sm md:text-md">Error</span>
          </div>
          <p className="text-red-500">{errorMessage}</p>
        </div>
      </div>
    );
  }

  // Map enrollments to the format expected by the UI
  const coursesWithDetails = courses.map((item) => {
    if (isEnrollmentWithCourse(item)) {
      const course = item.course;
      return {
        courseId: item.courseId,
        title: course?.title || String(item.courseId),
        thumbnail: course?.thumbnail,
        percentage: item.progress || 0,
      };
    }

    return {
      courseId: item.id,
      title: item.title,
      thumbnail: item.thumbnail,
      percentage: item.progress || 0,
    };
  });

  return (
    <div className="w-full mt-6">
      <div className="max-w-[1200px] mx-auto bg-white border border-[#E7E7E7] rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg md:text-2xl font-semibold">
            Continue Learning
          </h2>
          <span className="text-gray-500 text-sm md:text-md">
            {coursesWithDetails.length} Enrollments
          </span>
        </div>

        {coursesWithDetails.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            You are not enrolled in any courses yet. Check out the courses
            available below!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesWithDetails.map((course) => (
              <div
                key={course.courseId}
                className="bg-white border border-[#E7E7E7] p-4 rounded shadow flex flex-col gap-6"
              >
                {course.thumbnail ? (
                  <img
                    src={getCourseImageUrl(course.thumbnail)} // Use real thumbnail from server database
                    alt={course.title}
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <h3 className="font-semibold">{course.title}</h3>
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
