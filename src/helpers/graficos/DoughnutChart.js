import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend)

export const DoughnutChart = ({data,options=""}) => {
    options = {
        fill: true,
        responsive: true,
    };
    return (
        <Doughnut data={data} options={options} />
    )
}
