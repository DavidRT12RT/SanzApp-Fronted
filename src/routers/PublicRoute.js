import {Navigate} from "react-router-dom";

export const PublicRoute = ({children}) =>{
    //const user = localStorage.getItem('user');
    const user = true;
    return (user.logged) ? <Navigate to="/aplicacion"/> : children;
}
