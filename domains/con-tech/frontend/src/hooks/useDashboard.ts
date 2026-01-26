import { useProjects } from '../queries/projects';
import { useTasks } from '../queries/tasks';
import { useInspections } from '../queries/inspections';
import { useComments } from '../queries/comments';
import { useCreateTask, useUpdateTask } from '../queries/tasks';
import useUser from './useUser';
import { useState } from 'react';
import type { Project, Task, Inspection, Comment, Notification } from '../components/types';

interface DashboardHookValue {
  // Project related
  projects: Project[];
  loadProjects: () => void;
  loadingProjects: boolean;
  errorProjects: any;
  
  // Task related
  canCreateTask: boolean;
  createTask: (taskData: any) => Promise<any>;
  updateTask: (taskId: string, taskData: any) => Promise<any>;
  
  // Inspection related
  canInspect: boolean;
  
  // Comment related
  comments: Comment[];
  
  // Notification related
  notifications: Notification[];
  addNotification: (notification: any) => void;
  removeNotification: (id: string | number) => void;
}

const useDashboard = (): DashboardHookValue => {
  const { data: projects = [], isLoading: loadingProjects, error: errorProjects } = useProjects();
  const { mutateAsync: createTaskMutate } = useCreateTask();
  const { mutateAsync: updateTaskMutate } = useUpdateTask();
  const { data: inspections = [] } = useInspections();
  const { data: commentsData = [] } = useComments();

  const { currentUser } = useUser();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const canCreateTask = currentUser?.role === 'PROJECT_MANAGER' || currentUser?.globalRole === 'ADMIN';
  const canInspect = currentUser?.role === 'PROJECT_MANAGER' || currentUser?.role === 'CONTRACTOR' || currentUser?.globalRole === 'ADMIN';
  
  const loadProjects = () => {
    // Projects are loaded via the useProjects hook
  };
  
  
  return {
    // Project related
    projects,
    loadProjects,
    loadingProjects,
    errorProjects,
    
    // Task related
    canCreateTask,
    createTask: createTaskMutate,
    updateTask: updateTaskMutate,
    
    // Inspection related
    canInspect,
    
    // Comment related
    comments: commentsData,
    
    // Notification related
    notifications,
    addNotification: (notification: any) => {
      setNotifications(prev => [...prev, { ...notification, id: Date.now().toString() }]);
    },
    removeNotification: (id: string | number) => {
      setNotifications(prev => prev.filter(n => (n as any).id !== id));
    },
  };
};

export default useDashboard;