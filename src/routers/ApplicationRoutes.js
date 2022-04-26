import { Routes, Route } from "react-router-dom";
import {Component404} from "../components/component404/Component404";
import { AplicationLandingPage } from "../components/application/AplicationLandingPage";
//Components
import { Games } from "../components/application/Games";
import {AplicationNavbar} from "../components/application/ui/AplicationNavbar";
import { EmpleadosScreen } from "../components/empleados/EmpleadosScreen";
import { ObrasScreen } from "../components/obras/ObrasScreen";

export const ApplicationRoutes = () => {
    return (
        <>
            <AplicationNavbar/> 
            <Routes>
                <Route path="/" element={<AplicationLandingPage />} />
                <Route path="/aplicacion" element={<AplicationLandingPage />} />
                <Route path="/inventario" element={<Games />} />
                <Route path="/obras" element={<ObrasScreen />} />
                <Route path="/calendario" element={<Games />} />
                <Route path="/camionetas" element={<Games />} />
                <Route path="/empleados" element={<EmpleadosScreen/>} />
                <Route path="/*" element={<Component404 />} />
            </Routes>
        </>
    );
};
