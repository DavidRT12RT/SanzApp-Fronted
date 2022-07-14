import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css';
import {Button, Checkbox, Divider, Input } from 'antd';
import { Loading } from '../../../obras/Loading';
import { ProductoCard } from './components/ProductoCard';
import { Link, useLocation } from 'react-router-dom';
import { useProductos } from '../../../../hooks/useProductos';
import { useSelector } from 'react-redux';
import { useCategorias } from '../../../../hooks/useCategorias';
const CheckboxGroup = Checkbox.Group;


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
            <div className="container p-5 shadow rounded">
                <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap">
                    { pathname != "/aplicacion/almacen" && <Link to="/almacen/productos/registrar"><Button type="primary">Registrar un nuevo producto</Button></Link>}
                    { pathname != "/aplicacion/almacen" && <Link to="/almacen/productos/registrar/categoria"><Button type="primary">Registrar una nueva categoria</Button></Link>}
                </div>
                <h1 className="display-5 fw-bold mt-5 mt-lg-0">Lista de productos en almacen</h1>
                <hr/> 
                <div className="d-flex justify-content-start gap-2 flex-wrap">                        
                    { pathname != "/aplicacion/almacen" && (
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
                        <h4 className="fw-bold">Filtros</h4>
                        <Divider/> 
                        <div className="row"> 
                            <p>Categoria del producto</p>
                            {
                                categoriasDB.length === 0 
                                ? 
                                <p className="text-danger">Ninguna categoria registrada aun en el sistema...</p>
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
                        <h4 className="fw-bold">Productos del almacen</h4>
                        <Divider/> 
                        {/*Informacion*/}
                        <div className="d-flex justify-content-start container gap-5 flex-wrap mt-3 mt-lg-0">
                            {
                                dataSource.map(producto => {
                                    return ( 
                                        <ProductoCard rol={rol} key={producto._id} producto={producto} />
                                    )
                                })
                            }  
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}