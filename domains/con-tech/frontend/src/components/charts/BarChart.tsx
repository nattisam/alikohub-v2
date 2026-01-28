import React from 'react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  title?: string;
  color?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, xKey, yKey, title, color = '#3b82f6' }) => {
  return (
    <div className="w-full h-full">
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      <ReBarChart width={500} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yKey} fill={color} />
      </ReBarChart>
    </div>
  );
};

export default BarChart;