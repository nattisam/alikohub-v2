"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronLeft, Eye, Download, Mail, Loader2 } from "lucide-react"
import { api } from "../../lib/api"

interface Application {
  id: number
  jobId: number
  userId: string
  coverLetter: string
  resumeUrl: string
  createdAt: string
  status?: "new" | "reviewed" | "rejected"
}

interface ApplicantListProps {
  jobId: string
  jobTitle: string
  onBack: () => void
}

// Service function to fetch applicants for a job
async function fetchApplications(jobId: string): Promise<Application[]> {
  const res = await api.get(`/careers/jobs/${jobId}/applications`);
  return res.data;
}

// Service function to update application status
async function updateApplicationStatus(applicationId: number, status: string): Promise<any> {
  const res = await api.patch(`/careers/applications/${applicationId}/status`, { status });
  return res.data;
}

export function ApplicantList({ jobId, jobTitle, onBack }: ApplicantListProps) {
  const queryClient = useQueryClient();
  
  // Fetch applications for the job
  const { data: applications = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['applications', jobId],
    queryFn: () => fetchApplications(jobId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
  
  // Mutation for updating application status
  const updateStatusMutation = useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: number; status: string }) => 
      updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', jobId] });
    },
  })

  const handleStatusChange = (id: number, status: "new" | "reviewed" | "rejected") => {
    updateStatusMutation.mutate({ applicationId: id, status });
  }

  if (isLoading) {
    return (
      <div className="p-0 md:p-6 lg:p-8 w-full max-w-full flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1175BD]" />
          <p className="text-[#1C1800]/70">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-0 md:p-6 lg:p-8 w-full max-w-full">
        <div className="bg-red-50 ring-1 ring-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">Failed to load applicants</p>
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
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#1175BD] hover:text-[#38A1FF] transition-colors mb-6 font-medium"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Job Postings
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#1C1800] mb-2">Applications for {jobTitle}</h2>
        <p className="text-[#1C1800]/70">{applications.length} total applications</p>
      </div>

      <div className="grid gap-4">
        {applications.map((application) => (
          <div key={application.id} className="bg-white ring-1 ring-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-[#1C1800]">Application #{application.id}</h3>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      (application.status || "new") === "new"
                        ? "bg-gradient-to-r from-[#1175BD] to-[#38A1FF] text-white"
                        : (application.status || "new") === "reviewed"
                          ? "bg-gradient-to-r from-[#E6D600] to-[#F2F296] text-[#1C1800]"
                          : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Status: {application.status || "New"}
                  </span>
                </div>
                <p className="text-[#1C1800]/70 text-sm mb-1">User ID: {application.userId}</p>
                <p className="text-[#1C1800]/70 text-sm mb-3">Applied: {new Date(application.createdAt).toLocaleDateString()}</p>

                <div className="mb-3">
                  <p className="text-[#1C1800] text-sm mb-2"><strong>Cover Letter:</strong></p>
                  <p className="text-[#1C1800]/80 text-sm bg-[#F5F8F3] p-3 rounded-lg">
                    {application.coverLetter}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#1C1800]/70">Resume:</span>
                  <a 
                    href={application.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1175BD] hover:underline text-sm break-all"
                  >
                    {application.resumeUrl}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <a 
                  href={application.resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-[#1C1800]/70 hover:text-[#1175BD] transition-colors hover:bg-[#F5F8F3] rounded-lg"
                >
                  <Eye className="w-5 h-5" />
                </a>
                <a 
                  href={application.resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-[#1C1800]/70 hover:text-[#1175BD] transition-colors hover:bg-[#F5F8F3] rounded-lg"
                >
                  <Download className="w-5 h-5" />
                </a>
                <button className="p-2 text-[#1C1800]/70 hover:text-[#1175BD] transition-colors hover:bg-[#F5F8F3] rounded-lg">
                  <Mail className="w-5 h-5" />
                </button>

                {(application.status || "new") === "new" && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleStatusChange(application.id, "reviewed")}
                      className="px-4 py-2 text-xs font-medium bg-gradient-to-r from-[#1175BD] to-[#38A1FF] text-white rounded-lg hover:shadow-md transition-all"
                      disabled={updateStatusMutation.isPending}
                    >
                      {updateStatusMutation.isPending && updateStatusMutation.variables?.applicationId === application.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Review"
                      )}
                    </button>
                    <button
                      onClick={() => handleStatusChange(application.id, "rejected")}
                      className="px-4 py-2 text-xs font-medium ring-1 ring-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-all"
                      disabled={updateStatusMutation.isPending}
                    >
                      {updateStatusMutation.isPending && updateStatusMutation.variables?.applicationId === application.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Reject"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}