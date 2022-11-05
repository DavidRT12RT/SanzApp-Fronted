import React from 'react';
import { createContext } from 'react';
import { useSocket } from '../hooks/useSocket'

export const SocketContext = createContext();


export const SocketProvider = ({ children }) => {

    //const { socket, online } = useSocket('https://backendsanzconstructora.herokuapp.com/'); 
    //const { socket, online } = useSocket('http://localhost:4000');
    //const { socket,online } = useSocket("http://54.91.5.96:4000");
    const { socket,online } = useSocket(process.env.REACT_APP_BACKEND_URL);
    


    return (
        <SocketContext.Provider value={{ socket, online }}>
            { children }
        </SocketContext.Provider>
    )
}