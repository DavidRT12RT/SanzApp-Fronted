import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom';
import { CamionetaScreen } from '../components/administraccion/components/camionetas/CamionetaScreen';
import { GestionCamionetas } from '../components/administraccion/components/camionetas/GestionCamionetas';
import { RegistrarCamioneta } from '../components/administraccion/components/camionetas/RegistrarCamioneta';
import { MapasApp } from '../components/administraccion/components/Mapas/MapasApp';
import { GestionOficina } from '../components/administraccion/components/oficina/GestionOficina';
//Component's
import { AdministracionNavbar } from '../components/administraccion/ui/AdministracionNavbar';
import { Component404 } from "../components/componentesGenerales/component404/Component404";
import Footer from '../components/componentesGenerales/Footer';

import { SocketContext } from '../context/SocketContext';
import { PrivateRoutePorRole } from './PrivateRoutePorRole';

//Screen's
import { SeccionNoticias } from '../components/componentesGenerales/noticias/SeccionNoticias';
import { UsuariosScreen } from '../components/administraccion/components/usuarios/UsuariosScreen';
import { ProductosScreen } from '../components/almacen/components/productosAlmacen/ProductosScreen';
import { RegistrarUsuarioScreen } from '../components/administraccion/components/usuarios/RegistrarUsuarioScreen';

export const AdministracionRoutes = () => {
    const { socket } = useContext(SocketContext);
    //TODO: Alertas de administraccion 

    return (
        <>
            <AdministracionNavbar/>
            <Routes>
                <Route path="/" element={<SeccionNoticias/>}/>
                <Route path="/usuarios/" element={<UsuariosScreen/>}/>
                <Route path="/usuarios/registrar/" element={<RegistrarUsuarioScreen/>}/>
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