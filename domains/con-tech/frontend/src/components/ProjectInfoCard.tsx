import React from "react";
import type { Project } from "./types";

interface ProjectWithStats extends Project {
  taskStats?: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
}

interface ProjectInfoCardProps {
  project: ProjectWithStats;
}

const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({ project }) => {
  // Calculate project progress based on task stats
  const totalTasks = project.taskStats?.total || 0;
  const completedTasks = project.taskStats?.completed || 0;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{project.name}</h2>
      <p className="text-gray-600 mb-4">{project.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800">Status</h3>
          <p className="text-lg font-semibold text-blue-600">{project.status}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800">Progress</h3>
          <p className="text-lg font-semibold text-green-600">{progressPercentage}%</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800">Date Range</h3>
          <p className="text-sm">
            {new Date(project.startDate!).toLocaleDateString()} - {new Date(project.endDate!).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      {project.taskStats && (
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Project Progress</span>
            <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between text-sm text-gray-600">
        <span>Started: {new Date(project.startDate!).toLocaleDateString()}</span>
        <span>Ends: {new Date(project.endDate!).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default ProjectInfoCard;