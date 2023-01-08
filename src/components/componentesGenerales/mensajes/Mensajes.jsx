import React, { useContext } from 'react'

//Context's
import { ChatContext } from '../../../context/ChatContext';

//Style
import "./assets/style.css";

//Component's
import { InboxPeople } from './components/InboxPeople';
import { SelectChat } from './components/SelectChat';

export const Mensajes = () => {
    

    const { chatState } = useContext(ChatContext);
    
    console.log(chatState)


    return (
        <div className="messagesContainer">
            <InboxPeople usuarios={chatState.usuarios}/>
            {
                (chatState.chatActivo === null) 
                    ? <SelectChat/>
                    : null
            }
        </div>
    )
}

