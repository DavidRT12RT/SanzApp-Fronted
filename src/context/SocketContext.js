import React, { useContext, useEffect,createContext } from 'react';
import { useSelector } from 'react-redux';

//Custom hook
import { useSocket } from '../hooks/useSocket'

//Context's
import { ChatContext } from './ChatContext';

//Type's
import { types } from '../types/types';

export const SocketContext = createContext();


export const SocketProvider = ({ children }) => {

    const { socket,online,conectarSocket,desconectarSocket } = useSocket(process.env.REACT_APP_BACKEND_URL);
    const auth = useSelector(store => store.auth);
    
    const { dispatch } = useContext(ChatContext);

    //Estar al pendiente al estado del auth para hacer connect
    useEffect(() => {
        if(!auth.checking) conectarSocket();
    }, [auth,conectarSocket]);

    useEffect(() => {
        if(auth.checking) desconectarSocket();
    }, [auth,desconectarSocket]);

    //Escuchar cambios de usuarios conectados
    useEffect(() => {
        //Solo se ejecuta si el socket tiene valor
        socket?.on("lista-usuarios",(usuarios) => {
            console.log("Lista usuarios",usuarios);
            dispatch({
                type:types.usuariosCargados,
                payload:usuarios
            });
        });
    }, [socket,dispatch]);

    //Escuchar mensajes personales
    useEffect(() => {

        socket?.on("mensaje-personal",(mensaje) => {
            console.log("Mensaje personal: ",mensaje);
            //Dispatch de una accion que
            dispatch({
                type:types.nuevoMensaje,
                payload:mensaje
            });
            //TODO:Mover el scroll al final
            //scrollToBottomAnimated("mensajes");
        });

    }, [socket,dispatch]);
    
    return (
        <SocketContext.Provider value={{ socket, online }}>
            { children }
        </SocketContext.Provider>
    )
}