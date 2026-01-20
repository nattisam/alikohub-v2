import { useState } from "react";
import { Search, MapPin, DollarSign, ArrowRight, Briefcase, X, Sparkles } from "lucide-react";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  postedDate: string;
}

interface JobSearchProps {
  onSelectJob: (job: Job) => void;
  jobs?: Job[];
}

const DEFAULT_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: "$120K - $160K",
    type: "Full-time",
    description: "Looking for experienced React developers to join our team building next-generation web applications",
    postedDate: "2025-01-05",
  },
  {
    id: "2",
    title: "Product Manager",
    company: "InnovateLabs",
    location: "New York, NY",
    salary: "$130K - $170K",
    type: "Full-time",
    description: "Lead product strategy and roadmap for mobile applications serving millions of users",
    postedDate: "2025-01-08",
  },
  {
    id: "3",
    title: "UX Designer",
    company: "DesignStudio",
    location: "Remote",
    salary: "$90K - $130K",
    type: "Full-time",
    description: "Create beautiful and intuitive user experiences for enterprise software products",
    postedDate: "2025-01-07",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudFirst",
    location: "Austin, TX",
    salary: "$110K - $150K",
    type: "Full-time",
    description: "Build and maintain cloud infrastructure at scale using modern DevOps practices",
    postedDate: "2025-01-06",
  },
];

export function JobSearch({ onSelectJob, jobs }: JobSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const effectiveJobs = jobs && jobs.length > 0 ? jobs : DEFAULT_JOBS;

  const locations = Array.from(new Set(effectiveJobs.map((job) => job.location))).sort();
  const types = Array.from(new Set(effectiveJobs.map((job) => job.type))).sort();

  const filteredJobs = effectiveJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = !selectedLocation || job.location === selectedLocation;
    const matchesType = !selectedType || job.type === selectedType;

    return matchesSearch && matchesLocation && matchesType;
  });

  const hasActiveFilters = selectedLocation || selectedType;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="w-full min-h-screen bg-stone-50">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {/* Header */}
        <header className="space-y-6 mb-12">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-indigo-500/5 px-4 py-2 border border-indigo-500/10 hover:border-indigo-500/20 transition-colors duration-300">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
              {filteredJobs.length} Open {filteredJobs.length === 1 ? "Position" : "Positions"}
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1]">
              Find work that
              <span className="block text-[#BF6622]">moves you forward</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl leading-relaxed">
              Discover opportunities across engineering, design, product, and more at companies shaping the future.
            </p>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search Input */}
            <div className="relative group flex-1 w-full lg:max-w-md">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-teal-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <div className="relative rounded-xl bg-white border border-gray-200 hover:border-indigo-500/30 focus-within:border-indigo-500/50 transition-colors duration-300 shadow-sm">
                <div className="flex items-center gap-4 px-5 py-4">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search roles, companies..."
                    className="w-full bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Location Filter */}
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className={`appearance-none bg-white border rounded-xl px-4 py-3.5 pr-10 text-sm font-medium transition-colors duration-300 cursor-pointer focus:outline-none focus:border-indigo-500/50 hover:border-indigo-500/30 ${selectedLocation ? "text-indigo-600 border-indigo-500/30" : "text-gray-500 border-gray-200"}`}
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className={`appearance-none bg-white border rounded-xl px-4 py-3.5 pr-10 text-sm font-medium transition-colors duration-300 cursor-pointer focus:outline-none focus:border-indigo-500/50 hover:border-indigo-500/30 ${selectedType ? "text-indigo-600 border-indigo-500/30" : "text-gray-500 border-gray-200"}`}
                >
                  <option value="">All Types</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <Briefcase className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSelectedLocation("");
                    setSelectedType("");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-red-50 border border-red-200 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors duration-300"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Job Results */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="rounded-2xl bg-white border border-gray-200 p-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-6">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No positions found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="group relative w-full text-left rounded-2xl bg-white border border-gray-200 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative p-6 sm:p-7">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Company & Type */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-indigo-600">{job.company}</span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                          {job.type}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                        {job.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-500 line-clamp-2 max-w-2xl leading-relaxed">
                        {job.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <DollarSign className="w-4 h-4 text-indigo-600" />
                      <span>{job.salary}</span>
                    </div>
                    <span className="ml-auto text-xs text-gray-400 font-medium">
                      {formatDate(job.postedDate)}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
