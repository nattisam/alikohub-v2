"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Download, Eye, X } from "lucide-react";
import { api } from "../../lib/api";

interface Application {
  id: number;
  jobId: number;
  userId: string;
  coverLetter: string;
  resumeUrl: string;
  createdAt: string;
  status?: "new" | "reviewed" | "rejected";
  jobTitle?: string;
  user?: {
    firstname: string;
    lastname: string;
    email: string;
  };
}

interface ApplicantListProps {
  jobId?: string;
  jobTitle?: string;
  onBack?: () => void;
}

// Service function to fetch user data
async function fetchUserData(userId: string): Promise<any> {
  try {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    return null;
  }
}

// Service function to fetch applicants for a job
async function fetchApplications(jobId: string): Promise<Application[]> {
  const res = await api.get(`/careers/jobs/${jobId}/applications`);
  const applications = res.data;

  // Fetch user data for each application
  const applicationsWithUsers = await Promise.all(
    applications.map(async (app: Application) => {
      const userData = await fetchUserData(app.userId);
      return {
        ...app,
        user: userData
          ? {
              firstname: userData.firstname || null,
              lastname: userData.lastname || null,
              email: userData.email || null,
            }
          : null,
      };
    }),
  );

  return applicationsWithUsers;
}

// Service function to fetch all applications across all jobs
async function fetchAllApplications(): Promise<Application[]> {
  try {
    const jobsRes = await api.get("/careers/jobs");
    const jobs = jobsRes.data;

    const allApplications: Application[] = [];
    for (const job of jobs) {
      try {
        const applicationsRes = await api.get(
          `/careers/jobs/${job.id}/applications`,
        );
        const applications = applicationsRes.data;

        // Fetch user data for each application
        const applicationsWithUsers = await Promise.all(
          applications.map(async (app: any) => {
            const userData = await fetchUserData(app.userId);
            return {
              ...app,
              jobId: job.id,
              jobTitle: job.title,
              user: userData
                ? {
                    firstname: userData.firstname || null,
                    lastname: userData.lastname || null,
                    email: userData.email || null,
                  }
                : null,
            };
          }),
        );

        allApplications.push(...applicationsWithUsers);
      } catch (error) {
        console.error(`Failed to fetch applications for job ${job.id}:`, error);
      }
    }

    return allApplications;
  } catch (error) {
    console.error("Error fetching all applications:", error);
    throw error;
  }
}

export function ApplicantList({ jobId, jobTitle, onBack }: ApplicantListProps) {
  const [previewApplication, setPreviewApplication] =
    useState<Application | null>(null);

  // Fetch applications (either for specific job or all)
  const {
    data: applications = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: jobId ? ["applications", jobId] : ["all-applications"],
    queryFn: () => (jobId ? fetchApplications(jobId) : fetchAllApplications()),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-stone-50">
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500">Loading applicants...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen bg-stone-50">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="rounded-2xl bg-white border border-gray-200 p-12 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 mb-6">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Failed to load applicants
            </h2>
            <p className="text-gray-500 mb-6">
              Something went wrong while loading the applicants.
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 hover:shadow-md transition-all duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-stone-50">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2.5 rounded-full bg-white border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-300 shadow-sm hover:shadow-md mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Job Postings
          </button>
        )}

        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {jobTitle ? `Applications for ${jobTitle}` : "All Applications"}
          </h2>
          <p className="text-gray-500">
            {applications.length} total applications
          </p>
        </div>

        <div className="grid gap-6">
          {applications.map((application) => (
            <div
              key={application.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      Application #{application.id}
                    </h3>
                    {!jobId && application.jobTitle && (
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-100 text-blue-800">
                        {application.jobTitle}
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                        (application.status || "new") === "new"
                          ? "bg-indigo-600 text-white"
                          : (application.status || "new") === "reviewed"
                            ? "bg-yellow-500 text-gray-900"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      Status: {application.status || "New"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {application.user?.firstname &&
                      application.user?.lastname && (
                        <div>
                          <p className="text-gray-500 text-sm font-medium">
                            Applicant Name
                          </p>
                          <p className="text-gray-900 text-base font-semibold">
                            {application.user.firstname}{" "}
                            {application.user.lastname}
                          </p>
                        </div>
                      )}
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        Applied Date
                      </p>
                      <p className="text-gray-700 text-sm">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-5">
                    <p className="text-gray-700 text-sm font-semibold mb-2">
                      Cover Letter:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                        {application.coverLetter}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setPreviewApplication(application)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-300"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <a
                    href={application.resumeUrl}
                    download
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:shadow-md transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    Download Resume
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Application Preview
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {previewApplication.user?.firstname}{" "}
                  {previewApplication.user?.lastname}
                </p>
              </div>
              <button
                onClick={() => setPreviewApplication(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Applicant Info */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Applicant Information
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                  {previewApplication.user?.firstname &&
                    previewApplication.user?.lastname && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Full Name</p>
                        <p className="text-sm font-medium text-gray-900">
                          {previewApplication.user.firstname}{" "}
                          {previewApplication.user.lastname}
                        </p>
                      </div>
                    )}
                  {previewApplication.user?.email && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="text-sm font-medium text-gray-900">
                        {previewApplication.user.email}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Application Date
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(
                        previewApplication.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                        (previewApplication.status || "new") === "new"
                          ? "bg-indigo-600 text-white"
                          : (previewApplication.status || "new") === "reviewed"
                            ? "bg-yellow-500 text-gray-900"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {previewApplication.status || "New"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Cover Letter
                </h4>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {previewApplication.coverLetter}
                  </p>
                </div>
              </div>

              {/* Resume */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Resume
                </h4>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(
                      previewApplication.resumeUrl,
                    )}&embedded=true`}
                    className="w-full h-[600px] rounded-lg border border-gray-200"
                    title="Resume Preview"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
