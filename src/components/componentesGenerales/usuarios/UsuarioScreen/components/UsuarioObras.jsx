import { Avatar, Divider, List } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const UsuarioObras = ({userInfo}) => {

    const [data, setData] = useState([]);

    useEffect(() => {
        let obras = userInfo.obrasTrabajadas.map((obra,index) => (
            {
                titulo:(obra.id.titulo || "TITULO NO ENCONTRADO"),
                descripcion:(obra.id.descripcion || "DESCRIPCION NO ENCONTRADA"),
                rol:(obra.rol || "ROL NO ENCONTRADO"),
                key:(obra.id._id || index)
            }
        ))
        setData(obras);
    }, [userInfo]);
    
    return (
        <div className="userInfoContainer mt-4">
            <h1 className="titulo">Obras trabajadas</h1>
            {
                data.length > 0
                    ?
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={(item) => (
                            <List.Item key={item.key}>
                                <List.Item.Meta
                                    title={<Link target="_blank" to={`/aplicacion/obras/editor/${item.key}`}>{item.titulo}</Link>}
                                    description={item.rol.toUpperCase()}
                                />
                                {item.descripcion}
                            </List.Item>
                        )}
                    />
                :
                <p className="titulo-descripcion text-danger">No haz participado en ninguna obra aun...</p>
            }
       </div>
    )
}

export default UsuarioObras