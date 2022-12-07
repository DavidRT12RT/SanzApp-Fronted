import React from 'react'
import { ShoppingCartOutlined,TeamOutlined, ToolOutlined, FrownOutlined } from "@ant-design/icons";

//Estilos CSS
import "../../assets/EstadisticasObra.css";
import { PieChart } from '../../../../../../helpers/graficos/PieChart';



export const EstadisticasObra = ({obraInfo,socket}) => {

    //Dinero de gastos por categoria
    const dineroGastosPorCategoria = {
        labels:["COMPROBABLES","NO COMPROBABLES","OFICINA"],
        datasets: [
            {
                label:"Total de gastos",
                data:[obraInfo.gastos.comprobables.totalFacturas,obraInfo.gastos.NoComprobables.totalGastos,obraInfo.gastos.oficina.totalFacturas],
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
            },
        ],
    };

    //Horas extra totales por empleado
    let horasExtraTotales = 0; 
    let trabajadores = [];
    let horasXTrabajador = [];

    for(let i = 0; i < obraInfo.horasExtra.length; i++){
        let dato = obraInfo.horasExtra[i];
        trabajadores.push(dato.trabajador.nombre);
        horasXTrabajador[i] = 0;
        for(let j = 0; j < dato.registros.length; j++){
            let registro = dato.registros[j];
            horasExtraTotales += registro.horas;
            horasXTrabajador[i] += registro.horas;
        }
    }


    const horasExtraPorTrabajador = {
        labels:trabajadores,
        datasets: [
            {
                label:"Horas X trabajador",
                data:horasXTrabajador,
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
            },
        ],
    };

    return (
        <div >
            <section className="d-flex justify-content-center align-items-center flex-wrap gap-3 mt-5">

                <div className="text-center bg-body d-flex justify-content-center flex-column gap-2" style={{width:"350px",height:"250px"}}>
                    <p className="text-warning" style={{fontSize:"50px",margin:"0px"}}><TeamOutlined/></p>
                    <p className="titulo" style={{fontSize:"50px",fontWeight:"700",color:"black",margin:"0px"}}>{obraInfo.trabajadores.length}</p>
                    <p className="titulo" style={{fontSize:"20px",fontWeight:"700"}}>Numero de empleados</p>
                </div>

                <div className="text-center bg-body d-flex justify-content-center flex-column gap-2" style={{width:"350px",height:"250px"}}>
                    <p className="text-warning" style={{fontSize:"50px",margin:"0px"}}><ShoppingCartOutlined/></p>
                    <p className="titulo" style={{fontSize:"50px",fontWeight:"700",color:"black",margin:"0px"}}>{obraInfo.retiradoAlmacen.length}</p>
                    <p className="titulo" style={{fontSize:"20px",fontWeight:"700"}}>Retiros(SALIDAS) totales de almacen</p>
                </div>

                <div className="text-center bg-body d-flex justify-content-center flex-column gap-2" style={{width:"350px",height:"250px"}}>
                    <p className="text-warning" style={{fontSize:"50px",margin:"0px"}}><ToolOutlined/></p>
                    <p className="titulo" style={{fontSize:"50px",fontWeight:"700",color:"black",margin:"0px"}}>{obraInfo.trabajosEjecutados.length}</p>
                    <p className="titulo" style={{fontSize:"20px",fontWeight:"700"}}>Trabajos ejecutados</p>
                </div>

                <div className="text-center bg-body d-flex justify-content-center flex-column gap-2" style={{width:"350px",height:"250px"}}>
                    <p className="text-warning" style={{fontSize:"50px",margin:"0px"}}><FrownOutlined/></p>
                    <p className="titulo" style={{fontSize:"50px",fontWeight:"700",color:"black",margin:"0px"}}>{obraInfo.incidentes.length}</p>
                    <p className="titulo" style={{fontSize:"20px",fontWeight:"700"}}>Incidentes de obra</p>
                </div>


            </section>

            <section className="d-flex justify-content-center align-items-center flex-wrap gap-3 mt-5">
                <div className="p-3 bg-body d-flex flex-column justify-content-center align-items-center contenedorGrafica">
                    <p className="titulo" style={{fontSize:"20px",fontWeight:"700"}}>Dinero total de gastos por categoria</p>
                    <p className="titulo" style={{fontSize:"30px",fontWeight:"700"}}><span className="text-danger">${obraInfo.gastos.totalGastosObra}</span></p>
                    <PieChart data={dineroGastosPorCategoria}/>
                </div>

                <div className="p-3 bg-body d-flex flex-column justify-content-center align-items-center contenedorGrafica">
                    <p className="titulo" style={{fontSize:"20px",fontWeight:"700"}}>Horas extra totales</p>
                    <p className="titulo" style={{fontSize:"30px",fontWeight:"700"}}><span className="text-danger">{horasExtraTotales}</span></p>
                    <PieChart data={horasExtraPorTrabajador}/>
                </div>

            </section>
        </div>
    )
}
