"use client"

import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { publicApi } from "../lib/api"
import { JobSearch, type Job as SearchJob } from "../components/application/job-search"
import ErrorState from "../components/common/ErrorState"
import EmptyState from "../components/common/EmptyState"

interface ApiJob {
  id: string
  title: string
  description: string
  requirements?: string
  salaryRange?: string
  location?: string
  status?: string
  type?: string
  company?: string
  postedDate?: string
}

async function fetchJobs(): Promise<ApiJob[]> {
  const res = await publicApi.get("/careers/jobs")
  return res.data
}

export function JobsHomePage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  })
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-stone-50 flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-stone-100 border-t-stone-900 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 bg-stone-900 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-6 text-stone-500 font-medium animate-pulse tracking-wide uppercase text-[10px] font-black">Finding Opportunities...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen bg-stone-50 pt-20">
        <ErrorState onRetry={() => refetch()} />
      </div>
    )
  }

  const jobsForSearch: SearchJob[] =
    data?.map((job) => ({
      id: String(job.id),
      title: job.title,
      company: job.company ?? "AlikoHub",
      location: job.location ?? "Remote",
      salary: job.salaryRange ?? "Not specified",
      type: job.type ?? "Full-time",
      description: job.description,
      postedDate: job.postedDate ?? "Recently",
    })) ?? []

  if (jobsForSearch.length === 0) {
    return (
      <div className="w-full min-h-screen bg-stone-50 pt-20">
        <EmptyState 
          title="No Open Positions" 
          message="We don't have any open positions at the moment. Please check back later or subscribe to our newsletter."
        />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-stone-50 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <JobSearch onSelectJob={(job) => navigate(`/job/${job.id}`)} jobs={jobsForSearch} />
    </div>
  )
}


