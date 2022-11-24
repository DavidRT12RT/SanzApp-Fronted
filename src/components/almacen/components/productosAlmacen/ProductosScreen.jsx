import { message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom';
import { fetchConToken } from '../../../../helpers/fetch';
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';
import { useProductos } from '../../../../hooks/useProductos';

//Components
import { FiltrosProductos } from './components/FiltrosProductos';
import { HeaderProductosAlmacen } from './components/HeaderProductosAlmacen';
import { ProductosCards } from './components/ProductosCards';

//Style
import "./style.css";


export const ProductosScreen = () => {

    const [parametrosBusqueda, setParametrosBusqueda] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const { search } = useLocation();
    const { isLoading, productos, setProductos } = useProductos();

    useEffect(() => {
        //Hacer una peticion a el servidor de obras y pasarle el parametro de busqueda
        let query = {};
        for(const property in parametrosBusqueda){
            query = {...query,[property]:parametrosBusqueda[property]}
        }
        setSearchParams(query);

    }, [parametrosBusqueda]);

    useEffect(() => {
        const fetchData = async () => {
            const resp = await fetchConToken(`/productos/${search}`);
            const body = await resp.json();
            if(resp.status != 200) return message.error(body.msg);  
            //Busqueda con exito!
            setProductos(body.productos);
        }
        fetchData();
    }, [search]);



    if(isLoading) return <SanzSpinner/>
    else return (
        <div className="contenedorPrincipalProductosScreen">
            <HeaderProductosAlmacen setParametrosBusqueda={setParametrosBusqueda}/>
            <FiltrosProductos setParametrosBusqueda={setParametrosBusqueda}/>
            <ProductosCards productos={productos}/>
        </div>
    )
}

