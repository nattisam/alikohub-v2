import { FaTrash, FaEye, FaEdit, FaChartLine, FaCalendarPlus, FaUserGraduate } from "react-icons/fa";

interface CourseCardProps {
  title: string;
  thumbnail: string;
  enrolledNum: number;
  progress: number;
  onView: () => void;
  onEdit?: () => void; // Made optional
  onDelete?: () => void; // Made optional
  onAnalytics?: () => void; // Added analytics prop
  onSchedule?: () => void; // Added schedule prop
  className: string;
}

const InstructorCourseCard: React.FC<CourseCardProps> = ({
  title,
  thumbnail,
  enrolledNum,
  progress,
  onView,
  onEdit,
  onDelete,
  onAnalytics,
  onSchedule,
  className,
}) => {
  // Check if CRUD operations are available
  const canEdit = !!onEdit;
  const canDelete = !!onDelete;
  const canAnalytics = !!onAnalytics;
  const canSchedule = !!onSchedule;

  // Use a default image if thumbnail is empty or null
  const displayThumbnail = thumbnail && thumbnail.trim() !== "" 
    ? thumbnail 
    : "https://placehold.co/600x400/cccccc/000000?text=No+Image";

  return (
    <div className={className}>
      <div className="relative mb-4 w-full rounded-t-2xl h-48 overflow-hidden">
        <img
          src={displayThumbnail}
          alt={`${title} thumbnail`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
          <FaUserGraduate className="mr-1" />
          {enrolledNum}
        </div>
      </div>
      <div className="flex flex-col gap-4 px-5 pb-5">
        <h4 className="text-xl font-bold text-gray-900 truncate">{title}</h4>
        <div className="w-full">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onView}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 shadow hover:shadow-md"
          >
            <FaEye className="mr-2" size={14} />
            <span>View</span>
          </button>
          {canEdit ? (
            <button
              onClick={onEdit}
              className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 px-3 py-2 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 shadow hover:shadow-md border border-gray-300"
            >
              <FaEdit className="mr-2" size={14} />
              <span>Edit</span>
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-100 text-gray-400 px-3 py-2 rounded-lg flex items-center justify-center text-sm font-medium cursor-not-allowed border border-gray-200"
            >
              <FaEdit className="mr-2" size={14} />
              <span>Edit</span>
            </button>
          )}
          {canAnalytics ? (
            <button
              onClick={onAnalytics}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 py-2 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 shadow hover:shadow-md"
            >
              <FaChartLine className="mr-2" size={14} />
              <span>Analytics</span>
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-100 text-gray-400 px-3 py-2 rounded-lg flex items-center justify-center text-sm font-medium cursor-not-allowed border border-gray-200"
            >
              <FaChartLine className="mr-2" size={14} />
              <span>Analytics</span>
            </button>
          )}
          {canSchedule ? (
            <button
              onClick={onSchedule}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-2 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 shadow hover:shadow-md"
            >
              <FaCalendarPlus className="mr-2" size={14} />
              <span>Schedule</span>
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-100 text-gray-400 px-3 py-2 rounded-lg flex items-center justify-center text-sm font-medium cursor-not-allowed border border-gray-200"
            >
              <FaCalendarPlus className="mr-2" size={14} />
              <span>Schedule</span>
            </button>
          )}
        </div>
        {canDelete && (
          <button
            onClick={onDelete}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 shadow hover:shadow-md"
          >
            <FaTrash className="mr-2" size={14} />
            <span>Delete Course</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default InstructorCourseCard;