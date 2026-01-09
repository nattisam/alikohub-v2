import DocumentsSection from "./DocumentsSection";
import type { Document, Milestone, ProjectWithStats } from "./type";
import Timeline from "./ProjectTimeline";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";

import { useEffect, useState } from "react";
import TaskBoard from "./TaskBoard";
import { contechApi } from "../api";

const ProjectSection: React.FC<{
  project: ProjectWithStats;
  timeline?: Milestone[];
  documents: Document[];
}> = ({ project, timeline, documents }) => {
  const [unfold, setUnfold] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>(timeline || []);
  useEffect(() => {
    const fetchProjectMilestones = async() => {
      const res = await contechApi.get("milestones/project/" + project.id);
      setMilestones(res.data);
    };
    if (!timeline) {
      fetchProjectMilestones();
    }
  });
  if (!unfold) {
    return (
      <div id={`${project.id}`} className="w-full my-5 bg-white flex justify-between px-10 py-4 rounded shadow">
        <p className="text-xl font-bold text-gray-800">{project.name}</p>
        {/* button to unfold the project sections dropdown */}
        <button
          className="font-bold text-gray-600 hover:text-gray-800"
          onClick={() => setUnfold(!unfold)}
        >
          <FaAngleDown size={20} />
        </button>
      </div>
    );
  }

  return (
    <section className="bg-white rounded shadow px-10 py-6 mb-8 w-full">
      <h2 className="text-xl font-bold mb-6 flex flex-row justify-between text-gray-800">
        <span>{project.name}</span>
        {/* button to fold the project sections dropdown */}
        <button
          className="font-bold text-gray-600 hover:text-gray-800"
          onClick={() => setUnfold(!unfold)}
        >
          <FaAngleUp size={20} />
        </button>
      </h2>

      {/* Project Status and Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Status:</span>
            <span
              className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                project.status === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : project.status === "ACTIVE"
                  ? "bg-blue-100 text-blue-700"
                  : project.status === "ON_HOLD"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {project.status.replace("_", " ")}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Start Date:</span>
            <span className="ml-2 text-gray-800">
              {new Date(project.startDate ?? Date.now()).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">End Date:</span>
            <span className="ml-2 text-gray-800">
              {new Date(project.endDate ?? Date.now()).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Tasks:</span>
            <span className="ml-2 text-gray-800">
              {project.tasks?.length || 0} total
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-7 space-y-4 lg:space-y-0 lg:space-x-4">
        <TaskBoard
          className="bg-white rounded-lg shadow-md p-4 flex-1 col-span-5"
          tasks={project.tasks || []}
        />
        <Timeline
          className="w-full bg-green-100 col-span-2 p-4 rounded"
          stages={milestones}
        />
      </div>
      {documents && documents.length > 0 && (
        <DocumentsSection documents={documents} />
      )}
    </section>
  );
};

export default ProjectSection;
