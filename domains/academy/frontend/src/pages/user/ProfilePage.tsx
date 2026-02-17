import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../lib/api";
import {
  FaUser,
  FaSave,
  FaEdit,
  FaExchangeAlt,
  FaUserPlus,
} from "react-icons/fa";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const {
    user: currentUser,
    updateUser,
    isLoading,
    switchRoleMutation,
    setRoleModalOpen,
  } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const handleRoleChange = async (role: "STUDENT" | "INSTRUCTOR") => {
    if (currentUser) {
      try {
        // Use the mutation directly to get access to its state
        await switchRoleMutation.mutateAsync(role);

        // Show success modal
        Swal.fire({
          showConfirmButton: false,
          background: "transparent",
          backdrop: "rgba(0,0,0,0.3)",
          timer: 2500,
          html: `
            <div class="bg-white rounded-2xl shadow-xl p-8 w-[360px] text-center">
              <div class="flex justify-center mb-4">
                <div class="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h2 class="text-lg font-semibold text-gray-900">
                Role Switched Successfully
              </h2>

              <p class="text-sm text-gray-500 mt-2">
                You are now using the ${role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()} role.
              </p>
            </div>
          `,
        });
      } catch (error: any) {
        console.error("Failed to switch role:", error);

        // Extract error message
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Your instructor application is pending approval.";

        // Show failure modal
        Swal.fire({
          showConfirmButton: false,
          background: "transparent",
          backdrop: "rgba(0,0,0,0.3)",
          timer: 3000,
          html: `
            <div class="bg-white rounded-2xl shadow-xl p-8 w-[360px] text-center">
              <div class="flex justify-center mb-4">
                <div class="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>

              <h2 class="text-lg font-semibold text-gray-900">
                Failed to Switch Role
              </h2>

              <p class="text-sm text-gray-500 mt-2">
                ${errorMessage}
              </p>
            </div>
          `,
        });
      } finally {
        // Close the dropdown after role switch attempt
        setIsRoleDropdownOpen(false);
      }
    }
  };

  const handleChooseRole = () => {
    setRoleModalOpen(true);
  };

  // If user is loading, show loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!currentUser) {
    // Check if we are in a browser environment
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
    return null;
  }

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstname: currentUser?.firstname || "",
        lastname: currentUser?.lastname || "",
        email: currentUser?.email || "",
        bio: currentUser?.bio || "",
      });
    }
  }, [currentUser]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.firebaseId) {
      alert("User not found. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      // Update user profile in the backend
      const updateData: any = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        bio: formData.bio,
      };

      const response = await apiClient.patch(
        `/users/${currentUser.firebaseId}`,
        updateData,
      );

      if (response?.data) {
        // Update the current user context
        updateUser({
          ...currentUser,
          ...updateData,
        });

        setIsEditing(false);
        Swal.fire({
          showConfirmButton: false,
          background: "transparent",
          backdrop: "rgba(0,0,0,0.3)",
          timer: 2500,
          html: `
            <div class="bg-white rounded-2xl shadow-xl p-8 w-[360px] text-center">
              <div class="flex justify-center mb-4">
                <div class="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h2 class="text-lg font-semibold text-gray-900">
                Profile Update Successful
              </h2>

              <p class="text-sm text-gray-500 mt-2">
                Your profile has been updated successfully.
              </p>
            </div>
          `,
          didOpen: () => {
            const btn = document.getElementById("lms-success-btn");
            if (btn) btn.onclick = () => Swal.close();
          },
        });
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error updating profile",
        text: error?.response?.data?.message || "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <FaUser className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No user data
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                User Profile
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Personal details and application information.
              </p>
            </div>
            {/* Role Switching Dropdown - Show if user has any available roles */}
            {currentUser?.availableRoles &&
              currentUser.availableRoles.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    disabled={switchRoleMutation.isPending}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-[#0D72BA] bg-[#0D72BA]/10 hover:bg-[#0D72BA]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D72BA] disabled:opacity-50"
                  >
                    <FaExchangeAlt className="mr-2 h-4 w-4" />
                    Switch Role
                    {switchRoleMutation.isPending && (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                    )}
                  </button>

                  {isRoleDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1" role="menu">
                        {currentUser.availableRoles
                          .filter((role) =>
                            ["STUDENT", "INSTRUCTOR"].includes(role),
                          ) // Only show valid academy roles
                          .map((role) => (
                            <button
                              key={role}
                              onClick={() =>
                                handleRoleChange(
                                  role as "STUDENT" | "INSTRUCTOR",
                                )
                              }
                              className={`block px-4 py-2 text-sm w-full text-left ${
                                (currentUser.academyUser?.activeRole ||
                                  currentUser.academyActiveRole) === role
                                  ? "bg-blue-100 text-blue-900"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                              role="menuitem"
                            >
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            {/* Button to navigate to role selection page to choose additional roles */}
            <button
              onClick={handleChooseRole}
              className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FaUserPlus className="mr-2 h-4 w-4" />
              Choose Role
            </button>
          </div>

          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  {currentUser.profilePicture ? (
                    <img
                      src={currentUser.profilePicture}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover border-4 border-white shadow"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-200 border-4 border-white shadow flex items-center justify-center">
                      <FaUser className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {currentUser.firstname} {currentUser.lastname}
                </h2>
              </div>

              {/* Profile Information */}
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="firstname"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First name
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        id="firstname"
                        value={formData.firstname}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="lastname"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last name
                      </label>
                      <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        disabled
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-white py-2.5 px-6 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    {(() => {
                      const hasChanges =
                        currentUser &&
                        (formData.firstname !== (currentUser.firstname || "") ||
                          formData.lastname !== (currentUser.lastname || "") ||
                          formData.bio !== (currentUser.bio || ""));

                      return (
                        <button
                          type="submit"
                          disabled={loading || !hasChanges}
                          className={`inline-flex justify-center items-center py-2.5 px-8 border text-sm font-semibold rounded-full transition-all duration-200 
                            ${
                              loading || !hasChanges
                                ? "bg-[#0D72BA]/5 text-[#0D72BA]/30 border-[#0D72BA]/10 cursor-not-allowed"
                                : "bg-[#0D72BA] text-white border-transparent hover:bg-[#0b619e] hover:shadow-lg active:scale-95 shadow-md shadow-[#0D72BA]/20"
                            }`}
                        >
                          {loading ? (
                            <>
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <FaSave className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                      );
                    })()}
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Full name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {currentUser.firstname} {currentUser.lastname}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Email address
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {currentUser.email}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Bio</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {currentUser.bio || "No bio provided"}
                      </dd>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-full text-[#0D72BA] bg-[#0D72BA]/10 hover:bg-[#0D72BA]/20 hover:shadow-md transition-all duration-200 active:scale-95"
                    >
                      <FaEdit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
