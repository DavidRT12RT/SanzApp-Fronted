import React, { useEffect, useState } from 'react'
import "../assets/styleDashboardOficina.css";
import { useSelector } from 'react-redux';
//import welcomeImagen from "../assets/imgs/women_writting.svg";
import welcomeImagen from "../assets/imgs/juicy-girl-working-at-home.gif";
import { BarChart } from '../../../../../helpers/graficos/BarChart';
import { PieChart } from '../../../../../helpers/graficos/PieChart';
import { Divider } from 'antd';
import Moment from 'moment';


import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

export const DashboardOficina = ({oficinaInfo}) => {
    //Hooks 
    const { name } = useSelector(store => store.auth);

    const intervalo = 6;
    let fecha = moment().format("YYYY-MM-DD");

    //Intervalo de fechas de 6 meses para los graficos
    const currentDate = moment().format("YYYY-MM");
    const endDate = moment(currentDate).subtract(intervalo,"M").format("YYYY-MM");

    const meses = [];

    for(let i = 1; i <= intervalo; i++){
        meses.push(moment(endDate).add(i,"M").format("YYYY-MM"));
    }

    /*
    const range = moment().range(endDate,currentDate);
    console.log("range",range);
    */

    const colecciones = ["Luz","Agua","Gas","Papeleria","Material","Predial","Otros"];

    //Datos de graficos
    let registrosXCategoriaDatos = [];
    for(const property in oficinaInfo.gastos){
        if(colecciones.includes(property)){
            registrosXCategoriaDatos.push(oficinaInfo.gastos[property]);
        }
    }

    const numeroRegistrosXCategoria = {
        labels:colecciones,
        datasets:[
            {
                label:"Registros",
                data:registrosXCategoriaDatos.map(registro => registro.numeroRegistros),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            }
        ]
    };

    const dineroRegistrosXCategoria = {
        labels:colecciones,
        datasets:[
            {
                label:"Registros",
                data:registrosXCategoriaDatos.map(registro => registro.gastosTotales),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            }
        ]
    };

    let registrosXMes = {};

    for(const property in oficinaInfo.gastos){
        if(colecciones.includes(property)){
            //Por cada coleccion iteraremos sobre sus registros
            for(let i = 0; i < oficinaInfo.gastos[property].registros.length; i++){
                const registro = oficinaInfo.gastos[property].registros[i];
                if(moment(registro.fechaFactura).isBetween(endDate,currentDate)){
                    //Verificando cual es la fecha
                    for(const mes of meses){
                        if(moment(registro.fechaFactura).isSame(moment(mes),"month")){
                            //Ver si ya esta
                            if(registrosXMes[mes]){
                                registrosXMes[mes].numeroGastos += 1;
                                registrosXMes[mes].total += registro.importeFactura;
                            }else{
                                registrosXMes = {...registrosXMes,[mes]:{numeroGastos:1,total:registro.importeFactura}}
                            }
                        }
                    }
                }
            }
        }
    }
    registrosXMes = Object.keys(registrosXMes).map(key => {
        return registrosXMes[key];
    })


    const numeroRegistrosXMeses = {
        labels:meses,
        datasets:[
            {
                label:"Numero de registros por mes",
                data:registrosXMes.map(registro => registro.numeroGastos),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            }
        ]
    };

    const dineroRegistrosXMeses = {
        labels:meses,
        datasets:[
            {
                label:"Dinero por mes",
                data:registrosXMes.map(registro => registro.total),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            }
        ]
    }



    return (
        <div className="p-lg-5 p-3">

            {/*Titulo y fecha*/}
            <div className="d-flex justify-content-between align-items-center flex-wrap">
                <h1 className="titulo-descripcion">Dashboard</h1>
                <h1 className="titulo-descripcion text-muted">{fecha}</h1>
            </div>

            {/*Rectangulo con mensaje de bienvenida*/}
            <div className="welcomeDiv">
                <div className="content">
                    <h1 className="titulo">Bienvenid@ de vuelta <b>{name}</b>!</h1>
                    <p className="descripcion">
                        Seccion donde podras subir tus <b>facturas</b>, <b>comprobantes</b> y demas cosas al sistema,
                        <br/>tambien podras ver <b>estadisticas</b> sobre ellas y informarte mas sobre el estado actual del sistema.
                    </p>
                </div>
                <img src={welcomeImagen} className="imageWelcomeDiv"/>
            </div>

            <Divider/>
            <h1 className="titulo-descripcion">Datos estadisticos</h1>

            {/*Estadisticas sobre las facturas*/}
            <div className="statistics">
                <div className="statisticDiv">
                    <div className="content">
                        <h1 className="titulo-descripcion">Registros de facturas por categoria</h1>
                        <Divider/>
                    </div>
                    <PieChart data={numeroRegistrosXCategoria}/>
                </div>
                <div className="statisticDiv">
                    <div className="content">
                        <h1 className="titulo-descripcion">Dinero TOTAL de facturas por categoria</h1>
                        <Divider/>
                    </div>
                    <PieChart data={dineroRegistrosXCategoria}/>
                </div>

            </div>

            <div className="statistics">
                <div className="statisticDiv">
                    <div className="content">
                        <h1 className="titulo-descripcion">Facturas registradas por mes</h1>
                        <Divider/>
                    </div>
                    <BarChart data={numeroRegistrosXMeses}/>
                </div>
                <div className="statisticDiv">
                    <div className="content">
                        <h1 className="titulo-descripcion">Dinero TOTAL registrado x mes</h1>
                        <Divider/>
                    </div>
                    <BarChart data={dineroRegistrosXMeses}/>
                </div>
 
            </div>

        </div>
    )
}
