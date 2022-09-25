import React, { useContext, useEffect, useState } from 'react';
import { Button, Divider, message, PageHeader, Tabs, Tag,} from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
//import { EditInfo } from './components/EditInfo';
//import { RealizarRetiroAlmacen } from './components/RealizarRetiroAlmacen';
import "./components/assets/style.css";
import { SocketContext } from '../../context/SocketContext';
import { EntradasProducto } from '../almacen/components/productos/components/EntradasProducto';
import { SalidasProducto } from '../almacen/components/productos/components/SalidasProducto';
import { fetchConToken } from '../../helpers/fetch';
import { SanzSpinner } from '../../helpers/spinner/SanzSpinner';
import { MovimientosProducto } from '../almacen/components/productos/components/MovimientosProducto';

const { TabPane } = Tabs;

export const ProductoScreen = () => {


    const navigate = useNavigate();
    const {productoId} = useParams();
    const [informacionProducto, setInformacionProducto] = useState({});
	const [isModalVisibleEditInfo, setIsModalVisibleEditInfo] = useState(false);
    const [activeTabKey2, setActiveTabKey2 ] = useState('tab1');
    const {socket} = useContext(SocketContext);

    useEffect(()=>{

        const fetchDataProducto = async () => {
            const resp = await fetchConToken(`/productos/${productoId}`);
            const body = await resp.json();
            if(resp.status === 200) {
                body.registrosEntradas.sobranteObra.map(registro => {registro.tipo = "sobranteObra"; registro.key = registro._id;});
                body.registrosEntradas.devolucionResguardo.map(registro => {registro.tipo = "devolucionResguardo"; registro.key = registro._id})
                body.registrosEntradas.compraDirecta.map(registro => {registro.tipo = "compraDirecta"; registro.key = registro._id})
                body.registrosSalidas.obra.map(registro => {registro.tipo = "obra"; registro.key = registro._id;});
                body.registrosSalidas.merma.map(registro => {registro.tipo = "merma"; registro.key = registro._id});
                body.registrosSalidas.resguardo.map(registro => {registro.tipo = "resguardo"; registro.key = registro._id});
                setInformacionProducto(body);
            }
            if(resp.status === 400) {
                message.error("El ID del producto NO existe");
                return navigate(-1);
            }
        }
        fetchDataProducto();
    },[]);

    useEffect(() => {

       socket.on("actualizar-producto",(producto)=>{
            if(productoId === producto._id) {
                producto.registrosEntradas.sobranteObra.map(registro => {registro.tipo = "sobranteObra"; registro.key = registro._id;});
                producto.registrosEntradas.devolucionResguardo.map(registro => {registro.tipo = "devolucionResguardo"; registro.key = registro._id})
                producto.registrosEntradas.compraDirecta.map(registro => {registro.tipo = "compraDirecta"; registro.key = registro._id})
                producto.registrosSalidas.obra.map(registro => {registro.tipo = "obra"; registro.key = registro._id;});
                producto.registrosSalidas.merma.map(registro => {registro.tipo = "merma"; registro.key = registro._id});
                producto.registrosSalidas.resguardo.map(registro => {registro.tipo = "resguardo"; registro.key = registro._id});
                setInformacionProducto(producto);
            }
        });

    }, [socket,setInformacionProducto,productoId]);

    if( Object.keys(informacionProducto).length === 0){
        return <SanzSpinner/>
    }else{
        return (
            <div className="container p-3 p-lg-5">
                <div className="d-flex justify-content-start gap-2 flex-wrap">
                    <PageHeader
                        onBack={() => navigate("/aplicacion/almacen/")}
                        title="Volver a almacen"
                    />
                </div>
                 <div className="row">
                    {/* Imagen del producto*/}
                    <div className="col-lg-6 col-12 d-flex justify-content-center align-items-center">
                        <img src={`http://localhost:4000/api/uploads/productos/${informacionProducto._id}`} className="imagen-producto"/>
                    </div>

                    {/* Informacion basica del producto*/}
                    <div className="col-lg-6 col-12 d-flex flex-column">
                        <h1 className="nombre-producto">{informacionProducto.nombre}</h1>
                        {informacionProducto.estatus ? <h1 className="text-success estatus-producto">Disponible</h1> : <h1 className="text-danger descripcion">No disponible</h1>}
                        <Tag className="descripcion my-3" style={{backgroundColor:informacionProducto.categoria.color,borderColor:informacionProducto.categoria.color,fontSize:"13px",padding:"13px",maxWidth:"fit-content"}}>{informacionProducto.categoria.nombre}</Tag>
                        <h1 className="titulo-descripcion">Precio promedio X unidad:</h1>
                        <h1 className="precio-por-unidad-producto">${informacionProducto.costo}</h1>
                        <div className="row mt-5">
                            <h1 className="titulo-descripcion col-6">Cantidad en bodega:</h1>
                            <h1 className="descripcion col-6">{informacionProducto.cantidad}</h1>
                            <h1 className="titulo-descripcion col-6">Marca:</h1>
                            <h1 className="descripcion col-6">{informacionProducto.marca}</h1>
                            <h1 className="titulo-descripcion col-6">Unidad: </h1>
                            <h1 className="descripcion col-6">{informacionProducto.unidad}</h1>
                            <h1 className="titulo-descripcion col-6">Estado del producto: </h1>
                            <h1 className="descripcion col-6">{informacionProducto.estado}</h1>
                            <h1 className="titulo-descripcion col-6 ">Fecha de registro en el sistema: </h1>
                            <h1 className="descripcion col-6 text-danger">{informacionProducto.fechaRegistro}</h1>
                            <p className="mt-5 nota col-12 text-center">Para mas detalles del producto comunicate a almacen...</p>
                        </div>
                    </div>
                    
                    {/*Registros de el producto*/}
                    <div className="col-lg-6 col-12 d-flex flex-column">
                        <Divider/>
                        <h1 className="nombre-producto">Registros de el producto</h1>
                        <Tabs defaultActiveKey='1' key="1" size="large">
                            <TabPane tab="Entradas del producto">
                                <EntradasProducto registros={informacionProducto.registrosEntradas}/>
                            </TabPane>
                            <TabPane tab="Salidas del producto" key="2">
                                <SalidasProducto registros={informacionProducto.registrosSalidas}/>
                            </TabPane>
                            <TabPane tab="Movimientos del producto" key="3">
                                <MovimientosProducto registros={informacionProducto.movimientos} informacionProducto={informacionProducto}/>
                            </TabPane>
                        </Tabs>
                    </div>

                    {/* Descripcion del producto y sus aplicaciones*/}
                    <div className="col-lg-6 col-12 d-flex flex-column">
                        <Divider/>
                        <h1 className="nombre-producto">Descripcion del producto</h1>
                        <h1 className="descripcion-producto">{informacionProducto.descripcion}</h1>
                        <Divider/>
                        <h1 className="nombre-producto">Aplicaciones del producto</h1>
                        <h1 className="descripcion-producto">*Permite poner las paredes en un buen estado antees de la pintada</h1>
                        <h1 className="descripcion-producto">*Permite poner las paredes en un buen estado antees de la pintada</h1>
                        <h1 className="descripcion-producto">*Permite poner las paredes en un buen estado antees de la pintada</h1>
                    </div>
                 </div>
            </div>
        )
    }
};