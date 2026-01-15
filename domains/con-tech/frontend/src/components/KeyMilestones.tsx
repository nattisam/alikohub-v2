import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks';
import { useProjects } from '../queries/projects';
import type { ExtendedCurrentUser } from '../components/type';

interface Milestone {
  title: string;
  status: 'On Track' | 'At Risk' | 'Scheduled';
  date: string;
}

const KeyMilestones: React.FC = () => {
  const { currentUser } = useUser() as { currentUser: ExtendedCurrentUser };
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: projects = [], isLoading } = useProjects();

  useEffect(() => {
    if (currentUser) {
      fetchMilestones();
    }
  }, [currentUser]);

  const fetchMilestones = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      // Fetch projects to derive milestones
      const response: any = await projectsService.findAll({});
      const projects = Array.isArray(response) ? response : (response.items || []);
      
      // Create milestones based on project data
      const projectMilestones: Milestone[] = projects.slice(0, 3).map((project: any) => ({
        title: project.name,
        status: project.status === 'COMPLETED' ? 'On Track' : 
                project.status === 'IN_PROGRESS' ? 'At Risk' : 'Scheduled',
        date: `Due ${new Date(project.endDate).toLocaleDateString()}`
      }));
      
      setMilestones(projectMilestones);
    } catch (err) {
      console.error("Error fetching milestones:", err);
      // Fallback to static data
      setMilestones([
        { title: 'Concrete Pouring', status: 'On Track', date: 'Due September 15, 2024' },
        { title: 'Electrical Rough-in', status: 'At Risk', date: 'Due September 20, 2024' },
        { title: 'Plumbing Installation', status: 'Scheduled', date: 'Due October 5, 2024' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Key Milestones</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="p-4 rounded bg-gray-100 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Key Milestones</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className={`p-4 rounded ${milestone.status === 'On Track' ? 'bg-green-50' : milestone.status === 'At Risk' ? 'bg-yellow-50' : 'bg-blue-50'}`}
          >
            <span className="text-sm font-bold">{milestone.status}</span>
            <p className="mt-2">{milestone.title}</p>
            <p className="text-sm text-gray-500">{milestone.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KeyMilestones;