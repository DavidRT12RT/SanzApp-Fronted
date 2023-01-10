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
    
    const { chatState,dispatch } = useContext(ChatContext);

    return (
        <div className="messagesContainer">
            <InboxPeople chatState={chatState} usuarios={chatState.usuarios}/>
            {
                (chatState.chatActivo === null) 
                    ? <SelectChat/>
                    : <MessagesChat chatState={chatState} dispatch={dispatch}/>
            }

        </div>
    )
}

