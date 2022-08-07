import React, { useEffect, useState } from 'react'
import {Button, Checkbox, Divider, Input } from 'antd';
import { Loading } from '../../../obras/Loading';
import { ProductoCard } from './components/ProductoCard';
import { Link, useLocation } from 'react-router-dom';
import { useProductos } from '../../../../hooks/useProductos';
import { useSelector } from 'react-redux';
import { useCategorias } from '../../../../hooks/useCategorias';


export const ProductosScreen = () => {

    const { Search } = Input;
    const { isLoading,productos,productosInfo } = useProductos();
    const [dataSource, setValuesTable] = useState([]);
    const [valueSearch, setValueSearch] = useState("");
    const {isLoading:isLoadingCategorias , categorias:categoriasDB} = useCategorias();
    const [categorias, setCategorias] = useState([]);
    const { rol } = useSelector(store => store.auth);
    const { pathname } = useLocation();

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

    useEffect(() => {

        //Solo filtrar por categorias
        if(valueSearch.length === 0 && categorias.length > 0){
            const resultadosBusqueda = productos.filter(producto => {
                if(producto.categorias.some(categoria => categorias.includes(categoria._id))) return producto;
            });
            return setValuesTable(resultadosBusqueda);
        }

        //Solo filtrar por nombre 
        if(categorias.length === 0 && valueSearch.length > 0){
            const resultadosBusqueda = productos.filter(producto => {
                if(producto.nombre.toLowerCase().includes(valueSearch.toLowerCase())) return producto;
            })
            return setValuesTable(resultadosBusqueda);
        }

        //Filtrar por los dos
        if(categorias.length != 0 && valueSearch.length != 0){
            const resultadosBusqueda = productos.filter(producto => {
                if((producto.categorias.some(categoria => categorias.includes(categoria._id))) && (producto.nombre.toLowerCase().includes(valueSearch.toLowerCase()))) {
                    return producto;
                }
            });
            return setValuesTable(resultadosBusqueda);
        }

        //Ninguno tiene nada asi que mostramos todo
        if(categorias.length === 0 && valueSearch.length === 0){
            return setValuesTable(productos);
        }
    }, [valueSearch,categorias]);
    
    if(isLoading || isLoadingCategorias){
        return <Loading/>
    }else{
        return (
            <div className="container p-5 rounded" style={{minHeight:"100vh"}}>
                <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap">
                    { pathname != "/aplicacion/almacen/" && <Link to="/almacen/productos/registrar"><Button type="primary">Registrar un nuevo producto</Button></Link>}
                    { pathname != "/aplicacion/almacen/" && <Link to="/almacen/categorias/"><Button type="primary">Registrar una nueva categoria</Button></Link>}
                </div>
                <h1 className="titulo mt-5 mt-lg-0" style={{fontSize:"40px"}}>Lista de productos en almacen</h1>
                <h1 className="descripcion">Productos totales registrados en la bodega, podras filtrar los productos y buscar por su nombre de igual forma.</h1>
                <hr/> 
                <div className="d-flex justify-content-start gap-2 flex-wrap">                        
                    { pathname != "/aplicacion/almacen/" && (
                        <Search
                            placeholder="Buscar un producto en almacen por codigo de barras"
                            allowClear
                            enterButton="Buscar" 
                            size="large"
                            onSearch={onSearchProductoCodigo} 
                        />
                    )}
                    <Search
                        placeholder="Comienza a escribir el nombre del producto!"
                        allowClear
                        enterButton="Buscar"
                        size="large"
                        value={valueSearch}
                        onChange={(e)=>{setValueSearch(e.target.value)}}
                    />
                </div>
                <Divider/> 
                <div className="row">
                    <div className="col-md-12 col-lg-2">
                        {/*Filtros*/}
                        <h1 className="titulo-descripcion">Filtros</h1>
                        <Divider/> 
                        <div className="row"> 
                            <h1 className="titulo-descripcion" style={{fontSize:"15px"}}>Categoria del producto</h1>
                            {
                                categoriasDB.length === 0 
                                ? 
                                <p className="text-danger descripcion" style={{fontSize:"10px"}}>Ninguna categoria registrada aun en el sistema...</p>
                                :
                                <Checkbox.Group onChange={(categorias)=>{setCategorias(categorias)}} className="d-flex flex-column" >
                                {
                                    categoriasDB.map((categoria,index) => {
                                        if(index === 0) return (<Checkbox value={categoria._id} key={categoria._id} className="ms-2">{categoria.nombre}</Checkbox>)
                                        return (
                                            <Checkbox value={categoria._id} key={categoria._id}>{categoria.nombre}</Checkbox>
                                        )
                                    })
                                }
                                </Checkbox.Group>
                            }
                        </div>
                    </div>

                    <div className="col-md-12 col-lg-10 mt-5 mt-lg-0">

                        <h1 className="titulo-descripcion">Productos del almacen</h1>
                        <Divider/> 

                        {/*Informacion*/}
                            {
                                dataSource.length != 0 
                                    ?
                                    <div className="d-flex justify-content-center container gap-5 flex-wrap mt-3 mt-lg-0">
                                        {
                                            dataSource.map(producto => {
                                                return ( 
                                                    <ProductoCard rol={rol} key={producto._id} producto={producto} />
                                                 )
                                            })
                                        }
                                    </div>
                                    :
                                    <h4 className="text-danger titulo" style={{fontSize:"25px"}}>Ningun producto registrado aun...</h4>
                            }  
                    </div>
                </div>

            </div>
        )
    }
}