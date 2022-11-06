import React, { useEffect, useState } from 'react'
import {Affix, Button, Checkbox, Divider, Input, Menu } from 'antd';
import { Loading } from '../../../obras/Loading';
import { ProductoCard } from './components/ProductoCard';
import { Link, useLocation } from 'react-router-dom';
import { useProductos } from '../../../../hooks/useProductos';
import { useSelector } from 'react-redux';
import { useCategorias } from '../../../../hooks/useCategorias';
import { motion } from "framer-motion"

import "../../assets/css/styleProductosScreen.css";


export const ProductosScreen = () => {

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
                //if(producto.categorias.some(categoria => categorias.includes(categoria._id))) return producto;
                if(categorias.includes(producto.categoria._id)) return producto;
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
                if((categorias.includes(producto.categoria._id)) && (producto.nombre.toLowerCase().includes(valueSearch.toLowerCase()))) {
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
            <>
                <div className="contenedorBuscador">
                    <div className="content">
                        <h1 className="titulo">Almacen</h1>
                        <p className="descripcion">Registros de <b>TODOS</b> los productos en el sistema.</p>
                        <Input.Search className="descripcion barra-busqueda" placeholder="Busca una obra por su titulo" size="large" value={valueSearch} onChange={(e) => {setValueSearch(e.target.value)}} enterButton/>
                    </div>
                </div>

                <div className="bg-body p-3" style={{minHeight:"100vh"}}>
                    <div className="row mt-5" style={{width:"85%",margin:"0 auto"}}>
                        <div className="d-flex justify-content-end">
                            { pathname != "/aplicacion/almacen/" && <Link to="/almacen/productos/registrar"><Button type="primary">Registrar producto</Button></Link>}
                        </div>
                        <div className="col-lg-2 col-12 ">
                            <h1 className="titulo-descripcion" style={{fontSize:"20px"}}>FILTRAR POR</h1>
                            <Divider/>
                            <h1 className="titulo-descripcion" style={{fontSize:"13px"}}>Categorias</h1>
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
                        <div className="col-lg-10 col-12 mt-5 mt-lg-0">
                            <h1 className="titulo-descripcion" style={{fontSize:"20px"}}>PRODUCTOS ENCONTRADOS</h1>
                            <Divider/>
                            <div className="d-flex justify-content-center gap-5 flex-wrap">
                                {
                                    dataSource.map(producto => (
                                        <ProductoCard rol={rol} key={producto._id} producto={producto} />
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
   }
}