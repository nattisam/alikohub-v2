"use client"

import { useNavigate } from "react-router-dom"
import { JobPostingForm } from "../components/recruiter/job-posting-form"

export function JobPostPage() {
  const navigate = useNavigate()

  const handleSubmit = (data: any) => {
    // Handle job posting submission
    console.log("Job posted:", data)
    // Navigate back to dashboard after successful submission
    navigate("/")
  }

  const handleCancel = () => {
    navigate("/")
  }

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 border border-border/70 shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0F4875]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#1C1800]/75">
              Create a role
            </span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1C1800] mb-1">
              Share a role with the right level of context.
            </h1>
            <p className="text-sm sm:text-base text-[#1C1800]/70 max-w-2xl">
              A clear description, a few crisp requirements, and a realistic range go a long way. We&apos;ll
              help you collect the essentials without overwhelming candidates.
            </p>
          </div>
        </div>

        <div className="bg-white/95 border border-border rounded-2xl p-5 sm:p-6 shadow-xs">
          <JobPostingForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  )
}

