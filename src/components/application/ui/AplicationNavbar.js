import { useDispatch, useSelector } from "react-redux";
import {Link, NavLink, useNavigate} from "react-router-dom"
import { startLogout } from "../../../actions/authActions";
//import {AuthContext} from "../../../auth/authContext";

export const AplicationNavbar = () =>{
    //Hook for change the state of the user and navigate
    const navigate = useNavigate();


    let nombre = useSelector(state => state.auth.name);

    const dispatch = useDispatch();
    //handleLogout
    const handleLogout=()=>{
        dispatch(startLogout());
        navigate('/',{replace:true});
    }


    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link to="/aplicacion/" className="navbar-brand">Sanz espacio de trabajo</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        <li className="nav-item">
                            <NavLink className={({isActive})=>
                                "nav-link" + (isActive ? " active" : "")
                            } to="/aplicacion/" aria-current="page">Inicio</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={({isActive})=>
                                "nav-link" + (isActive ? " active" : "")
                            } to="/aplicacion/inventario" aria-current="page">Inventario almacen</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={({isActive})=>
                                "nav-link" + (isActive ? " active" : "")
                            } to="/aplicacion/obras" aria-current="page">Obras</NavLink>
                        </li>
                         
                         <li className="nav-item">
                            <NavLink className={({isActive})=>
                                "nav-link" + (isActive ? " active" : "")
                            } to="/aplicacion/empleados" aria-current="page">Empleados</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={({isActive})=>
                                "nav-link" + (isActive ? " active" : "")
                            } to="/aplicacion/calendario" aria-current="page">Calendario</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className={({isActive})=>
                                "nav-link" + (isActive ? " active" : "")
                            } to="/aplicacion/camionetas" aria-current="page">Control de camionetas</NavLink>
                        </li>

                       

                    </ul>
                    <span className="navbar-text">
                            {nombre}
                    </span>
                    <button className="btn btn-outline-warning mx-3" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span> Salir</span>
                    </button>
                </div>
            </div>
        </nav> 
    );
}
