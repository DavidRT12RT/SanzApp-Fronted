import { Link } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import validator from 'validator';
export const RegisterScreen = () => {
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
            console.log("Formulario correcto!");
        }
    };

    //Funcion para validar formulario
    const isFormValid = () =>{
        if(name.trim().length === 0){
            console.log("Name is required!");
            return false;
        }else if(!validator.isEmail(email)){
            console.log("Email is not valid!");
            return false;
        }else if(password !== password2 || password.length <5 ){
            console.log("Password must be 6 characters and match");
            return false;
        }
           
        return true;
    }


    return (
        <>
            <h3 className="auth__title">Register</h3>
            <form onSubmit={handleRegister}>
                <div className="auth__alert-error d-none">
                    Hola mundo!
                </div>
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
