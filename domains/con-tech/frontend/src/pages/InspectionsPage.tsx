import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDashboard, useUser } from "../hooks";
import { useInspections } from "../queries/inspections";
import { useProjects } from "../queries/projects";
import type { Inspection } from "../components/types";

const InspectionsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { currentUser } = useUser();
  const { canInspect } = useDashboard();

  const [selectedProject, setSelectedProject] = useState<string>(
    projectId || "all",
  );
  const [searchTerm, setSearchTerm] = useState("");

  const { data: allProjects = [], isLoading: projectsLoading } = useProjects();

  const { data: allInspections = [], isLoading: inspectionsLoading } =
    useInspections();

  // ✅ Derived loading (NO local state)
  const loading = projectsLoading || inspectionsLoading;

  // ✅ Auth guard (NO useEffect)
  if (!currentUser) {
    navigate("/login");
    return null;
  }

  // 🔍 Search filter
  const filteredInspections = allInspections.filter(
    (inspection: Inspection) =>
      (inspection.checklist &&
        JSON.stringify(inspection.checklist)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (inspection.status &&
        inspection.status.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // 🏗 Project filter
  const projectFilteredInspections =
    selectedProject === "all"
      ? filteredInspections
      : filteredInspections.filter(
          (inspection: Inspection) =>
            inspection.projectId === Number(selectedProject),
        );

  const handleCreateInspection = () => {
    navigate("/inspections/new");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Inspections</h1>
            {canInspect && (
              <button
                onClick={handleCreateInspection}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Create Inspection
              </button>
            )}
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search inspections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:flex-1 px-3 py-2 border rounded-md"
            />

            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Projects</option>
              {allProjects.map((project) => (
                <option key={project.id} value={project.id.toString()}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* List */}
          {projectFilteredInspections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectFilteredInspections.map((inspection: Inspection) => (
                <div
                  key={inspection.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">
                      Inspection #{inspection.id}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100">
                      {inspection.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-sm mt-3">
                    Checklist: {inspection.checklist?.length || 0}
                  </p>
                  <p className="text-sm">
                    Photos: {inspection.photos?.length || 0}
                  </p>

                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(inspection.createdAt).toLocaleDateString()}
                  </p>

                  <button
                    onClick={() => navigate(`/inspections/${inspection.id}`)}
                    className="mt-4 w-full border rounded py-2 text-sm hover:bg-gray-50"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No inspections found.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default InspectionsPage;
