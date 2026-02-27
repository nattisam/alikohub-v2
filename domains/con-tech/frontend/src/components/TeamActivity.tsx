import React, { useState, useEffect } from "react";
import { useUser } from "../hooks";

import type { ExtendedCurrentUser } from "../components/types";
import { FaUserCircle } from "react-icons/fa";

interface Activity {
  user: string;
  action: string;
  time: string;
}

interface TeamActivityProps {
  className?: string;
}

import { ProjectsService } from "../services/projects.service";
import { TasksService } from "../services/tasks.service";
import { InspectionsService } from "../services/inspections.service";

const projectsService = ProjectsService.getInstance();
const tasksService = TasksService.getInstance();
const inspectionsService = InspectionsService.getInstance();

const TeamActivity: React.FC<TeamActivityProps> = ({ className = "" }) => {
  const { currentUser } = useUser() as { currentUser: ExtendedCurrentUser };
  const [comment, setComment] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedProject) {
      fetchActivities();
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    if (!currentUser) return;

    try {
      const response: any = await projectsService.findAll({});
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

  const fetchActivities = async () => {
    if (!currentUser || !selectedProject) return;

    try {
      setLoading(true);

      // Fetch recent tasks
      const tasks = await tasksService.findByProject(selectedProject, {
        take: 3,
      });

      // Fetch recent inspections
      const inspections = await inspectionsService.findAllForProject(
        selectedProject,
        { take: 3 },
      );

      // Combine and format activities
      const taskActivities: Activity[] = tasks.map((task) => ({
        user: task.assignedTo || "Team Member",
        action: `completed task "${task.title}"`,
        time: getTimeAgo(new Date(task.updatedAt)),
      }));

      const inspectionActivities: Activity[] = inspections.map(
        (inspection) => ({
          user: "Inspector",
          action: `completed ${inspection.status.toLowerCase()} inspection`,
          time: getTimeAgo(new Date(inspection.updatedAt)),
        }),
      );

      // Combine and sort by date
      const allActivities = [...taskActivities, ...inspectionActivities]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);

      setActivities(allActivities);
    } catch (err) {
      console.error("Error fetching activities:", err);
      // Fallback to static data on error
      setActivities([
        {
          user: "John",
          action: "completed Foundation Inspection",
          time: "2 hours ago",
        },
        {
          user: "Sarah",
          action: "uploaded safety protocol update",
          time: "4 hours ago",
        },
        { user: "Mike", action: "submitted Invoice #4", time: "1 day ago" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format time ago
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    }
  };

  // Default activities
  const defaultActivities: Activity[] = [
    {
      user: "John",
      action: "completed Foundation Inspection",
      time: "2 hours ago",
    },
    {
      user: "Sarah",
      action: "uploaded safety protocol update",
      time: "4 hours ago",
    },
    { user: "Mike", action: "submitted Invoice #4", time: "1 day ago" },
  ];

  const displayActivities =
    activities.length > 0 ? activities : defaultActivities;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      console.log("Comment posted:", comment);
      setComment("");
    }
  };

  return (
    <section className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Team Activity</h2>
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
        <div className="text-center py-4">Loading activities...</div>
      ) : (
        <div className="space-y-4">
          {displayActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-2">
              <FaUserCircle className="text-gray-400 text-xl" />
              <p>
                {activity.user} {activity.action}{" "}
                <span className="text-gray-500">{activity.time}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleCommentSubmit} className="mt-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a comment or ask a question..."
            className="flex-1 p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Post Comment
          </button>
        </div>
      </form>
    </section>
  );
};

export default TeamActivity;
