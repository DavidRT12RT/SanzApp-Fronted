import {Route} from "react-router-dom"
import {LoginScreen} from "../components/auth/LoginScreen"
import {RegisterScreen} from "../components/auth/RegisterScreen"

export const AuthRouterV6=()=>{
    return (
        <Routes>
            <Route path="/login" element={<LoginScreen/>}/>
            <Route path="/register" element={<RegisterScreen/>}/>
            <Route path="*" element={<LoginScreen/>}/>
            <Route paht="*" element={<Navigate replace to="/auth/login"/>}/>
        </Routes>
    )
}
