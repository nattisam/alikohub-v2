"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery, useMutation } from "@tanstack/react-query"
import { api, publicApi } from "../lib/api"
import { ApplicationForm } from "../components/application/application-form"

interface JobDetail {
  id: string
  title: string
  description: string
  requirements?: string
  salaryRange?: string
  location?: string
  status?: string
  type?: string
  company?: string
}

async function fetchJobById(id: string): Promise<JobDetail> {
  const res = await publicApi.get(`/careers/jobs/${id}`)
  return res.data
}

export function JobPage() {
  const { id } = useParams<{ id: string }>()
  const [showForm, setShowForm] = useState(false)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJobById(id as string),
    enabled: !!id,
    retry: (failureCount, error: any) => {
      // Retry on 429 errors
      if (error?.response?.status === 429) {
        return failureCount < 3;
      }
      // Don't retry on 404 or other client errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex, error: any) => {
      if (error?.response?.status === 429) {
        const baseDelay = 1000;
        const maxDelay = 10000;
        return Math.min(baseDelay * Math.pow(2, attemptIndex), maxDelay) + Math.random() * 1000;
      }
      return Math.min(1000 * Math.pow(2, attemptIndex), 30000);
    },
  })

  const job = data

  const submitApplicationMutation = useMutation({
    mutationFn: async (applicationData: { coverLetter: string; resumeUrl: string }) => {
      if (!id) {
        throw new Error('Job ID is required');
      }
      
      // Validate URL format before sending
      try {
        new URL(applicationData.resumeUrl);
      } catch (urlError) {
        throw new Error('Invalid resume URL format. Please enter a valid URL starting with http:// or https://');
      }
      
      const response = await api.post(`/careers/jobs/${id}/apply`, applicationData);
      return response.data;
    },
    onSuccess: () => {
      alert('Application submitted successfully!');
      setShowForm(false);
    },
    onError: (error: any) => {
      console.error('Error submitting application:', error);
      alert(error.message || 'Failed to submit application. Please try again.');
    },
  });
  
  const handleSubmitApplication = (formData: any) => {
    submitApplicationMutation.mutate(formData);
  }

  const handleCancelApplication = () => {
    setShowForm(false)
  }

  if (isLoading) {
    return (
      <div className="p-0 md:p-6 lg:p-8 w-full max-w-full">
        <p className="text-sm text-[#1C1800]/70">Loading job details...</p>
      </div>
    )
  }

  if (isError || !job) {
    const errorStatus = (error as any)?.response?.status;
    const isRateLimited = errorStatus === 429;
    
    return (
      <div className="p-0 md:p-6 lg:p-8 w-full max-w-full">
        <div className="bg-white ring-1 ring-black/5 rounded-xl p-8 shadow-sm">
          {isRateLimited ? (
            <>
              <h2 className="text-2xl font-bold text-[#1C1800] mb-2">Too Many Requests</h2>
              <p className="text-[#1C1800]/70 mb-4">
                The server is currently handling too many requests. Please wait a moment and try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#0F4875] text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
              >
                Retry
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-[#1C1800] mb-2">Job not found</h2>
              <p className="text-[#1C1800]/70">We couldn&apos;t find this job. It may have been removed.</p>
            </>
          )}
        </div>
      </div>
    )
  }

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
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-full ring-1 ring-black/50 bg-white/80 px-3 py-1 text-[11px] font-medium text-[#1C1800]/70 hover:text-[#0F4875] hover:ring-[#0F4875]/60 hover:bg-[#F5F8F3] transition-colors"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#0F4875]" />
          Back to all roles
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] items-start">
        {/* Main content */}
        <div className="space-y-6">
          <div className="bg-white/95 ring-1 ring-black/5 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="mb-4 space-y-2">
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#1C1800] tracking-tight">
                {job.title}
              </h1>
              <p className="text-sm text-[#1C1800]/75">
                <span className="font-medium">{job.company ?? "AlikoHub"}</span>
                {job.location ? ` • ${job.location}` : ""}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {job.type && (
                  <span className="inline-flex items-center rounded-full bg-[#F5F8F3] px-3 py-1 text-[11px] font-medium text-[#1C1800]/80 ring-1 ring-border/50">
                    {job.type}
                  </span>
                )}
                {job.salaryRange && (
                  <span className="inline-flex items-center rounded-full bg-[#F5F8F3] px-3 py-1 text-[11px] font-medium text-[#1C1800]/80 ring-1 ring-border/50">
                    {job.salaryRange}
                  </span>
                )}
                {job.status && (
                  <span className="inline-flex items-center rounded-full bg-[#0F4875] px-3 py-1 text-[11px] font-medium text-white">
                    {job.status}
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#1C1800]/75">
              We&apos;re looking for someone who cares about thoughtful work, clear communication, and
              building with focus. Below is the full context for this role.
            </p>
          </div>

          <div className="bg-white/95 ring-1 ring-black/5 rounded-2xl p-5 sm:p-6 shadow-xs">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1C1800] mb-3">
              What you&apos;ll work on
            </h2>
            <p className="text-sm text-[#1C1800]/80 whitespace-pre-line leading-relaxed">
              {job.description}
            </p>
          </div>

          {job.requirements && (
            <div className="bg-white/95 ring-1 ring-black/5 rounded-2xl p-5 sm:p-6 shadow-xs">
              <h2 className="text-lg sm:text-xl font-semibold text-[#1C1800] mb-3">
                What makes you a great fit
              </h2>
              <p className="text-sm text-[#1C1800]/80 whitespace-pre-line leading-relaxed">
                {job.requirements}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-20">
          <div className="bg-white/95 ring-1 ring-black/5 rounded-2xl p-5 shadow-xs">
            <p className="text-xs font-medium text-[#1C1800]/60 uppercase tracking-[0.16em] mb-2">
              Role snapshot
            </p>
            <div className="space-y-3 text-sm text-[#1C1800]/80">
              {job.location && (
                <div className="flex justify-between gap-4">
                  <span className="text-[#1C1800]/60">Location</span>
                  <span className="font-medium text-right">{job.location}</span>
                </div>
              )}
              {job.type && (
                <div className="flex justify-between gap-4">
                  <span className="text-[#1C1800]/60">Type</span>
                  <span className="font-medium text-right">{job.type}</span>
                </div>
              )}
              {job.salaryRange && (
                <div className="flex justify-between gap-4">
                  <span className="text-[#1C1800]/60">Compensation</span>
                  <span className="font-medium text-right">{job.salaryRange}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/95 ring-1 ring-black/5 rounded-2xl p-5 shadow-xs space-y-3">
            <p className="text-sm text-[#1C1800]/75">
              Ready to move forward? Share a bit about what you&apos;ve built and why this role feels
              like the right next step.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="w-full inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#0F4875] text-sm font-semibold text-white shadow-sm hover:shadow-md hover:-translate-y-px transition-all"
            >
              Apply for this role
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}


