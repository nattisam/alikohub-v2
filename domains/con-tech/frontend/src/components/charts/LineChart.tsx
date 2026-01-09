import React from 'react';
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  title?: string;
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, xKey, yKey, title, color = '#3b82f6' }) => {
  return (
    <div className="w-full h-64">
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height="90%">
        <ReLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={yKey} stroke={color} activeDot={{ r: 8 }} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;