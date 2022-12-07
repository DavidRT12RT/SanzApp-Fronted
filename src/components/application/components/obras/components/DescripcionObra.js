import React from 'react'
import { Descriptions, Badge } from "antd";

export const DescripcionObra = ({obraInfo}) => {

    return (
        <div>
            <p className="lead">Información general de la obra</p>
            <Descriptions layout="horizontal" bordered>
                <Descriptions.Item label="Titulo de la obra">{obraInfo.titulo}</Descriptions.Item>
                <Descriptions.Item label="Estatus de la obra">
                    <Badge status={(obraInfo.estadoReporte) === "En proceso..." ? "processing" : "success"} text={obraInfo.estadoReporte} />
                </Descriptions.Item>
                <Descriptions.Item label="Numero track">{obraInfo.numeroTrack}</Descriptions.Item>
                <Descriptions.Item label="Tipo de reporte">{obraInfo.tipoReporte}</Descriptions.Item>
                <Descriptions.Item label="Jefe de obra" span={2}>{obraInfo.jefeObra.nombre}</Descriptions.Item>
                <Descriptions.Item label="Fecha de creación">{obraInfo.fecha}</Descriptions.Item>
                <Descriptions.Item label="Fecha de ultima actualización" span={2}>{obraInfo.ultimaActualizacion ? obraInfo.ultimaActualizacion : obraInfo.fecha}</Descriptions.Item>
                <Descriptions.Item label="Plaza">{obraInfo.plaza}</Descriptions.Item>
                <Descriptions.Item label="Sucursal">{obraInfo.sucursal}</Descriptions.Item>
                <Descriptions.Item label="Dirección regional">{obraInfo.direccionRegional}</Descriptions.Item>
                <Descriptions.Item label="Descripción de la obra" span={4}>{obraInfo.descripcion}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}
