import {Navigate} from "react-router-dom";

export const PublicRoute = ({children}) =>{
    const user = localStorage.getItem('user');
    return (user.logged) ? <Navigate to="/aplicacion"/> : children;
}
