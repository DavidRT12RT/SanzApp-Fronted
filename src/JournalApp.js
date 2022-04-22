import { Provider } from "react-redux";

import { AppRouter } from "./routers/AppRouter";
import { store } from "./store/store";

export const JournalApp = () => {
    return (
        <Provider store={store}>
            <AppRouter />;
        </Provider>
    );
};


/*El provider es lo mismo que el userContext 
Es un high order component que sirve para darle 
información al resto de componentes*/
