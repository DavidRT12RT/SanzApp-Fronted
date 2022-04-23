import { types } from "../types/types";
import { uistartLoading, uiStopLoading } from "./uiActions";
import {success} from '../alerts/botons';


export const startLoginEmailPassword = (email, password) => {

    
   
    //const url ="http://localhost:8080/api/auth/login";
    return (dispatch) => {
        dispatch(uistartLoading());
        console.log("Haciendo petición a Backend!!!");
        const payload = {
            "correo":email,
            "password":password
        };
        console.log(payload);
        fetch("api/auth/login",{
            method:'POST',
            body:JSON.stringify(payload)
        })
            .then( (datos) =>{
                console.log(datos);
                dispatch(login(datos.usuario.uid,datos.usuario.nombre));
                success();
                dispatch(uiStopLoading());
            })
            .catch(e=>{
                console.log(e);
                dispatch(uiStopLoading());
            });
        //Llamar API para logearse 
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
export const login = (uid, displayName) => ({
    type: types.login,
    payload: {
        uid,
        displayName,
    },
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


