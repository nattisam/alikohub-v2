import type { Course } from "./types.d";

interface CourseHeaderProps {
  course: Course;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ course }) => (
  <div className="bg-gray-800 text-white p-6 rounded-t-lg">
    <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
    <div className="flex items-center space-x-4">
      <img
        src={course.instructor?.profilePicture || "https://via.placeholder.com/40"}
        alt={`${course.instructor?.firstname} ${course.instructor?.lastname}`}
        className="w-10 h-10 rounded-full"
      />
      <div>
        <p className="text-sm">Instructor: {`${course.instructor?.firstname} ${course.instructor?.lastname}`}</p>
        <p className="text-xs text-gray-400">{course.instructor.email}</p>
      </div>
    </div>
    {course.thumbnail && (
      <img
        src={course.thumbnail}
        alt={`${course.title} thumbnail`}
        className="w-full h-48 object-cover mt-4 rounded-lg"
      />
    )}
  </div>
);

export default CourseHeader;