import React, { useContext } from 'react'

//Component's
import { IncomingMessage } from './IncomingMessage';
import { OutGoingMessage } from './OutGoingMessage';
import { SendMessage } from './SendMessage';

//Context's
import { ChatContext } from '../../../../context/ChatContext';
import { useSelector } from 'react-redux';

//Component's
import { MessageChatUserInfo } from './MessageChatUserInfo';

export const MessagesChat = () => {
    
    const { chatState } = useContext(ChatContext);
    const auth = useSelector(store => store.auth);

    //Buscando informacion del usuario del chat activo
    const usuario = chatState.usuarios.find(usuario => usuario.uid === chatState.chatActivo);

    return (
        <div>
            <div className="MessagesChatMainContainer" id="MessagesChatMainContainer">
                <MessageChatUserInfo user={usuario}/>
                {
                    chatState.mensajes.map(mensaje => {
                        if(mensaje.de === auth.uid) return <OutGoingMessage mensaje={mensaje} key={mensaje._id}/>
                        else return <IncomingMessage mensaje={mensaje} key={mensaje._id}/>
                    })
                }
            </div>
            <hr/>
            <SendMessage/>
        </div>
    )
}
