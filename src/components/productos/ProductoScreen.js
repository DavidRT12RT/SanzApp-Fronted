import React, { useContext, useEffect, useState } from 'react';
import { Card } from 'antd';
import { ViewInfo } from './components/ViewInfo';
import { Link, useParams } from 'react-router-dom';
import { EditInfo } from './components/EditInfo';
import { SocketContext } from '../../context/SocketContext';
import { fetchConToken } from '../../helpers/fetch';
import { EditarImagen } from './components/EditarImagen';
import { RealizarRetiroAlmacen } from './components/RealizarRetiroAlmacen';
import "./style.css";

export const ProductoScreen = () => {
    const {productoId} = useParams();
    const [informacionProducto, setInformacionProducto] = useState({});
    const [activeTabKey1, setActiveTabKey1] = useState('tab1');
    const [ImageProduct, setImageProduct] = useState("");
    const {socket} = useContext(SocketContext);



    useEffect(()=>{

        socket.emit("obtener-producto-por-id",{productoId},(producto)=>{
            setInformacionProducto(producto);
        });


        fetchConToken(`/uploads/productos/${productoId}`).then(resp => {
        resp.url && setImageProduct(resp.url);
        });

    },[]);

    useEffect(() => {

        socket.on("producto-actualizado",(producto)=>{
        if(producto._id === informacionProducto._id){
            setInformacionProducto(producto);
        }
        });

        //Cada vez que el producto sea actualizado la imagen deberia volverse a renderizar
        fetchConToken(`/uploads/productos/${productoId}`).then(resp => {
        resp.url && setImageProduct(resp.url);
        });

    }, [socket,setInformacionProducto,informacionProducto,fetchConToken,setImageProduct,productoId]);

    const tabList = [
        {
        key: 'tab1',
        tab: 'Información',
        },
        {
        key: 'tab2',
        tab: 'Editar información',
        },
        {
        key:'tab3',
        tab:"Editar imagen del producto"
        },
        {
        key:'tab4',
        tab:"Realizar retiro almacen de algun producto"
        }

    ];

    const onTab1Change = key => {
        setActiveTabKey1(key);
    };

    const contentList = 
    {
        tab1:<ViewInfo informacionProducto = {informacionProducto} ImageProduct = {ImageProduct}/>,
        tab2:<EditInfo informacionProducto = {informacionProducto} setInformacionProducto = {setInformacionProducto} productoId = {productoId} socket = {socket}/>,
        tab3:<EditarImagen socket = {socket} productoId = {productoId} informacionProducto = {informacionProducto}/>,
        tab4:<RealizarRetiroAlmacen socket = {socket} productoId = {productoId} informacionProducto = {informacionProducto}/>
    };

    return (
        <Card
            className="cardProduct p-3 p-lg-5 shadow"
            title="Información detallada del producto"
            extra={<Link to="/aplicacion/almacen/">Regresar a almacen</Link>}
            tabList={tabList}
            activeTabKey={activeTabKey1}
            onTabChange={key => {
            onTab1Change(key);
            }}
        >
            {contentList[activeTabKey1]}
        </Card>
    );
};