import type { Course } from "./types.d";
interface CourseOverviewProps {
  course: Course;
}

const CourseOverview: React.FC<CourseOverviewProps> = ({ course }) => (
  <div className="p-6 bg-white shadow-md rounded-b-lg">
    <h2 className="text-xl font-semibold mb-2">Course Overview</h2>
    <p className="text-gray-700 mb-4">{course.longDescription}</p>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-600">Category</p>
        <p className="font-medium">{course.category}</p>
      </div>
      <div>
        <p className="text-gray-600">Duration</p>
        <p className="font-medium">{course.estimatedTime || "Not specified"} hours</p>
      </div>
      <div>
        <p className="text-gray-600">Progress</p>
        <p className="font-medium">{course.progress || 0}%</p>
      </div>
    </div>
  </div>
);


export default CourseOverview;