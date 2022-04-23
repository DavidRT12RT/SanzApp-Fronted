import { types } from "../types/types";
import { uistartLoading, uiStopLoading } from "./uiActions";
import {error, success} from '../alerts/botons';
import {fetchConToken, fetchSinToken} from "../helpers/fetch";


export const startLogincorreoPassword = (correo, password) => {
    
   
    return async(dispatch) => {

        dispatch(uistartLoading());
        //Llamar API para logearse 
        const resp = await fetchSinToken("/auth/login",{correo,password},"POST");
        const body = await resp.json();

        if(resp.status == 200){
            localStorage.setItem("token",body.token);
            localStorage.setItem("token-init-date",new Date().getTime());
            dispatch(uiStopLoading());
            //dispatch al store para grabar el usuario
            dispatch(login({
                uid:body.usuario.uid,
                name:body.usuario.nombre
            }));
            success("Inicio de sección con exito!");
        } else {
            error(body.msg);
            dispatch(uiStopLoading());
        }

    };
};

export const startRegister = (correo,password,nombre,telefono,NSS,RFC,CURP,rol) =>{
        return async (dispatch) => {
            
            dispatch(uistartLoading());

            //Llamar API para registrarse
            const resp = await fetchConToken("/usuarios",{correo,password,nombre,telefono,NSS,RFC,CURP,rol},"POST");
            const body = await resp.json();
            let mensaje = "";

            if(resp.status == 200){
                localStorage.setItem("token",body.token);
                localStorage.setItem("token-init-date",new Date().getTime());
                dispatch(uiStopLoading);
                dispatch(login({
                    uid:body.usuario.uid,
                    name:body.usuario.nombre
                }));
                success(body.msg);
            } else {
                
                if(body?.errors){
                    body.errors.forEach((object)=>{
                        mensaje += object.msg;
                        mensaje += "\n";
                    });
                    error(mensaje);
                }else{
                    error(body.msg);
                }
                dispatch(uiStopLoading());
            }
        }
    };



//Accion que pondra en el store
export const login = (user) => ({
    type: types.login,
    payload: user
});


export const startLogout = () => {
    return (dispatch) =>{
        //Borrar token localstorage
        dispatch(logout());
    }
}

//Accion que borrara del store
export const logout = () =>({
    type:types.logout
});


