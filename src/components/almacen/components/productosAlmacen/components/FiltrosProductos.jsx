import { Divider,InputNumber } from 'antd';
import React, { useEffect, useState } from 'react'
import { useCategorias } from '../../../../../hooks/useCategorias'

export const FiltrosProductos = ({setParametrosBusqueda}) => {
    
    //Make http request to get categories from db
    const { isLoading, categorias } = useCategorias();
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);

    useEffect(() => {
        setParametrosBusqueda((parametrosAnteriores) => ({
            ...parametrosAnteriores,
            categoria:categoriasSelecionadas
        }));
    }, [categoriasSelecionadas]);

    const handleChangeCosto = (e,tipo) => {
        setParametrosBusqueda((parametrosAnteriores) => ({
            ...parametrosAnteriores,
            [tipo]:e
        }));
    }

    const CategoriaCard = ({categoria,key}) => {
        
        const handleClick = (e) => {
            if(categoriasSelecionadas.includes(categoria._id)){
                //La quitamos
                //let index = categoriasSelecionadas.indexOf(categoria.nombre);
                //categoriasSelecionadas.splice(index,1);
                setCategoriasSelecionadas([...categoriasSelecionadas.filter(e => e != categoria._id)]);
            }else{
                //Agregamos
                setCategoriasSelecionadas([...categoriasSelecionadas,categoria._id]);
            }
        }

        return (
            <div className={"categoriaCard " + (categoriasSelecionadas.includes(categoria._id) && "bg-warning")} key={key} onClick={handleClick}>
                <h1 className="titulo-descripcion">{categoria.nombre}</h1>
            </div>
        )
    }

    return (
        <section className="filtrosContenedorPrincipal">

            <h1 className="titulo-descripcion">Filtros</h1>
            <Divider/>
            <h2 className="titulo-descripcion text-muted">Categorias</h2>
            <div className="categoriasContainer">
                {categorias.length > 0 ? categorias.map(categoria => {
                    return <CategoriaCard categoria={categoria} key={categoria._id}/>
                }) : <p className='titulo-descripcion text-danger'>Ninguna categoria registrada en el sistema aun...</p>}
            </div>

            <Divider/>
            <h2 className="titulo-descripcion text-muted">Costo</h2>
            <div className="costoContainer">
                <InputNumber size="large" className="precioFiltro" onChange={(e) => handleChangeCosto(e,"min")} defaultValue={0} prefix="$"/>
                <InputNumber size="large" className="precioFiltro" onChange={(e) => handleChangeCosto(e,"max")} defaultValue={99999} prefix="$"/>
            </div>
        </section>
    )
}
