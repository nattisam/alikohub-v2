import React, { useState, useEffect } from "react";
import { courseApi } from "../api/courseApi";
import { enrollmentApi } from "../api/enrollmentApi";
import StudentModuleView from "./StudentModuleView";

interface EnrollmentModalProps {
  courseId: number;
  courseTitle: string;
  onClose: () => void;
  onEnrollSuccess: () => void;
  onEnrollComplete?: () => void; // Add this new prop
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ 
  courseId, 
  courseTitle, 
  onClose, 
  onEnrollSuccess,
  onEnrollComplete // Add this new prop
}) => {
  const [enrollmentType, setEnrollmentType] = useState<"direct" | "cohort">("direct");
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");
  const [showCourseContent, setShowCourseContent] = useState(false);

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const response = await courseApi.getCohorts(courseId);
        setCohorts(response.data);
        if (response.data.length > 0) {
          setSelectedCohort(response.data[0].id);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cohorts:", err);
        setLoading(false);
      }
    };

    fetchCohorts();
  }, [courseId]);

  const handleEnroll = async () => {
    setEnrolling(true);
    setError("");
    
    try {
      let enrollmentData: any = { courseId };
      
      if (enrollmentType === "cohort" && selectedCohort) {
        enrollmentData.cohortId = selectedCohort;
      }
      
      // Log the data being sent for debugging
      console.log("Sending enrollment data:", enrollmentData);
      
      await enrollmentApi.createEnrollment(enrollmentData);
      
      // Call the success callback
      onEnrollSuccess();
      
      // Call the complete callback if provided
      if (onEnrollComplete) {
        onEnrollComplete();
      }
      
      setShowCourseContent(true);
    } catch (err: any) {
      console.error("Enrollment error:", err);
      console.log("Enrollment error details:", {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      
      // Log the full error response
      if (err.response) {
        console.log("Full error response:", JSON.stringify(err.response, null, 2));
      }
      
      let errorMessage = "Failed to enroll in course. Please try again.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setEnrolling(false);
    }
  };

  if (showCourseContent) {
    return (
      <StudentModuleView 
        courseId={courseId} 
        onClose={onClose} 
      />
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading enrollment options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Enroll in {courseTitle}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full"
            >
              ×
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">
            Choose how you want to enroll in this course:
          </p>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="enrollmentType"
                  checked={enrollmentType === "direct"}
                  onChange={() => setEnrollmentType("direct")}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium">Direct Enrollment</span>
                  <p className="text-sm text-gray-600">
                    Enroll directly in the course without joining a specific cohort. 
                    You can join a cohort later if available.
                  </p>
                </div>
              </label>
            </div>
            
            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="enrollmentType"
                  checked={enrollmentType === "cohort"}
                  onChange={() => setEnrollmentType("cohort")}
                  className="mt-1"
                  disabled={cohorts.length === 0}
                />
                <div className="flex-1">
                  <span className="font-medium">Cohort Enrollment</span>
                  <p className="text-sm text-gray-600 mb-2">
                    Join a specific cohort with other students. Cohorts may have 
                    specific start dates and schedules.
                  </p>
                  
                  {enrollmentType === "cohort" && cohorts.length > 0 && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Cohort
                      </label>
                      <select
                        value={selectedCohort || ""}
                        onChange={(e) => setSelectedCohort(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        {cohorts.map((cohort) => (
                          <option key={cohort.id} value={cohort.id}>
                            {cohort.name} ({new Date(cohort.startDate).toLocaleDateString()} - {new Date(cohort.endDate).toLocaleDateString()})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {cohorts.length === 0 && (
                    <p className="text-sm text-yellow-600 mt-1">
                      No cohorts available for this course yet.
                    </p>
                  )}
                </div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              disabled={enrolling}
            >
              Cancel
            </button>
            <button
              onClick={handleEnroll}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={enrolling || (enrollmentType === "cohort" && cohorts.length === 0 && !selectedCohort)}
            >
              {enrolling ? "Enrolling..." : "Enroll"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;