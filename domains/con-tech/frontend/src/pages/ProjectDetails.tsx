import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../queries/projects";
import { useUser } from "../hooks";

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
    <div className="flex h-screen w-full bg-gray-50">
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Project Details</h1>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Back
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {project.name}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {project.description || "No description provided"}
              </p>
            </div>
            <div className="px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : project.status === "ACTIVE"
                          ? "bg-blue-100 text-blue-800"
                          : project.status === "PLANNED"
                          ? "bg-yellow-100 text-yellow-800"
                          : project.status === "ON_HOLD"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status.replace("_", " ")}
                    </span>
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(project.startDate).toLocaleDateString()}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">End Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : "N/A"}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Created By</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {project.manager?.firstname} {project.manager?.lastname}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Site Location</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {project.site || "N/A"}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Inspector</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {project.inspectorId || "N/A"}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Contractor</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {project.contractorId || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Project Stats */}
          {project.taskStats && (
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Task Statistics
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-0">
                <dl className="sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                  <div className="py-4 sm:py-5">
                    <dt className="text-sm font-medium text-gray-500">Total Tasks</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                      {project.taskStats.total}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5">
                    <dt className="text-sm font-medium text-gray-500">Completed</dt>
                    <dd className="mt-1 text-2xl font-semibold text-green-600">
                      {project.taskStats.completed}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5">
                    <dt className="text-sm font-medium text-gray-500">In Progress</dt>
                    <dd className="mt-1 text-2xl font-semibold text-blue-600">
                      {project.taskStats.inProgress}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5">
                    <dt className="text-sm font-medium text-gray-500">Pending</dt>
                    <dd className="mt-1 text-2xl font-semibold text-yellow-600">
                      {project.taskStats.pending}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProjectDetails;