import { Routes, Route } from "react-router-dom";
import {Component404} from "../components/component404/Component404";
import { AplicationLandingPage } from "../components/application/AplicationLandingPage";
//Components
import {AplicationNavbar} from "../components/application/ui/AplicationNavbar";
import { EmpleadosScreen } from "../components/empleados/EmpleadosScreen";
import { ObrasScreen } from "../components/obras/ObrasScreen";
import { EmpleadoScreen } from "../components/empleados/EmpleadoScreen";
import { ObraScreen } from "../components/obras/ObraScreen";
import { CalendarScreen } from "../components/calendar/CalendarScreen";
import { MapasApp } from "../components/Mapas/MapasApp";
import { ProductosScreen } from "../components/productos/ProductosScreen";
import {ProductoScreen} from "../components/productos/ProductoScreen";
import { RegistrarProducto } from "../components/productos/RegistrarProducto";

export const ApplicationRoutes = () => {
    return (
        <>
            <AplicationNavbar/> 
            <Routes>
                <Route path="/" element={<AplicationLandingPage />} />
                <Route path="/aplicacion" element={<AplicationLandingPage />} />
                <Route path="/almacen" element={<ProductosScreen />} />
                <Route path="/almacen/registro" element={<RegistrarProducto/>} />
                <Route path="/almacen/:productoId" element={<ProductoScreen />} />
                <Route path="/obras" element={<ObrasScreen />} />
                <Route path="/obra/:obraId" element={<ObraScreen />} />
                <Route path="/calendario" element={<CalendarScreen/>} />
                <Route path="/camionetas" element={<MapasApp/>} />
                <Route path="/empleados" element={<EmpleadosScreen/>} />
                <Route path="/empleado/:empleadoId" element={<EmpleadoScreen/>} />
                <Route path="/*" element={<Component404 />} />
            </Routes>
        </>
    );
};
