import React, { useContext, useEffect, useState } from 'react'

//Third party component's
import { Avatar } from 'antd'

//Context's
import { ChatContext } from '../../../../context/ChatContext';

import { types } from '../../../../types/types';

//Helper's
import { fetchConToken } from '../../../../helpers/fetch';
import { scrollToBottom } from '../../../../helpers/scrollToBottom';

export const InboxPeopleItem = ({usuario}) => {

    const { chatState,dispatch } = useContext(ChatContext);
    const [lastMessage, setLastMessage] = useState(null);

    useEffect(() => {
        //console.log("useEffect ejecutandose!");
        const fetchLastMessage = async() => {
            const resp = await fetchConToken(`/mensajes/ultimoMensaje/${usuario.uid}`);
            if (resp.status === 404) return null;
            const body = await resp.json();
            const lastMessage = body.lastMessage.mensaje;
            (lastMessage.length > 30) ? setLastMessage(`${lastMessage.slice(0,30)}...`) : setLastMessage(lastMessage);
        }
        fetchLastMessage();
    }, [chatState]);

    /* 

        Nota de desarollador:
        Obtener el ultimo mensaje de cada chat por una solicitud al backend 
        parece ser lo mas viable ya que si lo pensamos bien y obtenemos 
        todos los mensajes esto seria ineficiente ya que obtener todos los
        mensajes de todas las personas con las que ha hablado el usuario
        tendria mucho peso para la solicitud al backend y el usuario podria o no
        abrir el chat y simplemente hariamos la peticion por las "puras".

    */


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
        scrollToBottom("MessagesChatMainContainer");

    }

    return (
        <div className={"InboxpeopleItem " + (chatState.chatActivo === usuario.uid && "active-chat")} onClick={handleClickChat}>
            <Avatar size={48} src={`${process.env.REACT_APP_BACKEND_URL}/api/usuarios/${usuario.uid}/fotos/?tipo=perfil`} />
            <div>
                <div className="InboxPeopleItemUserInfo">
                    <h1 className="titulo-descripcion">{usuario.nombre}</h1>
                    <p className={usuario.online ? "text-success" : "text-danger"}>{usuario.online ? "Online" : "Offline"}</p>
                </div>
                <p className="descripcion">{lastMessage === null ? "Ningun mensaje aun..." : lastMessage}</p>
            </div>
        </div>
    )
}

