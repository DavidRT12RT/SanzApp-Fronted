import { types } from "../types/types";

export const chatReducer = (state,action) => {

    switch (action.type) {

        case types.usuariosCargados:
            return {
                ...state,
                usuarios:[...action.payload]
            };

        case types.activarChat:
            if(state.chatActivo === action.payload) return state;

            return {
                ...state,
                chatActivo:action.payload,
                mensajes:[]
            };
        
        case types.nuevoMensaje:
            //Si el chat NO esta activo no lo agregamos al arreglo de mensajes
            if(state.chatActivo === action.payload.de ||
                state.chatActivo === action.payload.para ){
                return {
                    ...state,
                    nuevoMensaje:action.payload,
                    mensajes:[...state.mensajes,action.payload]
                }
            }else{
                return state;
            }
        
        case types.cargarMensajes:

            return {
                ...state,
                mensajes:action.payload
            }
        
        case types.borrarMensajes:
            return {
                uid:"",
                chatActivo:null,
                usuarios:[],
                mensajes:[]
            };

        default:
            return state;

    }

}