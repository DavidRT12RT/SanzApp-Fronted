import { Button, Card, Divider, Statistic } from 'antd';
import React from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ReporteGastosGeneral } from '../../../../../../../reportes/Obras/ReporteGastosGeneral';
import { PieChart } from '../../../../../../../helpers/graficos/PieChart';

export const GastosResumen = ({obraInfo,socket}) => {
    let totalGastosEncargado = 0, totalTransferencias = 0,totalGastosOficina = 0,totalGastosObra = 0;

    totalGastosEncargado = obraInfo.gastos.comprobables.totalFacturas + obraInfo.gastos.NoComprobables.totalGastos + obraInfo.gastos.oficina.totalFacturas;
    totalTransferencias = obraInfo.abonos.cantidadTotal;
    totalGastosOficina = obraInfo.gastos.oficina.totalFacturas;
    totalGastosObra = obraInfo.gastos.totalGastosObra; 

    //Estadistica
    const colecciones = ["comprobables","NoComprobables","oficina"];

    let registrosXCategoriaDatos = [];
    for(const property in obraInfo.gastos){
        if(colecciones.includes(property)) registrosXCategoriaDatos.push(obraInfo.gastos[property]);
    }
 
    const gastoPorCategoria = {
        labels:colecciones,
        datasets:[
            {
                label:"Gasto por categoria",
                data:registrosXCategoriaDatos.map(registro => registro?.totalGastos || registro.totalFacturas),
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

    const registrosPorCategoria = {
        labels:colecciones,
        datasets:[
            {
                label:"Registro por categoria",
                data:registrosXCategoriaDatos.map(registro => registro?.numeroGastos || registro.numeroFacturas),
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
    
    return (
        <>
            <div className="d-flex justify-content-end">
                <PDFDownloadLink  document={<ReporteGastosGeneral gastos={obraInfo.gastos} obraInfo={obraInfo} />} fileName={`reporte_gastos_general_${obraInfo._id}.pdf`}>
                    {({ blob, url, loading, error }) => (<Button type="primary" loading={loading}>{loading ? "Cargando documento..." : "Descargar reporte"}</Button>)}
                </PDFDownloadLink> 
            </div>
            <h1 className="titulo">Resumen de gastos de la obra</h1>
            <p className="descripcion">Aqui se mostrara un resumen de los gastos que ha tenido la obra hasta el momento</p>
            {/*<RangePicker onChange={onChangeDate} size="large" locale={locale} className="mb-3"/>*/}
            <Divider/>
            <div className="statistics" style={{margin:"40px 0px 40px 0px"}}>
                <div className="statisticDiv shadow">
                    <div className="content">
                        <h1 className="titulo-descripcion">Gastos por categoria</h1>
                        <Divider/>
                    </div>
                    <PieChart data={gastoPorCategoria}/>
                </div>

                <div className="statisticDiv shadow">
                    <div className="content">
                        <h1 className="titulo-descripcion">Registros por categoria</h1>
                        <Divider/>
                    </div>
                    <PieChart data={registrosPorCategoria}/>
                </div>
            </div>

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
