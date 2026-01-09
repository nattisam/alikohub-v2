import type {Milestone} from "./type";
interface Props {
  stage: Milestone;

}

function TimelineItem({ stage }: Props) {
  let barColor = 'bg-gray-300';
  if (stage.status === 'APPROVED') barColor = 'bg-green-500';
  else if (stage.status === "IN_REVIEW" ) barColor = 'bg-blue-500';
  else if (stage.status === "PENDING") barColor = 'bg-yellow-500';
  else if (stage.status === "REJECTED") barColor = 'bg-red-500';
  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm">
        <span>{stage.title}</span>
        <span>{stage.status}</span>
      </div>
      <div className="bg-gray-200 h-2 rounded">
        <div className={`${barColor} h-2 rounded`} style={{ width: `${stage.progress}%` }}></div>
      </div>
    </div>
  );
}

export default TimelineItem;
