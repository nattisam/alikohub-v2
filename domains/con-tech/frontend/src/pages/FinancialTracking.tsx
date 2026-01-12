import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '../hooks';
import { useProjects } from '../queries/projects';
import { useContracts } from '../queries/contracts';
import type { ExtendedCurrentUser } from '../components/type';
import BudgetOverview from '../components/BudgetOverview';

interface Contract {
  id: number;
  projectId: number;
  fileName: string;
  secureUrl: string;
  publicId: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  changeOrders: ChangeOrder[];
  createdAt: string;
  updatedAt: string;
}

interface ChangeOrder {
  id: number;
  description: string;
  amount: number;
  createdAt: string;
}

const FinancialTracking: React.FC = () => {
  const { currentUser } = useUser() as { currentUser: ExtendedCurrentUser };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { data: allProjects = [], isLoading: loadingProjects, error: errorProjects } = useProjects();
  
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  

  
  const { data: allContracts = [], isLoading: loadingContracts, error: errorContracts } = useContracts();
  
  // Filter projects and contracts based on selection
  const projects = selectedProject 
    ? allProjects.filter(p => p.id === selectedProject)
    : allProjects;
  
  const contracts = selectedProject
    ? allContracts.filter(c => c.projectId === selectedProject)
    : allContracts;
  

  
  const initialSelectedProject = useMemo(() => {
    if (allProjects.length > 0 && !selectedProject) {
      return allProjects[0].id;
    }
    return selectedProject;
  }, [allProjects, selectedProject]);
  
  // Initialize selectedProject if not set and projects are available

  
  // Set loading and error states based on query states
  useEffect(() => {
    if (errorProjects) {
      setError(errorProjects.message || 'Failed to load projects');
    } else if (errorContracts) {
      setError(errorContracts.message || 'Failed to load contracts');
    } else {
      setError(null);
    }
  }, [errorProjects, errorContracts, setError]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateTotalChangeOrders = (changeOrders: ChangeOrder[]) => {
    return changeOrders.reduce((total, order) => total + order.amount, 0);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Financial Tracking</h1>
        <p className="text-gray-600">Monitor budgets, expenses, and financial reports for your projects</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <>
          {allProjects.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Project</label>
              <select
                value={selectedProject || ''}
                onChange={(e) => setSelectedProject(parseInt(e.target.value))}
                className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {selectedProject ? (
            <div className="grid grid-cols-1 gap-6">
              <BudgetOverview className="bg-white p-4 rounded-lg shadow-md" />
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Contracts & Change Orders</h2>
                
                {contracts.length > 0 ? (
                  <div className="space-y-6">
                    {contracts.map((contract) => (
                      <div key={contract.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{contract.fileName}</h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                              contract.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              contract.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                              contract.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {contract.status}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm">
                            {new Date(contract.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {contract.changeOrders && contract.changeOrders.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-900">Change Orders</h4>
                            <div className="mt-2 space-y-2">
                              {contract.changeOrders.map((order) => (
                                <div key={order.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                  <span className="text-gray-700">{order.description}</span>
                                  <span className="font-medium">{formatCurrency(order.amount)}</span>
                                </div>
                              ))}
                              <div className="flex justify-between items-center p-2 bg-blue-50 rounded font-semibold">
                                <span>Total Change Orders</span>
                                <span>{formatCurrency(calculateTotalChangeOrders(contract.changeOrders))}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No contracts found for this project.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold mb-2">No Projects Selected</h2>
              <p className="text-gray-600">Please select a project to view financial information.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FinancialTracking;