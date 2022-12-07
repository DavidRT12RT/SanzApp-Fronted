//import "../../Styles/style.css";
import { useDispatch, useSelector } from "react-redux";
import { startLogincorreoPassword } from "../../../actions/authActions";
import { useForm } from "../../../hooks/useForm";

//Note: You must use htmlfor instead of for in label tags when react is use 

//Estilos CSS
import './Style.css';
    
   
    
export const LoginScreen = () => {

    //Hook personalizado para el formulario
    const [formValues,handleInputChange] = useForm({
        correo:'examle@gmail.com',
        password:'123456'
    });

    const {correo,password} = formValues;

    const dispatch = useDispatch();
    //State
    const loading = useSelector((state)=> state.ui.loading);

    const state = useSelector((state)=> state);
    
       
    const handleLogin=(e)=>{
        e.preventDefault();
        dispatch(startLogincorreoPassword(correo,password));
    }
    

    return <>
    <div className="w-100 d-md-block container w-75 bg-primary rounded shadow centrar" style={{height:"100%"}}>
        <div className="row align-items-center login">
            <div className="col bg d-none d-lg-block col-md-5 col-lg-5 col-xl-6 rounded" style={{height:"100%"}}>
            </div>
            <div className="col bg-white p-5 rounded-end" style={{height:"100%"}}>
                <div className="text-end">
                    <img src={require('./assets/logo.png')} width="100" alt="logo"/>
                </div>
                <h2 className="fw-bold text-center py-5">Bienvenido</h2>
                <form id="iniciarSesion" className="needs-validation" noValidate onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="form-label">Correo Electronico</label>
                        <input 
                            type="correo" 
                            name="correo" 
                            value={correo}
                            onChange={handleInputChange}
                            autoComplete = "disabled"
                            id="correo"  
                            className="form-control" 
                            required/>

                        <div className="valid-feedback">Luce bien!</div>
                        <div className="invalid-feedback">Complete los datos</div>
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Contraseña</label>

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
                    <div className="d-grid mt-5">
                        <button type="submit" className="btn btn-warning" id="btnEnviar" disabled={loading}>Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div> 
    </>
};
