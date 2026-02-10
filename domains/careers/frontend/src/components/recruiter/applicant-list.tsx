"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Eye, Download, Loader2 } from "lucide-react";
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
}

interface ApplicantListProps {
  jobId?: string;
  jobTitle?: string;
  onBack?: () => void;
}

// Service function to fetch applicants for a job
async function fetchApplications(jobId: string): Promise<Application[]> {
  const res = await api.get(`/careers/jobs/${jobId}/applications`);
  return res.data;
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
        const applicationsWithJobInfo = applicationsRes.data.map(
          (app: any) => ({
            ...app,
            jobId: job.id,
            jobTitle: job.title,
          }),
        );
        allApplications.push(...applicationsWithJobInfo);
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

// Service function to update application status
async function updateApplicationStatus(
  applicationId: number,
  status: string,
): Promise<any> {
  const res = await api.patch(`/careers/applications/${applicationId}/status`, {
    status,
  });
  return res.data;
}

export function ApplicantList({ jobId, jobTitle, onBack }: ApplicantListProps) {
  const queryClient = useQueryClient();

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

  // Mutation for updating application status
  const updateStatusMutation = useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: number;
      status: string;
    }) => updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobId ? ["applications", jobId] : ["all-applications"],
      });
    },
  });

  const handleStatusChange = (
    id: number,
    status: "new" | "reviewed" | "rejected",
  ) => {
    updateStatusMutation.mutate({ applicationId: id, status });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-stone-50">
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
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
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        User ID
                      </p>
                      <p className="text-gray-700 text-sm">
                        {application.userId}
                      </p>
                    </div>
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
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {application.coverLetter}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm font-medium">
                      Resume:
                    </span>
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 hover:underline text-sm break-all"
                    >
                      {application.resumeUrl}
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 text-gray-500 hover:text-indigo-600 transition-colors hover:bg-indigo-500/10 rounded-lg"
                  >
                    <Eye className="w-5 h-5" />
                  </a>
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 text-gray-500 hover:text-indigo-600 transition-colors hover:bg-indigo-500/10 rounded-lg"
                  >
                    <Download className="w-5 h-5" />
                  </a>

                  {(application.status || "new") === "new" && (
                    <div className="flex gap-3 mt-4 lg:mt-0">
                      <button
                        onClick={() =>
                          handleStatusChange(application.id, "reviewed")
                        }
                        className="px-4 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:shadow-md transition-all duration-300 flex items-center gap-2"
                        disabled={updateStatusMutation.isPending}
                      >
                        {updateStatusMutation.isPending &&
                        updateStatusMutation.variables?.applicationId ===
                          application.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Review"
                        )}
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(application.id, "rejected")
                        }
                        className="px-4 py-2.5 text-sm font-medium border border-red-500 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-600 transition-all duration-300 flex items-center gap-2"
                        disabled={updateStatusMutation.isPending}
                      >
                        {updateStatusMutation.isPending &&
                        updateStatusMutation.variables?.applicationId ===
                          application.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Reject"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
