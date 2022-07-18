import { Button, Divider, Input, message, Modal, Result, Typography } from 'antd';
import React, { useState } from 'react'
import { ProductoCardDevolucion } from './ProductoCardDevolucion';
import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { fetchConToken } from '../../../../helpers/fetch';
import { ProductoCardAlmacen } from '../salidas/ProductoCardAlmacen';
const { confirm } = Modal;
const { Paragraph, Text } = Typography;

const { Search } = Input;


export const EntradaDevolucion = ({ socket }) => {
    const [processPhase, setProcessPhase] = useState(1);
    const [informacionSalida, setInformacionSalida] = useState(null);
    const [valueSearchCodigoSalida, setValueSearchCodigoSalida] = useState("");
    const [valueSearchCodigoProducto, setValueSearchCodigoProducto] = useState("");
    const [listaProductosDevueltos, setListaProductosDevueltos] = useState([]);
    const [isBotonDisabled, setIsBotonDisabled] = useState(true);

    /*Funcion para asegurarnos que la salida existe y su estado, donde si esta en true obtendremos toda la lista de productos 
    que se sacaron y la mostraremos asi como los devueltos ,etc.*/
    const setearCodigoSalida = async(salidaId) => {
        const resp = await fetchConToken(`/salidas/${salidaId}`);
        const body = await resp.json();
        if(resp.status != 200) return message.error(body.msg);
        setInformacionSalida(body);
        setProcessPhase(2);
        setValueSearchCodigoSalida("");
    }

    const agregarProductoDevolucion = async(id) => {
        //Checar que el producto existe
        const resp = await fetchConToken(`/productos/${id}`);
        const body = await resp.json();
        if(resp.status != 200) return message.error(body.msg);
        //Checar que el producto si este en la lista de productos de la salida en sacados y no devueltos
        let bandera = false;
        informacionSalida.listaProductos.map(producto => {
            //El producto si existe en la lista de productos retirados
            if(producto.id._id === id){
                bandera = true;
                //Checar si el producto ya esta en la lista de productos a devolver si no agregarlo
                let flag = false;
                const nuevaListaProductos = listaProductosDevueltos.map(productoADevolver => {
                    if(productoADevolver.id === id){
                        flag = true;
                        //TODO: Checar que no se pase de lo que hay en productos retiradso
                        (producto.cantidad - productoADevolver.cantidad) === 0 ? message.error("No se puede agregar mas producto de lo que hay registrado en la salida!") : productoADevolver.cantidad += 1;
                    }
                    return productoADevolver;
                });
                if(flag){
                    setListaProductosDevueltos(nuevaListaProductos)
                }else{
                    setListaProductosDevueltos(productos => [...productos,{id,cantidad:1,}]);
                    setIsBotonDisabled(false);
                    setValueSearchCodigoProducto("");
                }
            }
        });
        if(!bandera) return message.error("Producto NO registrado en la lista de productos retirados!");
    }

    const realizarDevolucion = () => {
        confirm({
            title:"¿Seguro quieres reingresar estos productos al almacen?",
            icon:<ExclamationCircleOutlined />,
            content:"Esta accion no se podra revertir y quedara como registro de entrada , asi como la modificacion a la salida",
			okText:"Realizar entrada",
			cancelText:"Volver atras",
            async onOk(){
                const resp = await fetchConToken(`/entradas/ingresar-almacen-por-devolucion`,{listaProductos:listaProductosDevueltos,salidaId:informacionSalida._id},"POST");
                const body = await resp.json();
                if(resp.status != 200) return message.error(body.msg);
                setProcessPhase(3);
           	},
        });
    }

    const handleDownloadEvidencia = async () => {
        try {
            const resp = await fetchConToken("/salidas/documento-pdf",{salidaId:informacionSalida._id},"POST");
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            element.setAttribute('download',`${informacionSalida._id}.pdf`);
            element.click();
        } catch (error) {
           message.error("No se pudo descargar el archivo del servidor :("); 
        }
    }

    switch (processPhase) {
        case 1:
            return (
                <div className="d-flex mt-5 align-items-center flex-column gap-2" style={{height:"100vh",width:"100vw"}}>				
                    <h1 className="display-6 fw-bold">Escanea el codigo de la salida</h1>
                    <span className="d-block text-center">
                        Escanea el codigo de barras de la salida y comienza a tu proceso de devolucion a bodega!.
                    </span>
                    <Search
                        placeholder="Ingresa un codigo de barras..."
                        allowClear
                        autoFocus
                        enterButton="Agregar"
                        size="large"
                        style={{width:"500px"}}
                        value={valueSearchCodigoSalida}
                        onChange={(e)=>{setValueSearchCodigoSalida(e.target.value)}}
                        onSearch={setearCodigoSalida}
                    /> 
                </div>
            )
        case 2:
            return (
                <div className="d-flex mt-5 align-items-center flex-column gap-2" style={{height:"100vh",width:"100vw"}}>				
                    <h1 className="display-6 fw-bold">Escanea los producto(s) a devolver</h1>
                    <span className="d-block text-center">
                        Escanea el codigo de barras de los productos o producto a devolver al almacen, ten encuenta <br/>
                        que los productos que escanearas necesitan estar en la lista de productos retirados mostrada a continuacion
                    </span>
                    <Search
                        placeholder="Ingresa un codigo de barras..."
                        allowClear
                        autoFocus
                        enterButton="Agregar"
                        size="large"
                        defaultValue=""
                        style={{width:"500px"}}
                        value={valueSearchCodigoProducto}
                        onChange={(e)=>{setValueSearchCodigoProducto(e.target.value)}}
                        onSearch={agregarProductoDevolucion}
                    /> 
                    {informacionSalida.listaProductos.length > 0 ? (
                        <div className="d-flex justify-content-center align-items-center container p-5 gap-2 flex-column">
                            <p className="text-muted text-center">Aqui se muestran todos los productos RETIRADOS del almacen que aun no se han devuelto</p>
                            <Divider/>
                            {informacionSalida.listaProductos.map(producto => {
                                    return <ProductoCardDevolucion producto={producto} listaProductosDevueltos={listaProductosDevueltos}/>
                                })
                            }
                        </div>
                        )
                        : 
                        (
                            <div className="d-flex justify-content-center align-items-center container p-5 gap-2 flex-column">
                                <h2 className="fw-bold text-white bg-success p-3">Todos los productos han sido devueltos!</h2>
                                <Divider/>
                            </div>
                        )
                    }
                    <div className="container mt-3 p-5">
                        <p className="text-muted text-center">Aqui se muestran todos los productos DEVUELTOS al almacen</p>
                        <Divider/>
    					{
					        informacionSalida.productosDevueltos.map(entrada => {
						        {
								    return (
									    <div className="d-flex justify-content-center align-items-center flex-column">
									        <p className="text-success text-center mt-3">Fecha de devolucion<br/>{entrada.fecha}</p>
											    {
												    entrada.listaProductos.map(productoDevuelto => {
													    return <ProductoCardAlmacen producto={productoDevuelto} key={productoDevuelto._id} tipo={"devuelto"}/>
												    })
											    }
									    </div>
								    )
							    }
						    })
					    }
                    </div>
                    <div className="desc d-flex mt-3 p-5 align-items-center flex-column gap-2 container">
                        <Paragraph>
                            <Text strong style={{fontSize: 16,}}>
                                Ten en cuenta las siguientes pautas antes de ingresar estos productos a almacen
                            </Text>
                        </Paragraph>
                        <Paragraph>
                                <InfoCircleOutlined style={{backgroundColor:"yellow",marginRight:"10px"}}/>
                                Al ser devolucion de productos a almacen , los productos se restaran de la lista de productos retirados en la obra o resguardo, y se marcaran como "devueltos"
                        </Paragraph>
                        <Paragraph>
                                <InfoCircleOutlined style={{backgroundColor:"yellow",marginRight:"10px"}}/>
                                Esto afectara a la salida de forma permantente y dejara un registro de los productos que se reingresaron y la fecha.
                        </Paragraph>
                        <Paragraph>
                                <InfoCircleOutlined style={{backgroundColor:"yellow",marginRight:"10px"}}/>
                                El document PDF se vera actualizado de igual forma con los productos retirados y los devueltos respectivamente.
                        </Paragraph>
                        <Button type="primary" block onClick={realizarDevolucion} disabled={isBotonDisabled}>Realizar devolucion</Button>
                    </div>
                </div>
            )
        case 3:
            return (
                <>
                    <Result
                        status="success"
                        title="Entrada de productos hecha con exito!"
                        subTitle="La entrada de productos al almacen por devolucion a sido completada correctamente."
                        extra={[
                            <Link to={`/almacen/productos/`}><Button type="primary" key="console">Regresar a almacen</Button></Link>,
                            <Button key="console" onClick={()=>{setProcessPhase(1);setListaProductosDevueltos([])}} className="mt-3 mt-lg-0">Realizar mas entrada de productos</Button>,
                        ]}
                    >
                        <div className="desc">
                            <Paragraph>
                                <Text strong style={{fontSize: 16,}}>
                                    Haz ingresado producto (s) al almacen, lee las siguientes pautas para poder terminar todo correctamente.
                                </Text>
                            </Paragraph>
                            <Paragraph>
                                    <InfoCircleOutlined style={{backgroundColor:"yellow",marginRight:"10px"}}/>
                                    Descargar el documento de evidencia de la salida actualizado! &gt; <a href="#" onClick={handleDownloadEvidencia}>Click aqui!</a>
                            </Paragraph>
                        </div>
                    </Result>
                </>
            )
    } 
}
