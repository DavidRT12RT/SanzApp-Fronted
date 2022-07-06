import { message } from "antd";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Link, NavLink, useNavigate} from "react-router-dom"
import { startLogout } from "../../../actions/authActions";
import { eventLogout } from "../../../actions/eventsActions";
import { SocketContext } from "../../../context/SocketContext";
//import {AuthContext} from "../../../auth/authContext";

export const AlmacenNavbar = () =>{
    //Hook for change the state of the user and navigate
    const navigate = useNavigate();

    const { online } = useContext(SocketContext);

    let nombre = useSelector(state => state.auth.name);

    const dispatch = useDispatch();
    //handleLogout
    const handleLogout=()=>{
        dispatch(eventLogout());
        dispatch(startLogout());
        message.success("Token eliminado!");
        navigate('/login',{replace:true});
    }


    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
            <div className="container-fluid">
                <Link to="/almacen/" className="navbar-brand h6">
                    <img src={require("../assets/favicon.png")} width="40" height="40"/>
                    Sanz Ingenieria Integral 
                    </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav me-auto mb-lg-0">
                        
                        <li className="nav-item">
                            <NavLink className={({isActive})=>
                                "nav-link h6" + (isActive ? " active" : "")
                            } to="/almacen/" aria-current="page">Inicio</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={({isActive})=>
                                "nav-link h6" + (isActive ? " active" : "")
                            } to="/almacen/productos/" aria-current="page">Almacen</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={({isActive})=>
                                "nav-link h6" + (isActive ? " active" : "")
                            } to="/almacen/ingresar/" aria-current="page">Ingreso a almacen</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={({isActive})=>
                                "nav-link h6" + (isActive ? " active" : "")
                            } to="/almacen/retirar/" aria-current="page">Retirar de almacen</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={({isActive})=>
                                "nav-link h6" + (isActive ? " active" : "")
                            } to="/almacen/entradas/" aria-current="page">Registros de entradas</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={({isActive})=>
                                "nav-link h6" + (isActive ? " active" : "")
                            } to="/almacen/salidas/" aria-current="page">Registro de salidas</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={({isActive})=>
                                "nav-link h6" + (isActive ? " active" : "")
                            } to="/almacen/productos/inventario/" aria-current="page">Realizar inventario</NavLink>
                        </li>

                    </ul>

                    {
                        online
                        ? <span className="navbar-text text-success h6">Servidor: Online</span>
                        : <span className="navbar-text text-danger h6">Servidor: Offline</span>
                    }

                    <span className="navbar-text ms-2 h6">
                            {nombre}
                    </span>
                    <button className="btn btn-outline-warning mx-lg-3 mt-3 mt-lg-0" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span> Salir</span>
                    </button>
                </div>
            </div>
        </nav> 
    );
}
