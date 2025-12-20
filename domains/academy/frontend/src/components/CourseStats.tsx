import React from 'react';
import type { Course } from './types.d';
import { FaBook, FaUsers, FaStar, FaClock } from 'react-icons/fa';

interface CourseStatsProps {
  courses: Course[];
}

const CourseStats: React.FC<CourseStatsProps> = ({ courses }) => {
  if (!courses || courses.length === 0) {
    return null;
  }

  const totalCourses = courses.length;
  const totalEnrollments = courses.reduce((sum, course) => sum + (course.enrolledNum || 0), 0);
  const averageRating = (courses.reduce((sum, course) => sum + (course.rating || 0), 0) / totalCourses).toFixed(1);
  const totalEstimatedTime = courses.reduce((sum, course) => sum + (course.estimatedTime || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow-sm">
        <FaBook className="text-blue-600 text-3xl mr-4" />
        <div>
          <p className="text-gray-500 text-sm">Total Courses</p>
          <h3 className="text-xl font-bold text-gray-800">{totalCourses}</h3>
        </div>
      </div>
      <div className="flex items-center p-4 bg-green-50 rounded-lg shadow-sm">
        <FaUsers className="text-green-600 text-3xl mr-4" />
        <div>
          <p className="text-gray-500 text-sm">Total Enrollments</p>
          <h3 className="text-xl font-bold text-gray-800">{totalEnrollments}</h3>
        </div>
      </div>
      <div className="flex items-center p-4 bg-yellow-50 rounded-lg shadow-sm">
        <FaStar className="text-yellow-600 text-3xl mr-4" />
        <div>
          <p className="text-gray-500 text-sm">Average Rating</p>
          <h3 className="text-xl font-bold text-gray-800">{averageRating} / 5.0</h3>
        </div>
      </div>
      <div className="flex items-center p-4 bg-purple-50 rounded-lg shadow-sm">
        <FaClock className="text-purple-600 text-3xl mr-4" />
        <div>
          <p className="text-gray-500 text-sm">Total Duration</p>
          <h3 className="text-xl font-bold text-gray-800">{totalEstimatedTime} hours</h3>
        </div>
      </div>
    </div>
  );
};

export default CourseStats;
