import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks';
import { useProjects } from '../queries/projects';
import { useTasks } from '../queries/tasks';
import { useInspections } from '../queries/inspections';
import type { ExtendedCurrentUser } from '../components/type';

interface Update {
  title: string;
  description: string;
  date: string;
  status?: 'warning';
}

const RecentUpdates: React.FC = () => {
  const { currentUser } = useUser() as { currentUser: ExtendedCurrentUser };
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  const { data: projects = [] } = useProjects();
  const { data: tasks = [] } = useTasks();
  const { data: inspections = [] } = useInspections();

  useEffect(() => {
    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedProject) {
      fetchUpdates();
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    if (!currentUser) return;
    
    try {
      const response: any = await projectsService.findAll({}, currentUser);
      const userProjects = Array.isArray(response) ? response : (response.items || []);
      setProjects(userProjects);
      
      // Select the first project by default
      if (userProjects.length > 0 && !selectedProject) {
        setSelectedProject(userProjects[0].id);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const fetchUpdates = async () => {
    if (!currentUser || !selectedProject) return;
    
    try {
      setLoading(true);
      
      // Fetch recent tasks
      const tasks = await tasksService.findByProject(selectedProject, { take: 5 }, currentUser);
      
      // Fetch recent inspections
      const inspections = await inspectionsService.findAllForProject(selectedProject, { take: 5 }, currentUser);
      
      // Combine and format updates
      const taskUpdates: Update[] = tasks.map(task => ({
        title: `Task "${task.title}" ${task.status.toLowerCase().replace('_', ' ')}`,
        description: task.description || 'No description',
        date: new Date(task.updatedAt).toLocaleDateString(),
        status: task.status === 'BLOCKED' || task.status === 'ON_HOLD' ? 'warning' : undefined
      }));
      
      const inspectionUpdates: Update[] = inspections.map(inspection => ({
        title: `Inspection ${inspection.status.toLowerCase().replace('_', ' ')}`,
        description: inspection.findings || 'No findings',
        date: new Date(inspection.updatedAt).toLocaleDateString(),
        status: inspection.status === 'FAILED' ? 'warning' : undefined
      }));
      
      // Combine and sort by date
      const allUpdates = [...taskUpdates, ...inspectionUpdates]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      
      setUpdates(allUpdates);
    } catch (err) {
      console.error("Error fetching updates:", err);
      // Fallback to static data on error
      setUpdates([
        { title: 'Foundation completed on Aug 25', description: '2 days ago', date: '2 days ago' },
        { title: 'Safety Inspection passed', description: '2-day delay due to weather', date: '5 days ago' },
        { title: 'Change Order #3 requires approval', description: 'Review Now', date: '1 week ago', status: 'warning' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Original static documents
  const staticUpdates: Update[] = [
    { title: 'Foundation completed on Aug 25', description: '2 days ago', date: '2 days ago' },
    { title: 'Safety Inspection passed', description: '2-day delay due to weather', date: '5 days ago' },
    { title: 'Change Order #3 requires approval', description: 'Review Now', date: '1 week ago', status: 'warning' },
  ];

  const displayUpdates = updates.length > 0 ? updates : staticUpdates;

  return (
    <section className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Recent Updates</h2>
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
        <div className="text-center py-4">Loading updates...</div>
      ) : (
        <div className="space-y-4">
          {displayUpdates.map((update, index) => (
            <div
              key={index}
              className={`p-4 rounded ${update.status === 'warning' ? 'bg-red-50' : 'bg-green-50'}`}
            >
              <p className="font-bold">{update.title}</p>
              <p className="text-sm text-gray-500">{update.description}</p>
              <p className="text-sm text-gray-500">{update.date}</p>
              {update.status === 'warning' && (
                <button className="text-blue-500 text-sm mt-2">Review Now</button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentUpdates;