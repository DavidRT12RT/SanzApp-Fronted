import { useSelector } from "react-redux";
import {Navigate} from "react-router-dom";

export const PublicRoute = ({children,uid}) =>{

    const rol = useSelector(store => store.auth.rol);

    if(!!uid){
        //Checar si mandarlo a la aplicación de administracción o almacen
        if(rol != "ENCARGADO_ALMACEN_ROL"){
            return <Navigate to="/aplicacion/"/>
        }else{
            return <Navigate to="/almacen/"/>
        }
    }else{
        return children;
    }

}
