import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api"; 
import {
  FaUser,
  FaCamera,
  FaSave,
  FaEdit,
  FaUserPlus,
} from "react-icons/fa";

const ProfilePage = () => {
  const {
    user: currentUser,
    isLoading,
  } = useAuth();
  
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);


  // Removed role switching functionality since it's not supported in the simplified auth context
  
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
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    title: "", // For instructors
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstname: currentUser.firstname || currentUser.firstName || "",
        lastname: currentUser.lastname || currentUser.lastName || "",
        email: currentUser.email || "",
        title: "", // For instructors
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

        // Note: Simplified auth doesn't support direct image upload through academyAPI
        // This functionality may need to be reimplemented differently
        console.warn("Image upload not supported in simplified auth");
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
      const updateData: { firstname: string; lastname: string; title?: string } = {
        firstname: formData.firstname,
        lastname: formData.lastname,
      };

      // Include title for instructors
      if (
        currentUser.role === "INSTRUCTOR"
      ) {
        updateData.title = formData.title;
      }
      const response = await authAPI.updateProfile(
        updateData
      );

      if (response.data) {
        // Note: updateUser function no longer available in simplified auth context
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
    <div className="min-h-screen bg-gray-50 pt-16 pb-8">
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
            {/* Role switching functionality has been removed in the simplified auth context */}
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
                  {/* Profile picture functionality has been simplified */}
                  <div className="h-24 w-24 rounded-full bg-gray-200 border-4 border-white shadow flex items-center justify-center">
                    <FaUser className="h-12 w-12 text-gray-400" />
                  </div>
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
                  {currentUser.firstname || currentUser.firstName} {currentUser.lastname || currentUser.lastName}
                </h2>
                {currentUser.role === "INSTRUCTOR" && (
                  <p className="text-gray-600">
                    Instructor
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

                    {currentUser.role === "INSTRUCTOR" && (
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
                        {currentUser.firstname || currentUser.firstName} {currentUser.lastname || currentUser.lastName}
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
                    {currentUser.role === "INSTRUCTOR" && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Title
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          Not provided
                        </dd>
                      </div>
                    )}
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Bio</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {"No bio provided" /* Bio property no longer available in simplified auth */}
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
