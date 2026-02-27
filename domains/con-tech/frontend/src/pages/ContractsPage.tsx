import { useEffect, useState, useRef, useMemo } from "react";
import { useDashboard, useUser } from "../hooks";
import type { Contract } from "../components/types";
import { ContractForm } from "../components/ContractForm";
import { useNavigate } from "react-router";
import { useContracts, useUploadContract } from "../queries/contracts";
import ContractSection from "../components/ContractSection";

const ContractsPage = () => {
  const { projects } = useDashboard();
  const { data: allContracts = [], isLoading } = useContracts();
  const uploadContractMutation = useUploadContract();
  const { currentUser } = useUser();
  const navigate = useNavigate();

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

  const [contracts, setContracts] = useState<
    Array<{ contractProject: string; contracts: Contract[] }>
  >([]);

  const [selectedProject, setSelectedProject] = useState<string>("");
  const [createNewContract, setCreateNewContract] = useState<boolean>(false);

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
            (contract: Contract) => contract.projectId === project.id
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
    <div className="w-full h-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Contracts</h2>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20 w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!isLoading && contracts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {contracts.map((contractSection) => (
            <div key={contractSection.contractProject} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <ContractSection
                projectName={contractSection.contractProject}
                contracts={contractSection.contracts}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-100 p-16 text-center shadow-sm">
          <p className="text-xl font-bold text-gray-900 mb-6">No Contracts signed yet!</p>

          {Array.isArray(projects) && projects.length > 0 ? (
            <div className="max-w-md mx-auto space-y-4">
              <p className="text-gray-500">Select a project to initiate a new contract.</p>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="block w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
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
                disabled={!selectedProject}
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-100"
              >
                Continue to Contract
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-gray-500 max-w-sm mx-auto">
                You need to have at least one active project before signing or creating contracts.
              </p>
              {(isAdmin || isClient) && (
                <button
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                  onClick={() => navigate(`${prefix}/projects/new`)}
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create New Project
                </button>
              )}
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
