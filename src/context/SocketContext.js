import React, { useEffect } from 'react';
import { createContext } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../hooks/useSocket'

export const SocketContext = createContext();


export const SocketProvider = ({ children }) => {

    const { socket,online,conectarSocket,desconectarSocket } = useSocket(process.env.REACT_APP_BACKEND_URL);
    const auth = useSelector(store => store.auth);

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
            console.log(usuarios);
        });
    }, [socket]);
    
    return (
        <SocketContext.Provider value={{ socket, online }}>
            { children }
        </SocketContext.Provider>
    )
}