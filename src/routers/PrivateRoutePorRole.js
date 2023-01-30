import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

//Provider's
import { ChatProvider } from "../context/ChatContext";
import { SocketProvider } from "../context/SocketContext";

//Alert's
import { error } from "../alerts/botons";

export const PrivateRoutePorRole = ({ children, rolRequerido }) => {
    const { rol, uid } = useSelector((store) => store.auth);
    if (rolRequerido.includes(rol) && uid != "") {
        return (
            <ChatProvider>
                <SocketProvider>{children}</SocketProvider>
            </ChatProvider>
        );
    } else if (uid === "") {
        //El usuario intento entrar a la ruta pero no tiene uid osea no esta logeado vaya
        return <Navigate to="/login" />;
    } else {
        //El usuario si esta logeado pero no tiene el rol para esta ruta
        error(
            `Tienes que tener el rol ${rolRequerido} \n para poder acceder a este recurso!`
        );
        if (rol != "ENCARGADO_ALMACEN_ROL") {
            return <Navigate to="/aplicacion" />;
        } else {
            return <Navigate to="/almacen" />;
        }
    }
};
