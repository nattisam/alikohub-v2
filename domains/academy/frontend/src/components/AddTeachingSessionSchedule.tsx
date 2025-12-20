import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { academyApi } from "../api";

import type { ITeachingSchedule } from "./types.d";

interface AddTeachingSessionScheduleProps {
  onAdd: () => void; // Simplified callback
  onClose: () => void;
  courseId: number;
}

const AddTeachingSessionSchedule: React.FC<AddTeachingSessionScheduleProps> = ({
  onAdd,
  onClose,
  courseId,
}) => {
  const [newSession, setNewSession] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    type: "LIVE",
    isRecurring: false,
    recurrencePattern: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate that start time is before end time
      if (new Date(newSession.startTime) >= new Date(newSession.endTime)) {
        throw new Error("Start time must be before end time");
      }
      
      // Validate that courseId is provided
      if (!courseId) {
        throw new Error("Course ID is required to create a schedule");
      }
      
      // Create the schedule data with courseId
      const scheduleData = {
        title: newSession.title,
        description: newSession.description,
        startTime: new Date(newSession.startTime).toISOString(),
        endTime: new Date(newSession.endTime).toISOString(),
        type: newSession.type,
        courseId: Number(courseId), // Ensure it's a number
        isRecurring: newSession.isRecurring,
        recurrencePattern: newSession.isRecurring ? newSession.recurrencePattern : undefined, // Only send recurrencePattern if isRecurring is true
      };
      
      console.log("Creating schedule with data:", scheduleData);
      const response = await academyApi.post('/teaching-schedules', scheduleData);
      console.log("Server response:", response);
      
      // Call the onAdd callback to refresh the schedules
      onAdd();
      
      // Reset form
      setNewSession({ 
        title: "", 
        description: "",
        startTime: "", 
        endTime: "", 
        type: "LIVE",
        isRecurring: false,
        recurrencePattern: "",
      });
      
      // Close the form
      onClose();
    } catch (err: any) {
      console.error("Error adding teaching schedule:", err);
      console.error("Error response:", err.response);
      console.error("Error request:", err.request);
      console.error("Error config:", err.config);
      
      // Try to get more specific error information
      let errorMessage = "Failed to add teaching schedule";
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
    <div className="backdrop-blur-md w-screen h-screen fixed inset-0 overflow-auto top-0 bg-gray-300/20 p-20 bg-opacity-50 z-50">
      <form onSubmit={handleSubmit} className="mt-4 z-30 space-y-4 bg-white rounded-2xl w-[50%] p-10 pt-4 mx-auto">
        <div className="flex justify-between px-5 items-center">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Add Teaching Schedule
          </h2>
          <button
            onClick={onClose}
            className="w-fit h-fit p-2 hover:bg-red-300 hover:text-red-400 "
            type="button"
          >
            <FaXmark size={20} />
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        
        <input
          type="text"
          name="title"
          value={newSession.title}
          onChange={(e) =>
            setNewSession({ ...newSession, title: e.target.value })
          }
          placeholder="Session Title"
          required
          className="w-full p-2 border rounded"
          disabled={loading}
        />
        
        <textarea
          name="description"
          value={newSession.description}
          onChange={(e) =>
            setNewSession({ ...newSession, description: e.target.value })
          }
          placeholder="Session Description (optional)"
          className="w-full p-2 border rounded"
          disabled={loading}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={newSession.startTime}
              onChange={(e) =>
                setNewSession({ ...newSession, startTime: e.target.value })
              }
              required
              className="w-full p-2 border rounded"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="datetime-local"
              value={newSession.endTime}
              name="endTime"
              onChange={(e) =>
                setNewSession({ ...newSession, endTime: e.target.value })
              }
              required
              className="w-full p-2 border rounded"
              disabled={loading}
            />
          </div>
        </div>
        
        <select
          value={newSession.type}
          onChange={(e) =>
            setNewSession({
              ...newSession,
              type: e.target.value,
            })
          }
          className="w-full p-2 border rounded"
          disabled={loading}
        >
          <option value="LIVE">Live Session</option>
          <option value="RECORDING">Recording</option>
          <option value="Q_AND_A">Q&A Session</option>
          <option value="OFFICE_HOURS">Office Hours</option>
          <option value="WORKSHOP">Workshop</option>
        </select>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isRecurring"
            checked={newSession.isRecurring}
            onChange={(e) =>
              setNewSession({
                ...newSession,
                isRecurring: e.target.checked,
              })
            }
            className="mr-2"
            disabled={loading}
          />
          <label htmlFor="isRecurring" className="text-sm text-gray-700">
            Recurring Session
          </label>
        </div>
        
        {newSession.isRecurring && (
          <select
            value={newSession.recurrencePattern}
            onChange={(e) =>
              setNewSession({ ...newSession, recurrencePattern: e.target.value })
            }
            className="w-full p-2 border rounded"
            disabled={loading}
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        )}
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Schedule"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTeachingSessionSchedule;