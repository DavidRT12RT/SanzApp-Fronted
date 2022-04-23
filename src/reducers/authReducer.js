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
                checking:false,
                ...action.payload
            };
        case types.logout:
            return {};
        default:
            return state;
    }
};
