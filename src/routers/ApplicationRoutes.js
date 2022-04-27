import { Routes, Route } from "react-router-dom";
import {Component404} from "../components/component404/Component404";
import { AplicationLandingPage } from "../components/application/AplicationLandingPage";
//Components
import { Games } from "../components/application/Games";
import {AplicationNavbar} from "../components/application/ui/AplicationNavbar";
import { EmpleadosScreen } from "../components/empleados/EmpleadosScreen";
import { ObrasScreen } from "../components/obras/ObrasScreen";
import { EmpleadoScreen } from "../components/empleados/EmpleadoScreen";
import { ObraScreen } from "../components/obras/ObraScreen";
import { CalendarScreen } from "../components/calendar/CalendarScreen";

export const ApplicationRoutes = () => {
    return (
        <>
            <AplicationNavbar/> 
            <Routes>
                <Route path="/" element={<AplicationLandingPage />} />
                <Route path="/aplicacion" element={<AplicationLandingPage />} />
                <Route path="/inventario" element={<Games />} />
                <Route path="/obras" element={<ObrasScreen />} />
                <Route path="/obra/:obraId" element={<ObraScreen />} />
                <Route path="/calendario" element={<CalendarScreen/>} />
                <Route path="/camionetas" element={<Games />} />
                <Route path="/empleados" element={<EmpleadosScreen/>} />
                <Route path="/empleado/:empleadoId" element={<EmpleadoScreen/>} />
                <Route path="/*" element={<Component404 />} />
            </Routes>
        </>
    );
};
