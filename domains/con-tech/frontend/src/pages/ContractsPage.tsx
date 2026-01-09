import { useEffect, useState, useRef } from "react";
import { useDashboard } from "../hooks";
import type { Contract } from "../components/type";
import { ContractForm } from "../components/ContractForm";
import { useNavigate } from "react-router";
import { useContracts, useUploadContract } from "../queries/contracts";
import ContractSection from "../components/ContractSection";

const ContractsPage = () => {
  const { projects } = useDashboard();
  const { data: allContracts = [], isLoading } = useContracts();
  const uploadContractMutation = useUploadContract();

  const [contracts, setContracts] = useState<
    Array<{ contractProject: string; contracts: Contract[] }>
  >([]);

  const [selectedProject, setSelectedProject] = useState<string>("");
  const [createNewContract, setCreateNewContract] = useState<boolean>(false);

  const navigate = useNavigate();

  const projectsRef = useRef(projects);
  const allContractsRef = useRef(allContracts);
  
  useEffect(() => {
    // Only run effect if projects or allContracts actually changed
    const projectsChanged = JSON.stringify(projects) !== JSON.stringify(projectsRef.current);
    const allContractsChanged = JSON.stringify(allContracts) !== JSON.stringify(allContractsRef.current);
    
    if (projectsChanged || allContractsChanged) {
      projectsRef.current = projects;
      allContractsRef.current = allContracts;
      
      if (Array.isArray(projects) && projects.length > 0) {
        const newContracts: Array<{
          contractProject: string;
          contracts: Contract[];
        }> = [];

        for (const project of projects) {
          const projectContracts = allContracts.filter(
            (contract) => contract.projectId === project.id
          );

          newContracts.push({
            contractProject: project.name,
            contracts: projectContracts,
          });
        }

        setContracts(newContracts);
      }
    }
  }, [projects, allContracts]);

  return (
    <div className="w-full h-full">
      <h2 className="font-bold text-xl">Contracts</h2>

      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <div className="animate-spin w-20 h-20 bg-blue-500"></div>
        </div>
      )}

      {!isLoading && contracts.length > 0 ? (
        <div className="w-full">
          {contracts.map((contractSection) => (
            <ContractSection
              key={contractSection.contractProject}
              projectName={contractSection.contractProject}
              contracts={contractSection.contracts}
            />
          ))}
        </div>
      ) : (
        <div className="w-full text-2xl">
          <p>No Contracts signed!</p>

          {Array.isArray(projects) && projects.length > 0 && (
            <form>
              <p>Select Project To Sign or Create Contract for Project</p>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setCreateNewContract(true)}
              >
                Continue
              </button>
            </form>
          )}

          {(!projects || !Array.isArray(projects)) && (
            <div>
              <p>
                First create projects before you sign contracts for a project
              </p>
              <button
                className="bg-blue-500 text-white text-xl rounded px-4 py-2"
                onClick={() => navigate("/dashboard/projects/new")}
              >
                Create New Project
              </button>
            </div>
          )}
        </div>
      )}

      {createNewContract && (
        <ContractForm
          projectId={Number(selectedProject)}
          onSubmit={(projectId: number, file: File) => {
            uploadContractMutation.mutate({ projectId, file });
            setCreateNewContract(false);
          }}
        />
      )}
    </div>
  );
};

export default ContractsPage;
