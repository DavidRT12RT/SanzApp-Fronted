import { Avatar } from 'antd'
import React from 'react'
import moment from "moment";

//Context's
import { types } from '../../../../types/types';
import { ArrowLeft } from 'react-bootstrap-icons';

export const MessageChatUserInfo = ({user,dispatch}) => {

    const handleClick = () => {
        dispatch({
            type:types.desactivarChat
        });
    }

    return (
        <div>
            <div className="MessageChatUserInfo">
                <span className="MessageTopBarLeftIcon" onClick={handleClick}><ArrowLeft/></span>
                <Avatar size={64} src={`${process.env.REACT_APP_BACKEND_URL}/api/usuarios/${user.uid}/fotos/?tipo=perfil`} />
                <div className="content">
                    <h1 className="titulo-descripcion">{user.nombre}</h1>
                    <p className="descripcion">{(user.descripcion) ? user.descripcion : "Usuario sin descripcion..."}</p>
                    <div className="ExtraInfo">
                        <p className="descripcion">{moment(user.fechaRegistro).format("LLLL")}</p>
                    </div>
                </div>
           </div>
            <hr style={{margin:"0px"}}/>
        </div>
    )
}
