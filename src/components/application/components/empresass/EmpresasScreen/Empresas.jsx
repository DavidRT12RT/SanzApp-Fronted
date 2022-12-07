import { message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom';
import { fetchConToken } from '../../../../../helpers/fetch';
import { SanzSpinner } from '../../../../../helpers/spinner/SanzSpinner';
import { useEmpresas } from '../../../../../hooks/useEmpresas';


//Components
import EmpresasCards from './components/EmpresasCards';
import HeroSection from './components/HeroSection';


//Style css
import "./style.css";

export const Empresas = () => {

    const [parametrosBusqueda, setParametrosBusqueda] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const { search } = useLocation();
    const { isLoading, empresas,setEmpresas } = useEmpresas();

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
            const resp = await fetchConToken(`/empresas/${search}`);
            const body = await resp.json();
            if(resp.status != 200) return message.error(body.msg);  
            //Busqueda con exito!
            setEmpresas(body.empresas);
        }
        fetchData();
    }, [search]);


    if(isLoading) return <SanzSpinner/>
    else return (
        <div className="contenedorPrincipalEmpresasScreen">
           <HeroSection/>
           <div className="heroSectionBorder bg-warning"></div>
           <EmpresasCards empresas={empresas} setParametrosBusqueda={setParametrosBusqueda}/>
        </div>
    )
}
