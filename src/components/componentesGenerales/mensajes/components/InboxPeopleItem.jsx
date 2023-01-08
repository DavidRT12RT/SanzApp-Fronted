import React, { useContext } from 'react'

//Third party component's
import { Avatar } from 'antd'

//Context's
import { ChatContext } from '../../../../context/ChatContext';

import { types } from '../../../../types/types';

//Helper's
import { fetchConToken } from '../../../../helpers/fetch';


export const InboxPeopleItem = ({usuario}) => {
    
    const { chatState,dispatch } = useContext(ChatContext);

    const handleClickChat = async() => {

        dispatch({
            type:types.activarChat,
            payload:usuario.uid
        });

        //Cargar mensajes del chat
        const resp = await fetchConToken(`/mensajes/${usuario.uid}`);
        const body = await resp.json();
        dispatch({
            type:types.cargarMensajes,
            payload:body.mensajes
        });


        //Scroll hacia abajo

    }

    return (
        <div className={"InboxpeopleItem " + (chatState.chatActivo === usuario.uid && "active-chat")} onClick={handleClickChat}>
            <Avatar size={48} src={`${process.env.REACT_APP_BACKEND_URL}/api/usuarios/${usuario.uid}/fotos/?tipo=perfil`} />
            <div>
                <div className="InboxPeopleItemUserInfo">
                    <h1 className="titulo-descripcion">{usuario.nombre}</h1>
                    <p className={usuario.online ? "text-success" : "text-danger"}>{usuario.online ? "Online" : "Offline"}</p>
                </div>
                <p className="descripcion lastMessage">Ultimo mensaje...</p>
            </div>
        </div>
    )
}
