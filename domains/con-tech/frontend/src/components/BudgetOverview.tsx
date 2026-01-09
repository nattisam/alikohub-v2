import React, { useState, useEffect } from 'react';
import { useProjects } from '../queries/projects';
import type { HTMLAttributes } from 'react';

interface BudgetProps {
  className?: HTMLAttributes<string>['className'];
}

const BudgetOverview: React.FC<BudgetProps> = ({ className }) => {

  const [budgetData, setBudgetData] = useState<{ amountBudgeted: string; remaining: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const { data: allProjects = [], isLoading } = useProjects();
  
  useEffect(() => {
    if (allProjects.length > 0 && !selectedProject) {
      setSelectedProject(allProjects[0].id);
    }
  }, [allProjects, selectedProject]);
    
  // Set loading state based on React Query loading state
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);
    
  const projects = allProjects; // For backward compatibility with JSX
   
  // The budget data is static for now, but in a real implementation
  // you would fetch this data based on the selected project

  const displayData = budgetData || { amountBudgeted: '$2.5M', remaining: '$800K' };

  return (
    <section className={className}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Budget Overview</h2>
        {projects.length > 0 && (
          <select
            value={selectedProject || ""}
            onChange={(e) => setSelectedProject(parseInt(e.target.value))}
            className="text-sm rounded border-gray-300"
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-4">Loading budget...</div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-2">Approved Sep 2024</p>
          <div className="space-y-2">
            <p>Amount Budgeted: <span className="font-bold">{displayData.amountBudgeted}</span></p>
            <p>Remaining: <span className="font-bold text-green-500">{displayData.remaining}</span></p>
          </div>
        </>
      )}
    </section>
  );
};

export default BudgetOverview;