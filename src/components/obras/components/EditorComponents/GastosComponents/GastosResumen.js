import { Card, Col, DatePicker, Divider, Row, Statistic } from 'antd';
import React, { useEffect } from 'react'
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
const { RangePicker } = DatePicker;

export const GastosResumen = ({obraInfo,socket}) => {
    let totalGastosEncargado = 0, totalTransferencias = 0,totalGastosOficina = 0,totalGastosObra = 0;

    totalGastosEncargado = obraInfo.gastos.comprobables.totalFacturas + obraInfo.gastos.NoComprobables.totalGastos;
    totalTransferencias = obraInfo.abonos.cantidadTotal;
    totalGastosOficina = obraInfo.gastos.oficina.totalFacturas;
    totalGastosObra = obraInfo.gastos.totalGastosObra; 


    return (
        <>
            <h1>Resumen de gastos de la obra</h1>
            <p className="lead">Aqui se mostrara un resumen de los gastos que ha tenido la obra hasta el momento</p>
            {/*<RangePicker onChange={onChangeDate} size="large" locale={locale} className="mb-3"/>*/}
            <Divider/>
            <div className="p-3 p-lg-5" style={{background:"#ececec"}}>
                <Card><Statistic title="Total gastos del encargado" prefix={"$"} valueStyle={{color: '#3f8600',}} value={totalGastosEncargado} precision={2}/></Card>
                <Card className="mt-3"><Statistic title="Total de transferencia (Abonos)" prefix={"$"} value={totalTransferencias} precision={2}/></Card>
                <Card className="mt-3 text-danger">
                    {
                        totalTransferencias > totalGastosEncargado 
                        ?
                            <Statistic title="Saldo a favor de Sanz" prefix={"$"} value={(totalTransferencias - totalGastosEncargado)} precision={2}/>
                        :
                            <Statistic title="Saldo a favor del encargado" prefix={"$"} valueStyle={{color:"#F03636"}} value={(totalGastosEncargado - totalTransferencias)} precision={2}/>
                    }
                </Card>
                <Card className="mt-3"><Statistic title="Total gastos de oficina" prefix={"$"} value={totalGastosOficina} precision={2}/></Card>
                <Card className="mt-3"><Statistic title="Total gastos de la obra" prefix={"$"} value={totalGastosObra} precision={2}/></Card>
            </div>
       </>
    )
}
