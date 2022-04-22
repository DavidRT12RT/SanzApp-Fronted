import { Link } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { useDispatch } from "react-redux";
import { startGoogleLogin, startLoginEmailPassword } from "../../actions/auth";

export const LoginScreen = () => {
    //Hook para hacer un distpach
    const distpach = useDispatch();

    //Custom hook for forms
    const [formValues, handleInputChange] = useForm({
        email: "example@gmail.com",
        password: "123456",
    });

    const { email, password } = formValues;

    const handleLogin = (e) => {
        e.preventDefault();
        distpach(startLoginEmailPassword(email, password));
    };

    const handleGoogleLogin = (e) => {
        e.preventDefault();
        distpach(startGoogleLogin());
    };

    return (
        <>
            <h3 className="auth__title">Login</h3>
            <form onSubmit={handleLogin}>
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
                <button type="submit" className="btn btn-primary btn-block">
                    Login
                </button>
                <hr />
                <div className="auth__social-networks">
                    <p>login with social networks</p>
                    <div className="google-btn" onClick={handleGoogleLogin}>
                        <div className="google-icon-wrapper">
                            <img
                                className="google-icon"
                                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                                alt="google button"
                            />
                        </div>
                        <p className="btn-text">
                            <b>Sign in with google</b>
                        </p>
                    </div>
                </div>
                <Link to="/auth/register" className="link">
                    Create new account
                </Link>
            </form>
        </>
    );
};
