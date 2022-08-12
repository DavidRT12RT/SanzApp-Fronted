import { Button, Checkbox, Divider, Input } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined,UploadOutlined,InboxOutlined, PlusOutlined, LeftOutlined, SearchOutlined} from '@ant-design/icons';
import { SanzSpinner } from '../../helpers/spinner/SanzSpinner';
import { useEmpresas } from '../../hooks/useEmpresas';
import { EmpresaCard } from './components/EmpresaCard';
const { Search } = Input;

export const Empresas = () => {

    const { isLoading,empresas } = useEmpresas();
    const [empresasRegistros, setEmpresasRegistros] = useState([]);
    const navigate =useNavigate();

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
            <div className="container p-5" style={{minHeight:"100vh"}}>
                <div className="d-flex justify-content-end align-items-center flex-wrap">
                    <Link to="/aplicacion/empresas/registrar"><Button type="primary">Registrar empresa</Button></Link>
                </div>
                <section className="d-flex justify-content-center align-items-center gap-2 flex-column">
                    <h1 className="titulo" style={{fontSize:"42px"}}>Empresas</h1>
                    <input className="descripcion form-control" onChange={(e)=>{filtrarEmpresaPorNombre(e.target.value)}} placeholder={"Buscar una empresa por su nombre"}></input>
                    <p className="titulo-descripcion mt-3 text-align-center ">{empresasRegistros.length} resultados</p>
                </section>
                <section className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
                    {empresasRegistros.map(empresa => {
                        return <EmpresaCard empresa={empresa} key={empresa.key}/>
                    })}
                </section>
            </div>
        )
    }
}
