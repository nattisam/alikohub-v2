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
      <div className="w-full min-h-screen bg-stone-50">
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="text-gray-500">Loading applications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen bg-stone-50">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="rounded-2xl bg-white border border-gray-200 p-12 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Failed to load applications</h2>
            <p className="text-gray-500 mb-6">Something went wrong while loading the applications.</p>
            <button 
              onClick={() => refetch()}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 hover:shadow-md transition-all duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-stone-50">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2.5 rounded-full bg-white border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-300 shadow-sm hover:shadow-md mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Job Postings
          </button>
        )}
        
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">All Job Applications</h2>
          <p className="text-gray-500">{applications.length} total applications</p>
        </div>

        <div className="grid gap-6">
          {applications.map((application) => (
            <div key={application.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Application #{application.id}</h3>
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-yellow-500 text-gray-900">
                      Job ID: {application.jobId}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Applied Date</p>
                      <p className="text-gray-700 text-sm font-medium">{new Date(application.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">User ID</p>
                      <p className="text-gray-700 text-sm font-medium truncate">{application.userId}</p>
                    </div>
                  </div>

                  <div className="mb-5">
                    <p className="text-gray-700 text-sm font-semibold mb-2">Cover Letter:</p>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {application.coverLetter}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm font-medium">Resume:</span>
                    <a 
                      href={application.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 hover:underline text-sm break-all"
                    >
                      {application.resumeUrl}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a 
                    href={application.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2.5 text-gray-500 hover:text-indigo-600 transition-colors hover:bg-indigo-500/10 rounded-lg"
                  >
                    <Eye className="w-5 h-5" />
                  </a>
                  <a 
                    href={application.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2.5 text-gray-500 hover:text-indigo-600 transition-colors hover:bg-indigo-500/10 rounded-lg"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                  <button className="p-2.5 text-gray-500 hover:text-indigo-600 transition-colors hover:bg-indigo-500/10 rounded-lg">
                    <Mail className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}