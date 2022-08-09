import { Button, Checkbox, Divider, Input } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { SanzSpinner } from '../../helpers/spinner/SanzSpinner';
import { useEmpresas } from '../../hooks/useEmpresas';
import { EmpresaCard } from './components/EmpresaCard';
const { Search } = Input;

export const Empresas = () => {

    const { isLoading,empresas } = useEmpresas();
    const [empresasRegistros, setEmpresasRegistros] = useState([]);

    useEffect(() => {
        empresas.map(empresa => empresa.key = empresa._id);
        setEmpresasRegistros(empresas);
    }, [empresas]);
   
    const filtrarEmpresaPorNombre = (values) => {
        if(values.length === 0) {
            return setEmpresasRegistros(empresas);
        }
        const resultadosBusqueda = empresas.filter(empresa => {
            if(empresa.nombre.toLowerCase().includes(values.toLowerCase())) return empresa;
        });

        setEmpresasRegistros(resultadosBusqueda);
    }

    if(isLoading){
        return <SanzSpinner/>
    }else{
        return (
            <div className="container" style={{minHeight:"100vh"}}>
                <div className="p-5">
                    <div className="d-flex justify-content-end align-items-center my-3">
                        <Link to={"/aplicacion/empresas/registrar/"}><Button type="primary">Registrar empresa</Button></Link>
                    </div>
                    <h1 className="titulo">Empresas</h1>
                    <Search
                        placeholder="Ingresa el nombre de la empresa..."
                        allowClear
                        autoFocus
                        enterButton="Buscar"
					    size="large"
                        onSearch={filtrarEmpresaPorNombre}
						onChange={(e)=>{
							if(e.target.value === "") return setEmpresasRegistros(empresas);
						}}
                    /> 
                    <Divider/>
                </div>
                <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
                    {empresasRegistros.map(empresa => {
                        return <EmpresaCard empresa={empresa} key={empresa.key}/>
                    })}
                </div>
            </div>
        )
    }
}
