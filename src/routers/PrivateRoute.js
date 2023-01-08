import { Navigate } from "react-router-dom";

//Provider's
import { SocketProvider } from "../context/SocketContext";

//Alert's
import { error } from "../alerts/botons";
import { ChatProvider } from "../context/ChatContext";

export const PrivateRoute = ({children,uid}) =>{
    if(!!uid){
        return (
            <ChatProvider>
                <SocketProvider>
                    {children}
                </SocketProvider>
            </ChatProvider>
        );
    }else{
        error("Tienes que iniciar seción primero para ingresar a esa ruta!");
        return <Navigate to="/login"/>;
    }
}