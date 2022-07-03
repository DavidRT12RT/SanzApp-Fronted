import React, { useContext, useEffect, useState } from 'react'
import 'antd/dist/antd.css';
import {Divider, Input } from 'antd';
import { useSelector } from 'react-redux';
import { useProductos } from '../../hooks/useProductos';
import { SocketContext } from '../../context/SocketContext';
import { Loading } from '../obras/Loading';
import { ProductoCard } from './components/ProductoCard';


export const ProductosScreen = () => {

    const { Search } = Input;
    //const rol = useSelector(store=> store.auth.rol);
    const { isLoading,productos,productosInfo } = useProductos();
    const { socket } = useContext(SocketContext);
    const [dataSource, setValuesTable] = useState([]);


    useEffect(() => {
        productos.map(producto => producto.key = producto._id);
        setValuesTable(productos);
    }, [productos]);
    
  
    const onSearchProductoNombre = (value) => {
        if(value.length === 0){
            return setValuesTable(productos);
        }
        const resultadosBusqueda = productos.filter(producto => {
            if(producto.nombre.toLowerCase().includes(value.toLowerCase())){
                return producto;
            }
        });
        setValuesTable(resultadosBusqueda);
    }


    if(isLoading){
        return <Loading/>
    }else{
        return (
            <div className="container mt-lg-5 p-5 shadow rounded">
                <h1 className="display-5 fw-bold">Lista de productos en almacen</h1>
                <hr/> 
                <Search
                    placeholder="Buscar un producto en almacen por su nombre"
                    allowClear
                    enterButton="Buscar"
                    size="large"
                    onSearch={onSearchProductoNombre}
                />
                <Divider/>
                <div className="d-flex justify-content-center container gap-5 flex-wrap">
                    {
                        dataSource.map(producto => {
                            return ( 
                                <ProductoCard key={producto._id} producto={producto}/>
                            )
                        })
                    }                               
                </div>
            </div>
        )
    }
}