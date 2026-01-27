import React from "react";
import { useDashboard } from "../hooks";
import ProjectSection from "../components/ProjectSection";
import { ProjectStatus } from "../components/types";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
const DashboardHome: React.FC = () => {
  const { projects, loadingProjects, errorProjects } = useDashboard();

  if (loadingProjects) {
    return (
      <div className="flex flex-col justify-center items-center py-32 w-full bg-slate-50/50 min-h-[60vh]">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-50 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  if (errorProjects) {
    return (
      <ErrorState 
        message={errorProjects.message || 'Failed to load projects'} 
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Calculate project statistics - ensure projects is an array
  const projectsArray = Array.isArray(projects) ? projects : [];
  const completedProjects = projectsArray.filter(project => project.status === ProjectStatus.COMPLETED).length || 0;
  const activeProjects = projectsArray.filter(project => project.status === ProjectStatus.ACTIVE).length || 0;
  const plannedProjects = projectsArray.filter(project => project.status === ProjectStatus.PLANNED).length || 0;
  
  // Calculate report statistics - for now set to 0 since we're not fetching all reports globally
  const totalReports = 0;
  
  // Get recently updated projects
  const recentProjects = projectsArray.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 3);

  return (
    <main className="min-h-full max-h-screen w-full bg-gray-100 container mx-auto p-4 overflow-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Project Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor your construction projects and track progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-blue-600">{activeProjects}</div>
          <div className="text-gray-600">Active Projects</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-green-600">{completedProjects}</div>
          <div className="text-gray-600">Completed Projects</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-yellow-600">{plannedProjects}</div>
          <div className="text-gray-600">Planned Projects</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-purple-600">{totalReports}</div>
          <div className="text-gray-600">Total Reports</div>
        </div>
      </div>

      {(projectsArray.length === 0) && (
        <EmptyState 
          title="No Projects Found"
          message="You don't have any projects assigned yet."
        />
      )}
      
      {(projectsArray && projectsArray.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Projects</h2>
          <div>
            {recentProjects.map((project) => (
              <ProjectSection
                key={project.id}
                project={project}
                timeline={project.milestones ?? []}
                documents={project.documents ?? []}
              />
            ))}
          </div>
        </div>
      ))}
      
      {/* Note: Reports section has been removed since we can't fetch all reports globally */}
    </main>
  );
};

export default DashboardHome;