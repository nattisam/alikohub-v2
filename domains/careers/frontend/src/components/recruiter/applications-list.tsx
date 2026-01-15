import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, Eye, Download, Mail } from "lucide-react"
import { api } from "../../lib/api"

interface Application {
  id: number;
  jobId: number;
  userId: string;
  coverLetter: string;
  resumeUrl: string;
  createdAt: string;
}

interface ApplicationsListProps {
  onBack?: () => void;
}

// Service function to fetch all applications
// First get all jobs, then fetch applications for each job
async function fetchAllApplications(): Promise<Application[]> {
  try {
    // Get all jobs first
    const jobsRes = await api.get('/careers/jobs');
    const jobs = jobsRes.data;
    
    // Then fetch applications for each job
    const allApplications: Application[] = [];
    for (const job of jobs) {
      try {
        const applicationsRes = await api.get(`/careers/jobs/${job.id}/applications`);
        const applicationsWithJobInfo = applicationsRes.data.map((app: any) => ({
          ...app,
          jobId: job.id
        }));
        allApplications.push(...applicationsWithJobInfo);
      } catch (error) {
        console.error(`Failed to fetch applications for job ${job.id}:`, error);
      }
    }
    
    return allApplications;
  } catch (error) {
    console.error('Error fetching all applications:', error);
    throw error;
  }
}

export function ApplicationsList({ onBack }: ApplicationsListProps) {
  const { data: applications = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['all-applications'],
    queryFn: fetchAllApplications,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="p-0 md:p-6 lg:p-8 w-full max-w-full flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1175BD]"></div>
          <p className="text-[#1C1800]/70">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-0 md:p-6 lg:p-8 w-full max-w-full">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">Failed to load applications</p>
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
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1175BD] hover:text-[#38A1FF] transition-colors mb-6 font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Job Postings
        </button>
      )}
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#1C1800] mb-2">All Job Applications</h2>
        <p className="text-[#1C1800]/70">{applications.length} total applications</p>
      </div>

      <div className="grid gap-4">
        {applications.map((application) => (
          <div key={application.id} className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-[#1C1800]">Application #{application.id}</h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E6D600] text-[#1C1800]/80">
                    Job ID: {application.jobId}
                  </span>
                </div>
                
                <div className="flex items-center gap-6 text-sm mb-3">
                  <span className="text-[#1C1800]/70">
                    Applied: <span className="text-[#1C1800] font-medium">{new Date(application.createdAt).toLocaleDateString()}</span>
                  </span>
                  <span className="text-[#1C1800]/70">
                    User ID: <span className="text-[#1C1800] font-medium truncate max-w-[100px]">{application.userId}</span>
                  </span>
                </div>

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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}