import { Avatar, Button, Divider } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom';
import "../assets/style.css";

export const EmpresaCard = ({empresa=null}) => {
    if(empresa === null) {
        return <h1>Cargando...</h1>
    }else{
        return (
            <div className="empresaCard border">
                <img src={`http://localhost:4000/api/uploads/empresas/empresa/${empresa._id}`}/>
                <div className="informacionEmpresa">
                    <h1 className="titulo">{empresa.nombre}</h1>
                    {empresa.estado ? <p className="text-success titulo-descripcion mt-3">Activa</p> : <p className="text-danger titulo-descripcion mt-3">Desactivada</p>}
                    <p className="descripcion">{empresa.descripcion.slice(0,150)}...</p>
                    <Link to={`/aplicacion/empresas/${empresa._id}`}><Button type="primary">Ver información completa de la empresa</Button></Link>
                </div>
            </div>
        )
    }
}
