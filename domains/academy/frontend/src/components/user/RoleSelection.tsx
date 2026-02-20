import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Users } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import TeacherApplicationModal from "../auth/TeacherApplicationModal";

const RoleSelection: React.FC = () => {
  const { user, selectRole, switchRole, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingRole, setProcessingRole] = useState<
    "STUDENT" | "INSTRUCTOR" | null
  >(null);
  const [localInstructorPending, setLocalInstructorPending] = useState(false);

  useEffect(() => {
    // Refresh profile to ensure we have the latest role status from backend
    // This now includes the academy status as well
    refreshProfile();
  }, []); // Only run once on mount

  // Debug logs to help diagnose backend response
  useEffect(() => {
    if (user) {
      console.log("Current User in RoleSelection:", user);
      console.log("Role Status:", user.roleStatus);
      // Check for snake_case variant just in case
      console.log("Role Status (snake_case):", (user as any)?.role_status);
    }
  }, [user]);

  // Only show this section if user is authenticated
  if (!user) {
    return null;
  }

  const hasInstructorRole = user.availableRoles?.includes("INSTRUCTOR");
  const currentRole = user.academyActiveRole;

  const handleStudentSelection = async () => {
    setProcessingRole("STUDENT");
    try {
      // If user already has student role, just switch to it
      if (user.hasSelectedRole && user.availableRoles?.includes("STUDENT")) {
        await switchRole("STUDENT");
      } else {
        // Otherwise, select it for the first time
        await selectRole("STUDENT");
      }
      // Navigate to student dashboard
      navigate("/student-dashboard");
    } catch (error) {
      console.error("Error selecting student role:", error);
    } finally {
      setProcessingRole(null);
    }
  };

  const handleInstructorSelection = () => {
    // If user already has instructor role, switch to it
    if (hasInstructorRole) {
      setProcessingRole("INSTRUCTOR");
      switchRole("INSTRUCTOR")
        .then(() => {
          navigate("/instructor");
        })
        .catch((error) => {
          console.error("Error switching to instructor role:", error);
        })
        .finally(() => {
          setProcessingRole(null);
        });
    } else {
      // Otherwise, open the application modal
      setIsModalOpen(true);
    }
  };

  const handleApplicationSuccess = async () => {
    // Just close the modal. The application is submitted and pending approval.
    // The user object should eventually update to reflect 'pending' status.
    setLocalInstructorPending(true);
    setIsModalOpen(false);
    // Force another refresh to be sure
    refreshProfile();
  };

  // Check if instructor application is pending
  // We check roleStatus from backend as source of truth.
  // We also check for snake_case 'role_status' which is common in some backends.
  const isInstructorPending =
    !hasInstructorRole &&
    (localInstructorPending ||
      user.hasTeacherApplication ||
      user.instructorStatus === "pending" ||
      user.roleStatus?.instructor === "pending");

  const isInstructorRejected =
    !hasInstructorRole &&
    (user.instructorStatus === "rejected" ||
      user.roleStatus?.instructor === "rejected");

  return (
    <>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How would you like to continue?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose your path and start your journey with AlikoHub Academy
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Student Card */}
            <div className="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8 hover:border-[#17469E] transition-all duration-300 hover:shadow-xl">
              <div className="absolute top-6 right-6 w-16 h-16 bg-[#17469E]/10 rounded-full flex items-center justify-center group-hover:bg-[#17469E]/20 transition-all">
                <GraduationCap className="w-8 h-8 text-[#17469E]" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Continue as Student
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access thousands of courses, learn at your own pace, and earn
                certificates to boost your career.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#17469E] mt-1">✓</span>
                  <span>Unlimited course access</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#17469E] mt-1">✓</span>
                  <span>Track your progress</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#17469E] mt-1">✓</span>
                  <span>Earn certificates</span>
                </li>
              </ul>

              <button
                onClick={handleStudentSelection}
                disabled={processingRole !== null}
                className="w-full px-6 py-3 bg-[#17469E] text-white font-semibold rounded-lg hover:bg-[#044C96] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {processingRole === "STUDENT"
                  ? "Processing..."
                  : currentRole === "STUDENT"
                    ? "Current Role ✓"
                    : user.availableRoles?.includes("STUDENT")
                      ? "Switch to Student"
                      : "Start Learning"}
              </button>
            </div>

            {/* Instructor Card */}
            <div className="group relative bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-2xl p-8 hover:border-[#F0802D] transition-all duration-300 hover:shadow-xl">
              <div className="absolute top-6 right-6 w-16 h-16 bg-[#F0802D]/10 rounded-full flex items-center justify-center group-hover:bg-[#F0802D]/20 transition-all">
                <Users className="w-8 h-8 text-[#F0802D]" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Continue as Instructor
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Share your expertise, create courses, and inspire thousands of
                learners worldwide.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#F0802D] mt-1">✓</span>
                  <span>Create and publish courses</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#F0802D] mt-1">✓</span>
                  <span>Earn from your expertise</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-[#F0802D] mt-1">✓</span>
                  <span>Build your reputation</span>
                </li>
              </ul>

              <button
                onClick={handleInstructorSelection}
                disabled={processingRole !== null || isInstructorPending}
                className={`w-full px-6 py-3 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  isInstructorPending
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : isInstructorRejected
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-[#F0802D] hover:bg-[#d97326]"
                }`}
              >
                {processingRole === "INSTRUCTOR"
                  ? "Processing..."
                  : currentRole === "INSTRUCTOR"
                    ? "Current Role ✓"
                    : hasInstructorRole
                      ? "Switch to Instructor"
                      : isInstructorPending
                        ? "Application Pending..."
                        : isInstructorRejected
                          ? "Application Rejected"
                          : "Apply to Teach"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <TeacherApplicationModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </>
  );
};

export default RoleSelection;
