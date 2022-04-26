import React, { useState } from 'react'
import { Loading } from './Loading';
import { useObras } from "../../hooks/useObras";
import { ObraCard } from "./ObraCard";
import { ObrasModalForm } from "./ObrasModalForm";




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
    
    //Open modal form for make a new service / construction 
    const [isOpen, setIsOpen] = useState(false)
    
   


    return (
        <div className='mt-5 container'>
            <h1>Lista de obras / servicios Sanz</h1>
            <ObrasModalForm open={isOpen} onClose={()=> setIsOpen(false)}></ObrasModalForm>
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
            <button className="btn btn-warning" onClick={()=>setIsOpen(true)}>Crear nueva obra</button>
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
