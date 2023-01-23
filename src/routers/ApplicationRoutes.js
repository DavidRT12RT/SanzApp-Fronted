import { Routes, Route, useNavigate } from "react-router-dom";
import { notification } from "antd";

//Components
import { AplicationNavbar } from "../components/application/ui/AplicationNavbar";
import { PrivateRoutePorRole } from "./PrivateRoutePorRole";
import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";

import Footer from "../components/componentesGenerales/Footer";
import { SeccionNoticias } from "../components/componentesGenerales/noticias/SeccionNoticias";
import { Empresas } from "../components/application/components/empresass/EmpresasScreen/Empresas";
import { EmpresaScreen } from "../components/application/components/empresas/components/EmpresaScreen";
import { RegistrarEmpresa } from "../components/application/components/empresas/components/RegistrarEmpresa";
import { SucursalScreen } from "../components/application/components/empresas/components/SucursalScreen";
import { RegistrarObra } from "../components/application/components/obras/RegistrarObra";
import Obras from "../components/application/components/obrass/ObrasScreen/Obras";
import { EditorObra } from "../components/application/components/obras/EditorObra";
import { ObrasScreen } from "../components/application/components/obras/ObrasScreen";
import { Component404 } from "../components/componentesGenerales/component404/Component404";
import { CalendarScreen } from "../components/componentesGenerales/calendar/CalendarScreen";
import { MySpace } from "../components/componentesGenerales/mi-espacio/components/MySpace";

import { ProductosScreen } from "../components/almacen/components/productosAlmacen/ProductosScreen";
import { ProductoScreen } from "../components/almacen/components/productos/ProductoScreen";

export const ApplicationRoutes = () => {
    const { socket } = useContext(SocketContext);
    const navigate = useNavigate();

    const handleClick = (_id, key) => {
        notification.close(key);
        return navigate(`/aplicacion/almacen/${_id}`);
    };

    const openNotification = (topRight, _id, nombre, message = "") => {
        const key = `open${Date.now()}`;
        const btn = (
            <button
                className="btn btn-primary"
                onClick={() => handleClick(_id, key)}
            >
                Mas detalles sobre el producto
            </button>
        );
        notification.open({
            message: "Notificación de almacen",
            description: `${nombre} ${message}`,
            btn,
            key,
        });
    };

    //Escuchando nuevos productos
    useEffect(() => {
        socket?.on("producto-nuevo", (producto) => {
            openNotification(
                "topRight",
                producto._id,
                producto.nombre,
                "Se ha agregado al almacen!"
            );
        });
    }, [socket]);

    //Escuchar cuando el producto se actualiza
    useEffect(() => {
        socket?.on("producto-actualizado", (producto) => {
            openNotification(
                "topRight",
                producto._id,
                producto.nombre,
                "Se ha actualizado en el almacen"
            );
        });
    }, [socket]);

    return (
        <>
            <AplicationNavbar />
            <Routes>
                <Route path="/" element={<SeccionNoticias />} />

                <Route path="/almacen/" element={<ProductosScreen />} />
                {/* <Route path="/almacen/:productoId/" element={<ProductoScreen />} /> */}
                <Route
                    path="/almacen/:productoId/"
                    element={<ProductoScreen />}
                />

                <Route path="/empresas/" element={<Empresas />} />
                <Route
                    path="/empresas/:empresaId/"
                    element={<EmpresaScreen />}
                />
                <Route
                    path="/empresas/registrar/"
                    element={<RegistrarEmpresa />}
                />
                <Route
                    path="/empresas/:empresaId/sucursales/:sucursalId/"
                    element={<SucursalScreen />}
                />

                <Route path="/obras/" element={<Obras />} />
                <Route
                    path="/obras/registrar/"
                    element={
                        <PrivateRoutePorRole
                            rolRequerido={["ADMIN_ROLE", "INGE_ROLE"]}
                        >
                            <RegistrarObra />
                        </PrivateRoutePorRole>
                    }
                />

                <Route
                    path="/obras/editor/:obraId/"
                    element={
                        <PrivateRoutePorRole
                            rolRequerido={["ADMIN_ROLE", "INGE_ROLE"]}
                        >
                            <EditorObra />
                        </PrivateRoutePorRole>
                    }
                />

                <Route path="/obras/:obraId/" element={<ObrasScreen />} />
                <Route path="/calendario/" element={<CalendarScreen />} />

                <Route path="/mi-espacio/" element={<MySpace />} />

                <Route path="/*" element={<Component404 />} />
            </Routes>
            <Footer />
        </>
    );
};
