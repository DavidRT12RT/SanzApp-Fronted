import React, { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);




export const BarChart = ({data,titulo="",options=""}) =>{
    options = {
        fill: true,
        scales: {
            y: {
                min: 0,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
            title: {
                display: true,
                text: titulo,
            },
        },
    };
    return (
        <Bar data={data} options={options} />
    );
}



