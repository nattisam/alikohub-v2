import React, { useState, useEffect, useCallback } from "react";
import { FaPlus, FaTrash, FaEdit, FaCalendarAlt, FaClock } from "react-icons/fa";
import { teachingScheduleApi } from "../api/teachingScheduleApi";
import { courseApi } from "../api/courseApi"; // Add course API import
import type { TeachingSchedule as ApiTeachingSchedule } from "../api/teachingScheduleApi";
import { useAuth } from "../contexts/AuthContext";

interface ManageTeachingSchedulesProps {
  className?: string;
  courseId?: number;
  courses?: { id: number; title: string }[]; // Add courses prop
  refreshKey?: number; // Add refreshKey prop to trigger refresh
}

const ManageTeachingSchedules: React.FC<ManageTeachingSchedulesProps> = ({ className = "", courseId, courses, refreshKey = 0 }) => {
  const [schedules, setSchedules] = useState<ApiTeachingSchedule[]>([]);
  const [availableCourses, setAvailableCourses] = useState<{ id: number; title: string }[]>([]); // Add state for courses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ApiTeachingSchedule | null>(null);
  const { user } = useAuth();

  // Fetch schedules based on context (instructor or course)
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch schedules
      let response;
      if (courseId) {
        // Fetch schedules for a specific course
        response = await teachingScheduleApi.getCourseSchedules(courseId);
      } else {
        // Fetch schedules for the current instructor
        response = await teachingScheduleApi.getInstructorSchedules();
      }
      
      setSchedules(response.data);
      
      // Fetch courses if not provided and not in course context
      if (!courseId && !courses) {
        try {
          const coursesResponse = await courseApi.getCourses();
          const courseData = Array.isArray(coursesResponse.data) 
            ? coursesResponse.data.map(course => ({ id: course.id, title: course.title }))
            : [];
          setAvailableCourses(courseData);
        } catch (courseError) {
          console.error("Error fetching courses:", courseError);
        }
      }
    } catch (err: any) {
      console.error("Error fetching teaching schedules:", err);
      setError("Failed to load teaching schedules");
    } finally {
      setLoading(false);
    }
  }, [user, courseId, courses, refreshKey]); // Add refreshKey to dependencies

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData, refreshKey]); // Add refreshKey to dependencies

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await teachingScheduleApi.deleteSchedule(scheduleId);
        setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
      } catch (err: any) {
        console.error("Error deleting schedule:", err);
        alert("Failed to delete schedule");
      }
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Format time as HH:MM AM/PM
    const formatTime = (date: Date) => {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      return hours + ':' + minutesStr + ' ' + ampm;
    };
    
    // Format date as Month Day
    const formatDate = (date: Date) => {
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return monthNames[date.getMonth()] + ' ' + date.getDate();
    };
    
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toDateString() === date.toDateString();
    
    if (isToday) {
      return `Today ${formatTime(date)}`;
    } else if (isTomorrow) {
      return `Tomorrow ${formatTime(date)}`;
    } else {
      return `${formatDate(date)} ${formatTime(date)}`;
    }
  };

  if (loading) {
    return (
      <div className={`${className} p-6 bg-white rounded-lg shadow`}>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} p-6 bg-white rounded-lg shadow`}>
        <div className="text-red-500 text-center py-4">{error}</div>
      </div>
    );
  }

  return (
    <div className={`${className} bg-white rounded-lg shadow`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Teaching Schedules</h2>
          <button
            onClick={() => {
              setEditingSchedule(null);
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FaPlus className="mr-2" /> Add Schedule
          </button>
        </div>

        {schedules.length === 0 ? (
          <div className="text-center py-12">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No schedules yet</h3>
            <p className="mt-1 text-gray-500">Get started by creating a new teaching schedule.</p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setEditingSchedule(null);
                  setShowForm(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                New Schedule
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recurring
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{schedule.title}</div>
                      {schedule.description && (
                        <div className="text-sm text-gray-500">{schedule.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {schedule.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-gray-400" />
                        {formatDateTime(schedule.startTime)} - {formatDateTime(schedule.endTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.isRecurring ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {schedule.recurrencePattern}
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingSchedule(schedule);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule Form Modal */}
      {showForm && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingSchedule ? "Edit Schedule" : "Create New Schedule"}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingSchedule(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
              </div>
              <ScheduleForm
                courseId={courseId}
                courses={courses || availableCourses} // Use provided courses or fetched courses
                schedule={editingSchedule}
                fetchData={fetchData} // Pass fetchData function
                onSave={() => {
                  setShowForm(false);
                  setEditingSchedule(null);
                }}
                onCancel={() => {
                  setShowForm(false);
                  setEditingSchedule(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Schedule Form Component
interface ScheduleFormProps {
  courseId?: number;
  courses?: { id: number; title: string }[]; // Add courses prop
  schedule: ApiTeachingSchedule | null;
  onSave: () => void;
  onCancel: () => void;
  fetchData: () => Promise<void>; // Add fetchData prop
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ courseId, courses, schedule, fetchData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: schedule?.title || "",
    description: schedule?.description || "",
    startTime: schedule?.startTime ? new Date(schedule.startTime).toISOString().slice(0, 16) : "",
    endTime: schedule?.endTime ? new Date(schedule.endTime).toISOString().slice(0, 16) : "",
    type: schedule?.type || "LIVE",
    selectedCourseId: courseId || schedule?.courseId || (courses && courses.length > 0 ? courses[0].id : 0),
    isRecurring: schedule?.isRecurring || false,
    recurrencePattern: schedule?.recurrencePattern || "WEEKLY"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate that start time is before end time
      if (new Date(formData.startTime) >= new Date(formData.endTime)) {
        throw new Error("Start time must be before end time");
      }
      
      if (schedule) {
        // Update existing schedule
        const scheduleData = {
          title: formData.title,
          description: formData.description,
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString(),
          type: formData.type,
          isRecurring: formData.isRecurring,
          recurrencePattern: formData.isRecurring ? formData.recurrencePattern : undefined // Only send recurrencePattern if isRecurring is true
        };
        
        console.log("Updating schedule with data:", scheduleData);
        await teachingScheduleApi.updateSchedule(schedule.id, scheduleData);
      } else {
        // Create new schedule
        // Use either the provided courseId, selectedCourseId, or ensure one is available
        const targetCourseId = courseId || formData.selectedCourseId;
        
        if (!targetCourseId) {
          throw new Error("Course ID is required to create a schedule");
        }
        
        const scheduleData = {
          title: formData.title,
          description: formData.description,
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString(),
          type: formData.type,
          courseId: Number(targetCourseId), // Convert to number
          isRecurring: formData.isRecurring,
          recurrencePattern: formData.isRecurring ? formData.recurrencePattern : undefined // Only send recurrencePattern if isRecurring is true
        };
        
        console.log("Creating schedule with data:", scheduleData);
        const response = await teachingScheduleApi.createSchedule(scheduleData);
        console.log("Server response:", response);
      }

      // Call onSave and then fetchData to refresh the schedules
      onSave();
      await fetchData(); // Refresh the schedules after saving
    } catch (err: any) {
      console.error("Error saving schedule:", err);
      console.error("Error response:", err.response);
      console.error("Error request:", err.request);
      console.error("Error config:", err.config);
      
      // Try to get more specific error information
      let errorMessage = "Failed to save schedule";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.statusText) {
        errorMessage = `Server error: ${err.response.statusText}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Course selection - only show when not in course context */}
      {!courseId && courses && courses.length > 0 && (
        <div>
          <label htmlFor="selectedCourseId" className="block text-sm font-medium text-gray-700">
            Course
          </label>
          <select
            name="selectedCourseId"
            id="selectedCourseId"
            value={formData.selectedCourseId}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <input
            type="datetime-local"
            name="startTime"
            id="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
            End Time
          </label>
          <input
            type="datetime-local"
            name="endTime"
            id="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type
        </label>
        <select
          name="type"
          id="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="LIVE">Live Session</option>
          <option value="RECORDING">Recording</option>
          <option value="Q_AND_A">Q&A Session</option>
          <option value="OFFICE_HOURS">Office Hours</option>
          <option value="WORKSHOP">Workshop</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isRecurring"
          id="isRecurring"
          checked={formData.isRecurring}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900">
          Is Recurring
        </label>
      </div>

      {formData.isRecurring && (
        <div>
          <label htmlFor="recurrencePattern" className="block text-sm font-medium text-gray-700">
            Recurrence Pattern
          </label>
          <select
            name="recurrencePattern"
            id="recurrencePattern"
            value={formData.recurrencePattern}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
        >
          {loading ? "Saving..." : schedule ? "Update Schedule" : "Create Schedule"}
        </button>
      </div>
    </form>
  );
};

export default ManageTeachingSchedules;