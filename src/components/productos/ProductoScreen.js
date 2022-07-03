import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Badge, Button, Descriptions, List, Tabs, Tag, Typography } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { SocketContext } from '../../context/SocketContext';
import { Loading } from '../obras/Loading';
import { SalidasProducto } from './components/SalidasProducto';
//import { EditInfo } from './components/EditInfo';
const { TabPane } = Tabs;

export const ProductoScreen = () => {
    const {productoId} = useParams();
    const [informacionProducto, setInformacionProducto] = useState({});
    const {socket} = useContext(SocketContext);

    useEffect(()=>{

        socket.emit("obtener-producto-por-id",{productoId},(producto)=>{
            setInformacionProducto(producto);
        });

    },[]);

    useEffect(() => {

        socket.on("producto-actualizado",(producto)=>{
            if(producto._id === informacionProducto._id){
                setInformacionProducto(producto);
            }
        });


    }, [socket,setInformacionProducto,informacionProducto,productoId]);

    const categoriaColor = (categoria) => {
        switch (categoria) {
            case "ferreteria":
                return <Tag color="cyan" key="categoria">{categoria.toUpperCase()}</Tag> 
            case "vinilos":
                return <Tag color="green" key="categoria">{categoria.toUpperCase()}</Tag> 
            case "herramientas":
                return <Tag color="blue" key="categoria">{categoria.toUpperCase()}</Tag> 
            case "pisosAzulejos":
                return <Tag color="orange" key="categoria">{categoria.toUpperCase()}</Tag>
            case "fontaneria":
                return <Tag color="red" key="categoria">{categoria.toUpperCase()}</Tag>
            case "iluminacion":
                return <Tag color="yellow" key="categoria">{categoria.toUpperCase()}</Tag>
            case "materialElectrico":
                return <Tag color="gold" key="categoria">{categoria.toUpperCase()}</Tag>
            default:
                return <Tag color="green" key="categoria">{categoria.toUpperCase()}</Tag> 
        }
    }

   if(informacionProducto === undefined){
        <Loading/>
    }else{
            return (
                <div className="container p-5">
                    <div className="d-flex justify-content-end gap-2 flex-wrap">
                        <Link to="/aplicacion/almacen/"><Button type="primary">Regresar a lista de productos</Button></Link>
                    </div>
                    <div className="row mt-5">
                        <div className="col-lg-6 col-sm-12">
                           {/*Información del producto*/}
							<h1 className="display-6 fw-bold">{informacionProducto.nombre}</h1>
                            <span>Categorias del producto:</span><br/>
                            <div className="d-flex justify-content-start gap-2 flex-wrap mt-3 mb-3">
                                {informacionProducto?.categorias?.map(categoria => categoriaColor(categoria))}
                            </div>
                            <span>Información detallada del producto</span>
                            <Descriptions layout="vertical" bordered className="mt-3">
                                <Descriptions.Item label="Nombre del producto">{informacionProducto.nombre}</Descriptions.Item>
                                <Descriptions.Item label="Cantidad">{informacionProducto.cantidad}</Descriptions.Item>
                                <Descriptions.Item label="Estado">{informacionProducto.estadoProducto}</Descriptions.Item>
                                <Descriptions.Item label="Marca del producto">{informacionProducto.marcaProducto}</Descriptions.Item>
                                <Descriptions.Item label="Costo del producto">{informacionProducto.costo}</Descriptions.Item>
                                <Descriptions.Item label="Unidad">{informacionProducto.unidad}</Descriptions.Item>
                                <Descriptions.Item label="Producto registrado por">Carlos Sanchez</Descriptions.Item>
                                <Descriptions.Item label="Estatus" span={3}>
                                    <Badge status={informacionProducto.estatus ? "processing" : "error"} text={informacionProducto.estatus ? "Disponible en almacen" : "NO disponible en almacen"}/>
                                </Descriptions.Item>
                                <Descriptions.Item label="Fecha de ingreso al sistema">{informacionProducto.fechaRegistro}</Descriptions.Item>
                                <Descriptions.Item label="Ultima revisión en bodega" span={2}>
                                    {informacionProducto.fechaRegistro}
                                </Descriptions.Item>
                                <Descriptions.Item label="Descripción del producto">
                                    {informacionProducto.descripcion}
                                </Descriptions.Item>
                            </Descriptions>
                        </div>
                        <div className="col-lg-6 col-sm-12 mt-3 mt-lg-0">
                            <Avatar shape="square" src={`http://localhost:4000/api/uploads/productos/${informacionProducto._id}`} style={{width:"250px",height:"250px"}}/>
                            <p className="text-muted">(Imagen principal del producto)</p>
                            <Tabs defaultActiveKey='1' key="1" size="large" className="mt-3">
                                <TabPane tab="Entradas del producto">
                                    Entradas del producto
                                </TabPane>
                                <TabPane tab="Salidas del producto" key="2">
                                    <SalidasProducto registros={informacionProducto.registrosSalidas}/>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>
        )
    }
};