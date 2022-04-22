import { Provider } from "react-redux";

//import { AppRouter } from "./routers/AppRouter";
import {AppRouter} from "./routers/AppRouterV6";

import { store } from "./store/store";

export const SanzApp = () => {
    return (
        <Provider store={store}>
            <AppRouter />;
        </Provider>
    );
};


/*El provider es lo mismo que el userContext 
Es un high order component que sirve para darle 
información al resto de componentes*/
