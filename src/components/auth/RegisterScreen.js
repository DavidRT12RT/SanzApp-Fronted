//import {useNavigate} from "react-router-dom";
import {useForm} from "../../hooks/useForm";
import './Style.css';
//import "../../Styles/style.css";
import { Navbar } from "../ui/NavbarBootstrap";
import { useDispatch, useSelector } from "react-redux";
import {startRegister } from "../../actions/authActions";
import { AplicationNavbar } from "../application/ui/AplicationNavbar";

//Note: You must use htmlfor instead of for in label tags when react is use 
    
   
    
export const RegisterScreen = () => {

    //Hook personalizado para el formulario
    const [formValues,handleInputChange] = useForm({
        correo:'examle@gmail.com',
        password:'123456',
        nombre:"Carlos Sanchez",
        telefono:"9999999999",
        NSS:"72795608040",
        RFC:"MELM8305281H0",
        CURP:"SASO750909HDFNNS05",
        rol:"USER_ROLE"

    });

    const {correo,password,nombre,telefono,NSS,RFC,CURP,rol} = formValues;

    const dispatch = useDispatch();
    //const navigate = useNavigate();
    //State
    const loading = useSelector((state)=> state.ui.loading);

    //const state = useSelector((state)=> state);
    
       
    const handleLogin=(e)=>{
        e.preventDefault();
        dispatch(startRegister(correo,password,nombre,telefono,NSS,RFC,CURP,rol));
    }
    

    return <>
    <div className="w-100 d-md-block container w-75 bg-primary rounded shadow centrar" style={{height:"100%"}}>
        <div className="row align-items-lg-stretch login">
            <div className="col bgRegistro d-none d-lg-block col-md-5 col-lg-5 col-xl-6 rounded" style={{height:"100%"}}>
            </div>
            <div className="col bg-white p-5 rounded-end"  style={{height:"100%"}}>
                <div className="text-end">
                    <img src={require('./assets/logo.png')} width="100" alt="logo"/>
                </div>
                <h2 className="fw-bold text-center py-5">Registro usuario</h2>
                <form id="iniciarSesion" className="needs-validation" noValidate onSubmit={handleLogin}>
                    {/*Datos usuarios para registro*/}
                    <div className="mb-4">
                        <label className="form-label">Nombre</label>
                        <input 
                            type="text" 
                            name="nombre" 
                            value={nombre}
                            onChange={handleInputChange}
                            placeholder="nombre usuario"
                            className="form-control" 
                            required/>

                    </div>
                    <div className="mb-4">
                        <label className="form-label">Correo Electronico</label>
                        <input 
                            type="correo" 
                            name="correo" 
                            value={correo}
                            onChange={handleInputChange}
                            autoComplete = "disabled"
                            className="form-control" 
                            required/>

                    </div>

                    <div className="mb-4">
                        <label className="form-label">Contraseña</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={password}
                            onChange={handleInputChange}
                            placeholder="******"
                            className="form-control" 
                            required/>

                    </div>

                     <div className="mb-4">
                        <label className="form-label">Telefono</label>
                        <input 
                            type="text" 
                            name="telefono" 
                            value={telefono}
                            onChange={handleInputChange}
                            placeholder="9999999999"
                            className="form-control" 
                            required/>

                    </div>

                    <div className="mb-4">
                        <label className="form-label">Numero de seguro social (NSS)</label>
                        <input 
                            type="text" 
                            name="NSS" 
                            value={NSS}
                            onChange={handleInputChange}
                            placeholder="72795608040"
                            className="form-control" 
                            required/>

                    </div>

                    <div className="mb-4">

                        <label className="form-label">RFC</label>
                        <input 
                            type="text" 
                            name="RFC" 
                            value={RFC}
                            onChange={handleInputChange}
                            placeholder="RFC AQUI"
                            className="form-control" 
                            required/>

                    </div>

                    <div className="mb-4">

                        <label className="form-label">CURP</label>
                        <input 
                            type="text" 
                            name="CURP" 
                            value={CURP}
                            onChange={handleInputChange}
                            placeholder="CURP AQUI"
                            className="form-control" 
                            required/>

                    </div>

                     <div className="mb-4">

                        <label className="form-label">Rol del usuario</label>
                        <input 
                            type="text" 
                            name="rol" 
                            value={rol}
                            onChange={handleInputChange}
                            placeholder="USER_ROLE"
                            className="form-control" 
                            required/>

                    </div>

                    <div className="d-grid mt-5">
                        <button type="submit" className="btn btn-warning" id="btnEnviar" disabled={loading}>Registrar usuario</button>
                    </div>
                    {/*
                    <span className="w-100 mt-5 d-flex justify-content-center">¿Ya tienes una cuenta?</span>
                    <div className="d-flex justify-content-center px-5 w-auto">
                        <span className="mx-2"><Link to="/login">Login</Link></span>
                    </div>
                    */}
                </form>
                
            </div>
        </div>
    </div> 
    </>
}
