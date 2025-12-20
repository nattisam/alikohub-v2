import React, { useState, useEffect } from "react";
import { academyApi } from "../api";
import type { Course } from "./types.d";
import { FaUsers, FaChartLine, FaBook, FaGraduationCap } from "react-icons/fa";
import StudentProgressDetails from "./StudentProgressDetails";

interface StudentProgress {
  student: {
    id: string;
    name: string;
  };
  totalLessons: number;
  completed: number;
  percentage: number;
}

interface CourseAnalyticsProps {
  course: Course;
  onClose: () => void;
}

const CourseAnalytics: React.FC<CourseAnalyticsProps> = ({ course, onClose }) => {
  const [studentsProgress, setStudentsProgress] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await academyApi.get(`/progress/course/${course.id}/students`);
        setStudentsProgress(response.data);
      } catch (err) {
        console.error("Error fetching course analytics:", err);
        setError("Failed to load course analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [course.id]);

  const averageProgress = studentsProgress.length > 0
    ? studentsProgress.reduce((sum, student) => sum + student.percentage, 0) / studentsProgress.length
    : 0;

  const completedCourses = studentsProgress.filter(student => student.percentage === 100).length;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <p>Loading course analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <p className="text-red-500">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Analytics for "{course.title}"
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <FaUsers className="text-blue-500 text-xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {studentsProgress.length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center">
                  <FaChartLine className="text-green-500 text-xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Avg. Progress</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {averageProgress.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <div className="flex items-center">
                  <FaGraduationCap className="text-yellow-500 text-xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {completedCourses}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center">
                  <FaBook className="text-purple-500 text-xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {studentsProgress.length > 0 
                        ? ((completedCourses / studentsProgress.length) * 100).toFixed(1) 
                        : "0"}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Students Progress Table */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Student Progress
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Student
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Progress
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Completed Lessons
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentsProgress.map((studentProgress) => (
                      <tr key={studentProgress.student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {studentProgress.student.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${studentProgress.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {studentProgress.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {studentProgress.completed} of {studentProgress.totalLessons}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${studentProgress.percentage === 100 
                              ? 'bg-green-100 text-green-800' 
                              : studentProgress.percentage > 0 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-gray-100 text-gray-800'}`}>
                            {studentProgress.percentage === 100 
                              ? 'Completed' 
                              : studentProgress.percentage > 0 
                                ? 'In Progress' 
                                : 'Not Started'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setSelectedStudent(studentProgress.student.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {selectedStudent && (
        <StudentProgressDetails
          course={course}
          studentId={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  );
};

export default CourseAnalytics;