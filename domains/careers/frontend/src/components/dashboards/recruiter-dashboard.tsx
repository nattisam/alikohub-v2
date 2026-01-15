"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Edit2, Trash2, Eye, Loader2 } from "lucide-react"
import { JobPostingForm } from "../recruiter/job-posting-form"
import { ApplicantList } from "../recruiter/applicant-list"
import { getJobById, getAllJobs, createJob, deleteJob } from "../../services/job-service"

export function RecruiterDashboard() {
  const [showForm, setShowForm] = useState(false)
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const queryClient = useQueryClient()
  
  // Fetch all jobs
  const { data: jobs = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['jobs'],
    queryFn: getAllJobs,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
  
  // Mutation for creating a job
  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      setShowForm(false)
    },
  })
  
  // Mutation for deleting a job
  const deleteJobMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
  
  const handleCreateJob = (jobData: any) => {
    createJobMutation.mutate(jobData)
  }
  
  const handleDeleteJob = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      deleteJobMutation.mutate(id)
    }
  }
  
  // Refetch jobs when selectedJob changes
  useEffect(() => {
    if (selectedJob) {
      refetch();
    }
  }, [selectedJob, refetch]);

  if (isLoading) {
    return (
      <div className="p-0 md:p-6 lg:p-8 w-full max-w-full flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1175BD]" />
          <p className="text-[#1C1800]/70">Loading job postings...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-0 md:p-6 lg:p-8 w-full max-w-full">
        <div className="bg-red-50 ring-1 ring-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">Failed to load job postings</p>
          <button 
            onClick={() => refetch()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
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
          disabled={createJobMutation.isPending}
        >
          {createJobMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              New Job Posting
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white/80 ring-1 ring-black/5 shadow-sm backdrop-blur-sm">
          <JobPostingForm 
            onSubmit={handleCreateJob} 
            onCancel={() => setShowForm(false)} 
            isSubmitting={createJobMutation.isPending}
          />
        </div>
      )}

      {!selectedJob ? (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white ring-1 ring-border rounded-xl p-6 hover:ring-[#1175BD] hover:shadow-lg transition-all"
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
                  <p className="text-[#1C1800]/70 text-sm mb-2">{job.department || 'General'}</p>
                  <p className="text-[#1C1800] text-sm">{job.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-[#1C1800]/60 text-xs uppercase tracking-wider">Applicants</p>
                    <p className="text-lg font-bold text-[#1175BD]">{job.applicants || 0}</p>
                  </div>
                  <div>
                    <p className="text-[#1C1800]/60 text-xs uppercase tracking-wider">Posted</p>
                    <p className="text-[#1C1800] text-sm">{job.postedDate || 'N/A'}</p>
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
                    disabled={deleteJobMutation.isPending}
                  >
                    {deleteJobMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
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