import React, { useState } from 'react'

//Context's
import { useSelector } from 'react-redux';

//Component's
import { IncomingMessage } from './IncomingMessage';
import { OutGoingMessage } from './OutGoingMessage';
import { SendMessage } from './SendMessage';
import { MessageChatUserInfo } from './MessageChatUserInfo';
import { MessageTopBar } from './MessageTopBar';



export const MessagesChat = ({chatState,dispatch}) => {
    /* 

        Nota de desarollador:
        Aqui le estamos pasando a los componentes hijos que lo utilizaran el "dispatch"
        que en este componente no lo utilizamos como tal, pero si en los componentes hijos
        utilizo un useContext y de ahi lo exporto no creo que sea la mejor practica para
        rendimiento pero bueno eso es decision de cada quien.

    */
    
    const auth = useSelector(store => store.auth);
    const [isMessageTopBarVisible, setIsMessageTopBarVisible] = useState(false);

    //Buscando informacion del usuario del chat activo
    const usuario = chatState.usuarios.find(usuario => usuario.uid === chatState.chatActivo);

    const handleScroll = (event) => {
        const scrollTop = event.currentTarget.scrollTop;
        if(scrollTop > 360) setIsMessageTopBarVisible(true);
        else setIsMessageTopBarVisible(false);
    }



    return (
        <div 
            className={"MessagesChatMainContainer " + (chatState.chatActivo !== null ? "enabled" : "disabled")} 
        >
            <div onScroll={handleScroll} className="MessagesUsers" id="MessagesChatMainContainer">
                <MessageTopBar 
                    isMessageTopBarVisible={isMessageTopBarVisible} 
                    user={usuario}
                    dispatch={dispatch}
                />
                <MessageChatUserInfo 
                    user={usuario}
                    dispatch={dispatch}
                />
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
