//import { type } from "@testing-library/user-event/dist/type";
import { types } from "../types/types";

/*Actions para el reducer con el typo de actions 
para modificar el store*/


//ACTIONS
export const setError = (err) =>({
    type:types.uiSetError,
    payload:err
});

export const removeError = () => ({
    type:types.uiRemoveError
});

export const uistartLoading = () =>({
    type:types.uiStartLoading
});


export const uiStopLoading = () =>({
    type:types.uiStopLoading
});




