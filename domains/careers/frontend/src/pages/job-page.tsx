"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { publicApi } from "../lib/api"
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJobById(id as string),
    enabled: !!id,
  })

  const job = data

  const handleSubmitApplication = (formData: any) => {
    // For now we just log; later this can call POST /careers/jobs/:id/apply
    console.log("Application submitted for job", id, formData)
    setShowForm(false)
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
    return (
      <div className="p-0 md:p-6 lg:p-8 w-full max-w-full">
        <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1C1800] mb-2">Job not found</h2>
          <p className="text-[#1C1800]/70">We couldn&apos;t find this job. It may have been removed.</p>
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
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/80 px-3 py-1 text-[11px] font-medium text-[#1C1800]/70 hover:text-[#0F4875] hover:border-[#0F4875]/60 hover:bg-[#F5F8F3] transition-colors"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#0F4875]" />
          Back to all roles
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] items-start">
        {/* Main content */}
        <div className="space-y-6">
          <div className="bg-white/95 border border-border rounded-2xl p-5 sm:p-6 shadow-xs">
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
                  <span className="inline-flex items-center rounded-full bg-[#F5F8F3] px-3 py-1 text-[11px] font-medium text-[#1C1800]/80 border border-border/70">
                    {job.type}
                  </span>
                )}
                {job.salaryRange && (
                  <span className="inline-flex items-center rounded-full bg-[#F5F8F3] px-3 py-1 text-[11px] font-medium text-[#1C1800]/80 border border-border/70">
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

          <div className="bg-white/95 border border-border rounded-2xl p-5 sm:p-6 shadow-xs">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1C1800] mb-3">
              What you&apos;ll work on
            </h2>
            <p className="text-sm text-[#1C1800]/80 whitespace-pre-line leading-relaxed">
              {job.description}
            </p>
          </div>

          {job.requirements && (
            <div className="bg-white/95 border border-border rounded-2xl p-5 sm:p-6 shadow-xs">
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
          <div className="bg-white/95 border border-border rounded-2xl p-5 shadow-xs">
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

          <div className="bg-white/95 border border-border rounded-2xl p-5 shadow-xs space-y-3">
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


