"use client"

import { useState } from "react"
import { Search, MapPin, DollarSign, Briefcase } from "lucide-react"

export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  type: string
  description: string
  postedDate: string
}

interface JobSearchProps {
  onSelectJob: (job: Job) => void
  jobs?: Job[]
}

const DEFAULT_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: "$120K - $160K",
    type: "Full-time",
    description: "Looking for experienced React developers to join our team",
    postedDate: "2025-01-05",
  },
  {
    id: "2",
    title: "Product Manager",
    company: "InnovateLabs",
    location: "New York, NY",
    salary: "$130K - $170K",
    type: "Full-time",
    description: "Lead product strategy and roadmap for mobile applications",
    postedDate: "2025-01-08",
  },
  {
    id: "3",
    title: "UX Designer",
    company: "DesignStudio",
    location: "Remote",
    salary: "$90K - $130K",
    type: "Full-time",
    description: "Create beautiful and intuitive user experiences",
    postedDate: "2025-01-07",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudFirst",
    location: "Austin, TX",
    salary: "$110K - $150K",
    type: "Full-time",
    description: "Build and maintain cloud infrastructure",
    postedDate: "2025-01-06",
  },
]

export function JobSearch({ onSelectJob, jobs }: JobSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const effectiveJobs = jobs && jobs.length > 0 ? jobs : DEFAULT_JOBS

  const filteredJobs = effectiveJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="w-full">
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 border border-border/70 shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0F4875]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#1C1800]/75">
              Open roles
            </span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1C1800]">
              Find work that feels like a step forward.
            </h1>
            <p className="text-sm sm:text-base text-[#1C1800]/70 max-w-2xl">
              Explore carefully curated roles across product, engineering, design, and more. Filter by
              what matters to you, then move from interest to application in a few calm clicks.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative rounded-2xl border border-border/80 bg-white/90 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C1800]/40" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, company, or location"
                  className="w-full rounded-xl border-0 bg-transparent pl-9 pr-2 py-2.5 text-sm text-[#1C1800] placeholder:text-[#1C1800]/45 focus:outline-none focus:ring-0"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-[#F5F8F3] px-3 py-1 text-[11px] font-medium text-[#1C1800]/70 border border-border/70">
                  <MapPin className="mr-1.5 h-3 w-3 text-[#0F4875]" />
                  Remote friendly
                </span>
                <span className="inline-flex items-center rounded-full bg-[#F5F8F3] px-3 py-1 text-[11px] font-medium text-[#1C1800]/70 border border-border/70">
                  <Briefcase className="mr-1.5 h-3 w-3 text-[#0F4875]" />
                  Product &amp; Engineering
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Job List */}
        <div className="grid gap-4">
          {filteredJobs.length === 0 ? (
            <div className="bg-white/90 border border-dashed border-border rounded-2xl p-10 text-center shadow-xs">
              <p className="text-sm text-[#1C1800]/70">
                No roles match your search just yet. Try broadening your filters or check back soon.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="group bg-white/90 border border-border rounded-2xl p-5 sm:p-6 hover:border-[#0F4875] hover:shadow-md hover:-translate-y-[1px] transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#1C1800] mb-1.5">
                      {job.title}
                    </h3>
                    <p className="text-xs font-medium text-[#0F4875] mb-2">
                      {job.company} • {job.type}
                    </p>
                    <p className="text-xs sm:text-sm text-[#1C1800]/80 mb-3 line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                  <button className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full border border-[#0F4875]/15 bg-[#0F4875] text-xs font-semibold text-white shadow-xs group-hover:shadow-sm group-hover:-translate-y-px transition-all whitespace-nowrap ml-4">
                    Apply Now
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm pt-3 border-t border-border/70">
                  <div className="flex items-center gap-2 text-[#1C1800]/80">
                    <MapPin className="w-3.5 h-3.5 text-[#0F4875]" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#1C1800]/80">
                    <DollarSign className="w-3.5 h-3.5 text-[#0F4875]" />
                    <span className="truncate">{job.salary}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-[#1C1800]/80">
                    <Briefcase className="w-3.5 h-3.5 text-[#0F4875]" />
                    <span className="truncate">{job.type}</span>
                  </div>
                  <div className="flex sm:justify-end text-[#1C1800]/55 text-right sm:text-left">
                    Posted {job.postedDate}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
