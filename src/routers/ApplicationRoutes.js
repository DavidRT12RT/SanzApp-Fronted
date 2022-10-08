import { Routes, Route, useNavigate } from "react-router-dom";
import {Component404} from "../components/component404/Component404";
import { notification } from 'antd';
//Components
import { RegisterScreen } from "../components/auth/RegisterScreen";
import {AplicationNavbar} from "../components/application/ui/AplicationNavbar";
import { EmpleadosScreen } from "../components/empleados/EmpleadosScreen";
import { ObrasScreen } from "../components/obras/ObrasScreen";
import { EmpleadoScreen } from "../components/empleados/EmpleadoScreen";
import { ObraScreen } from "../components/obras/ObraScreen";
import { CalendarScreen } from "../components/calendar/CalendarScreen";
import { MapasApp } from "../components/Mapas/MapasApp";
import {ProductoScreen} from "../components/productos/ProductoScreen";
import { PrivateRoutePorRole } from "./PrivateRoutePorRole";
import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { RegistrarObra } from "../components/obras/RegistrarObra";
import { EditorObra } from "../components/obras/EditorObra";
import { GestionCamionetas } from "../components/camionetas/GestionCamionetas";
import { CamionetaScreen } from "../components/camionetas/CamionetaScreen";
import { RegistrarCamioneta } from "../components/camionetas/RegistrarCamioneta";
import { GestionOficina } from "../components/oficina/GestionOficina";
import { SeccionNoticias } from "../components/noticias/SeccionNoticias";
import { ProductosScreen } from "../components/almacen/components/productos/ProductosScreen";

import { Empresas } from "../components/empresas/Empresas";
import { RegistrarEmpresa } from "../components/empresas/components/RegistrarEmpresa";
import { EmpresaScreen } from "../components/empresas/components/EmpresaScreen";
import { SucursalScreen } from "../components/empresas/components/SucursalScreen";
import { MySpace } from "../components/mi-espacio/components/MySpace";

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
                <Route path="/" element={<SeccionNoticias />} />
                <Route path="/almacen/" element={<ProductosScreen />} />
                <Route path="/almacen/:productoId/" element={<ProductoScreen />} />

                <Route path="/empresas/" element={<Empresas/>}/>
                <Route path="/empresas/:empresaId/" element={<EmpresaScreen/>}/>
                <Route path="/empresas/registrar/" element={<RegistrarEmpresa/>}/>
                <Route path="/empresas/:empresaId/sucursales/:sucursalId/" element={<SucursalScreen/>}/>

                <Route path="/obras/" element={<ObrasScreen />} />
                <Route path="/obras/registrar/" element={
                    <PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","INGE_ROLE"]}>
                        <RegistrarObra/>
                    </PrivateRoutePorRole>
                }/>

                <Route path="/obras/editor/:obraId/" element={
                    <PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","INGE_ROLE"]}>
                        <EditorObra/>
                    </PrivateRoutePorRole>
                }/>

                <Route path="/obras/:obraId/" element={<ObraScreen />} />
                <Route path="/calendario/" element={<CalendarScreen/>} />
                <Route path="/oficina/gestion/" element={
                    <PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","ADMINISTRADOR_ROLE"]}>
                        <GestionOficina/>
                    </PrivateRoutePorRole>
                }/>
                <Route path="/camionetas/registro/" element={
                    <PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","ADMINISTRADOR_ROLE"]}>
                        <RegistrarCamioneta/>
                    </PrivateRoutePorRole>
                }/>
                <Route path="/camionetas/localizacion/" element={<MapasApp/>} />
                <Route path="/camionetas/gestion/" element={
                    <PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","ADMINISTRADOR_ROLE"]}>
                        <GestionCamionetas/>
                    </PrivateRoutePorRole>
                }/>
                <Route path="/camionetas/gestion/:camionetaId/" element={
                    <PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","ADMINISTRADOR_ROLE"]}>
                        <CamionetaScreen/>
                    </PrivateRoutePorRole>
                }/>
                <Route path="/registro/" element={
                    <PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","ADMINISTRADOR_ROLE"]}>
                        <RegisterScreen/>
                    </PrivateRoutePorRole>
                }/>
                <Route path="/empleados/" element={
                    <PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","ADMINISTRADOR_ROLE"]}>
                        <EmpleadosScreen/>
                    </PrivateRoutePorRole>
                }/>
                <Route path="/empleados/:empleadoId/" element={
                    <PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","ADMINISTRADOR_ROLE"]}>
                        <EmpleadoScreen/>
                    </PrivateRoutePorRole>
                } />
				<Route path="/mi-espacio/" element={
                    <MySpace/>
                }/>

                <Route path="/*" element={<Component404 />} />
            </Routes>
        </>
    );
};
