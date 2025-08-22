import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const BodyPartChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        // --- THIS LINE IS FIXED ---
        label: "Sets",
        data: Object.values(data),
        backgroundColor: [
          "rgba(184, 159, 101, 0.7)", // Gold
          "rgba(45, 52, 71, 0.7)", // Slate
          "rgba(232, 230, 227, 0.5)", // Off-white
          "rgba(212, 188, 132, 0.7)", // Light Gold
          "rgba(75, 85, 104, 0.7)", // Muted Grey
          "rgba(138, 117, 73, 0.7)", // Dark Gold
        ],
        borderColor: "rgb(var(--color-bg-default))",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "rgb(var(--color-text-secondary))", // Use theme color
          padding: 20,
        },
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default BodyPartChart;
