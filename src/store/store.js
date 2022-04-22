import thunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";

import { authReducer } from "../reducers/authReducer";
import { uiReducer } from "../reducers/uiReducer";

const composeEnhancers =
    (typeof window !== "undefined" &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

/* Especicando un arreglo de reducers el cual si en el
 * dia de ma�ana tenemos que establecer uno nuevo no tendremos
 * que refactorizar para poder agregar mas acciones*/


//Es alguna documentaciones es llamada como rootReducer
const reducers = combineReducers({
    auth: authReducer,
    ui : uiReducer
});

export const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(thunk))
);
