import {Link, NavLink, useNavigate} from "react-router-dom"
//import {AuthContext} from "../../../auth/authContext";

export const AplicationNavbar = () =>{
    //Hook for change the state of the user and navigate
    const navigate =useNavigate();

    //handleLogout
    const handleLogout=()=>{
        navigate('/',{replace:true});
    }


    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link to="/aplication/" className="navbar-brand">Pokemon Workflow</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className={({isActive})=>
                                "nav-link" + (isActive ? " active" : "")
                            } to="/aplication/" aria-current="page">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({isActive})=>
                                "nav-link" + (isActive ? " active" : "")
                            } to="/aplication/orders" aria-current="page">Orders</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({isActive})=>
                                "nav-link" + (isActive ? " active" : "")
                            } to="/aplication/products" aria-current="page">Products</NavLink></li>
                    </ul>
                    <span className="navbar-text">
                    </span>
                    <button className="btn btn-outline-warning mx-3" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </nav> 
    );
}
