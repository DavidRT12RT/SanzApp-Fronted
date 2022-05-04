import React from 'react'
import { Descriptions, Badge} from 'antd';

export const InformacionProducto = () => {
    return (
        <>
        <h1>Información detallada del producto</h1>
        <Descriptions layout="vertical" bordered>
            <Descriptions.Item label="Nombre del producto">Base de pintura</Descriptions.Item>
            <Descriptions.Item label="Cantidad">35</Descriptions.Item>
            <Descriptions.Item label="Estado">Nuevo</Descriptions.Item>
            <Descriptions.Item label="Categoria">Ferreteria</Descriptions.Item>
            <Descriptions.Item label="Fecha de ingreso al sistema">2018-04-24 18:00:00</Descriptions.Item>
            <Descriptions.Item label="Ultima revisión en bodega" span={2}>
                2019-04-24 18:00:00
            </Descriptions.Item>
            <Descriptions.Item label="Estatus" span={3}>
                <Badge status="processing" text="Disponible en bodega" />
            </Descriptions.Item>
            <Descriptions.Item label="Costo del producto">$80.00</Descriptions.Item>
            <Descriptions.Item label="ID">#S03DSD23</Descriptions.Item>
            <Descriptions.Item label="Usos">1.- Poner base para pintura</Descriptions.Item>
            <Descriptions.Item label="Descripción del producto">
                Pintura vinílica ideal para superficies que necesiten renovarse de manera rápida y sencilla. Con buen desempeño y durabilidad. Para interiores y exteriores.
            </Descriptions.Item>
        </Descriptions>
        </>
  )
}

