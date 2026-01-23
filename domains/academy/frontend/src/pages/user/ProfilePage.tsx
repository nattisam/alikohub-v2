import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import RoleSelectionModal from "../../components/auth/RoleSelectionModal";
import apiClient from "../../lib/api";
import {
  FaUser,
  FaCamera,
  FaSave,
  FaEdit,
  FaExchangeAlt,
  FaUserPlus,
} from "react-icons/fa";

const ProfilePage = () => {
  const {
    user: currentUser,
    updateUser,
    isLoading,
    switchRoleMutation,
  } = useAuth();
  
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const handleRoleChange = async (role: "STUDENT" | "INSTRUCTOR") => {
    if (currentUser) {
      try {
        // Use the mutation directly to get access to its state
        await switchRoleMutation.mutateAsync(role);

        // Close the dropdown after role switch
        setIsRoleDropdownOpen(false);

      } catch (error) {
        console.error("Failed to switch role:", error);

        // Close the dropdown even if there's an error
        setIsRoleDropdownOpen(false);
      }
    }
  };
  
  const handleChooseRole = () => {
    navigate('/role');
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
    window.location.href = "/auth/login";
    return null;
  }

  // Allow users with globalRole USER to access their profile
  // If user hasn't selected a role yet and doesn't have globalRole USER, show role selection modal

  if (!currentUser.academyRole && currentUser.globalRole !== "USER") {
    // We need to show the role selection modal
    // For now, we'll just show a message directing them to select a role
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Select Your Role
            </h2>
            <p className="text-gray-600 mb-6">
              To access your profile, please select a role.
            </p>
            <RoleSelectionModal onClose={() => (window.location.href = "/")} />
          </div>
        </div>
      </div>
    );
  }
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    bio: "",
    title: "", // For instructors
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstname: currentUser.firstname || "",
        lastname: currentUser.lastname || "",
        email: currentUser.email || "",
        bio: currentUser.bio || "",
        title: (currentUser as any).title || "", // For instructors
      });
    }
  }, [currentUser]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentUser) {
      const file = e.target.files[0];

      // Create FormData object to send the file
      const formData = new FormData();
      formData.append("file", file);

      try {
        setUploading(true);

        // Upload the file to our file upload service through the API gateway
        // Use axios instead of fetch for consistency
        const response = await apiClient.post("/upload/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data) {
          const result = response.data;

          const updateResponse = await apiClient.patch(
            `/users/${currentUser.firebaseId}`,
            {
              profilePicture: result.url,
            }
          );

          if (updateResponse.data) {
            // Update the current user context
            updateUser({
              ...currentUser,
              profilePicture: result.url,
            });
          }
        } else {
          console.error("File upload failed");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);

      // Update user profile in the backend
      const updateData: any = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        bio: formData.bio,
      };

      // Include title for instructors
      if (
        currentUser.academyUser?.activeRole === "INSTRUCTOR" ||
        currentUser.academyRole === "INSTRUCTOR"
      ) {
        updateData.title = formData.title;
      }
      const response = await apiClient.patch(
        `/users/${currentUser.firebaseId}`,
        updateData
      );

      if (response.data) {
        // Update the current user context
        updateUser({
          ...currentUser,
          ...updateData,
        });

        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
            {currentUser?.availableRoles && currentUser.availableRoles.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    disabled={switchRoleMutation.isPending}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
                            ["STUDENT", "INSTRUCTOR"].includes(role)
                          ) // Only show valid academy roles
                          .map((role) => (
                            <button
                              key={role}
                              onClick={() =>
                                handleRoleChange(
                                  role as "STUDENT" | "INSTRUCTOR"
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
                  <button
                    onClick={triggerFileInput}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {uploading ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaCamera className="h-4 w-4 text-white" />
                    )}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {currentUser.firstname} {currentUser.lastname}
                </h2>
                {(currentUser.academyUser?.activeRole === "INSTRUCTOR" ||
                  currentUser.academyRole === "INSTRUCTOR") && (
                  <p className="text-gray-600">
                    {(currentUser as any).title || "Instructor"}
                  </p>
                )}
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

                    {currentUser.academyRole === "INSTRUCTOR" && (
                      <div className="sm:col-span-6">
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    )}

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
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-2 h-4 w-4" />
                          Save
                        </>
                      )}
                    </button>
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
                    {(currentUser.academyUser?.activeRole === "INSTRUCTOR" ||
                      currentUser.academyRole === "INSTRUCTOR") && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Title
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {(currentUser as any).title || "Not provided"}
                        </dd>
                      </div>
                    )}
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
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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