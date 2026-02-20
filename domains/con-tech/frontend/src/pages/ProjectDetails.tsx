import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../queries/projects";
import { useUser } from "../hooks";
import { contechAPI } from "../services/api";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Calendar,
  CheckCircle,
  CircleDot,
  Circle,
  Loader2,
  MessageSquare,
  Send,
  FileText,
  Image as ImageIcon,
  Clock,
  User,
  Plus,
  CheckCircle2,
  ListTodo,
} from "lucide-react";

interface Milestone {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";
  dueDate: string | null;
  progress: number;
  isVisibleToClient: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: number | string;
  projectId: number;
  userId: string;
  content: string;
  text?: string;
  author?: { name: string; avatar: string };
  createdAt: string;
  updatedAt: string;
  user?: {
    firstname?: string;
    lastName?: string;
    email?: string;
  };
}

type TabType = "timeline" | "tasks" | "updates" | "files" | "messages";

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const {
    data: project,
    isLoading,
    error,
    refetch: refetchProject,
  } = useProject(Number(projectId));
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestonesLoading, setMilestonesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("timeline");

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Tasks UI state
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  // Milestone state
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [newMilestoneDate, setNewMilestoneDate] = useState("");

  const isAdmin =
    currentUser?.globalRole === "ADMIN" || currentUser?.role === "ADMIN";
  const isContractor = currentUser?.role === "CONTRACTOR";
  const canComment = isAdmin || isContractor;

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
  }, [currentUser, navigate]);

  const fetchMilestones = useCallback(async () => {
    if (!projectId) return;

    try {
      setMilestonesLoading(true);
      const data = await contechAPI.getMilestones(Number(projectId));
      setMilestones(data || []);
    } catch (err) {
      console.error("Error fetching milestones:", err);
      setMilestones([]);
    } finally {
      setMilestonesLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim() || !projectId) return;

    try {
      await contechAPI.createTaskExact({
        projectId: Number(projectId),
        title: newTaskName.trim(),
        description: newTaskDesc.trim(),
        status: "PENDING",
      });
      setNewTaskName("");
      setNewTaskDesc("");
      setShowAddTask(false);
      refetchProject();
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, status: string) => {
    try {
      await contechAPI.updateTaskStatusExact(taskId, status);
      refetchProject();
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneName.trim() || !projectId) return;

    try {
      await contechAPI.createMilestoneExact({
        projectId: Number(projectId),
        name: newMilestoneName.trim(),
        date: newMilestoneDate || new Date().toISOString(),
      });
      setNewMilestoneName("");
      setNewMilestoneDate("");
      setShowAddMilestone(false);
      // Refetch milestones
      const data = await contechAPI.getMilestones(Number(projectId));
      setMilestones(data || []);
    } catch (err) {
      console.error("Error creating milestone:", err);
    }
  };

  const fetchComments = useCallback(async () => {
    if (!projectId) return;
    try {
      setCommentsLoading(true);
      const data = await contechAPI.getProjectComments(Number(projectId));
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (activeTab === "messages" && projectId) {
      fetchComments();
    }
  }, [activeTab, projectId, fetchComments]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !projectId) return;
    try {
      setSubmittingComment(true);
      await contechAPI.createComment({
        projectId: Number(projectId),
        content: newComment.trim(),
        text: newComment.trim(),
      } as any);
      setNewComment("");
      await fetchComments();
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const getMilestoneIcon = (status: string, progress: number) => {
    if (status === "APPROVED" || progress === 100) {
      return (
        <CheckCircle
          size={18}
          className="absolute -left-[9px] top-1 text-green-500 bg-white"
        />
      );
    } else if (status === "IN_REVIEW" || progress > 0) {
      return (
        <CircleDot
          size={18}
          className="absolute -left-[9px] top-1 text-[#3E92D1] bg-white"
        />
      );
    } else {
      return (
        <Circle
          size={18}
          className="absolute -left-[9px] top-1 text-gray-300 bg-white"
        />
      );
    }
  };

  const getMilestoneTextColor = (status: string, progress: number) => {
    if (status === "APPROVED" || progress === 100) {
      return "text-green-600";
    } else if (status === "IN_REVIEW" || progress > 0) {
      return "text-[#3E92D1]";
    } else {
      return "text-gray-900";
    }
  };

  const getStatusBadge = (status: string, progress: number) => {
    if (status === "APPROVED" || progress === 100) {
      return (
        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
          Completed
        </span>
      );
    } else if (status === "IN_REVIEW") {
      return (
        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
          In Review
        </span>
      );
    } else if (progress > 0) {
      return (
        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
          In Progress ({progress}%)
        </span>
      );
    } else if (status === "REJECTED") {
      return (
        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
          Rejected
        </span>
      );
    }
    return null;
  };

  const formatCommentTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E92D1]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="rounded w-full text-red-500 p-4">
          Error loading project:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="rounded w-full text-red-500 p-4">Project not found</div>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "timeline", label: "Timeline", icon: <Calendar size={14} /> },
    { id: "tasks", label: "Tasks", icon: <ListTodo size={14} /> },
    { id: "updates", label: "Updates", icon: <FileText size={14} /> },
    { id: "files", label: "Files", icon: <ImageIcon size={14} /> },
    { id: "messages", label: "Messages", icon: <MessageSquare size={14} /> },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                {project.name}
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {project.status}
                </span>
              </h1>

              <div className="mt-3 flex flex-wrap gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {(project as any).site || "N/A"}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 size={14} />
                  {project.contractorId || "N/A"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  Due:{" "}
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              {project.description && (
                <p className="mt-3 text-sm text-gray-600 max-w-2xl">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Progress</span>
              <span>{project.progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#3E92D1] h-2 rounded-full transition-all duration-500"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200 bg-white rounded-t-lg px-6">
          <nav className="flex gap-6 text-sm font-medium">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 pb-3 pt-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#3E92D1] text-[#3E92D1]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-0 bg-white rounded-b-lg shadow p-6">
          {/* TIMELINE TAB */}
          {activeTab === "timeline" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Project Milestones
                </h2>
                {(isContractor || isAdmin) && (
                  <button
                    onClick={() => setShowAddMilestone(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#3E92D1] hover:text-[#2E82C1] transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                  >
                    <Plus size={14} />
                    Add Milestone
                  </button>
                )}
              </div>

              {showAddMilestone && (
                <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <form onSubmit={handleCreateMilestone} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Milestone Name
                        </label>
                        <input
                          type="text"
                          value={newMilestoneName}
                          onChange={(e) => setNewMilestoneName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3E92D1]/20"
                          placeholder="e.g. Foundation Completion"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Target Date
                        </label>
                        <input
                          type="date"
                          value={newMilestoneDate}
                          onChange={(e) => setNewMilestoneDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3E92D1]/20"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddMilestone(false)}
                        className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-bold text-white bg-[#3E92D1] hover:bg-[#2E82C1] rounded-lg shadow-sm"
                      >
                        Create Milestone
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {milestonesLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#3E92D1]" />
                </div>
              ) : milestones.length > 0 ? (
                <div className="relative border-l border-gray-200 ml-4 space-y-8">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="relative pl-8">
                      {getMilestoneIcon(milestone.status, milestone.progress)}
                      <h3
                        className={`font-medium ${getMilestoneTextColor(
                          milestone.status,
                          milestone.progress,
                        )}`}
                      >
                        {milestone.title}
                      </h3>
                      {milestone.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {milestone.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {milestone.dueDate
                          ? `Due: ${new Date(
                              milestone.dueDate,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}`
                          : "No due date set"}
                      </p>
                      {getStatusBadge(milestone.status, milestone.progress)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Circle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">
                    No milestones have been created for this project yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TASKS TAB */}
          {activeTab === "tasks" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Project Tasks
                </h2>
                {(isContractor || isAdmin) && (
                  <button
                    onClick={() => setShowAddTask(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#3E92D1] hover:text-[#2E82C1] transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                  >
                    <Plus size={14} />
                    New Task
                  </button>
                )}
              </div>

              {showAddTask && (
                <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Task Name
                      </label>
                      <input
                        type="text"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3E92D1]/20"
                        placeholder="e.g. Foundation Excavation"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Description
                      </label>
                      <textarea
                        value={newTaskDesc}
                        onChange={(e) => setNewTaskDesc(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3E92D1]/20 resize-none"
                        rows={3}
                        placeholder="Detailed task description..."
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddTask(false)}
                        className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-bold text-white bg-[#3E92D1] hover:bg-[#2E82C1] rounded-lg shadow-sm"
                      >
                        Create Task
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {(project.tasks || []).length > 0 ? (
                <div className="space-y-4">
                  {(project.tasks || []).map((task: any) => (
                    <div
                      key={task.id}
                      className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-sm font-bold text-gray-900 truncate">
                            {task.name || task.title}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              task.status === "COMPLETED"
                                ? "bg-green-50 text-green-700 border border-green-100"
                                : task.status === "IN_PROGRESS"
                                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                                  : "bg-amber-50 text-amber-700 border border-amber-100"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1 italic">
                          {task.description}
                        </p>
                      </div>

                      {(isContractor || isAdmin) &&
                        task.status !== "COMPLETED" && (
                          <div className="flex gap-2">
                            {task.status === "PENDING" && (
                              <button
                                onClick={() =>
                                  handleUpdateTaskStatus(task.id, "IN_PROGRESS")
                                }
                                className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#3E92D1] hover:bg-blue-50 rounded-lg flex items-center gap-1.5 transition-colors"
                              >
                                Start Task
                              </button>
                            )}
                            {task.status === "IN_PROGRESS" && (
                              <button
                                onClick={() =>
                                  handleUpdateTaskStatus(task.id, "COMPLETED")
                                }
                                className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-green-600 hover:bg-green-50 rounded-lg flex items-center gap-1.5 transition-colors"
                              >
                                <CheckCircle2 size={12} />
                                Complete
                              </button>
                            )}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ListTodo className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">
                    No tasks have been assigned for this project yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* UPDATES TAB */}
          {activeTab === "updates" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Project Updates
              </h2>
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium text-gray-700">
                  No updates yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Progress updates and weekly summaries from the contractor will
                  appear here.
                </p>
              </div>
            </div>
          )}

          {/* FILES TAB */}
          {activeTab === "files" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Documents & Photos
              </h2>
              <div className="text-center py-12 text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium text-gray-700">
                  No files uploaded
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Site photos, reports, and documents uploaded by the contractor
                  will appear here.
                </p>
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === "messages" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Project Communication
              </h2>

              {commentsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#3E92D1]" />
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-1">
                  {comments.length > 0 ? (
                    comments.map((comment) => {
                      const authorName = comment.user?.firstname
                        ? `${comment.user.firstname} ${comment.user?.lastName || ""}`.trim()
                        : comment.author?.name || comment.userId || "Unknown";
                      const initials = authorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <div
                          key={comment.id}
                          className="flex gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100"
                        >
                          <div className="w-9 h-9 rounded-full bg-[#3E92D1]/10 flex items-center justify-center text-[#3E92D1] font-bold text-xs shrink-0">
                            {initials || <User size={14} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-gray-900">
                                {authorName}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock size={10} />
                                {formatCommentTime(comment.createdAt as string)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {comment.content || comment.text}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 text-gray-400">
                      <MessageSquare className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                      <p className="text-sm">
                        No messages yet. Start the conversation below.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Message Input - only for admin/contractor */}
              {canComment && (
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#3E92D1] flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {currentUser?.firstName?.[0]}
                      {currentUser?.lastName?.[0]}
                    </div>
                    <div className="flex-1 flex gap-2">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmitComment();
                          }
                        }}
                        placeholder="Write a message or update..."
                        rows={2}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#3E92D1]/20 focus:border-[#3E92D1] transition-all"
                      />
                      <button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim() || submittingComment}
                        className="self-end px-4 py-2.5 bg-[#3E92D1] hover:bg-[#2E82C1] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {submittingComment ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Send size={14} />
                        )}
                        Send
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 ml-12">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              )}

              {!canComment && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-400 text-center">
                    Messages are sent by the contractor and admin. Contact your
                    contractor for updates.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
