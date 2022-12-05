import { Routes, Route, useNavigate } from "react-router-dom";
import {Component404} from "../components/component404/Component404";
import { notification } from 'antd';
//Components
import {AplicationNavbar} from "../components/application/ui/AplicationNavbar";
import { ObraScreen } from "../components/obras/ObraScreen";
import { CalendarScreen } from "../components/calendar/CalendarScreen";
import {ProductoScreen} from "../components/productos/ProductoScreen";
import { PrivateRoutePorRole } from "./PrivateRoutePorRole";
import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { RegistrarObra } from "../components/obras/RegistrarObra";
import { EditorObra } from "../components/obras/EditorObra";

import { RegistrarEmpresa } from "../components/empresas/components/RegistrarEmpresa";
import { SucursalScreen } from "../components/empresas/components/SucursalScreen";
import { MySpace } from "../components/mi-espacio/components/MySpace";
import { ProductosScreen } from "../components/almacen/components/productosAlmacen/ProductosScreen";
import Footer from "../components/Footer";
import { Empresas } from "../components/empresass/EmpresasScreen/Empresas";
import Obras from "../components/obrass/ObrasScreen/Obras";
import { EmpresaScreen } from "../components/empresas/components/EmpresaScreen";
import { SeccionNoticias } from "../components/noticias/SeccionNoticias";

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

                <Route path="/obras/" element={<Obras/>} />
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

				<Route path="/mi-espacio/" element={
                    <MySpace/>
                }/>

                <Route path="/*" element={<Component404 />} />
            </Routes>
            <Footer/>
        </>
    );
};
