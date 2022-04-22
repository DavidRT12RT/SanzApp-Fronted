import {Route,Routes} from "react-router-dom"
import {LoginScreen} from "../components/auth/LoginScreen"
import {RegisterScreen} from "../components/auth/RegisterScreen"
import { Navbar } from "../components/ui/NavbarBootstrap"

export const AuthRouterV6=()=>{
    return (
        <Routes>
            <Route path="/login" element={<LoginScreen/>}/>
            <Route path="/register" element={<RegisterScreen/>}/>
            <Route path="*" />
        </Routes>
    )
}
