import {Route, Routes} from "react-router-dom"
import { LandingPage } from "../components/landingPage/LandingPage";
import { About } from "../components/aboutUs/About";
import { Contact } from "../components/contact/Contact";
import {LoginScreen} from "../components/auth/LoginScreen";
import { Component404 } from "../components/component404/Component404";
import {Navbar} from "../components/ui/NavbarBootstrap";
import {Features} from "../components/features/Features";
import {PublicRoute} from "./PublicRoute";
import {AuthRouterV6} from "./AuthRouterV6"

export const ComunRoutes = () =>{
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/features" element={<Features/>} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth/*" element={<AuthRouterV6/>}/>
                <Route path="/*" element={<Component404 />} />
        </Routes>
        </>
    )
}