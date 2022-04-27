import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useEmpleados } from '../../hooks/useEmpleados'
import { EmpleadoCard } from './EmpleadoCard';
import { Loading } from './Loading';

export const EmpleadosScreen = () => {

    const {isLoading,empleados}  = useEmpleados();
    const [currentPage,setCurrentPage] = useState(0);
    const [search, setsearch] = useState("");

    const filtrar = () =>{
        const filtered = empleados.filter(empleado => empleado.nombre.includes(search));
        return filtered.slice(currentPage,currentPage + 5);
    }

    const empleadosFiltrados = () =>{
        if(search.length === 0){
            return empleados.slice(currentPage,currentPage + 5);
        }else{
            const empleadosFiltradosPorExpresionRegular = filtrar();
            return empleadosFiltradosPorExpresionRegular;
        }
    }
    
    const previousPage = () =>{
        if(currentPage > 0) 
            setCurrentPage(currentPage - 5);
    }

    const nextPage = () =>{
        const empleadosFiltradosPorExpresionRegular = filtrar();
        console.log(empleadosFiltradosPorExpresionRegular);
        if(empleadosFiltradosPorExpresionRegular.length > currentPage +1 ){
            setCurrentPage(currentPage + 5);
       }
    }

    const onSearchChange = ({target}) =>{
        setCurrentPage(0);
        setsearch(target.value);
    }
   
    console.log(empleados.length);
    return (
        <div className='mt-5 container'>
            <h1>Listado de empleados Sanz</h1>
            <hr/>
            <input 
            type="text"
            className="mb-3 form-control"
            placeholder="Buscar empleado..."
            value={search}
            onChange={onSearchChange}
            />
            <button className='btn btn-warning' onClick={previousPage}>
                Anterior
            </button>
            &nbsp;
            <button className='btn btn-warning mx-2' onClick={nextPage}>
                Siguiente
            </button>
            <Link to="/registro" className="btn btn-warning">Registrar usuario</Link>
            <div className="d-flex justify-content-center flex-column mt-5">
                 {
                        empleadosFiltrados().map(empleado => 
                            <EmpleadoCard key={empleado.uid} {...empleado}/>
                        )
                    }

            </div>
                   
            {isLoading &&<Loading/>}
        </div>
    )
};
