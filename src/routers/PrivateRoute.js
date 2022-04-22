import { useLocation } from "react-router-dom"
import {Navigate} from "react-router-dom";


export const PrivateRoute = ({children}) =>{
    const {pathname,search} = useLocation();
    localStorage.setItem('lastPath',pathname+search);
    const user = {
        logged:false
    };
    return (user.logged) ? children :<Navigate to="/auth/login"/>;
}