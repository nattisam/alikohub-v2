import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDashboard, useUser } from "../hooks";
import EmptyState from "../components/common/EmptyState";

const ProjectsPage = () => {
  const { currentUser } = useUser();
  const { projects, loadingProjects, errorProjects } =
    useDashboard();
  const isError = !!errorProjects;
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
    const projectsList = Array.isArray(projects) ? projects : [];
    if (searchTerm.trim() !== "") {
      return projectsList.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return projectsList;
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
      <div className="flex flex-col justify-center items-center py-32 w-full">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-50 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading projects...</p>
      </div>
    );
  }
  
  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {isError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                Error loading projects: {(errorProjects as any)?.message || 'An unknown error occurred.'}
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-900 underline"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-slate-500 mt-1">Manage and track your construction projects</p>
        </div>
        {isAdmin && (
          <button
            onClick={handleCreateProject}
            className="group relative bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-blue-200 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <svg className="h-5 w-5 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Project
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative group max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all shadow-sm group-hover:border-slate-300"
          placeholder="Search projects by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {project.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase ${
                      project.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : 
                      project.status === "ACTIVE" ? "bg-blue-50 text-blue-700 border border-blue-100" : 
                      project.status === "PLANNED" ? "bg-amber-50 text-amber-700 border border-amber-100" : 
                      "bg-slate-50 text-slate-700 border border-slate-100"
                    }`}
                  >
                    {project.status.replace("_", " ")}
                  </span>
                </div>
                
                <p className="text-slate-500 text-sm line-clamp-2 mb-8 h-10 leading-relaxed">
                  {project.description || "No description provided."}
                </p>
                
                <div className="flex items-center text-xs font-semibold text-slate-400 mb-8 pt-4 border-t border-slate-50">
                  <div className="bg-slate-50 p-1.5 rounded-lg mr-3 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <span className="tracking-tight">
                    {new Date(project.startDate ?? "").toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} — {new Date(project.endDate ?? "").toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <button
                  onClick={() => navigate(`${prefix}/projects/${project.id}`)}
                  className="w-full bg-slate-50 text-slate-700 font-bold py-4 px-4 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center group/btn gap-2"
                >
                  View Details
                  <svg className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          title={searchTerm ? "No matching projects" : "No projects found"}
          message={searchTerm ? `We couldn't find any projects matching "${searchTerm}". Try another search term.` : "No projects have been assigned to you yet."}
          actionText={isAdmin && !searchTerm ? "Start Your First Project" : "Clear Search"}
          onAction={isAdmin && !searchTerm ? handleCreateProject : () => setSearchTerm("")}
          icon={
            <svg className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
      )}
    </div>
  );
};

export default ProjectsPage;
