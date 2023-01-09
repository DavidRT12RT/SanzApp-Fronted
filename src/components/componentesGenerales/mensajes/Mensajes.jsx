import React, { useContext } from 'react'

//Context's
import { ChatContext } from '../../../context/ChatContext';

//Style
import "./assets/style.css";

//Component's
import { InboxPeople } from './components/InboxPeople';
import { MessagesChat } from './components/MessagesChat';
import { SelectChat } from './components/SelectChat';

export const Mensajes = () => {
    

    const { chatState } = useContext(ChatContext);
    


    return (
        <div className="messagesContainer">
            <InboxPeople usuarios={chatState.usuarios}/>
            {
                (chatState.chatActivo === null) 
                    ? <SelectChat/>
                    : <MessagesChat/>
            }

        </div>
    )
}

