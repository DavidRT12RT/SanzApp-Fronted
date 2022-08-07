import React, { useEffect, useState,useMemo } from 'react'
import moment from "moment";
import { Button, Card, Col, Divider, Drawer, message, Row, Table, Tag } from 'antd';
import { Link } from 'react-router-dom';

//<---- TODO CREAR UN INDEX EN LA CARPETA DE HOOKS ----->
import { useSalidas } from '../../../../hooks/useSalidas';
import { useEntradas } from '../../../../hooks/useEntradas';
import { useProductos } from '../../../../hooks/useProductos';
import { useCategorias } from '../../../../hooks/useCategorias';
//<---- Fin de la nota ----->

//Graficos de linea
import { BarChart } from '../../../../helpers/graficos/BarChart';
import { PieChart } from '../../../../helpers/graficos/PieChart';
import { ProductoCard } from '../productos/components/ProductoCard';
import { ProductoCardAlmacen } from '../salidas/ProductoCardAlmacen';
import { fetchConToken } from '../../../../helpers/fetch';
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';

//CSS
import "./assets/style.css";


const fecha = moment().locale('es').format("YYYY-MM-DD");







export const PanelDeControl = () => {
    const startOfMonth = moment().startOf('month').locale('es').format("YYYY-MM-DD");
    const endOfMonth   = moment().endOf('month').locale('es').format("YYYY-MM-DD");
    const startOfLastMonth = moment().startOf('month').locale('es').subtract(1, "month").format("YYYY-MM-DD");
    const endOfLastMonth   = moment().endOf('month').locale('es').subtract(1, "month").format("YYYY-MM-DD");
    const { isLoading:isLoadingSalidas, salidas } = useSalidas();
    const { isLoading:isLoadingEntradas,entradas } = useEntradas();
    const { isLoading:isLoadingProductos,productos,productosInfo } = useProductos();
    const { isLoading:isLoadingCategorias, categorias,categoriasInformacion } = useCategorias();
    //Informacion de las salidas de este mes y anterior
    const [salidasOfMonth, setSalidasOfMonth] = useState({"obra":[],"resguardo":[],"merma":[],totalRegistros:0});
    const [salidasOfLastMonth, setSalidasOfLastMonth] = useState({"obra":[],"resguardo":[],"merma":[],totalRegistros:0});
    const [dineroTotalAlmacen, setDineroTotalAlmacen] = useState(0);
    //Informacion de las entradas de este mes y anterior
    const [entradasOfMonth, setEntradasOfMonth] = useState({"sobrante-obra":[],"devolucion-resguardo":[],"normal":[],totalRegistros:0});
    const [entradasOfLastMonth, setEntradasOfLastMonth] = useState({"sobrante-obra":[],"devolucion-resguardo":[],"normal":[],totalRegistros:0});


    //Drawer para entradas y salidas
    const [informacionRegistroParticular, setInformacionRegistroParticular] = useState(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [registroTipo, setRegistroTipo] = useState(null);

    const columnsSalidas = [		
        {
		    title:"Tipo de la salida",
		    dataIndex:"tipo",
            render:(text,record) => {
                switch (text) {
                    case "obra":
                        return (
                            <Tag color="green">OBRA</Tag>
                        )
                    case "resguardo":
                        return (
                            <Tag color="yellow">RESGUARDO</Tag>
                        )
                    case "merma":
                        return (
                            <Tag color="red">MERMA</Tag>
                        )
                }
            }
	    },
	    {
		    title:"Fecha creacion",
		    dataIndex:"fechaCreacion"
	    },
	    {
		    title:"Beneficiario",
		    render:(text,record) => {
			    switch (record.tipo) {
				    case "resguardo":
					    return (<span>{record.beneficiarioResguardo.nombre}</span>);
				    case "obra":
					    return (<span>{record.beneficiarioObra.titulo}</span>)
				    case "merma":
					    return (<span>Nadie por ser merma</span>)
			    }
		    }
	    },
	    {
		    title:"Detalles",
		    render:(text,record) => {
			    return <a onClick={(e)=>{
				    e.preventDefault();
				    //Seteando la informacion para ver el registro en particular
                    setRegistroTipo("Salida");
					setInformacionRegistroParticular(record);
					setIsDrawerVisible(true);
			    }} href="">Datos completos de la salida</a>
		    }
	    }
    ];
    const columnsEntradas = [
    	{
		    title:"Tipo de entrada",
		    dataIndex:"tipo",
            render:(text,record) => {
                switch (text) {
                    case "sobrante-obra":
                        return (
                            <Tag color="green">{text.toUpperCase()}</Tag>
                        )
                    case "devolucion-resguardo":
                        return (
                            <Tag color="yellow">{text.toUpperCase()}</Tag>
                        )
                    case "normal":
                        return (
                            <Tag color="red">NORMAL</Tag>
                        )
                }
            }
	    },
	    {
		    title:"Fecha creacion",
		    dataIndex:"fecha"
	    },
	    {
		    title:"Detalles",
		    render:(text,record) => {
			    return <a onClick={(e)=>{
				    e.preventDefault();
				    //Seteando la informacion para ver el registro en particular
                    setRegistroTipo("Entrada");
				    setInformacionRegistroParticular(record);
				    setIsDrawerVisible(true);
			    }} href="">Datos completos de la entrada</a>
		    }
	    }
    ];
    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">{title}:</p>
            {content}
        </div>
    );

    const renderizarProductoIngresado = (producto) => {
        switch (informacionRegistroParticular.tipo) {
            /*Para caso de devolucion o sobrante de obra, este es un metodo para ejecutar codigo por dos condiciones
            sin usar el || */
            case "devolucion-resguardo":
            case "sobrante-obra" :
                return (
                    <ProductoCardAlmacen producto={producto} key={producto.id} tipo={"devuelto"}/>
                );
            case "normal":
                return (
                    <ProductoCardAlmacen producto={producto} key={producto.id} tipo={"normal"}/>
                )
        }
    }

	const renderizarInformacionBeneficiario = () => {
		switch (informacionRegistroParticular.tipo) {
			case "obra":
				return (
                    <>
                        <Row>
                            <Col span={12}><DescriptionItem title="Nombre de la obra" content={informacionRegistroParticular.beneficiarioObra.titulo}/></Col>
                            <Col span={12}><DescriptionItem title="Jefe de la obra" content={informacionRegistroParticular.beneficiarioObra.jefeObra}/></Col>
                        </Row>
                        <Row>
                            <Col span={12}><DescriptionItem title="Sucursal de la obra" content={informacionRegistroParticular.beneficiarioObra.sucursal}/></Col>
                            <Col span={12}><DescriptionItem title="Direccion regional de la obra" content={informacionRegistroParticular.beneficiarioObra.direccionRegional}/></Col>
                        </Row>
                        <Row>
                            <Col span={12}><DescriptionItem title="Tipo de reporte de la obra" content={informacionRegistroParticular.beneficiarioObra.tipoReporte}/></Col>
                            <Col span={12}><DescriptionItem title="Numero de track" content={informacionRegistroParticular.beneficiarioObra.numeroTrack}/></Col>
                        </Row>
                        <Row>
                            <Col span={12}><DescriptionItem title="Estado de la obra" content={informacionRegistroParticular.beneficiarioObra.estadoReporte}/></Col>
                            <Col span={12}><DescriptionItem title="Plaza de la obra" content={informacionRegistroParticular.beneficiarioObra.plaza}/></Col>
                        </Row>
						<Row>
							<Col span={24}>
                            	<DescriptionItem title="Descripcion de la obra" content={informacionRegistroParticular.beneficiarioObra.descripcion}/>
							</Col>
						</Row>
                    </>
				)
            case "resguardo":
                return (
                    <>
                        <Row>
                            <Col span={12}><DescriptionItem title="Nombre del empleado" content={informacionRegistroParticular.beneficiarioResguardo.nombre}/></Col>
                            <Col span={12}><DescriptionItem title="Correo electronico" content={informacionRegistroParticular.beneficiarioResguardo.correo}/></Col>
                        </Row>
                    </>
                )
            case "merma":
                return (
                    <p>Al ser merma no hay ninguna persona o obra que reciba el producto</p>
                );
		}
	}
    const handleDownloadEvidencia = async () => {
        try {
            const resp = await fetchConToken("/salidas/documento-pdf",{salidaId:informacionRegistroParticular._id},"POST");
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            element.setAttribute('download',`${informacionRegistroParticular._id}.pdf`);
            element.click();
        } catch (error) {
           message.error("No se pudo descargar el archivo del servidor :("); 
        }
    }
    
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
                    case "normal":
                        setEntradasOfMonth(prevState => (
                            {...prevState,"normal":[...prevState.normal,entrada],totalRegistros:prevState.totalRegistros +1}
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
                    case "normal":
                        setEntradasOfLastMonth(prevState => (
                            {...prevState,"normal":[...prevState.normal,entrada],totalRegistros:prevState.totalRegistros +1}
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
            setDineroTotalAlmacen(Math.round(costoTotal));
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
        labels:["Entrada por sobrante de obra","Entrada por devolucion de resguardo","Entrada normal"],
        datasets: [
            {
                label:"Entradas del almacen",
                data: [entradasOfMonth["sobrante-obra"].length,entradasOfMonth["devolucion-resguardo"].length,entradasOfMonth["normal"].length],
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
            <div className="bg-body" >
                <section className="d-flex justify-content-center align-items-center flex-column header">
                    <h1 className="titulo" style={{fontSize:"45px",color:"black"}}>Dashboard del almacen</h1>
                    <h1 className="descripcion">Todo la informacion del almacen en un solo lugar&#128521;.</h1>
                    <div class="custom-shape-divider-bottom-1658013821">
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
                        </svg>
                    </div>
                </section> 

                <section className="p-5 d-flex justify-content-center align-items-center gap-4 flex-wrap">
                    <Card className="text-center shadow p-3 d-flex justify-content-center align-items-center" style={{width:"350px",height:"360px"}}>
                        <h1 className="titulo" style={{fontSize:"30px"}}>Categorias</h1>
                        <h1 style={{fontSize:"50px"}}>{categoriasInformacion.total}</h1>
                        <Link to={"/almacen/productos/registrar/categoria/"} className="text-link" style={{fontSize:"15px"}}>Registrar una nueva categoria</Link>
                    </Card>
                    <Card className="text-center shadow p-3 d-flex justify-content-center align-items-center" style={{width:"350px",height:"360px"}}>
                        <h1 className="titulo" style={{fontSize:"30px"}}>Productos</h1>
                        <h1 style={{fontSize:"50px"}}>{productosInfo.total}</h1>
                        <Link to={"/almacen/productos/registrar/"} className="text-link" style={{fontSize:"15px"}}>Registrar un nuevo prodcucto</Link>
                    </Card>
                    <Card className="text-center shadow p-3 d-flex justify-content-center align-items-center" style={{width:"350px",height:"360px"}}>
                        <h1 className="titulo" style={{fontSize:"30px"}}>Salidas</h1>
                        <h1 style={{fontSize:"50px"}}>{salidasOfMonth.totalRegistros}</h1>
                        <Link to={"/almacen/retirar/"} className="text-link" style={{fontSize:"15px"}}>Realizar un retiro de almacen</Link>
                    </Card>
                    <Card className="text-center shadow p-3 d-flex justify-content-center align-items-center" style={{width:"350px",height:"360px"}}>
                        <h1 className="titulo" style={{fontSize:"30px"}}>Entradas</h1>
                        <h1 style={{fontSize:"50px"}}>{entradasOfMonth.totalRegistros}</h1>
                        <Link to={"/almacen/ingresar/"} className="text-link" style={{fontSize:"15px"}}>Realizar una entrada</Link>
                    </Card>
                </section>

               <Divider/> 

                <section className="p-5 d-flex justify-content-center align-items-center flex-wrap gap-4" style={{margin:"auto"}}>
                        <Card className="text-center shadow p-3">
                            <h1 className="titulo" style={{fontSize:"30px",color:"black"}}>Dinero TOTAL en almacen:</h1>
                            <h1 className="descripcion text-success cantidadTotalAlmacen" style={{fontSize:"50px"}}>${dineroTotalAlmacen}</h1>
                            <p className="nota">
                                La cantidad anterior es un redondeo de la suma total de el costo de todos los <br/>productos del almacen (Puede variar por decimales)
                            </p>
                        </Card>
                        <Card className="p-5 text-center shadow" style={{width:"35%",height:"50%"}}>
                            <h1 className="descripcion">Dinero de productos por categoria</h1>
                            <PieChart data={dataProductosAlmacenDineroPorCategoria} style={{width:"100%",height:"100%"}}/>
                            <p className="nota mt-3">
                                Dinero total de los productos por categoria (si un producto tiene 2 categorias este se mostrara en la otra tambien)
                            </p>
                        </Card>
                </section>

               <Divider/> 

                <section className="mt-5 p-5 d-flex justify-content-center align-items-center gap-4 flex-wrap">
                    <Card className=" p-3 shadow d-flex justify-content-center align-items-center text-center" style={{width:"45%",height:"50%"}}>
                        <h1 className="titulo mb-3" style={{fontSize:"20px"}}>Grafico de salidas</h1>
                        {(salidasOfLastMonth.length === 0 && salidasOfMonth.length === 0) && <p className="text-danger danger mt-3">Ningun registro por el momento...</p>}
                        <BarChart data={dataSalidas} style={{width:"100%",height:"100%"}} />
                        <p className="nota mt-3">
                            Grafico donde se muestra las entradas totales del mes y comparandolas con las entradas del mes anterior.
                        </p>
                    </Card>
                    <Card className=" p-3 d-flex shadow justify-content-center align-items-center text-center"  style={{width:"45%",height:"50%"}}>
                        <h1 className="titulo mb-3" style={{fontSize:"20px"}}>Graficos de entradas</h1>
                        {(entradasOfLastMonth.length === 0 && entradasOfMonth.length === 0) && <p className="text-danger danger mt-3">Ningun registro por el momento...</p>}
                        <BarChart data={dataEntradas}  style={{width:"100%",height:"100%"}} />
                        <p className="nota mt-3">
                            Grafico donde se muestra las salidas totales del mes y comparandolas con las salidas del mes anterior.
                        </p>
                    </Card>
                </section>

                <Divider/>
                <section className="mt-5 p-5 d-flex justify-content-center align-items-center gap-4 flex-wrap">
                    <div className="card p-3 d-flex shadow justify-content-center align-items-center" style={{width:"500px",height:"570px"}}>
                        <h1 className="titulo mb-3 " style={{fontSize:"20px"}}>Categorias de los productos registrados</h1>
                        {(productos.length === 0) && <p className="text-danger mt-3">Ningun producto registrado aun...</p>}
                        <PieChart data={dataProductosAlmacen}/>
                    </div>
                    <div className="card p-3 d-flex shadow justify-content-center align-items-center" style={{width:"500px",height:"570px"}}>
                        <h1 className="titulo mb-3" style={{fontSize:"20px"}}>Tipos de salidas este mes</h1>
                        {(salidas.length === 0) && <p className="text-danger mt-3">Ninguna salida registrada aun...</p>}
                        <PieChart data={dataTiposSalida}/>
                     </div>
                    <div className="card p-3 d-flex shadow justify-content-center align-items-center" style={{width:"500px",height:"570px"}}>
                        <h1 className="titulo mb-3" style={{fontSize:"20px"}}>Tipos de entradas este mes</h1>
                        {(entradas.length === 0) && <p className="text-danger mt-3">Ninguna entrada registrada aun...</p>}
                        <PieChart data={dataTiposEntrada}/>
                    </div>
                </section>
                

				{(informacionRegistroParticular != null && registroTipo === "Entrada") &&(
					<Drawer width={640} placement="right" closable={false} onClose={()=>{setIsDrawerVisible(false);}} visible={isDrawerVisible}>
                    	<p className="site-description-item-profile-p" style={{marginBottom: 24,}}>Informacion detallada de la entrada a almacen</p>
                    	<p className="site-description-item-profile-p">Informacion sobre el ingreso del almacen</p>
                        <Row>
                       		<Col span={12}><DescriptionItem title="Fecha de la entrada" content={informacionRegistroParticular.fecha}/></Col>
                       		<Col span={12}><DescriptionItem title="Tipo de entrada" content={informacionRegistroParticular.tipo.toUpperCase()}/></Col>
                            <Divider/>
                    		<p className="site-description-item-profile-p">Lista de productos ingresados a almacen</p>
                        	<div className="d-flex justify-content-center align-items-center container p-5 gap-2 flex-column">
							    {
                                    informacionRegistroParticular.listaProductos.map(producto => {
                                        return renderizarProductoIngresado(producto);
								    })
							    }
						    </div>
                        </Row>
                        </Drawer>
                    )
                }
                {
                    (informacionRegistroParticular != null && registroTipo === "Salida") && (
						<Drawer width={640} placement="right" closable={false} onClose={()=>{setIsDrawerVisible(false);}} visible={isDrawerVisible}>
                    		<p className="site-description-item-profile-p" style={{marginBottom: 24,}}>Informacion detallada de la salida de almacen</p>
                    		<p className="site-description-item-profile-p">Informacion sobre el beneficiario</p>
							{renderizarInformacionBeneficiario()}
							<Divider/>
                    		<p className="site-description-item-profile-p">Informacion sobre el retiro del almacen</p>
							<Row>
                       			<Col span={12}><DescriptionItem title="Fecha de la salida" content={informacionRegistroParticular.fecha}/></Col>
                            	<Col span={12}><DescriptionItem title="Tipo de la salida" content={informacionRegistroParticular.tipo}/></Col>
							</Row>
							<Row>
                       			<Col span={24}><DescriptionItem title="Motivo de la salida" content={informacionRegistroParticular.motivo}/></Col>
							</Row>
							<Divider/>
                    		<p className="site-description-item-profile-p">Lista de productos retirados del almacen</p>
                        	<div className="d-flex justify-content-center align-items-center container p-5 gap-2 flex-column">

								{
									informacionRegistroParticular.listaProductos.length > 0 
										? 
											informacionRegistroParticular.listaProductos.map(producto => {
                                    			return <ProductoCardAlmacen key={producto.id._id} producto={producto} tipo={"retirado"}/>

											})
										:
                                		<h2 className="fw-bold text-white text-center bg-success p-3">Todos los productos han sido devueltos!</h2>
								}
							</div>
							<Divider/>
                    		<p className="site-description-item-profile-p">Devoluciones al almacen</p>
							{informacionRegistroParticular.productosDevueltos.length === 0 && <p className="text-danger">
							    Ningun producto devuelto al almacen por el momento...</p>}
							{
								informacionRegistroParticular.productosDevueltos.map(entrada => {
									{
										return (
											<div className="d-flex justify-content-center align-items-center flex-wrap">
												<p className="text-success text-center mt-3">Fecha de devolucion<br/>{entrada.fecha}</p>
												{
													entrada.listaProductos.map(productoDevuelto => {
														//return <ProductoCardDevuelto producto={productoDevuelto} key={productoDevuelto._id}/>
														return <ProductoCardAlmacen producto={productoDevuelto} key={productoDevuelto._id} tipo={"devuelto"}/>
													})
												}
											</div>
										)
									}
								})
							}
							<Divider/>
                    		<p className="site-description-item-profile-p">Documento PDF de la salida</p>
							<Button type="primary" onClick={handleDownloadEvidencia}>Descargar documento de evidencia</Button>
                		</Drawer>
					)}
            </div>
        )
    }
}
