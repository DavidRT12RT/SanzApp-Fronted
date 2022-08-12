import React, { useEffect, useState,useMemo } from 'react'
import { Link } from 'react-router-dom';
import moment from "moment";
import { Card } from 'antd';

//<---- TODO CREAR UN INDEX EN LA CARPETA DE HOOKS ----->
import { useSalidas } from '../../../../hooks/useSalidas';
import { useEntradas } from '../../../../hooks/useEntradas';
import { useProductos } from '../../../../hooks/useProductos';
import { useCategorias } from '../../../../hooks/useCategorias';
//<---- Fin de la nota ----->

//Graficos de linea
import { BarChart } from '../../../../helpers/graficos/BarChart';
import { PieChart } from '../../../../helpers/graficos/PieChart';
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';

//CSS
import "./assets/style.css";


export const PanelDeControl = () => {
    const fecha = moment().locale('es').format("YYYY-MM-DD");
    const startOfMonth = moment().startOf('month').locale('es').format("YYYY-MM-DD");
    const endOfMonth   = moment().endOf('month').locale('es').format("YYYY-MM-DD");
    const startOfLastMonth = moment().startOf('month').locale('es').subtract(1, "month").format("YYYY-MM-DD");
    const endOfLastMonth   = moment().endOf('month').locale('es').subtract(1, "month").format("YYYY-MM-DD");
    const { isLoading:isLoadingSalidas, salidas } = useSalidas();
    const { isLoading:isLoadingEntradas,entradas } = useEntradas();
    const { isLoading:isLoadingProductos,productos,productosInfo } = useProductos();
    const { isLoading:isLoadingCategorias, categorias,categoriasInformacion } = useCategorias();
    const [dineroTotalAlmacen, setDineroTotalAlmacen] = useState(0);

    //Informacion de las salidas de este mes y anterior
    const [salidasOfMonth, setSalidasOfMonth] = useState({"obra":[],"resguardo":[],"merma":[],totalRegistros:0});
    const [salidasOfLastMonth, setSalidasOfLastMonth] = useState({"obra":[],"resguardo":[],"merma":[],totalRegistros:0});

    //Informacion de las entradas de este mes y anterior
    const [entradasOfMonth, setEntradasOfMonth] = useState({"sobrante-obra":[],"devolucion-resguardo":[],"compra-directa":[],totalRegistros:0});
    const [entradasOfLastMonth, setEntradasOfLastMonth] = useState({"sobrante-obra":[],"devolucion-resguardo":[],"compra-directa":[],totalRegistros:0});

    
    useEffect(() => {
        //Acomodar salidas del mes y del mes anterior
        salidas.map(salida => {
            if(moment(salida.fechaCreacion).isBetween(startOfMonth,endOfMonth)){
                switch (salida.tipo) {
                    case "obra":
                        setSalidasOfMonth(prevState => (
                            {...prevState,"obra":[...prevState.obra,salida],totalRegistros: prevState.totalRegistros + 1}
                        )); 
                        break;
                
                    case "merma":
                        setSalidasOfMonth(prevState => (
                            {...prevState,"merma":[...prevState.merma,salida],totalRegistros: prevState.totalRegistros + 1}
                        )); 
                        break;

                    case "resguardo":
                        setSalidasOfMonth(prevState => (
                            {...prevState,"resguardo":[...prevState.resguardo,salida],totalRegistros: prevState.totalRegistros + 1}
                        )); 
                        break;
                }
            }else if(moment(salida.fechaCreacion).isBetween(startOfLastMonth,endOfLastMonth)){
                switch (salida.tipo) {
                    case "obra":
                        setSalidasOfLastMonth(prevState => (
                            {...prevState,"obra":[...prevState.obra,salida],totalRegistros: prevState.totalRegistros + 1}
                        )); 
                        break;
                
                    case "merma":
                        setSalidasOfLastMonth(prevState => (
                            {...prevState,"merma":[...prevState.merma,salida],totalRegistros: prevState.totalRegistros + 1}
                        )); 
                        break;

                    case "resguardo":
                        setSalidasOfLastMonth(prevState => (
                            {...prevState,"resguardo":[...prevState.resguardo,salida],totalRegistros: prevState.totalRegistros + 1}
                        )); 
                        break;
                }
            }
        })
    }, [salidas]);

    useEffect(() => {
        //Acomodar las entradas del mes y del mes anterior
        entradas.map(entrada => {
            if(moment(entrada.fecha).isBetween(startOfMonth,endOfMonth)){
                switch (entrada.tipo) {
                    case "compra-directa":
                        setEntradasOfMonth(prevState => (
                            {...prevState,"compra-directa":[...prevState["compra-directa"],entrada],totalRegistros:prevState.totalRegistros +1}
                        ));
                        break;

                    case "devolucion-resguardo":
                        setEntradasOfMonth(prevState => (
                            {...prevState,"devolucion-resguardo":[...prevState["devolucion-resguardo"],entrada],totalRegistros:prevState.totalRegistros +1}
                        ));
                        break;

                    case "sobrante-obra":
                        setEntradasOfMonth(prevState => (
                            {...prevState,"sobrante-obra":[...prevState["sobrante-obra"],entrada],totalRegistros:prevState.totalRegistros +1}
                        ));
                        break;
                }
            }else if(moment(entrada.fecha).isBetween(startOfLastMonth,endOfLastMonth)){
                switch (entrada.tipo) {
                    case "compra-directa":
                        setEntradasOfLastMonth(prevState => (
                            {...prevState,"compra-directa":[...prevState["compra-directa"],entrada],totalRegistros:prevState.totalRegistros +1}
                        ));
                        break;

                    case "devolucion-resguardo":
                        setEntradasOfLastMonth(prevState => (
                            {...prevState,"devolucion-resguardo":[...prevState["devolucion-resguardo"],entrada],totalRegistros:prevState.totalRegistros +1}
                        ));
                        break;

                    case "sobrante-obra":
                        setEntradasOfLastMonth(prevState => (
                            {...prevState,"sobrante-obra":[...prevState["sobrante-obra"],entrada],totalRegistros:prevState.totalRegistros +1}
                        ));
                        break;
                }
            }
        });
    }, [entradas]);

    useEffect(() => {
        if(productos.length !=0 ){
            let costoTotal = 0;
            productos.forEach(producto => {
                costoTotal += producto.costo;
            });
            setDineroTotalAlmacen(costoTotal);
        }
    }, [productos]);
    
    
    
    
    const dataSalidas =  {
        datasets: [
            {
                label: "Salidas",
                tension: 0.3,
                data: [salidasOfLastMonth.totalRegistros,salidasOfMonth.totalRegistros],
                borderColor: ["rgba(75, 192, 192, 0.3)",],
                backgroundColor:["rgba(75, 192, 192, 0.3)",],
                borderWidth:1
            },
        ],
        
        labels:["Mes anterior","Mes actual"],//Eje X
    };


    const dataEntradas = {
        datasets: [
            {
                label: "Entradas",
                tension: 0.3,
                data: [entradasOfLastMonth.totalRegistros,entradasOfMonth.totalRegistros],
                borderColor: "rgb(75, 192, 192)",
                backgroundColor:["rgba(75, 192, 192, 0.3)","rgba(54, 162, 235, 0.2)"],
            },
        ],
        
        labels:["Mes anterior","Mes actual"],//Eje X
    }
    

    const dataProductosAlmacen = {
        //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        labels:categorias.map(categoria => categoria.nombre),
        datasets: [
            {
                label:"Productos con categorias registrados en el sistema",
                data: categorias.map(categoria => categoria.productosRegistrados.length),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const dataProductosAlmacenDineroPorCategoria = {
        //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        labels:categorias.map(categoria => categoria.nombre),
        datasets: [
            {
                label:"Productos con categorias registrados en el sistema",
                data: categorias.map(categoria =>{
                    let dineroEnCategoria = 0;
                    categoria.productosRegistrados.map(producto => {
                        dineroEnCategoria += producto.costo;
                    })
                    return dineroEnCategoria
                }),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const dataTiposSalida = {
        labels:["Salida por obra","Salida por resguardo","Salida por merma"],
        datasets: [
            {
                label:"Salidas del almacen",
                data: [salidasOfMonth.obra.length,salidasOfMonth.resguardo.length,salidasOfMonth.merma.length],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    const dataTiposEntrada = {
        labels:["Entrada por sobrante de obra","Entrada por devolucion de resguardo","Entrada por compra directa"],
        datasets: [
            {
                label:"Entradas del almacen",
                data: [entradasOfMonth["sobrante-obra"].length,entradasOfMonth["devolucion-resguardo"].length,entradasOfMonth["compra-directa"].length],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    if((isLoadingSalidas || isLoadingEntradas || isLoadingProductos || isLoadingCategorias || productosInfo === undefined) || categoriasInformacion === undefined){
        //return <h1>Cargando informacion...</h1>
        return <SanzSpinner/>
    }else{
        return (
            <>
                <section className="d-flex justify-content-center align-items-center flex-wrap gap-3 mt-5">
                   <Card className="text-center p-3 d-flex justify-content-center align-items-center" style={{width:"350px",height:"360px"}}>
                        <h1 className="titulo" style={{fontSize:"30px"}}>Categorias</h1>
                        <h1 style={{fontSize:"50px"}}>{categoriasInformacion.total}</h1>
                        <Link to={"/almacen/categorias/"} className="text-link" style={{fontSize:"15px"}}>Registrar una nueva categoria</Link>
                    </Card>
                    <Card className="text-center p-3 d-flex justify-content-center align-items-center" style={{width:"350px",height:"360px"}}>
                        <h1 className="titulo" style={{fontSize:"30px"}}>Productos</h1>
                        <h1 style={{fontSize:"50px"}}>{productosInfo.total}</h1>
                        <Link to={"/almacen/productos/registrar/"} className="text-link" style={{fontSize:"15px"}}>Registrar un nuevo prodcucto</Link>
                    </Card>
                    <Card className="text-center p-3 d-flex justify-content-center align-items-center" style={{width:"350px",height:"360px"}}>
                        <h1 className="titulo" style={{fontSize:"30px"}}>Salidas</h1>
                        <h1 style={{fontSize:"50px"}}>{salidasOfMonth.totalRegistros}</h1>
                        <Link to={"/almacen/retirar/"} className="text-link" style={{fontSize:"15px"}}>Realizar un retiro de almacen</Link>
                    </Card>
                    <Card className="text-center p-3 d-flex justify-content-center align-items-center" style={{width:"350px",height:"360px"}}>
                        <h1 className="titulo" style={{fontSize:"30px"}}>Entradas</h1>
                        <h1 style={{fontSize:"50px"}}>{entradasOfMonth.totalRegistros}</h1>
                        <Link to={"/almacen/ingresar/"} className="text-link" style={{fontSize:"15px"}}>Realizar una entrada</Link>
                    </Card>
               </section>

                <section className="d-flex justify-content-center align-items-center gap-3 flex-wrap mt-5">
                    <div className="bg-body d-flex justify-content-center align-items-center text-center flex-column contenedorGraficaBarra">
                        <h1 className="titulo mt-3" style={{fontSize:"25px"}}>Salidas por mes</h1>
                        {(salidasOfLastMonth.length === 0 && salidasOfMonth.length === 0) && <p className="text-danger danger mt-3">Ningun registro por el momento...</p>}
                        <BarChart data={dataSalidas}/>
                    </div>
                    <div className="bg-body d-flex justify-content-center align-items-center text-center flex-column contenedorGraficaBarra">
                        <h1 className="titulo mt-3" style={{fontSize:"25px"}}>Entradas por mes</h1>
                        {(entradasOfLastMonth.length === 0 && entradasOfMonth.length === 0) && <p className="text-danger danger mt-3">Ningun registro por el momento...</p>}
                        <BarChart data={dataEntradas}/>
                    </div>
                </section>

                <section className="d-flex justify-content-center align-items-center flex-wrap gap-5 mt-5">
                    <Card className="text-center p-3 d-flex justify-content-center align-items-center">
                        <h1 className="titulo" style={{fontSize:"30px"}}>Dinero TOTAL en almacen</h1>
                        <h1 className="text-success" style={{fontSize:"110px"}}>${dineroTotalAlmacen}</h1>
                    </Card>
                    <div className="p-3 bg-body d-flex flex-column justify-content-center align-items-center contenedorGraficaPastel">
                        <h1 className="titulo mt-3" style={{fontSize:"25px"}}>Dinero por categoria</h1>
                        <PieChart data={dataProductosAlmacenDineroPorCategoria}/>
                    </div>
                </section>

                <section className="mt-5 d-flex justify-content-center align-items-center gap-4 flex-wrap">
                    <div className="p-3 bg-body d-flex flex-column justify-content-center align-items-center contenedorGraficaPastel">
                        <h1 className="titulo mt-3" style={{fontSize:"25px"}}>Productos por categoria</h1>
                        {(productos.length === 0) && <p className="text-danger mt-3">Ningun producto registrado aun...</p>}
                        <PieChart data={dataProductosAlmacen}/>
                    </div>
                    <div className=" p-3 bg-body d-flex flex-column justify-content-center align-items-center contenedorGraficaPastel">
                        <h1 className="titulo mt-3" style={{fontSize:"25px"}}>Tipos de salidas en el mes</h1>
                        {(salidas.length === 0) && <p className="text-danger mt-3">Ninguna salida registrada aun...</p>}
                        <PieChart data={dataTiposSalida}/>
                     </div>
                    <div className="p-3 bg-body d-flex flex-column justify-content-center align-items-center contenedorGraficaPastel">
                        <h1 className="titulo mt-3" style={{fontSize:"25px"}}>Tipos de entradas en el mes</h1>
                        {(entradas.length === 0) && <p className="text-danger mt-3">Ninguna entrada registrada aun...</p>}
                        <PieChart data={dataTiposEntrada}/>
                    </div>
                </section>
            </>
        )
    }
}
