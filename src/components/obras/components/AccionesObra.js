import React from 'react'
import { List } from "antd";

export const AccionesObra = ({obraInfo}) => {
    return (
      <>
        <p className="lead">Trabajos ejecutados</p>
        <List
            header={<div>Información sobre las acciones que se han hecho en la obra</div>}
            itemLayout="horizontal"
            dataSource={obraInfo.trabajosEjecutados}
            bordered
            style={{minHeight:"200px"}}
            renderItem={item => (
                <List.Item
                    key={item._id}
                >
                <List.Item.Meta
                    title={item.trabajoRealizado}
                    description={item.trabajador}
                />
                    {item.descripcion}
                </List.Item>
                )}
        />
    </>
  )
}
