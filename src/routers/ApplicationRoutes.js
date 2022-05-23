import { Routes, Route, useNavigate } from "react-router-dom";
import {Component404} from "../components/component404/Component404";
import { AplicationLandingPage } from "../components/application/AplicationLandingPage";
import { notification } from 'antd';
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
import { PrivateRoutePorRole } from "./PrivateRoutePorRole";
import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { RegistrarObra } from "../components/obras/RegistrarObra";
import { EditorObra } from "../components/obras/EditorObra";

export const ApplicationRoutes = () => {

   const { socket } = useContext(SocketContext);
   const navigate = useNavigate();
   const handleClick = (_id,key) =>{
        notification.close(key);    
        return navigate(`/aplicacion/almacen/${_id}`);
    }

    const openNotification = (topRight,_id,nombre,message = "") => {
        const key = `open${Date.now()}`;
        const btn = (
            <button className='btn btn-primary' onClick={()=>handleClick(_id,key)}>Mas detalles sobre el producto</button>
        );
        notification.open({
            message: "Notificación de almacen",
            description:
                `${nombre} ${message}`,
            btn,
            key,
        });
    };

   //Escuchando nuevos productos
    useEffect(()=>{
        socket.on("producto-nuevo",(producto)=>{
            openNotification("topRight",producto._id,producto.nombre,"Se ha agregado al almacen!");
        });
    },[socket]);
 
    //Escuchar cuando el producto se actualiza 
    useEffect(() => {
      socket.on("producto-actualizado",(producto)=>{
          openNotification("topRight",producto._id,producto.nombre,"Se ha actualizado en el almacen");
      }) 
    }, [socket]);

    return (
        <>
            <AplicationNavbar/> 
            <Routes>
                <Route path="/" element={<AplicationLandingPage />} />
                <Route path="/aplicacion" element={<AplicationLandingPage />} />
                <Route path="/almacen" element={<ProductosScreen />} />
                <Route path="/almacen/registro" element={
                    <PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","ALMACEN_ENCARGADO_ROLE"]}>
                            <RegistrarProducto/>
                    </PrivateRoutePorRole>
                } />
                <Route path="/almacen/:productoId" element={<ProductoScreen />} />
                <Route path="/obras" element={<ObrasScreen />} />
                <Route path="/obras/registro" element={
                    <PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","INGENIERO_ROLE"]}>
                        <RegistrarObra/>
                    </PrivateRoutePorRole>
                }/>
                <Route path="/obra/editor/:obraId" element={
                    <PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","INGENIERO_ROLE"]}>
                        <EditorObra/>
                    </PrivateRoutePorRole>
                }/>

                <Route path="/obras/:obraId" element={<ObraScreen />} />
                <Route path="/calendario" element={<CalendarScreen/>} />
                <Route path="/camionetas" element={<MapasApp/>} />
                <Route path="/empleados" element={<EmpleadosScreen/>} />
                <Route path="/empleado/:empleadoId" element={<EmpleadoScreen/>} />
                <Route path="/*" element={<Component404 />} />
            </Routes>
        </>
    );
};
