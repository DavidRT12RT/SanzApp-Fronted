import React from 'react'
import { Avatar, List } from "antd";

export const ObservacionesObra = ({obraInfo}) => {
    console.log(obraInfo.comentarios);
    return (
      <>
            <p className='lead'>Observaciones</p>
            <List
                header={<div>Observaciones que se han tenido acerca del servicio que se esta proporcionando</div>}
                itemLayout="horizontal"
                dataSource={obraInfo.comentarios}
                bordered
                style={{minHeight:"200px"}}
                renderItem={item => (
                    <List.Item
                        key={item._id}
                    >
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar}/>}
                        title={item.author}
                        description={item.datetime}
                    />
                    {item.content}
                    </List.Item>
                )}
            />
  </>
  )
}
