import React, { useEffect } from "react";
import { useDashboard, useUser } from "../hooks";
import type { ExtendedCurrentUser } from "../components/type";
import ProjectSection from "../components/ProjectSection";
import { ProjectStatus } from "../components/type";
const DashboardHome: React.FC = () => {
  const { currentUser } = useUser() as { currentUser: ExtendedCurrentUser };
  const { projects, loadProjects, loadingProjects, errorProjects } = useDashboard();

  if (loadingProjects) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (errorProjects) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 w-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{errorProjects.message || 'Failed to load projects'}</span>
        </div>
      </div>
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
        <div className="bg-white rounded shadow p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Projects Found</h3>
          <p className="text-gray-500">You don't have any projects assigned yet.</p>
        </div>
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