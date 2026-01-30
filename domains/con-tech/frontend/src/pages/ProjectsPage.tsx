import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDashboard, useUser } from "../hooks";
import EmptyState from "../components/common/EmptyState";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Search, Plus, Calendar, ArrowRight, Loader2 } from "lucide-react";

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
  const isAdmin = isGlobalAdmin || userRole === 'ADMIN';
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#3E92D1]" />
        <p className="mt-4 text-sm font-medium text-gray-500">Loading projects...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your construction projects</p>
        </div>
        {isAdmin && (
          <button
            onClick={handleCreateProject}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-[#3E92D1] hover:bg-[#2E82C1] gap-2 text-white shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative group max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#3E92D1] transition-colors">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-[#3E92D1] transition-all shadow-sm"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id}
              className="border-none shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col h-full"
            >
              <CardHeader className="pb-3 px-6 pt-6">
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      project.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : 
                      project.status === "ACTIVE" ? "bg-blue-50 text-[#3E92D1] border-blue-100" : 
                      project.status === "PLANNED" ? "bg-amber-50 text-amber-700 border-amber-100" : 
                      "bg-gray-50 text-gray-700 border-gray-100"
                    }`}
                  >
                    {project.status.replace("_", " ")}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#3E92D1] transition-colors">
                  {project.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="px-6 pb-6 flex-grow">
                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                  {project.description || "No description provided."}
                </p>
                
                <div className="flex items-center text-xs font-medium text-gray-400 mt-6 pt-4 border-t border-gray-50">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-gray-400" />
                  <span>
                    {new Date(project.startDate ?? "").toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} — {new Date(project.endDate ?? "").toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="px-6 pb-6 pt-0">
                 <button
                  onClick={() => navigate(`${prefix}/projects/${project.id}`)}
                  className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-gray-200 hover:border-[#3E92D1] hover:text-[#3E92D1] bg-white h-9 px-4 py-2 group/btn"
                >
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          title={searchTerm ? "No matching projects" : "No projects found"}
          message={searchTerm ? `We couldn't find any projects matching "${searchTerm}". Try another search term.` : "No projects have been assigned to you yet."}
          actionText={isAdmin && !searchTerm ? "Start Your First Project" : "Clear Search"}
          onAction={isAdmin && !searchTerm ? handleCreateProject : () => setSearchTerm("")}
          icon={
            <Search className="h-10 w-10 text-gray-300" />
          }
        />
      )}
    </div>
  );
};

export default ProjectsPage;
