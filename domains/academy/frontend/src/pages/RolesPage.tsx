import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type RoleStatus = "active" | "pending" | "inactive";

interface Role {
  id: string;
  name: string;
  description: string;
  status: RoleStatus;
  actionLabel?: string;
}

const statusStyles: Record<RoleStatus, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  inactive: "bg-gray-100 text-gray-600",
};

export default function RolesPage() {
  const { user: currentUser, addRole, switchRole, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Show loading state if user data is still loading
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading roles...</p>
        </div>
      </div>
    );
  }
  
  // If no user is found, redirect to login
  if (!currentUser) {
    navigate('/auth/login');
    return null;
  }
  
  // Determine role status based on user's available roles and status information
  const studentStatus: RoleStatus = currentUser?.availableRoles?.includes('STUDENT') ? "active" : "inactive";
  const instructorStatus: RoleStatus = currentUser?.availableRoles?.includes('INSTRUCTOR') 
    ? (currentUser.roleStatus?.instructor === 'pending' ? "pending" : "active")
    : "inactive";
  const adminStatus: RoleStatus = currentUser?.availableRoles?.includes('ADMIN') ? "active" : "inactive";

  // Define roles based on user's available roles
  const roles: Role[] = [
    {
      id: "student",
      name: "Student",
      description:
        "Access course materials, track assignments, view grades, and participate in the student community.",
      status: studentStatus,
      actionLabel: "Enter Student Portal",
    },
    {
      id: "teacher",
      name: "Teacher",
      description:
        "Create and manage courses, assignments, and track student progress.",
      status: instructorStatus,
      actionLabel: "Go to Instructor Dashboard",
    },
    {
      id: "admin",
      name: "Academy Admin",
      description:
        "Full access to manage users, content approval workflows, platform settings, and analytics dashboards.",
      status: adminStatus,
      actionLabel: "Go to Admin Panel",
    },
  ];

  const handleRoleAction = (roleId: string) => {
    if (roleId === 'student') {
      if (currentUser?.availableRoles?.includes('STUDENT')) {
        switchRole('STUDENT');
      } else {
        addRole('STUDENT');
      }
    } else if (roleId === 'teacher') {
      if (currentUser?.availableRoles?.includes('INSTRUCTOR')) {
        // Check if instructor role is pending
        if (currentUser.roleStatus?.instructor === 'pending') {
          alert('Your teacher application is under review. You will be notified when approved.');
          return;
        }
        switchRole('INSTRUCTOR');
      } else {
        // Navigate to teacher application page
        navigate('/auth/teacher-application');
      }
    } else if (roleId === 'admin') {
      if (currentUser?.availableRoles?.includes('ADMIN')) {
        switchRole('ADMIN');
      } else {
        // Admin role might require special approval
        alert('Please contact admin to request admin access');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Your Roles</h1>
        <p className="text-sm text-gray-500">
          Manage your access to Aliko Academy resources and portals. Switch
          between active profiles or apply for new positions.
        </p>
      </div>

      {/* Roles */}
      <div className="space-y-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="flex items-center justify-between rounded-xl border p-5 bg-white shadow-sm"
          >
            <div className="flex items-start gap-4">
              {/* Status Indicator */}
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[role.status]}`}
              >
                {role.status === "active"
                  ? "Active"
                  : role.status === "pending"
                  ? "Pending approval"
                  : "Inactive"}
              </span>

              {/* Content */}
              <div>
                <h2 className="text-lg font-semibold">{role.name}</h2>
                <p className="text-sm text-gray-600 max-w-xl">
                  {role.description}
                </p>

                {role.actionLabel && (
                  <button 
                    onClick={() => handleRoleAction(role.id)}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                  >
                    {currentUser?.availableRoles?.includes(role.id.toUpperCase() as any) 
                      ? `${role.actionLabel} →` 
                      : `Get ${role.name} Role →`}
                  </button>
                )}
                
                {/* Show additional info for pending instructor role */}
                {role.id === 'teacher' && role.status === 'pending' && (
                  <p className="mt-2 text-sm text-yellow-600">
                    Your application is under review. You will receive an email notification when a decision is made.
                  </p>
                )}
              </div>
            </div>

            {/* Decorative Placeholder */}
            <div className="hidden md:block w-40 h-24 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200" />
          </div>
        ))}
      </div>

      {/* Apply New Role */}
      <div className="mt-8 border-2 border-dashed rounded-xl p-6 text-center">
        <div className="text-gray-500 text-sm mb-2">
          Looking to expand your contribution?
        </div>
        <button 
          onClick={() => navigate('/auth/teacher-application')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
        >
          + Apply for a New Role
        </button>
      </div>
    </div>
  );
}