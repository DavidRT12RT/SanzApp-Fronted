import React from 'react'

//Hooks
//Components
import { Input } from 'antd';
import EmpresaCard from './EmpresaCard';
import EmpresasPagination from './EmpresasPagination';

const EmpresasCards = ({empresas,setParametrosBusqueda}) => {

    const handleChangeNombreEmpresa = (e) => {
        console.log(e);
        if(e.length > 0) {
            setParametrosBusqueda((parametrosAnteriores) => ({
                ...parametrosAnteriores,
                nombre:e
            }));
        }else{
            setParametrosBusqueda((parametrosAnteriores) => {
                delete parametrosAnteriores.nombre
                return {...parametrosAnteriores};
            })
        }
    }


    return (
        <>
        <section className="empresasCardsContainer">
            <Input.Search size="large" onSearch={handleChangeNombreEmpresa} allowClear enterButton={<button type="primary" className="btn btn-warning">Buscar</button>} placeholder="busca una empresa por su nombre..."/>
            {
                empresas.map(empresa => {
                    return <EmpresaCard empresa={empresa} key={empresa._id}/>
                })
            }
            <EmpresasPagination/>
        </section>
        </>
    )
}

export default EmpresasCards