import React, { useContext, useEffect, useState } from 'react';
import { InformacionProducto } from './InformacionProducto';
import { Registros } from './Registros';
import 'antd/dist/antd.css';
import { ProductoImagen } from './ProductoImagen';
import { SocketContext } from '../../../context/SocketContext';
import { useParams } from 'react-router-dom';
import { Descriptions, Badge, Input, Tag} from 'antd';
import { List, Typography, Divider } from "antd";
import { useSelector } from 'react-redux';

export const ViewInfo = () => {

    const {socket} = useContext(SocketContext);
    const {productoId} = useParams();
    const [informacionProducto, setInformacionProducto] = useState({});
    const rol = useSelector(state => state.auth.rol);

    //Solicitando los productos cuando el componente cargue por primera vez o cargue otra vez
    useEffect(()=>{
        socket.emit("obtener-producto-por-id",{productoId},(producto)=>{
            setInformacionProducto(producto);
        });
    },[]);

    //TODO: Escuchar cuando el producto se actualiza 
    useEffect(() => {
      socket.on("producto-actualizado",(producto)=>{
        if(producto._id === informacionProducto._id){
          setInformacionProducto(producto);
        }
      }) 
    }, [socket,setInformacionProducto,informacionProducto]);

    if(informacionProducto === undefined){
        <h1>Cargando...</h1>
        console.log("Cargandoo....");
    }else{
    return (
        <div>

            <div className="row">
               <div className="col-lg-9 col-sm-12">
                    <Descriptions layout="vertical" bordered>
                        <Descriptions.Item label="Nombre del producto">{informacionProducto.nombre}</Descriptions.Item>
                        <Descriptions.Item label="Cantidad">{informacionProducto.cantidad}</Descriptions.Item>
                        <Descriptions.Item label="Estado">{informacionProducto.estadoProducto}</Descriptions.Item>
                        <Descriptions.Item label="Categorias">{informacionProducto?.categorias?.map(categoria => <Tag color="green">{categoria.toUpperCase()}</Tag>)}</Descriptions.Item>
                        <Descriptions.Item label="Fecha de ingreso al sistema">{informacionProducto.fechaRegistro}</Descriptions.Item>
                        <Descriptions.Item label="Ultima revisión en bodega" span={2}>
                            {informacionProducto.fechaRegistro}
                        </Descriptions.Item>
                        <Descriptions.Item label="Estatus" span={2}>
                            <Badge status={informacionProducto.estatus ? "processing" : "error"} text={informacionProducto.estatus ? "Disponible en almacen" : "NO disponible en almacen"}/>
                        </Descriptions.Item>
                        <Descriptions.Item label="ID del producto">{informacionProducto._id}</Descriptions.Item>
                        <Descriptions.Item label="Costo del producto">{informacionProducto.costo}</Descriptions.Item>
                        <Descriptions.Item label="Usuario creador">Carlos Sanchez</Descriptions.Item>
                        <Descriptions.Item label="Descripción del producto">
                            {informacionProducto.descripcion}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
                <div className="col-lg-3 col-sm-12">
                    <ProductoImagen srcImagen/>
                </div>
                <div className="col-lg-12 col-sm-12">
                    <Divider orientation="left">Movimientos | Registros</Divider>
                    <List
                        header={<div>Información sobre las entradas y salidas de los productos en el almacen</div>}
                        bordered
                        dataSource={informacionProducto.registros}
                        renderItem={(item) => (
                            item.startsWith("[ENTRADA]") || item.startsWith("[REGISTRO]")
                            ?
                                <List.Item>
                                    <Typography.Text type="success">{item}</Typography.Text> 
                                </List.Item>
                            : 
                                <List.Item>
                                    <Typography.Text type="danger">{item}</Typography.Text>
                                </List.Item>
                        )}
                    />
                </div>
                
            </div>

          
               
       

            </div>
        )
    }
}