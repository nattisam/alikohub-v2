"use client";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api, publicApi } from "../lib/api";
import { ApplicationForm } from "../components/application/application-form";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import Loading from "../components/common/Loading";
import ServerError from "../components/common/ServerError";

interface JobDetail {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  salaryRange?: string;
  location?: string;
  status?: string;
  type?: string;
  company?: string;
}

async function fetchJobById(id: string): Promise<JobDetail> {
  const res = await publicApi.get(`/careers/jobs/${id}`);
  return res.data;
}

export function JobPage() {
  const { id } = useParams<{ id: string }>();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJobById(id as string),
    enabled: !!id,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 429) return failureCount < 3;
      if (error?.response?.status >= 400 && error?.response?.status < 500)
        return false;
      return failureCount < 3;
    },
  });

  const job = data;

  const submitApplicationMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!id) {
        throw new Error("Job ID is required");
      }

      const response = await api.post(`/careers/jobs/${id}/apply`, formData);
      return response.data;
    },
    onSuccess: () => {
      alert("Application submitted successfully!");
      setShowForm(false);
    },
    onError: (error: any) => {
      console.error("Error submitting application:", error);
      alert(error.message || "Failed to submit application. Please try again.");
    },
  });

  const handleSubmitApplication = (formData: any) => {
    submitApplicationMutation.mutate(formData);
  };

  const handleCancelApplication = () => {
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-stone-50 pt-20">
        <Loading message="Loading Position..." />
      </div>
    );
  }

  if (isError) {
    const errorStatus = (error as any)?.response?.status;

    if (errorStatus === 500) {
      return <ServerError onRetry={() => refetch()} />;
    }

    if (errorStatus === 404) {
      return (
        <div className="w-full min-h-screen bg-stone-50 pt-20">
          <EmptyState
            title="Position Not Found"
            message="We couldn't find this specific opening. It may have been recently filled or closed."
            actionText="Browse jobs"
            onAction={() => window.history.back()}
          />
        </div>
      );
    }

    return (
      <div className="w-full min-h-screen bg-stone-50 pt-20">
        <ErrorState
          message={
            errorStatus === 429
              ? "The server is currently handling too many requests. Please wait a moment."
              : "Failed to load job details."
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!job) return null;

  if (showForm) {
    return (
      <ApplicationForm
        job={{
          title: job.title,
          company: job.company ?? "AlikoHub",
          location: job.location ?? "Remote",
        }}
        onSubmit={handleSubmitApplication}
        onCancel={handleCancelApplication}
      />
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
        <div className="mb-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2.5 rounded-full bg-white border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to all roles
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] items-start">
          {/* Main content */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="mb-6 space-y-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-[1.1]">
                  {job.title}
                </h1>
                <p className="text-lg text-gray-600">
                  <span className="font-semibold text-indigo-600">
                    {job.company ?? "AlikoHub"}
                  </span>
                  {job.location ? ` • ${job.location}` : ""}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  {job.type && (
                    <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-500/20">
                      {job.type}
                    </span>
                  )}
                  {job.salaryRange && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200">
                      {job.salaryRange}
                    </span>
                  )}
                  {job.status && (
                    <span className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
                      {job.status}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-base text-gray-500 leading-relaxed max-w-3xl">
                We&apos;re looking for someone who cares about thoughtful work,
                clear communication, and building with focus. Below is the full
                context for this role.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                What you&apos;ll work on
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 whitespace-pre-line leading-relaxed text-base">
                  {job.description}
                </p>
              </div>
            </div>

            {job.requirements && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-5">
                  What makes you a great fit
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 whitespace-pre-line leading-relaxed text-base">
                    {job.requirements}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-4">
                Role snapshot
              </p>
              <div className="space-y-4 text-sm text-gray-600">
                {job.location && (
                  <div className="flex justify-between gap-4 pb-3 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500">Location</span>
                    <span className="font-medium text-gray-900 text-right">
                      {job.location}
                    </span>
                  </div>
                )}
                {job.type && (
                  <div className="flex justify-between gap-4 pb-3 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium text-gray-900 text-right">
                      {job.type}
                    </span>
                  </div>
                )}
                {job.salaryRange && (
                  <div className="flex justify-between gap-4 pb-3 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500">Compensation</span>
                    <span className="font-medium text-gray-900 text-right">
                      {job.salaryRange}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-5">
              <p className="text-gray-600 leading-relaxed">
                Ready to move forward? Share a bit about what you&apos;ve built
                and why this role feels like the right next step.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-indigo-600 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Apply for this role
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
