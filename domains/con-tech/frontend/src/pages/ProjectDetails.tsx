import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../queries/projects";
import { useUser } from "../hooks";
import { contechAPI } from "../services/api";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Calendar,
  CheckCircle,
  CircleDot,
  Circle,
  Loader2,
} from "lucide-react";

interface Milestone {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";
  dueDate: string | null;
  progress: number;
  isVisibleToClient: boolean;
  createdAt: string;
  updatedAt: string;
}

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { data: project, isLoading, error } = useProject(Number(projectId));
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestonesLoading, setMilestonesLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchMilestones = async () => {
      if (!projectId) return;
      
      try {
        setMilestonesLoading(true);
        const data = await contechAPI.getMilestones(Number(projectId));
        setMilestones(data || []);
      } catch (err) {
        console.error("Error fetching milestones:", err);
        setMilestones([]);
      } finally {
        setMilestonesLoading(false);
      }
    };

    fetchMilestones();
  }, [projectId]);

  const getMilestoneIcon = (status: string, progress: number) => {
    if (status === "APPROVED" || progress === 100) {
      return <CheckCircle size={18} className="absolute -left-[9px] top-1 text-green-500 bg-white" />;
    } else if (status === "IN_REVIEW" || progress > 0) {
      return <CircleDot size={18} className="absolute -left-[9px] top-1 text-[#3E92D1] bg-white" />;
    } else {
      return <Circle size={18} className="absolute -left-[9px] top-1 text-gray-300 bg-white" />;
    }
  };

  const getMilestoneTextColor = (status: string, progress: number) => {
    if (status === "APPROVED" || progress === 100) {
      return "text-green-600";
    } else if (status === "IN_REVIEW" || progress > 0) {
      return "text-[#3E92D1]";
    } else {
      return "text-gray-900";
    }
  };

  const getStatusBadge = (status: string, progress: number) => {
    if (status === "APPROVED" || progress === 100) {
      return (
        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
          Completed
        </span>
      );
    } else if (status === "IN_REVIEW") {
      return (
        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
          In Review
        </span>
      );
    } else if (progress > 0) {
      return (
        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
          In Progress ({progress}%)
        </span>
      );
    } else if (status === "REJECTED") {
      return (
        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
          Rejected
        </span>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E92D1]"></div>
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
              {project.progress || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#3E92D1] h-2 rounded-full"
              style={{
                width: `${project.progress || 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="flex gap-6 text-sm font-medium">
          <button className="pb-3 border-b-2 border-[#3E92D1] text-[#3E92D1]">
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

        {milestonesLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#3E92D1]" />
          </div>
        ) : milestones.length > 0 ? (
          <div className="relative border-l border-gray-200 ml-4 space-y-8">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="relative pl-8">
                {getMilestoneIcon(milestone.status, milestone.progress)}
                <h3 className={`font-medium ${getMilestoneTextColor(milestone.status, milestone.progress)}`}>
                  {milestone.title}
                </h3>
                {milestone.description && (
                  <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                )}
                <p className="text-sm text-gray-500">
                  {milestone.dueDate 
                    ? `Due: ${new Date(milestone.dueDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}`
                    : "No due date set"}
                </p>
                {getStatusBadge(milestone.status, milestone.progress)}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Circle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No milestones have been created for this project yet.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);


};

export default ProjectDetails;