import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../hooks";
import { useTasks } from "../queries/tasks";
import { useProjects } from "../queries/projects";
import Sidebar from "../components/Sidebar";
import EmptyState from "../components/common/EmptyState";

const TasksPage = () => {
  const { projectId } = useParams();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<string>(
    projectId || "all",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Use React Query hooks
  const { data: allProjects = [], isLoading: projectsLoading } = useProjects();

  // Get tasks based on selected project
  const {
    data: allTasks,
    isLoading: tasksLoading,
    isError,
    refetch,
  } = useTasks(
    selectedProject !== "all" ? parseInt(selectedProject) : undefined,
  );

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
  }, [currentUser, navigate]);

  const filteredTasks = (allTasks || []).filter(
    (task: any) =>
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateTask = () => {
    navigate("/tasks/new");
  };

  const isDataLoading = projectsLoading || tasksLoading;

  if (isDataLoading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-50 border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-4 text-slate-500 font-medium animate-pulse">
            Loading tasks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 overflow-auto animate-in fade-in duration-500">
        <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6 sm:px-8 lg:px-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                Tasks
              </h1>
              <p className="text-slate-500 text-xs mt-1 font-medium italic">
                Manage project deliverables
              </p>
            </div>
            <button
              onClick={handleCreateTask}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-blue-200 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 text-sm"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Task
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8 sm:px-8 lg:px-10">
          {isError && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-sm font-black italic">
                !
              </div>
              <div>
                <p className="text-xs font-black text-red-900 uppercase tracking-widest leading-none">
                  Synchronization Offline
                </p>
                <p className="text-[10px] font-bold text-red-400 mt-1 italic uppercase leading-none">
                  Live data verification failed. Displaying cached scope.
                </p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-stretch">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all shadow-sm"
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative md:w-64">
              <select
                value={selectedProject}
                onChange={(e) => {
                  setSelectedProject(e.target.value);
                  refetch();
                }}
                className="block w-full pl-4 pr-10 py-4 text-sm border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 rounded-2xl appearance-none bg-white shadow-sm transition-all font-medium text-slate-700"
              >
                <option value="all">All Projects</option>
                {allProjects.map((project: any) => (
                  <option key={project.id} value={project.id.toString()}>
                    {project.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          {filteredTasks.length > 0 ? (
            <div className="grid gap-4">
              {filteredTasks.map((task: any) => (
                <div
                  key={task.id}
                  className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  onClick={() => navigate(`/tasks/${task.id}`)}
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-blue-500 transition-colors"></div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                          {task.title}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                            task.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : task.status === "IN_PROGRESS"
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : task.status === "PENDING"
                                  ? "bg-amber-50 text-amber-700 border-amber-100"
                                  : "bg-slate-50 text-slate-500 border-slate-100"
                          }`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm line-clamp-1 italic">
                        {task.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3 min-w-[200px]">
                      <div className="flex items-center text-xs font-bold text-slate-400 gap-2">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z"
                          />
                        </svg>
                        Due{" "}
                        {new Date(task.dueDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>

                      <div className="w-full flex items-center gap-3">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 w-8">
                          {task.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title={
                searchTerm
                  ? "No matching tasks"
                  : selectedProject === "all"
                    ? "No tasks found"
                    : "No tasks for this project"
              }
              message={
                searchTerm
                  ? "Try adjusting your filters or search term."
                  : "Get started by creating a new task for your project."
              }
              actionText={searchTerm ? "Clear Search" : "Create First Task"}
              onAction={searchTerm ? () => setSearchTerm("") : handleCreateTask}
              icon={
                <svg
                  className="h-10 w-10 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default TasksPage;
