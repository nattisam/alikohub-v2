import { TaskStatus, type Task } from "./types";
import { FaUserCircle } from "react-icons/fa";
import { MdMoreVert } from "react-icons/md";
import { useDashboard } from "../hooks";
import { useState } from "react";
interface Props {
  task: Task;
}

function TaskCard({ task }: Props) {
  const { title, description, assignedTo, deadline, status } = task;
  const { canCreateTask, updateTask } = useDashboard();
  const [showOptions, setShowOptions] = useState(false);
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    updateTask(task.id.toString(), { status: e.target.value as TaskStatus });
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "TODO":
        return "bg-gray-100 text-gray-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <div className="bg-white p-2 rounded shadow mb-2">
      <h5 className="font-semibold flex justify-between">
        <span>{title}</span>
        <button onClick={() => setShowOptions(!showOptions)}>
          <MdMoreVert size={25} />
        </button>
      </h5>
      {showOptions && (
        <div className="z-20 w-max">
          <select
            disabled={!canCreateTask}
            onChange={(e) => handleStatusChange(e)}
            value={status}
            className={`w-full px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}
          >
            <option value={TaskStatus.TODO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </select>
        </div>
      )}
      <p className="text-sm text-gray-600">{description}</p>
      <div className="flex items-center mt-2 text-sm text-gray-500">
        <FaUserCircle className="mr-1" />
        {assignedTo} · {deadline?.toString().slice(0, 10)}
      </div>
    </div>
  );
}

export default TaskCard;
