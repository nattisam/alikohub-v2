import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../queries/projects";
import { useUser } from "../hooks";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Calendar,
  CheckCircle,
  CircleDot,
} from "lucide-react";


const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { data: project, isLoading, error } = useProject(Number(projectId));

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
  }, [currentUser, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="rounded w-full text-red-500 p-4">
          Error loading project: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="rounded w-full text-red-500 p-4">
          Project not found
        </div>
      </div>
    );
  }

 return (
  <div className="min-h-screen w-full bg-gray-50">
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
              {project.name}
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {project.status}
              </span>
            </h1>

            <div className="mt-3 flex flex-wrap gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {project.site || "N/A"}
              </span>
              <span className="flex items-center gap-1">
                <Building2 size={14} />
                {project.contractorId || "N/A"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                Due:{" "}
                {project.endDate
                  ? new Date(project.endDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Progress</span>
            <span>
              {project.taskStats?.completed
                ? Math.round(
                    (project.taskStats.completed /
                      project.taskStats.total) *
                      100
                  )
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${
                  project.taskStats?.completed
                    ? (project.taskStats.completed /
                        project.taskStats.total) *
                      100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="flex gap-6 text-sm font-medium">
          <button className="pb-3 border-b-2 border-blue-600 text-blue-600">
            Timeline
          </button>
          <button className="pb-3 text-gray-500 hover:text-gray-700">
            Updates
          </button>
          <button className="pb-3 text-gray-500 hover:text-gray-700">
            Files
          </button>
          <button className="pb-3 text-gray-500 hover:text-gray-700">
            Messages
          </button>
        </nav>
      </div>

      {/* Milestones */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Project Milestones
        </h2>

        <div className="relative border-l border-gray-200 ml-4 space-y-8">
          {/* Completed */}
          <div className="relative pl-8">
            <CheckCircle
              size={18}
              className="absolute -left-[9px] top-1 text-green-500 bg-white"
            />
            <h3 className="font-medium text-gray-900">
              Foundation Complete
            </h3>
            <p className="text-sm text-gray-500">Due: 14 Aug 2024</p>
          </div>

          <div className="relative pl-8">
            <CheckCircle
              size={18}
              className="absolute -left-[9px] top-1 text-green-500 bg-white"
            />
            <h3 className="font-medium text-gray-900">
              Structure (Floors 1–5)
            </h3>
            <p className="text-sm text-gray-500">Due: 29 Oct 2024</p>
          </div>

          <div className="relative pl-8">
            <CheckCircle
              size={18}
              className="absolute -left-[9px] top-1 text-green-500 bg-white"
            />
            <h3 className="font-medium text-gray-900">
              Structure (Floors 6–10)
            </h3>
            <p className="text-sm text-gray-500">Due: 30 Dec 2024</p>
          </div>

          {/* In Progress */}
          <div className="relative pl-8">
            <CircleDot
              size={18}
              className="absolute -left-[9px] top-1 text-blue-600 bg-white"
            />
            <h3 className="font-medium text-blue-600">
              Structure (Floors 11–15)
            </h3>
            <p className="text-sm text-gray-500">Due: 27 Feb 2025</p>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              In Progress
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);


};

export default ProjectDetails;