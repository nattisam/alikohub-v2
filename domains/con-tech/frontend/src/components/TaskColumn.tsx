import { FaPlus } from 'react-icons/fa';
import TaskCard from './TaskCard.tsx';
import type { Task } from './type';
import { useDashboard } from '../hooks';

interface Props {
  title: string;
  count: number;
  tasks: Task[];
}

function TaskColumn({ title, count, tasks }: Props) {
  const { canCreateTask } = useDashboard();
  return (
    <div className="bg-green-100 p-2 rounded">
      <div className="flex justify-between mb-2">
        <h4 className="font-semibold text-gray-700">{title} ({count})</h4>
        {canCreateTask && title === 'To Do' && (<FaPlus className="text-yellow-500 cursor-pointer" />)}
      </div>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskColumn;
