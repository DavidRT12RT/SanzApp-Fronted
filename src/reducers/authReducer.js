import { types } from "../types/types";



export const authReducer = (state = {}, action) => {
    //Reducer de la autenticación
    switch (action.type) {
        case types.login:
            return {
                //Informacion que viene de la API
                uid: action.payload.uid,
                name: action.payload.displayName,
            };
        case types.logout:
            return {};
        default:
            return state;
    }
};
