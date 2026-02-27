import React, { useState, useEffect } from "react";
import { useUser } from "../hooks";

import type { ExtendedCurrentUser, Inspection } from "../components/types";

import { ProjectsService } from "../services/projects.service";
import { InspectionsService } from "../services/inspections.service";

const projectsService = ProjectsService.getInstance();
const inspectionsService = InspectionsService.getInstance();

const InspectionReports: React.FC = () => {
  const { currentUser } = useUser() as { currentUser: ExtendedCurrentUser };
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedProject) {
      fetchInspections();
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const response: any = await projectsService.findAll({});
      const userProjects = Array.isArray(response)
        ? response
        : response.items || [];
      setProjects(userProjects);

      // Select the first project by default
      if (userProjects.length > 0 && !selectedProject) {
        setSelectedProject(userProjects[0].id);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchInspections = async () => {
    if (!currentUser || !selectedProject) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch inspections for the selected project
      const inspectionData = await inspectionsService.findAllForProject(
        selectedProject,
        {},
      );
      setInspections(inspectionData);
    } catch (err) {
      console.error("Error fetching inspections:", err);
      setError("Failed to load inspection reports");
      setInspections([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <main className="p-6 w-full">
      <div className="mb-6 w-full">
        <h1 className="text-2xl font-bold">Inspection Reports</h1>
        <p className="text-gray-600">
          View quality assessments and inspection reports for your projects
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center w-full h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <>
          {projects.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Project
              </label>
              <select
                value={selectedProject || ""}
                onChange={(e) => setSelectedProject(parseInt(e.target.value))}
                className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {projects.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {inspections.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {inspections.map((inspection) => (
                <div
                  key={inspection.id}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">
                        Inspection #{inspection.id}
                      </h2>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(inspection.status)}`}
                      >
                        {inspection.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {new Date(inspection.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900">Findings</h3>
                    <p className="mt-1 text-gray-600 whitespace-pre-wrap">
                      {inspection.findings || "No findings reported"}
                    </p>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900">
                      Recommendations
                    </h3>
                    <p className="mt-1 text-gray-600 whitespace-pre-wrap">
                      {inspection.recommendations ||
                        "No recommendations provided"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold mb-2">
                No Inspection Reports Found
              </h2>
              <p className="text-gray-600">
                {selectedProject
                  ? "No inspection reports have been created for this project yet."
                  : "Please select a project to view inspection reports."}
              </p>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default InspectionReports;
