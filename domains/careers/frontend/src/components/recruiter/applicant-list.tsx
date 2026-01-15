"use client"

import { useState } from "react"
import { ChevronLeft, Eye, Download, Mail } from "lucide-react"

interface Applicant {
  id: string
  name: string
  email: string
  phone: string
  appliedDate: string
  status: "new" | "reviewed" | "rejected"
  score: number
}

interface ApplicantListProps {
  jobId: string
  jobTitle: string
  onBack: () => void
}

export function ApplicantList({ jobId, jobTitle, onBack }: ApplicantListProps) {
  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@email.com",
      phone: "(555) 123-4567",
      appliedDate: "2025-01-12",
      status: "new",
      score: 85,
    },
    {
      id: "2",
      name: "Jordan Smith",
      email: "jordan.smith@email.com",
      phone: "(555) 234-5678",
      appliedDate: "2025-01-10",
      status: "reviewed",
      score: 78,
    },
    {
      id: "3",
      name: "Casey Williams",
      email: "casey.w@email.com",
      phone: "(555) 345-6789",
      appliedDate: "2025-01-08",
      status: "rejected",
      score: 45,
    },
  ])

  const handleStatusChange = (id: string, status: Applicant["status"]) => {
    setApplicants(applicants.map((app) => (app.id === id ? { ...app, status } : app)))
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
        <h2 className="text-3xl font-bold text-[#1C1800] mb-2">Applicants for {jobTitle}</h2>
        <p className="text-[#1C1800]/70">{applicants.length} total applications</p>
      </div>

      <div className="grid gap-4">
        {applicants.map((applicant) => (
          <div key={applicant.id} className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-[#1C1800]">{applicant.name}</h3>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      applicant.status === "new"
                        ? "bg-gradient-to-r from-[#1175BD] to-[#38A1FF] text-white"
                        : applicant.status === "reviewed"
                          ? "bg-gradient-to-r from-[#E6D600] to-[#F2F296] text-[#1C1800]"
                          : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {applicant.status}
                  </span>
                </div>
                <p className="text-[#1C1800]/70 text-sm mb-1">{applicant.email}</p>
                <p className="text-[#1C1800]/70 text-sm mb-3">{applicant.phone}</p>

                <div className="flex items-center gap-6 text-sm">
                  <span className="text-[#1C1800]/70">
                    Applied: <span className="text-[#1C1800] font-medium">{applicant.appliedDate}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1C1800]/70">Match Score:</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#1175BD] to-[#38A1FF] transition-all" style={{ width: `${applicant.score}%` }} />
                    </div>
                    <span className="text-[#1175BD] font-bold ml-2">{applicant.score}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 text-[#1C1800]/70 hover:text-[#1175BD] transition-colors hover:bg-[#F5F8F3] rounded-lg">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-2 text-[#1C1800]/70 hover:text-[#1175BD] transition-colors hover:bg-[#F5F8F3] rounded-lg">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2 text-[#1C1800]/70 hover:text-[#1175BD] transition-colors hover:bg-[#F5F8F3] rounded-lg">
                  <Mail className="w-5 h-5" />
                </button>

                {applicant.status === "new" && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleStatusChange(applicant.id, "reviewed")}
                      className="px-4 py-2 text-xs font-medium bg-gradient-to-r from-[#1175BD] to-[#38A1FF] text-white rounded-lg hover:shadow-md transition-all"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => handleStatusChange(applicant.id, "rejected")}
                      className="px-4 py-2 text-xs font-medium border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-all"
                    >
                      Reject
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
