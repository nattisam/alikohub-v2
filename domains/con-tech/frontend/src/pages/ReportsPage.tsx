import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../hooks';
import { useReports } from '../queries/reports';
import { useProjects } from '../queries/projects';
import EmptyState from "../components/common/EmptyState";
import { Card, CardContent } from "../components/ui/card";
import { Search, Plus, FileText, Calendar, Filter, Loader2, AlertCircle, ArrowRight } from "lucide-react";

const ReportsPage = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<string>(projectId || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: allProjects = [], isLoading: projectsLoading } = useProjects();
  const { data: reports, isLoading: reportsLoading, isError, refetch } = useReports(
    selectedProject !== 'all' ? parseInt(selectedProject) : undefined
  );

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
  }, [currentUser, navigate]);

  const filteredReports = (reports || []).filter((report: any) =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.summary && report.summary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (projectsLoading || reportsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#3E92D1]" />
        <p className="mt-4 text-sm font-medium text-gray-500">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Consolidated reporting and oversight logs</p>
        </div>
        <button
          onClick={() => navigate('/admin/reports/new')}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-[#3E92D1] hover:bg-[#2E82C1] gap-2 text-white shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Generate New Report
        </button>
      </div>

      {isError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                Security / Sync Alert: Scanning database failed.
              </p>
              <button 
                onClick={() => refetch()} 
                className="mt-1 text-sm font-medium text-red-700 hover:text-red-900 underline"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative group flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#3E92D1] transition-colors">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-[#3E92D1] transition-all shadow-sm"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Filter className="h-4 w-4" />
          </div>
          <select
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              refetch();
            }}
            className="block w-full pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-[#3E92D1] transition-all shadow-sm appearance-none text-gray-900 cursor-pointer"
          >
            <option value="all">All Projects</option>
            {allProjects.map((project: any) => (
              <option key={project.id} value={project.id.toString()}>
                {project.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
             <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length > 0 ? (
        <div className="grid gap-4">
          {filteredReports.map((report: any) => (
            <Card 
              key={report.id} 
              onClick={() => navigate(`/admin/reports/${report.id}`)}
              className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-[#3E92D1]"></span>
                     <h3 className="text-base font-bold text-gray-900 group-hover:text-[#3E92D1] transition-colors">
                       {report.title}
                     </h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1 max-w-2xl">
                    {report.summary || "No executive summary available for this report."}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                     <div className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        <span>Verification Log</span>
                     </div>
                     <span>•</span>
                     <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                     </div>
                  </div>
                </div>
                
                <div className="flex items-center text-[#3E92D1] font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Open Audit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="Archive Empty"
          message="No monitoring logs have been recorded for this scope."
          actionText={selectedProject !== "all" ? "Clear Filters" : "Generate Report"}
          onAction={selectedProject !== "all" ? () => setSelectedProject("all") : () => navigate('/admin/reports/new')}
          icon={
            <FileText className="h-10 w-10 text-gray-300" />
          }
        />
      )}
    </div>
  );
};

export default ReportsPage;