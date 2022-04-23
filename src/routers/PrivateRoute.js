import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom"
import {Navigate} from "react-router-dom";


export const PrivateRoute = ({children}) =>{
    const {pathname,search} = useLocation();
    localStorage.setItem('lastPath',pathname+search);
    const state = useSelector((state)=>state);
    const user = {
        logged:true
    };
    return (user.logged) ? children :<Navigate to="/login"/>;
}