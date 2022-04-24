import { types } from "../types/types";

const initialState = {
    checking : true,
};

export const authReducer = (state = initialState, action) => {
    //Reducer de la autenticación
    switch (action.type) {
        case types.login:
            return {
                //Informacion que viene de la API
                ...state,
                ...action.payload,
                checking:false
            };

        case types.authCheckingFinish:
            return {
                ...state,
                checking:false
            }

        case types.logout:
            return {
                checking:false
            };

        default:
            return state;
    }
};

