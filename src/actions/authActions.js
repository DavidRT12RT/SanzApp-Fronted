import { types } from "../types/types";
import { firebase, googleAuthProvider } from "../firebase/firebase-config";
import { uistartLoading, uiStopLoading } from "./uiActions";
import {sucess} from '../alerts/botons';


export const startLoginEmailPassword = (email, password) => {

    
   
    return (dispatch) => {
        dispatch(uistartLoading());
        console.log("Haciendo petición a Backend!!!");
        setTimeout(() => {
            dispatch(uiStopLoading());
        }, 3500);
        dispatch(login(123,"Pedro"));
        //Llamar API para logearse 
        sucess();
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
export const startGoogleLogin = () => {
    return (dispatch) => {
        firebase
            .auth()
            .signInWithPopup(googleAuthProvider)
            .then(({ user }) => {
                dispatch(login(user.id, user.displayName));
            });
    };
};

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


