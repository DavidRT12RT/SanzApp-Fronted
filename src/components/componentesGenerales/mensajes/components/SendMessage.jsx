import React, { useContext } from 'react'

//Icon's
import { SendFill } from 'react-bootstrap-icons';

//Custom hook's
import { useForm } from '../../../../hooks/useForm'

//Context's
import { SocketContext } from '../../../../context/SocketContext';
import { ChatContext } from '../../../../context/ChatContext';
import { useSelector } from 'react-redux';

export const SendMessage = () => {

    const [ values, handleInputChange,setValues ] = useForm({
        message:""
    });

    const auth = useSelector(store => store.auth);
    const { socket } = useContext(SocketContext);
    const { chatState } = useContext(ChatContext);

    const handleSubmitNewMessage = (e) => {

        e.preventDefault();

        if(values.message.trim().length === 0) return;

        socket.emit("mensaje-personal",{
            de:auth.uid,
            para:chatState.chatActivo,
            mensaje:values.message
        });

        setValues({message:""});
    }


    return (
        <form className="SendMessageContainer" onSubmit={handleSubmitNewMessage}>
            <input 
                className="descripcion SendMessageInput"
                name="message"
                value={values.message}
                onChange={handleInputChange}
                placeholder="Empieza un nuevo mensaje"
            >

            </input>
            <button type="submit" disabled={values.message.length === 0 ? true : false} className="SendMessageBtn"><SendFill className="SendMessageIcon"/></button>
        </form>
    )
}
