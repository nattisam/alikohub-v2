"use client"

import { useState } from "react"
import { Search, MapPin, DollarSign, ArrowRight, Briefcase, X } from "lucide-react"

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
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")
  const effectiveJobs = jobs && jobs.length > 0 ? jobs : DEFAULT_JOBS

  // Get unique locations and types for filters
  const locations = Array.from(new Set(effectiveJobs.map(job => job.location))).sort()
  const types = Array.from(new Set(effectiveJobs.map(job => job.type))).sort()

  const filteredJobs = effectiveJobs.filter(
    (job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesLocation = !selectedLocation || job.location === selectedLocation
      const matchesType = !selectedType || job.type === selectedType

      return matchesSearch && matchesLocation && matchesType
    },
  )

  const hasActiveFilters = selectedLocation || selectedType

  return (
    <div className="w-full min-h-screen bg-[#FFFFFF]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Header */}
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-primary/10 px-4 py-2 ring-1 ring-primary/20 hover:ring-primary/30 transition">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Open Opportunities
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Find work that moves you forward
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl font-light">
              Discover opportunities across engineering, design, product, and more.
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search - Narrower */}
            <div className="relative group flex-1 sm:flex-initial sm:max-w-md w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition" />
              <div className="relative rounded-xl bg-white/80 backdrop-blur shadow-sm ring-1 ring-black/5 hover:ring-primary/20 focus-within:ring-primary/30 transition">
                <div className="flex items-center gap-3 px-6 py-4">
                  <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, company, or location..."
                    className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Location Filter */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent rounded-lg blur-xl opacity-0 group-focus-within:opacity-100 transition" />
                <div className="relative rounded-lg bg-white/80 backdrop-blur shadow-sm ring-1 ring-black/5 hover:ring-primary/20 focus-within:ring-primary/30 transition">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="appearance-none bg-transparent px-4 py-3 pr-8 text-sm text-foreground focus:outline-none cursor-pointer"
                  >
                    <option value="">All Locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Type Filter */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent rounded-lg blur-xl opacity-0 group-focus-within:opacity-100 transition" />
                <div className="relative rounded-lg bg-white/80 backdrop-blur shadow-sm ring-1 ring-black/5 hover:ring-primary/20 focus-within:ring-primary/30 transition">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="appearance-none bg-transparent px-4 py-3 pr-8 text-sm text-foreground focus:outline-none cursor-pointer"
                  >
                    <option value="">All Types</option>
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSelectedLocation("")
                    setSelectedType("")
                  }}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-white/80 backdrop-blur shadow-sm ring-1 ring-black/5 hover:ring-primary/20 hover:bg-white/90 transition text-sm text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="rounded-xl bg-white/60 backdrop-blur p-14 text-center shadow-sm ring-1 ring-black/5">
              <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No roles match your search.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="group relative w-full text-left rounded-xl bg-white/80 backdrop-blur shadow-sm ring-1 ring-black/5 hover:ring-primary/25 hover:shadow-md transition overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />

                <div className="relative p-6 space-y-4">
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-primary font-medium">{job.company}</span>
                        <span className="text-muted-foreground">• {job.type}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {job.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-foreground">
                      <DollarSign className="w-4 h-4 text-primary" />
                      {job.salary}
                    </div>
                    <span className="ml-auto text-xs">
                      Posted {job.postedDate}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

