import React, { useContext, useEffect, useState } from 'react'
import 'antd/dist/antd.css';
import {Button, Checkbox, Divider, Input } from 'antd';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../../../context/SocketContext';
import { useProductos } from '../../../../hooks/useProductos';
import { Loading } from '../../../obras/Loading';
import { ProductoCard } from './components/ProductoCard';
import { Link } from 'react-router-dom';
const CheckboxGroup = Checkbox.Group;


export const ProductosScreen = () => {

    const { Search } = Input;
    const rol = useSelector(store=> store.auth.rol);
    const { isLoading,productos,productosInfo } = useProductos();
    const { socket } = useContext(SocketContext);
    const [dataSource, setValuesTable] = useState([]);
    const plainOptions = ['Apple', 'Pear', 'Orange'];


    useEffect(() => {
        productos.map(producto => producto.key = producto._id);
        setValuesTable(productos);
    }, [productos]);
    
  
    const onSearchProductoCodigo = (value) => {
        if(value.length === 0){
            return setValuesTable(productos);
        }

        const resultadosBusqueda = productos.filter(producto => producto._id === value);

        setValuesTable(resultadosBusqueda);
    }

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
                <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap">
                    <Link to="/almacen/productos/registrar"><Button type="primary">Registrar un nuevo producto</Button></Link>
                </div>
                <h1 className="display-5 fw-bold">Lista de productos en almacen</h1>
                <hr/> 
                <div className="row">
                    <div className="col-12 col-lg-6">
                        <Search
                            placeholder="Buscar un producto en almacen por codigo de barras"
                            allowClear
                            enterButton="Buscar" 
                            size="large"
                            onSearch={onSearchProductoCodigo} 
                        />
                    </div>
                    <div className="col-12 col-lg-6 mt-3 mt-lg-0">
                        <Search
                            placeholder="Buscar un producto en almacen por su nombre"
                            allowClear
                            enterButton="Buscar"
                            size="large"
                            onSearch={onSearchProductoNombre}
                        />
                    </div>
                </div>
                <Divider/>
                <div className="row">
                    <div className="col col-lg-2">
                        {/*Filtros*/}
                        <h2 className="fw-bold">Filtros</h2>
                        <hr/>
                        <div className="row">
                            <p>Categoria del producto</p>
                            <Checkbox className="ms-2">Herramientas</Checkbox>
                            <Checkbox>Ferreteria</Checkbox>
                            <Checkbox>Vinilos</Checkbox>
                            <Checkbox>Pisos y azulejos</Checkbox>
                            <Checkbox>Fontaneria</Checkbox>
                            <Checkbox>Iluminación</Checkbox>
                            <Checkbox>Material electrico</Checkbox>
                        </div>
                        <div className="row mt-3">
                            <p>Marca del producto</p>
                            <Checkbox className="ms-2">FOFEL</Checkbox>
                            <Checkbox>TRUPPER</Checkbox>
                            <Checkbox>CFE</Checkbox>
                        </div>
                    </div>
                    <div className="col col-lg-10 d-flex justify-content-center container gap-2 flex-wrap mt-3 mt-lg-0">
                        {/*Informacion*/}
                        {
                            dataSource.map(producto => {
                                return ( 
                                    <ProductoCard key={producto._id} producto={producto} />
                                )
                            })
                        }                               
                    </div>
                </div>

            </div>
        )
    }
}