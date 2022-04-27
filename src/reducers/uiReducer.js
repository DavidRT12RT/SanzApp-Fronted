import {types} from "../types/types";

const initialState = {
    modalOpen:false,
    loading:false,
    msgError:null
};

export const uiReducer = (state = initialState, action) =>{

    switch (action.type) {
        case types.uiOpenModal:
            return {
                ...state,
                modalOpen:true 
            }

        case types.uiCloseModal:
            return {
                ...state,
                modalOpen:false
            }

        case types.uiSetError:
            return {
                ...state,
                msgError:action.payload
            }

        case types.uiUnsetError:
            return {
                ...state,
                msgError:null
            }

        case types.uiStartLoading:
            return {
                ...state,
                loading:true
            }

        case types.uiStopLoading:
            return {
                ...state,
                loading:false
            }
        default:
            return state;
    }

}