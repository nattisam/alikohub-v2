import { useEffect, useState } from "react";
import TaskColumn from "./TaskColumn";
import { TaskStatus, type Task } from "./type";
import TaskCreationModal from "./AddTaskForm";
import { useDashboard } from '../hooks';
const TaskBoard = ({ tasks,className }: {className: string, tasks: Task[] }) => {
  const { canCreateTask, createTask } = useDashboard();
  const [todoTasks, setTodoTasks] = useState(tasks.filter((t) => t.status === TaskStatus.TODO));
  const inProgressTasks = tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS);
  const doneTasks = tasks.filter((t) => t.status === TaskStatus.COMPLETED);
  const [addTask, setAddTask] = useState(false);
  useEffect(() => {
    console.log(JSON.stringify(todoTasks))
  }, [todoTasks])
  return (
    <section className={className}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Task Board</h2>
        {canCreateTask && (<button
          className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 transition"
          onClick={() => {
            setAddTask(true);
          }}
        >
          + Add Task
        </button>)}
      </div>
      {addTask && (
        <TaskCreationModal
          onClose={() => {
            setAddTask(false);
          }}
          onCreate={async (task: Task) => {
            try {
              const newTask:Task =await createTask(task);
              setTodoTasks([...todoTasks, { ...newTask } as Task]);
            } catch (e) {
              alert(e)
            }
          }}
        />
      )}
      <div className="flex flex-col md:flex-row md:space-x-4">
        <TaskColumn
          title="To Do"
          count={todoTasks.length}
          tasks={todoTasks}
        />
        <TaskColumn
          title="In Progress"
          count={inProgressTasks.length}
          tasks={inProgressTasks}
        />
        <TaskColumn
          title="Done"
          count={doneTasks.length}
          tasks={doneTasks}
        />
      </div>
    </section>
  );
};

export default TaskBoard;
