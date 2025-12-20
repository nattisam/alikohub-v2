
interface KeyLearningPointsProps {
  points: string[];
}

const KeyLearningPoints = ({ points }:KeyLearningPointsProps) => (
  <div className="p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Key Learning Points</h2>
    <ul className="list-disc pl-5 space-y-2">
      {points.map((point, index) => (
        <li key={index} className="text-gray-700">{point}</li>
      ))}
    </ul>
  </div>
);

export default KeyLearningPoints;