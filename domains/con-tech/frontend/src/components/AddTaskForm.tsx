import React, { useState } from "react";
import { TaskPriority, TaskStatus, type Task } from "./type";
import { FaX } from "react-icons/fa6";
interface TaskCreationModalProps {
  onClose: () => void;
  onCreate: (task: Task) => void;
}

const TaskCreationModal: React.FC<TaskCreationModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [task, setTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    assignedTo:"" ,
    deadline: null,
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO,
  });
  const teamMembers = [
    { id: 1, name: "Daniel", avatar: "/path-to-avatar.jpg" },
    { id: 2, name: "Sarah", avatar: "/path-to-avatar.jpg" },
    { id: 3, name: "Mike", avatar: "/path-to-avatar.jpg" },
  ];
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setTask((prev) => ({
      ...prev,
      deadline: date,
    }));
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTask((prev) => ({
      ...prev,
      assignee: teamMembers.filter(member => (member.id).toString() == e.target.value)[0] ,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.title?.trim()) {
      onCreate(task as Task);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-400/70 bg-opacity-50 z-50" onClick={()=>onClose()}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative" onClick={(e)=>{e.stopPropagation()}}>
        <button
          onClick={onClose}
          className="absolute top-2 pr-2 pt-2 right-2 text-gray-500 hover:text-gray-900"
        >
          <FaX />
        </button>
        <h2 className="text-xl font-bold mb-4">Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Task Name
            </label>
            <input
              type="text"
              name="title"
              value={task.title?? ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-yellow-400"
              placeholder="Task Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Add description
            </label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-yellow-400"
              placeholder="Add description"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Assignee
              </label>
              <select
                name="assignee"
                value={task.assignedTo || ""}
                onChange={handleAssigneeChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-yellow-400"
              >
                <option value="">Select Assignee</option>
                {teamMembers.map(({id,name}) => <option key={id} value={id}>{name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Due date
              </label>
              <input
                type="date"
                name="date"
                value={
                  task.deadline
                    ? new Date(task.deadline).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleDateChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                name="priority"
                value={task.priority}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-yellow-400"
              >
                <option value={TaskPriority.LOW}>Low</option>
                <option value={TaskPriority.MEDIUM}>Medium</option>
                <option value={TaskPriority.HIGH}>High</option>
                <option value={TaskPriority.CRITICAL}>Critical</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-2 rounded-full hover:bg-yellow-300 transition mt-4"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskCreationModal;
