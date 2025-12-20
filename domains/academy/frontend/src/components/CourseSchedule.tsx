import React, { useState, useEffect } from "react";
import { FaChalkboardTeacher, FaComments, FaFileAlt, FaClock } from "react-icons/fa";
import { teachingScheduleApi } from "../api/teachingScheduleApi";
import type { TeachingSchedule } from "../api/teachingScheduleApi";

interface CourseScheduleProps {
  courseId: number;
  className?: string;
}

const CourseSchedule: React.FC<CourseScheduleProps> = ({ courseId, className = "" }) => {
  const [schedules, setSchedules] = useState<TeachingSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch schedules for this specific course
        const response = await teachingScheduleApi.getCourseSchedules(courseId);
        setSchedules(response.data);
      } catch (err: any) {
        console.error("Error fetching course schedules:", err);
        setError("Failed to load course schedules");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchSchedules();
    }
  }, [courseId]);

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
        return <FaChalkboardTeacher className="text-gray-500" />;
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
    
    return `${formatDate(date)} at ${formatTime(date)}`;
  };

  if (loading) {
    return (
      <div className={className}>
        <h3 className="text-xl font-extrabold mb-4">Course Schedule</h3>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <h3 className="text-xl font-extrabold mb-4">Course Schedule</h3>
        <div className="text-red-500 p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-xl font-extrabold mb-4">Course Schedule</h3>
      <div className="flex flex-col gap-3">
        {schedules && schedules.length > 0 ? (
          schedules.map((session) => (
            <div
              key={session.id}
              className={`p-3 flex items-center rounded-lg ${getScheduleColor(session.type)}`}
            >
              <div className="mr-3">
                {getScheduleIcon(session.type)}
              </div>
              <div className="flex-1">
                <div className="font-medium">{session.title}</div>
                <div className="text-sm text-gray-600">
                  {formatDateTime(session.startTime)}
                </div>
                {session.isRecurring && (
                  <div className="text-xs text-gray-500">
                    Recurring: {session.recurrencePattern}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-8">
            <p>No scheduled sessions for this course</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSchedule;