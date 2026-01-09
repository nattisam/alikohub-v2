import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BudgetChartProps {
  budget: number;
  spent: number;
  title?: string;
}

const BudgetChart: React.FC<BudgetChartProps> = ({ budget, spent, title }) => {
  const remaining = budget - spent;
  
  const data = {
    labels: ['Budget', 'Spent', 'Remaining'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [budget, spent, remaining],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // blue for budget
          'rgba(239, 68, 68, 0.8)',  // red for spent
          'rgba(16, 185, 129, 0.8)', // green for remaining
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title || 'Budget vs Spent',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-64">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BudgetChart;