import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDashboard, useUser } from "../hooks";
import type { Project } from "../components/types";

const ProjectsPage = () => {
  const { currentUser } = useUser();
  const { projects, loadingProjects, errorProjects } =
    useDashboard();
  // const [filteredProjects, setFilteredProjects] = useState<any[]>([]); // Replaced with useMemo
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { projectId } = useParams();
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
  }, [currentUser, navigate]);

  const isGlobalAdmin = currentUser?.globalRole === 'ADMIN';
  const userRole = currentUser?.role;
  const isAdmin = isGlobalAdmin || userRole === 'PROJECT_MANAGER' || userRole === 'ADMIN';
  const isContractor = userRole === 'CONTRACTOR';
  const isClient = userRole === 'CLIENT';

  const prefix = useMemo(() => {
    if (isAdmin) return "/admin";
    if (isContractor) return "/contractor";
    if (isClient) return "/client";
    return "/dashboard";
  }, [isAdmin, isContractor, isClient]);

  const filteredProjects = useMemo(() => {
    if (searchTerm.trim() !== "") {
      // Filter projects based on search term
      if (projects && Array.isArray(projects)) {
        return (projects as Project[]).filter(
          (project) =>
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return [];
    } else {
      // Show all projects when no search term
      return projects && Array.isArray(projects) ? (projects as Project[]) : [];
    }
  }, [searchTerm, projects]);

  useEffect(() => {
    if (projectId) {
      navigate(`${prefix}/projects/${projectId}`);
    }
  }, [projectId, navigate, prefix]);

  const handleCreateProject = () => {
    navigate(`${prefix}/projects/new`);
  };

  if (loadingProjects) {
    return (
      <div className="flex justify-center items-center py-20 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (errorProjects) {
    return (
      <div className="flex justify-center items-center py-20 w-full">
        <div className="bg-red-50 border border-red-200 rounded-lg text-red-600 p-6 max-w-lg text-center">
          <p className="font-bold mb-2">Error loading projects</p>
          <p className="text-sm">{(errorProjects as any).message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        {(isAdmin || isClient) && (
          <button
            onClick={handleCreateProject}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition-all transform hover:scale-105"
          >
            Create Project
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-blue-500 transition-colors">
          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          placeholder="Search projects by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                      project.status === "COMPLETED" ? "bg-green-100 text-green-700" : 
                      project.status === "ACTIVE" ? "bg-blue-100 text-blue-700" : 
                      project.status === "PLANNED" ? "bg-yellow-100 text-yellow-700" : 
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {project.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-6 h-10">
                  {project.description || "No description provided."}
                </p>
                <div className="flex items-center text-sm text-gray-500 border-t border-gray-50 pt-4">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
                  </svg>
                  <span>
                    {new Date(project.startDate ?? "").toLocaleDateString()} — {new Date(project.endDate ?? "").toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => navigate(`${prefix}/projects/${project.id}`)}
                    className="w-full bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center group/btn"
                  >
                    View Details
                    <svg className="h-4 w-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-100 p-16 text-center shadow-sm">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            {searchTerm ? `We couldn't find any projects matching "${searchTerm}".` : "No projects have been assigned to you yet."}
          </p>
          {(isAdmin || isClient) && !searchTerm && (
            <button
              onClick={handleCreateProject}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Start Your First Project
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
