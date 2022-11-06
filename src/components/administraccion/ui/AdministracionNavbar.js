import { message } from "antd";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom"
import { startLogout } from "../../../actions/authActions";
import { eventLogout } from "../../../actions/eventsActions";
import { SocketContext } from "../../../context/SocketContext";
//import {AuthContext} from "../../../auth/authContext";
import "./style.css";


export const AdministracionNavbar = () =>{
    //Hook for change the state of the user and navigate
    const navigate = useNavigate();
    const { online } = useContext(SocketContext);
    const { pathname } = useLocation();
    let { uid,nombre,rol} = useSelector(state => state.auth);
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
            <div className="container-fluid menuBarra">
                <Link to="/almacen/" className="navbar-brand h6">
                    <img src={require("../assets/imgs/favicon.png")} width="40" height="40"/>
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
                            } to="/administracion/" aria-current="page">Inicio</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={({isActive})=>
                                "nav-link h6" + (isActive ? " active" : "")
                            } to="/administracion/usuarios/" aria-current="page">Usuarios registrados</NavLink>
                        </li>

                    </ul>

                    {
                        online
                        ? <span className="navbar-text text-success h6">Servidor: Online</span>
                        : <span className="navbar-text text-danger h6">Servidor: Offline</span>
                    }
                    <div className="flex-shrink-0 dropdown ms-lg-3">
                        <a href="#" className="d-block text-white text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src={`${process.env.REACT_APP_BACKEND_URL}/api/uploads/usuarios/${uid}`} alt="mdo" width="40" height="40" className="rounded-circle" style={{"objectFit":"cover"}}/>
                        </a>
                        <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                            <li><a className="dropdown-item" href="#">Perfil</a></li>
                            <li><Link to="/aplicacion/"><a class="dropdown-item" href="#">Ir a la aplicacion</a></Link></li>
                            <li><Link to="/almacen/"><a class="dropdown-item" href="#">Ir a almacen</a></Link></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><a className="dropdown-item" href="#" onClick={handleLogout}>Cerrar sesion</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav> 
    );
}
