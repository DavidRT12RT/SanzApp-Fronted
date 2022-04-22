import { Link } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import validator from 'validator';
//Hooks de react redux
import { useDispatch, useSelector } from "react-redux";
import { removeError, setError } from "../../actions/uiActions";
import { startRegister } from "../../actions/authActions";

export const RegisterScreen = () => {
    //Sacar información del state
    const state = useSelector( (state)=> state );
    const {msgError} = state.ui;
    console.log(msgError);


    console.log(state);

    //el dispatch le envia las acciones al reducer
    const distpach = useDispatch();
    //useForm
    const [formValues, handleInputChange] = useForm({
        name: "name",
        email: "example@gmail.com",
        password: "123456",
        password2: "123456",
    });

    const { name, email, password, password2 } = formValues;

    const handleRegister = (e) => {
        e.preventDefault();
        if(isFormValid()){
            //Disparar la acción
            distpach(startRegister(name,email,password)); 
        }
    };

    //Funcion para validar formulario
    const isFormValid = () =>{
        if(name.trim().length === 0){
            distpach(setError("Nombre es requerido!"));
            return false;
        }else if(!validator.isEmail(email)){
            distpach(setError("Email no es valido!"));
            return false;
        }else if(password !== password2 || password.length <5 ){
            distpach(setError("La contraseña NO es valida!"));
            return false;
        }
        distpach(removeError());  
        return true;
    }


    return (
        <>
            <h3 className="auth__title">Register</h3>
            <form onSubmit={handleRegister}>
                {
                    msgError && 
                    (<div className="auth__alert-error d-none">
                        {msgError} 
                    </div>)
                }
               
                <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    className="auth__input"
                    autoComplete="disabled"
                    value={name}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    className="auth__input"
                    autoComplete="disabled"
                    value={email}
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    className="auth__input"
                    value={password}
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    placeholder="Confirm password"
                    name="password2"
                    className="auth__input"
                    value={password2}
                    onChange={handleInputChange}
                />
                <button
                    type="submit"
                    className="btn btn-primary btn-block mb-5"
                >
                    Register
                </button>

                <Link to="/auth/login" className="link">
                    Alredy registered?
                </Link>
            </form>
        </>
    );
};
