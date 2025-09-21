import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import BASE_URL from "../../config";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesGraph = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // X-axis (months)
    datasets: [
      {
        label: 'Total Sales (₹)',
        data: [2000, 2500, 2300, 3000, 3500, 4000], // Y-axis (Sales data)
        fill: false,
        borderColor: '#4e73df',
        tension: 0.1,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#4e73df',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Sales Analytics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default SalesGraph;
