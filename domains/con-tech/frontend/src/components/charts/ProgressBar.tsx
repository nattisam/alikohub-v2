import React from 'react';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, label, color = 'bg-blue-600' }) => {
  return (
    <div className="w-full">
      {label && <div className="mb-1 text-sm font-medium">{label}</div>}
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div 
          className={`${color} h-4 rounded-full transition-all duration-500 ease-in-out`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-1 text-right text-sm font-medium">{percentage}%</div>
    </div>
  );
};

export default ProgressBar;