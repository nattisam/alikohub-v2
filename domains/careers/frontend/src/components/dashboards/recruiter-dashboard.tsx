"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Eye } from "lucide-react"
import { JobPostingForm } from "../recruiter/job-posting-form"
import { ApplicantList } from "../recruiter/applicant-list"

export function RecruiterDashboard() {
  const [showForm, setShowForm] = useState(false)
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [jobs, setJobs] = useState([
    {
      id: "1",
      title: "Senior React Developer",
      department: "Engineering",
      status: "active",
      applicants: 12,
      postedDate: "2025-01-05",
      description: "Looking for experienced React developers",
    },
    {
      id: "2",
      title: "Product Manager",
      department: "Product",
      status: "active",
      applicants: 8,
      postedDate: "2025-01-08",
      description: "Lead product strategy and roadmap",
    },
    {
      id: "3",
      title: "UX Designer",
      department: "Design",
      status: "inactive",
      applicants: 5,
      postedDate: "2024-12-20",
      description: "Create beautiful user experiences",
    },
  ])

  const handleCreateJob = (jobData: any) => {
    const newJob = {
      id: String(jobs.length + 1),
      ...jobData,
      status: "active",
      applicants: 0,
      postedDate: new Date().toISOString().split("T")[0],
    }
    setJobs([newJob, ...jobs])
    setShowForm(false)
  }

  const handleDeleteJob = (id: string) => {
    setJobs(jobs.filter((job) => job.id !== id))
  }

  return (
    <div className="p-0 md:p-6 lg:p-8 w-full max-w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1C1800] mb-2">Job Postings</h1>
          <p className="text-[#1C1800]/70">Manage your job listings and review applicants</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E6D600] to-[#F2F296] text-[#1C1800] rounded-full hover:shadow-lg transition-all font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Job Posting
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white border border-border rounded-xl p-6 shadow-lg">
          <JobPostingForm onSubmit={handleCreateJob} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {!selectedJob ? (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-border rounded-xl p-6 hover:border-[#1175BD] hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-[#1C1800]">{job.title}</h3>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        job.status === "active"
                          ? "bg-gradient-to-r from-[#1175BD] to-[#38A1FF] text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="text-[#1C1800]/70 text-sm mb-2">{job.department}</p>
                  <p className="text-[#1C1800] text-sm">{job.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-[#1C1800]/60 text-xs uppercase tracking-wider">Applicants</p>
                    <p className="text-lg font-bold text-[#1175BD]">{job.applicants}</p>
                  </div>
                  <div>
                    <p className="text-[#1C1800]/60 text-xs uppercase tracking-wider">Posted</p>
                    <p className="text-[#1C1800] text-sm">{job.postedDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedJob(job.id)}
                    className="p-2 text-[#1C1800]/70 hover:text-[#1175BD] transition-colors hover:bg-[#F5F8F3] rounded-lg"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-[#1C1800]/70 hover:text-[#1175BD] transition-colors hover:bg-[#F5F8F3] rounded-lg">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-2 text-[#1C1800]/70 hover:text-red-600 transition-colors hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ApplicantList
          jobId={selectedJob}
          jobTitle={jobs.find((j) => j.id === selectedJob)?.title || ""}
          onBack={() => setSelectedJob(null)}
        />
      )}
    </div>
  )
}
