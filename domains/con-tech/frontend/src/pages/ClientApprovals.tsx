import React, { useState, useEffect } from 'react';
import { useUser } from "../hooks";
import { useProjects } from '../queries/projects';
import { useTasks } from '../queries/tasks';
import type { ExtendedCurrentUser } from '../components/types';
import { TaskStatus, type Project, type Task } from '../components/types';


const ClientApprovals: React.FC = () => {
  const { currentUser } = useUser() as { currentUser: ExtendedCurrentUser };
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [approving, setApproving] = useState<number | null>(null);
  
  const { data: allProjects = [], isLoading: loadingProjects, error: errorProjects } = useProjects();
  const { data: allTasks = [], isLoading: loadingTasks, error: errorTasks } = useTasks();
  
  // Filter projects and tasks based on selection
  const projects = selectedProject 
    ? allProjects.filter(p => p.id === selectedProject)
    : allProjects;
  
  // Filter tasks that might need client approval
  const pendingApprovals = selectedProject
    ? allTasks.filter(task => 
        task.projectId === selectedProject && 
        task.status === TaskStatus.COMPLETED && 
        task.progress === 100
      )
    : [];
  
  useEffect(() => {
    if (allProjects.length > 0 && !selectedProject) {
      setSelectedProject(allProjects[0].id);
    }
  }, [allProjects, selectedProject]);
  
  // Determine loading and error states
  const loading = loadingProjects || loadingTasks;
  const error = errorProjects?.message || errorTasks?.message || null;

  const handleApprove = async (taskId: number) => {
    if (!currentUser) return;

    try {
      setApproving(taskId);

      // In a real implementation, you would call an approval endpoint
      // For now, we'll just simulate the approval
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real implementation, you would update the task status via an API call
      // For now, we'll just refetch the data
      // You could also invalidate the query to trigger a refetch
      // queryClient.invalidateQueries(['tasks']);

      // Show success message
      alert('Approval submitted successfully!');
    } catch (err) {
      console.error("Error approving task:", err);
      alert('Failed to submit approval. Please try again.');
    } finally {
      setApproving(taskId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ON_HOLD': return 'bg-orange-100 text-orange-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Client Approvals</h1>
        <p className="text-gray-600">Approve project milestones, change orders, and deliverables</p>
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
          {projects.length > 0 && (
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

          {pendingApprovals.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
                <div className="space-y-4">
                  {pendingApprovals.map((task) => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <p className="mt-1 text-gray-600">{task.description}</p>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="text-gray-500 text-sm">
                            Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}
                          </p>
                          <button
                            onClick={() => handleApprove(task.id)}
                            disabled={approving === task.id}
                            className={`mt-2 px-4 py-2 rounded text-white ${approving === task.id
                              ? 'bg-gray-400'
                              : 'bg-green-500 hover:bg-green-600'
                              }`}
                          >
                            {approving === task.id ? 'Approving...' : 'Approve'}
                          </button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold mb-2">No Pending Approvals</h2>
              <p className="text-gray-600">
                {selectedProject
                  ? 'There are no items pending your approval for this project.'
                  : 'Please select a project to view pending approvals.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClientApprovals;