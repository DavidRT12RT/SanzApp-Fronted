import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = ({data,options=""}) => {
    const graficaRef = useRef(null);
    options = {
        fill: true,
        responsive: true,
    };


    useEffect(() => {
        if(graficaRef.current !== null){
            console.log(graficaRef.current.toBase64Image());
        }
    }, [graficaRef]);

    const getChartBase64 = () => {
        if(graficaRef.current != null) return graficaRef.current.toBase64Image();
    }
    
    return <Pie data={data} ref={graficaRef} style={{height:"80%",width:"80%"}}/>;
}
