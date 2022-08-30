import { Divider, Table } from 'antd'
import React from 'react'

export const IncidentesObra = ({obraInfo,socket}) => {

    const columns = [
        {
            title:<p className="titulo-descripcion">Trabajadores implicados</p>
        },
        {
            title:<p className="titulo-descripcion">Motivo incidente</p>
        },
        {
            title:<p className="titulo-descripcion"></p>
        }
    ];

    return (
        <div className="container p-3 p-lg-5">
            <h1 className="titulo">Incidentes de la obra</h1>
            <p className="descripcion">Incidentes que se han tenido en la obra</p>
            <Divider/>
            <Table columns={columns}/>
        </div>
    )
}
