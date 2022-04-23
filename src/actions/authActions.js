import { types } from "../types/types";
import { uistartLoading, uiStopLoading } from "./uiActions";
import {error, success} from '../alerts/botons';
import {fetchSinToken} from "../helpers/fetch";


export const startLogincorreoPassword = (correo, password) => {
    
   
    return async(dispatch) => {

        dispatch(uistartLoading());
        //Llamar API para logearse 
        const resp = await fetchSinToken("login",{correo,password},"POST");
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
            success();
        } else {
            error(body.msg);
            dispatch(uiStopLoading());
        }

    };
};

export const startRegister = () =>{
    //Tarea asincrona entonces necesito retornar un callback
    return (dispatch)=>{
        //Hacer petición a backend y rezar para que pase todo

        /*Una vez ya obtenido el usuario lo hacemos 
        la acción  de login y lo guardamos en el store de la 
        aplicación
        */
        dispatch(login(123,"Pedrita!"));
    };
}


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


