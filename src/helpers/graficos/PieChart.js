import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = ({data,options=""}) => {
    options = {
        fill: true,
        responsive: true,
    };
    return <Pie data={data} style={{height:"80%",width:"80%"}}/>;
}
