import { useState, useEffect } from "react";
import { useUser } from "../hooks";
import { contechAPI } from "../services/api";
import type { ExtendedCurrentUser } from "../components/types";
import { FaDownload } from "react-icons/fa";
import type { Project } from "./types";

interface Document {
  name: string;
  type: string;
  updated: string;
}

const Documents: React.FC = () => {
  const { currentUser } = useUser() as { currentUser: ExtendedCurrentUser };
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedProject) {
      fetchDocuments();
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    if (!currentUser) return;

    try {
      const response: any = await contechAPI.getProjects({});
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
    }
  };

  const fetchDocuments = async () => {
    if (!currentUser || !selectedProject) return;

    try {
      setLoading(true);
      // Fetch contracts for the selected project
      const contractData: any[] =
        await contechAPI.getContracts(selectedProject);
      const contractDocuments = contractData.map((contract: any) => ({
        name: contract.fileName,
        type: "Contract",
        updated: new Date(contract.updatedAt).toLocaleDateString(),
      }));

      setDocuments(contractDocuments);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  // Original static documents
  const staticDocuments: Document[] = [
    { name: "Construction Contract", type: "pdf", updated: "2024-09-15" },
    { name: "Invoice #4", type: "pdf", updated: "2024-09-10" },
  ];

  const allDocuments = documents.length > 0 ? documents : staticDocuments;

  return (
    <section className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Documents</h2>
        {projects.length > 0 && (
          <select
            value={selectedProject || ""}
            onChange={(e) => setSelectedProject(parseInt(e.target.value))}
            className="text-sm rounded border-gray-300"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="text-center py-4">Loading documents...</div>
      ) : (
        <div className="space-y-4">
          {allDocuments.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-2">
                <span>{doc.type === "Contract" ? "📄" : "📝"}</span>
                <div>
                  <span>{doc.name}</span>
                  <p className="text-xs text-gray-500">
                    Updated: {doc.updated}
                  </p>
                </div>
              </div>
              <FaDownload className="text-blue-500 cursor-pointer" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Documents;
