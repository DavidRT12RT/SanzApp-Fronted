import React, { useState } from 'react'
import { Loading } from './Loading';
import { useObras } from "../../hooks/useObras";
import { ObraCard } from "./ObraCard";
import { Link } from 'react-router-dom';

import "./assets/style.css";



export const ObrasScreen = () => {


    const {isLoading,obras} = useObras();
    const [currentPage,setCurrentPage] = useState(0);
    const [search, setsearch] = useState("");

    const filtrar = () =>{
        const filtered = obras.filter( obra => obra.titulo.includes(search));
        return filtered.slice(currentPage,currentPage + 5);
    }

    const obrasFiltradas = () =>{
        if(search.length === 0){
            return obras.slice(currentPage,currentPage + 5);
        }else{
            const obrasFiltradasPorExpresionRegular = filtrar();
            return obrasFiltradasPorExpresionRegular; 
        }
    }
    
    const previousPage = () =>{
        if(currentPage > 0) 
            setCurrentPage(currentPage - 5);
    }

    const nextPage = () =>{
        const obrasFiltradasPorExpresionRegular = filtrar();
        if(obrasFiltradasPorExpresionRegular.length > currentPage +1 ){
            setCurrentPage(currentPage + 5);
       }
    }

    const onSearchChange = ({target}) =>{
        setCurrentPage(0);
        setsearch(target.value);
    }

   

    return (
        <div className='mt-5 container'>
            <h1>Lista de obras / servicios Sanz</h1>
            <hr/>
            <input 
            type="text"
            className="mb-3 form-control"
            placeholder="Buscar empleado..."
            value={search}
            onChange={onSearchChange}
            />
            <button className='btn btn-outline border' onClick={previousPage}>
                Anterior
            </button>
            &nbsp;
            <button className='btn btn-outline border mx-2' onClick={nextPage}>
                Siguiente
            </button>
            <Link to="/aplicacion/obras/registro" className="btn btn-outline border">Crear obra / servicio</Link>
            <div className="d-flex justify-content-center flex-column mt-5">
                 {
                        obrasFiltradas().map(obra => 
                            <ObraCard key={obra._id} {...obra}/>
                        )
                    }

            </div>
                   
            {isLoading &&<Loading/>}
        </div>
    )
};
