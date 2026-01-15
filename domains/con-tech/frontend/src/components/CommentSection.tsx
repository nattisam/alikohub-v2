import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useDashboard } from '../hooks';
import { useUser } from '../hooks';
import { useProjects } from '../queries/projects';
import type { ExtendedCurrentUser } from '../components/type';

interface Comment {
  author: { name: string; avatar: string };
  text: string;
  time: string;
}

interface ProjectComment extends Comment {
  projectId?: number;
}

interface FormattedComment {
  author: { name: string; avatar: string };
  text: string;
  time: string;
}

interface CommentSectionProps {
  className?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ className = '' }) => {
  const { comments } = useDashboard();
  const { currentUser } = useUser() as { currentUser: ExtendedCurrentUser | null };
  const [projectComments, setProjectComments] = useState<FormattedComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [localComments, setLocalComments] = useState<ProjectComment[]>([]);

  const { data: allProjects = [], isLoading } = useProjects();
  const projects = allProjects; // For backward compatibility with JSX

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  // Format and filter comments
  useEffect(() => {
    const formattedDashboardComments: FormattedComment[] = (comments || []).map(comment => ({
      author: { name: comment.author.name, avatar: comment.author.avatar },
      text: comment.text,
      time: 'Just now'
    }));

    const allComments = [...formattedDashboardComments, ...localComments];

    if (selectedProject) {
      const filteredComments = allComments.filter(
        (comment: any) =>
          !('projectId' in comment) || !comment.projectId || comment.projectId === selectedProject
      );
      setProjectComments(filteredComments);
    } else {
      setProjectComments(allComments);
    }
  }, [comments, localComments, selectedProject]);

  // Initialize selected project
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id);
    }
  }, [projects, selectedProject]);

  const handleAddComment = () => {
    if (newComment.trim() && currentUser) {
      const comment: ProjectComment = {
        author: { name: currentUser.firstName || 'User', avatar: currentUser.avatar || '' },
        text: newComment,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        projectId: selectedProject || undefined
      };

      setLocalComments(prev => [...prev, comment]);
      setNewComment('');

      console.log('Comment posted:', comment);
    }
  };

  return (
    <section className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Comments</h2>
        {projects.length > 0 && (
          <select
            value={selectedProject ?? ''}
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

      <div className="space-y-4 mb-4">
        {projectComments.length > 0 ? (
          projectComments.map((comment, index) => (
            <div key={index} className="border-b pb-2">
              <div className="flex items-center space-x-2">
                <FaUserCircle size={30} />
                <div>
                  <p className="font-semibold">{comment.author.name}</p>
                  <p className="text-xs text-gray-500">{comment.time}</p>
                </div>
              </div>
              <p className="mt-1">{comment.text}</p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 p-2 border rounded"
        />
        <button 
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </div>
    </section>
  );
};

export default CommentSection;
