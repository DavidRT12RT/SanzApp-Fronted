import React from 'react'
import { List } from "antd";

export const ObservacionesObra = ({obraInfo}) => {
    return (
      <>
            <p className='lead'>Observaciones</p>
            <List
                header={<div>Observaciones que se han tenido acerca del servicio que se esta proporcionando</div>}
                itemLayout="horizontal"
                dataSource={obraInfo.observaciones}
                bordered
                style={{minHeight:"200px"}}
                renderItem={item => (
                    <List.Item
                        key={item._id}
                    >
                    <List.Item.Meta
                        title={item.observacionTitulo}
                        description={item.trabajador}
                    />
                    {item.observacion}
                    </List.Item>
                )}
            />
  </>
  )
}
