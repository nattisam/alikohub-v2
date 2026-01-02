import React, { useState } from "react";
import { useInstructorCourses } from "../hooks/useInstructorCourses";
import { useAuth } from "../contexts/AuthContext";
import { FaPlus, FaEdit, FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AccessDenied from "../components/states/AccessDenied";
import AddModuleModal from "../components/AddModuleModal";

// Icons
import { 
  Plus, 
  Edit3, 
  BookOpen, 
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Settings,
  Users,
  BarChart3,
  Clock,
  Award
} from 'lucide-react';

const InstructorMyCourses: React.FC = () => {
  const { courses } = useInstructorCourses();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const activeRole =
    currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
  const mainRole =
    currentUser?.academyRole || currentUser?.academyUser?.role;

  const hasInstructorAccess =
    activeRole === "INSTRUCTOR" ||
    mainRole === "INSTRUCTOR" ||
    activeRole === "ADMIN";

  // State for modals
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  
  // State for search
  const [searchTerm, setSearchTerm] = useState("");

  if (!hasInstructorAccess) {
    return (
      <div className="p-6">
        <AccessDenied
          title="Access Denied"
          message="You don't have permission to access instructor courses."
          showHomeButton
          showBackButton
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-1">
              Manage your content and track student progress.
            </p>
          </div>
  
          <button
            onClick={() => navigate("/instructor/create-course")}
            className="bg-indigo-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus size={18} /> Create New Course
          </button>
        </div>
  
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            />
          </div>
  
    
        </div>
  
        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses
            .filter(course => 
              course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              course.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(course => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="h-40 bg-gray-200 relative">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  )}
          
                  <span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                    {course.status ?? "Draft"}
                  </span>
                </div>
          
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">
                    {course.title}
                  </h3>
          
                  <p className="text-sm text-gray-500 mb-3">
                    {course.updatedAt
                      ? `Updated recently`
                      : `Created recently`} • {" "}
                    {course.enrolledNum ?? 0} Students
                  </p>
          
                  {/* Progress */}
                  <div className="h-2 bg-gray-200 rounded mb-3">
                    <div
                      className="h-2 bg-green-500 rounded"
                      style={{ width: `${course.progress ?? 0}%` }}
                    />
                  </div>
          
                  {/* Actions */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => navigate(`/instructor/mycourses/manage/${course.id}`)}
                      className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm hover:bg-indigo-50 hover:border-indigo-300 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <Edit3 size={16} /> Manage
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setShowAddModuleModal(true);
                      }}
                      className="flex-1 bg-indigo-50 text-indigo-600 rounded-lg py-2.5 text-sm hover:bg-indigo-100 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <BookOpen size={16} /> + Module
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
  
        {/* Pagination (UI only) */}
        <div className="flex justify-center gap-2 mt-10">
          <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
            <ChevronLeft size={18} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center border border-indigo-600 bg-indigo-600 text-white rounded-lg">
            1
          </button>
          <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
            2
          </button>
          <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
            3
          </button>
          <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-indigo-50 transition-colors duration-300">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
  
      {/* Add Module Modal */}
      {showAddModuleModal && selectedCourseId && (
        <AddModuleModal
          courseId={selectedCourseId}
          isOpen={showAddModuleModal}
          onClose={() => {
            setShowAddModuleModal(false);
            setSelectedCourseId(null);
          }}
          onModuleAdded={() => {
            // Refresh the course list to show updated modules
            // This will be handled by the context provider
          }}
        />
      )}
      
    </div>
  );
};


export default InstructorMyCourses;
