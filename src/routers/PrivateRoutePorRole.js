import { useSelector } from "react-redux";
import {Navigate} from "react-router-dom";
import {error} from "../alerts/botons";

export const PrivateRoutePorRole = ({children,rolRequerido}) =>{
    const rol = useSelector(store => store.auth.rol);
    if(rolRequerido.includes(rol)){
        return children;
    }else{
        error(`Tienes que tener el rol ${rolRequerido} para poder acceder a este recurso!`);
        return <Navigate to="/aplicacion/"/>;
    }
}