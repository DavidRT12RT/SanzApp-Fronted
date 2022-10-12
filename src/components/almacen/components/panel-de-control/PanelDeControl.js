import React, { useEffect, useState,useMemo } from 'react'
import { Link } from 'react-router-dom';
import moment from "moment";
import { Card, Divider } from 'antd';
import { useSelector } from 'react-redux';


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
import { ShoppingCartOutlined,TeamOutlined, ToolOutlined, FrownOutlined } from "@ant-design/icons";
import welcomeImage from"./assets/imgs/juicy-man-studying-financial-analytics.gif";
import { ArrowLeft, ArrowReturnRight, Bookmark, BoxSeam } from 'react-bootstrap-icons';



export const PanelDeControl = () => {
    const fecha = moment().format("YYYY-MM-DD");

    const { name } = useSelector(store => store.auth);
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
            <div className="p-3 p-lg-5">
                
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <h1 className="titulo-descripcion">Dashboard</h1>
                    <h1 className="titulo-descripcion text-muted">{fecha}</h1>
                </div>


                {/*Rectangulo con mensaje de bienvenida*/}
                <div className="welcomeDivAlmacen">
                    <div className="content">
                        <h1 className="titulo text-warning">Bienvenid@ de vuelta <b>{name}</b>!</h1>
                        <p className="descripcion">
                            Seccion donde podras <b>analizar</b> el estado del almacen , ver <b>salidas</b>, <b>entradas</b> y <b>inventarios</b>,
                            <br/>tambien podras ver estadisticas sobre ellos y informarte mas sobre estos.
                        </p>
                    </div>
                    <img src={welcomeImage} className="imageWelcomeDiv"/>
                </div>
                

                <Divider/>
                <h1 className="titulo-descripcion">Datos estadisticos</h1>
                <div className="statistics">
                    <div className="statisticDiv">
                        <div className="content">
                            <h1 className="titulo-descripcion">Dinero de almacen por categoria</h1>
                            <Divider/>
                        </div>
                        <PieChart data={dataProductosAlmacenDineroPorCategoria}/>
                    </div>
                    <div className="statisticDiv">
                        <div className="content">
                            <h1 className="titulo-descripcion">Productos de almacen por categoria</h1>
                            <Divider/>
                        </div>
                        <PieChart data={dataProductosAlmacen}/>
                    </div>
                </div>

                <div className="statistics">
                    <div className="statisticDiv">
                        <div className="content">
                            <h1 className="titulo-descripcion">Salidas</h1>
                            <Divider/>
                        </div>
                        <BarChart data={dataSalidas}/>
                    </div>
                    <div className="statisticDiv">
                        <div className="content">
                            <h1 className="titulo-descripcion">Entradas</h1>
                            <Divider/>
                        </div>
                        <BarChart data={dataEntradas}/>
                    </div>
                </div>

                <div className="statistics">
                    <div className="statisticDiv">
                        <div className="content">
                            <h1 className="titulo-descripcion">Tipos de salidas en el mes</h1>
                            <Divider/>
                        </div>
                        <PieChart data={dataTiposSalida}/>
                    </div>
                    <div className="statisticDiv">
                        <div className="content">
                            <h1 className="titulo-descripcion">Tipos de entradas en el mes </h1>
                            <Divider/>
                        </div>
                        <PieChart data={dataTiposEntrada}/>
                    </div>
                </div>
                <Divider/>
                <h1 className="titulo-descripcion">Datos numericos</h1>

                <section className="d-flex justify-content-center align-items-center flex-wrap gap-3 p-5">
                    <div className="text-center bg-body d-flex justify-content-center flex-column gap-2" style={{width:"350px",height:"250px"}}>
                        <p className="text-warning" style={{fontSize:"50px",margin:"0px"}}><Bookmark/></p>
                        <p className="titulo" style={{fontSize:"50px",fontWeight:"700",color:"black",margin:"0px"}}>{categoriasInformacion.total}</p>
                        <p className="titulo" style={{fontSize:"20px",fontWeight:"700"}}>Categorias</p>
                    </div>

                    <div className="text-center bg-body d-flex justify-content-center flex-column gap-2" style={{width:"350px",height:"250px"}}>
                        <p className="text-warning" style={{fontSize:"50px",margin:"0px"}}><BoxSeam/></p>
                        <p className="titulo" style={{fontSize:"50px",fontWeight:"700",color:"black",margin:"0px"}}>{productosInfo.total}</p>
                        <p className="titulo" style={{fontSize:"20px",fontWeight:"700"}}>Productos</p>
                    </div>

                    <div className="text-center bg-body d-flex justify-content-center flex-column gap-2" style={{width:"350px",height:"250px"}}>
                        <p className="text-warning" style={{fontSize:"50px",margin:"0px"}}><ArrowLeft/></p>
                        <p className="titulo" style={{fontSize:"50px",fontWeight:"700",color:"black",margin:"0px"}}>{salidasOfMonth.totalRegistros}</p>
                        <p className="titulo" style={{fontSize:"20px",fontWeight:"700"}}>Salidas en el mes</p>
                    </div>

                    <div className="text-center bg-body d-flex justify-content-center flex-column gap-2" style={{width:"350px",height:"250px"}}>
                        <p className="text-warning" style={{fontSize:"50px",margin:"0px"}}><ArrowReturnRight/></p>
                        <p className="titulo" style={{fontSize:"50px",fontWeight:"700",color:"black",margin:"0px"}}>{entradasOfMonth.totalRegistros}</p>
                        <p className="titulo" style={{fontSize:"20px",fontWeight:"700"}}>Entradas en el mes</p>
                    </div>


               </section>


            </div>

        )
    }
}
