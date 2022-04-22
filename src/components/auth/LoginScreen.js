import {Link, useNavigate} from "react-router-dom";

import {useForm} from "../../hooks/useForm";
import './Style.css';
//import "../../Styles/style.css";
import Swal from "sweetalert2";
import { Navbar } from "../ui/NavbarBootstrap";

//Note: You must use htmlfor instead of for in label tags when react is use 

export const LoginScreen = () => {

    const navigate = useNavigate();
   
    //Hook personalizado para el formulario
    const [values,handleInputChange] = useForm({
        email:'',
        password:''
    });

    //Destructurando los valores para el formulario

    const {email,password} = values;

    const handleLogin=(e)=>{
        e.preventDefault();
        //const correo = document.querySelector("#email").value;
        const correo = email;
        Swal.fire({
            position:"top-center",
            width:"50%",
            icon:"success",
            title:"Haz accedido correctamente!",
            showConfirmButton:false,
            timer:1500
        });
        //Look for lastPath in localStorage 
        const lastPath = localStorage.getItem('lastPath') || "/aplicacion";
        //replacing the history to avoid the user can go back in log page after login
        /*navigate(lastPath,{
            replace:true
        });
        */
       navigate("/aplicacion/");
    }
    

    return <>
        <Navbar/>
    (
    <div className="w-100 d-md-block container w-75 bg-primary rounded shadow margin-top">
        <div className="row align-items-lg-stretch">
            <div className="col bg d-none d-lg-block col-md-5 col-lg-5 col-xl-6 rounded">
            </div>
            <div className="col bg-white p-5 rounded-end">
                <div className="text-end">
                    <img src={require('./assets/logo.png')} width="100" alt="logo"/>
                </div>
                <h2 className="fw-bold text-center py-5">Bienvenido</h2>
                <form id="iniciarSesion" className="needs-validation" noValidate>
                    <div className="mb-4">
                        <label for="email" className="form-label">Correo Electronico</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={email}
                            onChange={handleInputChange}
                            id="email"  
                            placeholder="ejemplo@hotmail.com"
                            className="form-control" 
                            required/>

                        <div className="valid-feedback">Luce bien!</div>
                        <div className="invalid-feedback">Complete los datos</div>
                    </div>
                    <div className="mb-4">
                        <label for="password" className="form-label">Contraseña</label>

                        <input 
                            type="password" 
                            name="password" 
                            value={password}
                            onChange={handleInputChange}
                            id="password" 
                            placeholder="******"
                            className="form-control" 
                            required/>

                        <div className="valid-feedback">Luce bien!</div>
                        <div className="invalid-feedback">Complete los datos</div>
                    </div>
                    <div className="mb4 form-check">
                        <input type="checkbox" name="connected" className="form-check-input" id="" checked/>
                        <label for="connected" className="form-check-label">Permanecer conectado</label>
                    </div>
                    <div className="d-grid mt-5">
                        <button type="submit" onClick={handleLogin} className="btn btn-warning" id="btnEnviar">Login</button>
                    </div>
                    <span className="w-100 mt-5 d-flex justify-content-center">No tienes cuenta? </span>
                    <div className="d-flex justify-content-center px-5 w-auto">
                        <span className="mx-2"><Link to="#">Registrate</Link></span>
                        <span ><Link to="#">Recuperar password</Link></span>
                    </div>
                </form>
                
            </div>
        </div>
    </div> 
    );
    </>
};
