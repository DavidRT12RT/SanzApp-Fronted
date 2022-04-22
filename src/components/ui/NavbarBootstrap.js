import React from "react";
import { Link, NavLink } from "react-router-dom";
/*Link y Navlink son componentes 
 1.-Link es como un enlace normalito y se acompa�a con la etiqueta to
 es decir a donde ira y la diferencia de esto con un a normal es que 
 el a carga el dom completo y hace la petici�n al servidor otra vez
 2.-Switch componente que elige condicionalmente por la ruta que componente
 3.-El componente navbar al utilizar un componete o mas de link tiene que ir dentro del Router pero fuera del switch
 */

export const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-light fixed-top mb-5">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    {/* 
                    <img
                        src={require("../../assets/Login/img/logo.png")}
                        alt="pokemonLogo"
                        width="30"
                        height="30"
                    />
                    */
                    }   
                   Sanz Constructora 
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                    
                >
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavLink
                                aria-current="page"
                                to="/"
                                className={({ isActive }) =>
                                    "nav-link" + (isActive ? " active" : "")
                                }
                            >
                                Inicio
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                aria-current="page"
                                to="/acerca"
                                className={({ isActive }) =>
                                    "nav-link" + (isActive ? " active" : "")
                                }
                            >
                                Acerca de nosotros
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                aria-current="page"
                                to="/obras"
                                className={({ isActive }) =>
                                    "nav-link" + (isActive ? " active" : "")
                                }
                            >
                                Obras y clientes
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                aria-current="page"
                                to="/contacto"
                                className={({ isActive }) =>
                                    "nav-link" + (isActive ? " active" : "")
                                }
                            >
                                Contacto
                            </NavLink>
                        </li>
                    </ul>
                    <NavLink aria-current="page" to="/login" 
                        className={({isActive})=>
                            "btn btn-warning " + (isActive ? " active": "")
                        }>
                        Login
                   </NavLink>
                </div>
            </div>
        </nav>
    );
};
