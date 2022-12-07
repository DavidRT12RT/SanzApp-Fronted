import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom';
import { CamionetaScreen } from '../components/administraccion/components/camionetas/CamionetaScreen';
import { GestionCamionetas } from '../components/administraccion/components/camionetas/GestionCamionetas';
import { RegistrarCamioneta } from '../components/administraccion/components/camionetas/RegistrarCamioneta';
import { MapasApp } from '../components/administraccion/components/Mapas/MapasApp';
import { GestionOficina } from '../components/administraccion/components/oficina/GestionOficina';
import { RegistrarUsuario } from '../components/administraccion/components/usuarios/RegistrarUsuario';
import { UsuariosPanel } from '../components/administraccion/components/usuarios/UsuariosPanel';
import { AdministracionNavbar } from '../components/administraccion/ui/AdministracionNavbar';
import { ProductosScreen } from '../components/almacen/components/productosAlmacen/ProductosScreen';
import { Component404 } from "../components/componentesGenerales/component404/Component404";
import Footer from '../components/componentesGenerales/Footer';
import { SeccionNoticias } from '../components/componentesGenerales/noticias/SeccionNoticias';
import { SocketContext } from '../context/SocketContext';
import { PrivateRoutePorRole } from './PrivateRoutePorRole';

export const AdministracionRoutes = () => {
    const { socket } = useContext(SocketContext);
    //TODO: Alertas de administraccion 

    return (
        <>
            <AdministracionNavbar/>
            <Routes>
                <Route path="/" element={<SeccionNoticias/>}/>
                <Route path="/usuarios/" element={<UsuariosPanel/>}/>
                <Route path="/usuarios/registrar/" element={<RegistrarUsuario/>}/>
                <Route path="/almacen" element={<ProductosScreen/>}/>

                <Route path="/oficina/" element={
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

                <Route path="/camionetas/" element={
                    <PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","ADMINISTRADOR_ROLE"]}>
                        <GestionCamionetas/>
                    </PrivateRoutePorRole>
                }/>
                <Route path="/camionetas/:camionetaId/" element={
                    <PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","ADMINISTRADOR_ROLE"]}>
                        <CamionetaScreen/>
                    </PrivateRoutePorRole>
                }/>


                <Route path="/*" element={<Component404 />} />
            </Routes>
            <Footer/>
        </>
    )
}