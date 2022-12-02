import { message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom';
import { fetchConToken } from '../../../helpers/fetch';
import { SanzSpinner } from '../../../helpers/spinner/SanzSpinner';
import { useObras } from '../../../hooks/useObras';

//Components
import Filtros from './components/Filtros';
import HeaderObras from './components/HeaderObras';
import ObrasCards from './components/ObrasCards';

//Estilos 
import "./style.css";

const Obras = () => {

    const [parametrosBusqueda, setParametrosBusqueda] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const { search } = useLocation();

    const { isLoading,obras,setObras } = useObras();

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
            const resp = await fetchConToken(`/obras/${search}`);
            const body = await resp.json();
            if(resp.status != 200) return message.error(body.msg);  
            //Busqueda con exito!
            setObras(body.obras);
        }
        fetchData();
    }, [search]);


    if(isLoading) return <SanzSpinner/>
    else return (
        <div className="obrasContenedorPrincipal row">
            <section className="col-12 col-lg-3 contenedorIzquierdo">
                <Filtros setParametrosBusqueda={setParametrosBusqueda}/>
            </section>
            <section className="col-12 col-lg-9 contenedorDerecho">
                <HeaderObras/>
                <div className="obraBorder bg-warning"/>
                <ObrasCards setParametrosBusqueda={setParametrosBusqueda} obras={obras}/>
            </section>
        </div>
    )
}

export default Obras;

