import React, { useState, useEffect } from "react";
import { FaPlay, FaVideo, FaChalkboardTeacher, FaComments, FaFileAlt, FaClock, FaTrash } from "react-icons/fa";
import { teachingScheduleApi } from "../api/teachingScheduleApi";
import type { TeachingSchedule as ApiTeachingSchedule } from "../api/teachingScheduleApi";
import { useAuth } from "../contexts/AuthContext";

interface TeachingScheduleProps {
  className: string;
  onAddSession: () => void;
  courseId?: number;
  refreshKey?: number; // Add refreshKey prop
}

const TeachingSchedule: React.FC<TeachingScheduleProps> = ({ className, onAddSession, courseId, refreshKey = 0 }) => {
  const [schedules, setSchedules] = useState<ApiTeachingSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuth().user;

  // Fetch schedules based on context (instructor or course)
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (courseId) {
          // Fetch schedules for a specific course
          response = await teachingScheduleApi.getCourseSchedules(courseId);
        } else {
          // Fetch schedules for the current instructor
          response = await teachingScheduleApi.getInstructorSchedules();
        }
        
        setSchedules(response.data);
      } catch (err: any) {
        console.error("Error fetching teaching schedules:", err);
        setError("Failed to load teaching schedules");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSchedules();
    }
  }, [user, courseId, refreshKey]); // Add refreshKey to dependencies

  const getScheduleIcon = (type: string) => {
    switch (type) {
      case "LECTURE":
        return <FaChalkboardTeacher className="text-blue-500" />;
      case "DISCUSSION":
        return <FaComments className="text-green-500" />;
      case "EXAM":
        return <FaFileAlt className="text-red-500" />;
      case "ASSIGNMENT":
        return <FaFileAlt className="text-yellow-500" />;
      case "OFFICE_HOURS":
        return <FaClock className="text-purple-500" />;
      default:
        return <FaVideo className="text-gray-500" />;
    }
  };

  const getScheduleColor = (type: string) => {
    switch (type) {
      case "LECTURE":
        return "border-l-4 border-blue-400 bg-blue-50";
      case "DISCUSSION":
        return "border-l-4 border-green-400 bg-green-50";
      case "EXAM":
        return "border-l-4 border-red-400 bg-red-50";
      case "ASSIGNMENT":
        return "border-l-4 border-yellow-400 bg-yellow-50";
      case "OFFICE_HOURS":
        return "border-l-4 border-purple-400 bg-purple-50";
      default:
        return "bg-gray-50";
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
      hours = hours ? hours : 12; // the hour '0' should be '12'
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

  if (loading) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-extrabold">Teaching Schedule</h3>
          <button
            className="bg-gradient-to-r from-[#E6D600] to-[#F2F296] text-white px-4 py-2 rounded-full mt-2"
            onClick={onAddSession}
          >
            + Add Session
          </button>
        </div>
        <div className="flex justify-center items-center h-[80%]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-extrabold">Teaching Schedule</h3>
          <button
            className="bg-gradient-to-r from-[#E6D600] to-[#F2F296] text-white px-4 py-2 rounded-full mt-2"
            onClick={onAddSession}
          >
            + Add Session
          </button>
        </div>
        <div className="flex justify-center items-center h-[80%] text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-extrabold">Teaching Schedule</h3>
        <button
          className="bg-gradient-to-r from-[#E6D600] to-[#F2F296] px-4 py-2 rounded-full mt-2"
          onClick={onAddSession}
        >
          + Add Session
        </button>
      </div>
      <div className="flex flex-col gap-4 overflow-auto h-[80%]">
        {schedules && schedules.length > 0 ? (
          schedules.map((session) => {
            return (
              <div
                key={session.id}
                className={`p-3 flex justify-between items-center rounded-lg ${getScheduleColor(session.type)}`}
              >
                <div className="flex items-center">
                  <div className="mr-3">
                    {getScheduleIcon(session.type)}
                  </div>
                  <div>
                    <div className="font-medium">{session.title}</div>
                    <div className="text-sm text-gray-600">
                      {session.type} • {formatDateTime(session.startTime)}
                    </div>
                    {session.isRecurring && (
                      <div className="text-xs text-gray-500">
                        Recurring: {session.recurrencePattern}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteSchedule(session.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-[80%] text-gray-500">
            <FaChalkboardTeacher size={32} className="mb-2" />
            <p>No teaching schedules found</p>
            <p className="text-sm mt-1">Click "Add Session" to create one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachingSchedule;