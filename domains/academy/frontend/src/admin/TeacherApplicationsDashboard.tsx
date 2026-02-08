import React, { useState } from "react";
import { authService } from "../services/auth-service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTimes, FaCheck, FaBan, FaUserCircle } from "react-icons/fa";

// Define TypeScript interfaces
interface TeacherApplication {
  id: string;
  userId: string;
  personalDetails: {
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
  };
  teachingCategories: string[];
  resumeUrl?: string;
  interviewResponses: {
    question: string;
    answer: string;
  }[];
  documents?: {
    name: string;
    url: string;
  }[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  user: {
    firstname: string;
    lastname: string;
    email: string;
  };
}

interface ReviewModalProps {
  application: TeacherApplication | null;
  onClose: () => void;
  onApprove: (id: string, notes: string) => void;
  onReject: (id: string, notes: string) => void;
  isProcessing: boolean;
}

const ReviewApplicationModal: React.FC<ReviewModalProps> = ({
  application,
  onClose,
  onApprove,
  onReject,
  isProcessing,
}) => {
  const [notes, setNotes] = useState("");

  if (!application) return null;

  // Extract derived data
  const department =
    application.teachingCategories && application.teachingCategories.length > 0
      ? application.teachingCategories.join(", ")
      : "General";

  const experienceQ = application.interviewResponses?.find(
    (r) =>
      r.question.toLowerCase().includes("experience") ||
      r.question.toLowerCase().includes("years"),
  );
  // Truncate experience if it's too long for the card, or show "View Details"
  const experience = experienceQ
    ? experienceQ.answer.length > 30
      ? experienceQ.answer.substring(0, 30) + "..."
      : experienceQ.answer
    : "See Resume";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#10141d] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-800 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-start p-8 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Review Teacher Application
            </h2>
            <div className="flex items-center gap-2 text-gray-400">
              <FaUserCircle className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">Reviewing:</span>
              <span className="text-white font-semibold">
                {application.user.firstname} {application.user.lastname}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="px-8 py-4 space-y-6">
          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#171f29] p-5 rounded-xl border border-white/5">
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                Department
              </div>
              <div
                className="text-white font-semibold truncate text-sm"
                title={department}
              >
                {department}
              </div>
            </div>
            <div className="bg-[#171f29] p-5 rounded-xl border border-white/5">
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                Experience
              </div>
              <div
                className="text-white font-semibold truncate text-sm"
                title={experienceQ?.answer}
              >
                {experience}
              </div>
            </div>
          </div>

          {application.status === "PENDING" ? (
            /* Comments */
            <div>
              <label className="block text-sm text-gray-300 font-medium mb-2.5">
                Reviewer Comments / Reason
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#171f29] border border-white/10 rounded-xl p-4 text-gray-200 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none resize-none h-32 text-sm placeholder-gray-600 transition-all font-medium"
                placeholder="Provide specific feedback or reasons for this decision..."
              />
              <p className="text-[11px] text-gray-500 mt-2.5 leading-relaxed">
                This feedback will be visible to other administrators and
                partially shared with the applicant upon rejection.
              </p>
            </div>
          ) : (
            /* Status Display */
            <div
              className={`p-6 rounded-xl border ${
                application.status === "APPROVED"
                  ? "bg-green-500/10 border-green-500/20"
                  : "bg-red-500/10 border-red-500/20"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {application.status === "APPROVED" ? (
                  <div className="bg-green-500 rounded-full p-1">
                    <FaCheck size={12} className="text-black" />
                  </div>
                ) : (
                  <div className="bg-red-500 rounded-full p-1">
                    <FaBan size={12} className="text-white" />
                  </div>
                )}
                <span
                  className={`text-lg font-bold ${
                    application.status === "APPROVED"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  Application {application.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                This application has already been processed.
              </p>
            </div>
          )}
        </div>

        {/* Footer actions - Only show for PENDING applications */}
        {application.status === "PENDING" && (
          <div className="px-8 py-6 bg-[#0c1016] flex justify-end gap-4 border-t border-white/5">
            {/* Reject Button */}
            <button
              onClick={() => onReject(application.id, notes)}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-full bg-[#1a0f0f] border border-red-900/30 text-red-500 font-semibold text-xs hover:bg-[#2a1212] transition-all flex items-center gap-2 disabled:opacity-50 tracking-wide uppercase"
            >
              <FaBan size={12} />
              Reject
            </button>

            {/* Approve Button */}
            <button
              onClick={() => onApprove(application.id, notes)}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-full bg-[#00e376] text-black font-bold text-xs hover:bg-[#00c968] transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-green-900/20 tracking-wide uppercase"
            >
              <div className="bg-black rounded-full p-0.5">
                <FaCheck size={8} className="text-white" />
              </div>
              Approve Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TeacherApplicationsDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState<TeacherApplication | null>(
    null,
  );

  // State for applications and UI
  const {
    data: applications = [],
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery<TeacherApplication[]>({
    queryKey: ["teacherApplications"],
    queryFn: authService.getTeacherApplications,
  });

  const approveMutation = useMutation({
    mutationFn: authService.approveTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherApplications"] });
      setSelectedApp(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: authService.rejectTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherApplications"] });
      setSelectedApp(null);
    },
  });

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Filter applications based on search term and status
  const filteredApplications = (
    Array.isArray(applications) ? applications : []
  ).filter((app) => {
    if (!app?.user) return false;

    const matchesSearch =
      (app.user.firstname?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      ) ||
      (app.user.lastname?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      ) ||
      (app.user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "ALL" || app.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleReview = (application: TeacherApplication) => {
    setSelectedApp(application);
  };

  const onApprove = (id: string, notes: string) => {
    approveMutation.mutate({ applicationId: id, data: { reviewNotes: notes } });
  };

  const onReject = (id: string, notes: string) => {
    rejectMutation.mutate({ applicationId: id, data: { reviewNotes: notes } });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teacher applications...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    const err = error as { response?: { status?: number } };
    const isPermissionError =
      err?.response?.status === 401 || err?.response?.status === 403;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {isPermissionError ? "Access Denied" : "Error"}
          </h2>
          <p className="text-gray-600">
            {isPermissionError
              ? "You do not have permission to access teacher applications."
              : "Failed to load teacher applications. Please try again later."}
          </p>
          {!isPermissionError && (
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Teacher Applications
          </h1>
          <p className="mt-2 text-gray-600">
            Manage teacher applications and approve/reject requests
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Applications
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name or email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Status
              </label>
              <select
                id="status-filter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50/50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Applications List
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {filteredApplications.length} of {applications.length} application
              {applications.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Applicant
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Applied For
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Resume
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No teacher applications found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {application.user.firstname.charAt(0)}
                            {application.user.lastname.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.user.firstname}{" "}
                              {application.user.lastname}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {String(application.id).substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Instructor
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                        {application.resumeUrl ? (
                          <a
                            href={application.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            View Resume
                          </a>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            application.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : application.status === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {application.status === "PENDING" ? (
                          <button
                            onClick={() => handleReview(application)}
                            className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-1.5 rounded-md text-xs font-medium transition-colors"
                          >
                            Review
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReview(application)}
                            className="text-gray-500 hover:text-gray-900 px-4 py-1.5 text-xs font-medium transition-colors border border-gray-200 rounded-md hover:bg-gray-50"
                          >
                            View Details
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <ReviewApplicationModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onApprove={onApprove}
          onReject={onReject}
          isProcessing={approveMutation.isPending || rejectMutation.isPending}
        />
      )}
    </div>
  );
};

export default TeacherApplicationsDashboard;
