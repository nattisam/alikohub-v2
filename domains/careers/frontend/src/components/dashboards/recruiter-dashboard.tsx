"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { JobPostingForm } from "../recruiter/job-posting-form";
import { ApplicantList } from "../recruiter/applicant-list";
import {
  getAllJobs,
  createJob,
  deleteJob,
  closeJob,
} from "../../services/job-service";
import ConfirmationModal from "../common/ConfirmationModal";

export function RecruiterDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    confirmButtonClass?: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const queryClient = useQueryClient();

  // Fetch all jobs
  const {
    data: jobs = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: getAllJobs,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for creating a job
  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setShowForm(false);
    },
  });

  // Mutation for deleting a job
  const deleteJobMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  // Mutation for closing a job
  const closeJobMutation = useMutation({
    mutationFn: closeJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  const handleCloseJob = (id: string) => {
    setModalConfig({
      isOpen: true,
      title: "Close Job Posting",
      message:
        "Are you sure you want to close this job posting? This action cannot be undone.",
      confirmText: "Close Job",
      confirmButtonClass: "bg-orange-600 hover:bg-orange-700",
      onConfirm: () => {
        closeJobMutation.mutate(id);
        setModalConfig({ ...modalConfig, isOpen: false });
      },
    });
  };

  const handleCreateJob = (jobData: any) => {
    createJobMutation.mutate(jobData);
  };

  const handleDeleteJob = (id: string) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Job Posting",
      message:
        "Are you sure you want to permanently delete this job posting? All application data will be lost.",
      confirmText: "Delete Job",
      confirmButtonClass: "bg-red-600 hover:bg-red-700",
      onConfirm: () => {
        deleteJobMutation.mutate(id);
        setModalConfig({ ...modalConfig, isOpen: false });
      },
    });
  };

  // Refetch jobs when selectedJob changes
  useEffect(() => {
    if (selectedJob) {
      refetch();
    }
  }, [selectedJob, refetch]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-stone-50">
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-gray-500">Loading job postings...</p>
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
              Failed to load job postings
            </h2>
            <p className="text-gray-500 mb-6">
              Something went wrong while loading your job postings.
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
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Job Postings
            </h1>
            <p className="text-gray-500">
              Manage your job listings and review applicants
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 font-semibold"
            disabled={createJobMutation.isPending}
          >
            {createJobMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                New Job Posting
              </>
            )}
          </button>
        </div>

        <ConfirmationModal
          isOpen={modalConfig.isOpen}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmText={modalConfig.confirmText}
          confirmButtonClass={modalConfig.confirmButtonClass}
        />

        {showForm && (
          <div className="mb-10">
            <JobPostingForm
              onSubmit={handleCreateJob}
              onCancel={() => setShowForm(false)}
              isSubmitting={createJobMutation.isPending}
            />
          </div>
        )}

        {!selectedJob ? (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-500/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {job.title}
                      </h3>
                      <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                          job.status === "active"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-3">
                      {job.department || "General"}
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
                        Applicants
                      </p>
                      <p className="text-lg font-bold text-indigo-600">
                        {job.applicants || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
                        Posted
                      </p>
                      <p className="text-gray-700 text-sm">
                        {job.postedDate || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCloseJob(job.id)}
                      className="p-2.5 text-gray-500 hover:text-indigo-600 transition-colors hover:bg-indigo-500/10 rounded-lg"
                      title="Close Job"
                      disabled={closeJobMutation.isPending}
                    >
                      {closeJobMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Edit2 className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2.5 text-gray-500 hover:text-red-600 transition-colors hover:bg-red-50 rounded-lg"
                      disabled={deleteJobMutation.isPending}
                    >
                      {deleteJobMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ApplicantList
            jobId={selectedJob}
            jobTitle={jobs.find((j) => j.id === selectedJob)?.title || ""}
            onBack={() => setSelectedJob(null)}
          />
        )}
      </div>
    </div>
  );
}
