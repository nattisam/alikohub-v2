"use client"

import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { publicApi } from "../lib/api"
import { JobSearch, type Job as SearchJob } from "../components/application/job-search"

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
  const { data, isLoading, isError } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  })
  const navigate = useNavigate()

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

  return (
    <div className="w-full min-h-screen bg-stone-50">
      {isLoading && (
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <p className="text-sm text-gray-500">Loading jobs...</p>
          </div>
        </div>
      )}
      {isError && (
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="bg-red-50 border border-red-100 rounded-xl px-6 py-4 max-w-md text-center">
              <p className="text-sm text-red-600">Failed to load jobs. Please try again later.</p>
            </div>
          </div>
        </div>
      )}
      {!isLoading && !isError && (
        <JobSearch onSelectJob={(job) => navigate(`/job/${job.id}`)} jobs={jobsForSearch} />
      )}
    </div>
  )
}


