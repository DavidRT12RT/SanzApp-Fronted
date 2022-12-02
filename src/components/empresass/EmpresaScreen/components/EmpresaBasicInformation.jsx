import { Divider } from 'antd';
import React from 'react'

const EmpresaBasicInformation = ({empresa}) => {
    return (
        <div className="basicInformationContainer">
            <h1 className="titulo-descripcion">Informacion basica</h1>
            <Divider className="bg-warning"/>


            <h1 className="titulo-descripcion">Logo de la empresa:</h1>
            <div className="logoContainer">
                <img src={`${process.env.REACT_APP_BACKEND_URL}/api/uploads/empresas/empresa/${empresa._id}`}/>
            </div>
            <h1 className="titulo-descripcion mt-3">Descripcion de la empresa:</h1>
            <p className="descripcion">{empresa.descripcion}</p>
            <h1 className="titulo-descripcion mt-3"></h1>
        </div>
    )
}

export default EmpresaBasicInformation;
