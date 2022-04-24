import {Navigate} from "react-router-dom";
import {error} from "../alerts/botons";

export const PrivateRoute = ({children,uid}) =>{
    if(!!uid){
        return children;
    }else{
        error("Tienes que iniciar seción primero para ingresar a esa ruta!");
        return <Navigate to="/login"/>;
    }
}