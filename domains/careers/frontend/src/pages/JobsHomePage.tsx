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
    <>
      {isLoading && (
        <div className="w-full flex justify-center pt-4">
          <p className="text-sm text-[#1C1800]/70">Loading jobs...</p>
        </div>
      )}
      {isError && (
        <div className="w-full flex justify-center pt-4">
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            Failed to load jobs. Please try again later.
          </p>
        </div>
      )}
      <JobSearch onSelectJob={(job) => navigate(`/job/${job.id}`)} jobs={jobsForSearch} />
    </>
  )
}


