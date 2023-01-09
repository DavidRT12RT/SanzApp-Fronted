import { Avatar, Divider } from 'antd'
import React from 'react'
import moment from "moment";

export const MessageChatUserInfo = ({user}) => {

    return (
        <div>
            <div className="MessageChatUserInfo">
                <Avatar size={64} src={`${process.env.REACT_APP_BACKEND_URL}/api/usuarios/${user.uid}/fotos/?tipo=perfil`} />
                <h1 className="titulo-descripcion">{user.nombre}</h1>
                <p className="descripcion">{(user.descripcion) ? user.descripcion : "Usuario sin descripcion..."}</p>
                <div>
                    <p className="descripcion">{moment(user.fechaRegistro).format("LLLL")}</p>
                </div>
            </div>
            <hr style={{margin:"0px"}}/>
        </div>
    )
}
