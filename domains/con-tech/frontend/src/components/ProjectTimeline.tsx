import TimelineItem from "./TimelineItem";
import type { Milestone } from "./types";

interface Props {
  stages: Milestone[];
  className: string;
}

function Timeline({ className, stages }: Props) {
  return (
    <div className={className}>
      <h3 className="font-bold mb-2">Project Timeline</h3>
      <p className="text-sm text-gray-600 mb-4">Planned vs Actual · Sep 2024</p>
      {stages.map((stage, index) => (
        <TimelineItem key={index} stage={stage} />
      ))}
    </div>
  );
}
export default Timeline;