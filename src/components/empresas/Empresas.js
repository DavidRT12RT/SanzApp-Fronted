import { Button, Checkbox, Divider, Input, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { SanzSpinner } from '../../helpers/spinner/SanzSpinner';
import { useEmpresas } from '../../hooks/useEmpresas';
import "./assets/style.css";
const { Search } = Input;

export const Empresas = () => {

    const { isLoading,empresas } = useEmpresas();
    const [empresasRegistros, setEmpresasRegistros] = useState([]);
    const navigate =useNavigate();

    useEffect(() => {
        empresas.map(empresa => empresa.key = empresa._id);
        setEmpresasRegistros(empresas);
    }, [empresas]);
   
    const columns = [
        {
            title:<p className="titulo-descripcion">Logo empresa</p>,
            render:(text,record)=> (
                <div className="d-flex justify-content-center align-items-center">
                    <img src={`http://localhost:4000/api/uploads/empresas/empresa/${record._id}`} width={150} height={150} style={{objectFit:"contain"}}/>
                </div>
            )
        },
        {
            title:<p className="titulo-descripcion">Nombre empresa</p>,
            render:(text,record)=> (<Link to={`/aplicacion/empresas/${record._id}`} className="descripcion text-primary">{record.nombre}</Link>)
        },
        {
            title:<p className="titulo-descripcion">Sucursales registradas</p>,
            render:(text,record)=> (<p className="descripcion">{record.sucursales.length}</p>)
        },
        {
            title:<p className="titulo-descripcion">Obras registradas</p>,
            render:(text,record)=> (<p className="descripcion">{record.obras.length}</p>)
        },
        {
            title:<p className="titulo-descripcion">Fecha registro</p>,
            render:(text,record)=> (<p className="descripcion">{record.fechaRegistro}</p>)
        },
        {
            title:<p className="titulo-descripcion">Estado</p>,
            render:(text,record)=> (record.estado ? <p className="descripcion text-success">Activa</p> : <p className="descripcion text-danger">Desactivada</p>)
        }
    ];

 
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
            <div>

                <header className="contenedorBuscadorEmpresas">
                    <div className="content">
                        <h1 className="titulo">Empresas</h1>
                        <p className="descripcion">Registro <b>TOTAL</b> de empresas en el sistema.</p>
                        <Input.Search className="descripcion barra-busqueda" placeholder="Busca una empresa por su nombre" size="large" enterButton/>
                    </div>
               </header>

                <div className="bg-body p-3" style={{minHeight:"100vh"}}>
                    <div className="row mt-5" style={{width:"90%",margin:"0 auto"}}>
                        <div className="col-12 col-lg-2">
                            <h1 className="titulo-descripcion" style={{fontSize:"20px"}}>FILTRAR POR</h1>
                            <Divider/>

                        </div>

                        <div className="col-12 col-lg-10 mt-5 mt-lg-0">
                            <h1 className="titulo-descripcion" style={{fontSize:"20px"}}>EMPRESAS ENCONTRADAS</h1>
                            <Divider/>
                            <Table columns={columns} dataSource={empresasRegistros} bordered/>
                       </div>
                    </div>
                </div>

            </div> 
        )
    }
}
