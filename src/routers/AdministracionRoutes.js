import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom';
import { RegistrarUsuario } from '../components/administraccion/components/usuarios/RegistrarUsuario';
import { UsuariosPanel } from '../components/administraccion/components/usuarios/UsuariosPanel';
import { AdministracionNavbar } from '../components/administraccion/ui/AdministracionNavbar';
import { Component404 } from '../components/component404/Component404';
import { SeccionNoticias } from '../components/noticias/SeccionNoticias';
import { SocketContext } from '../context/SocketContext';

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

                <Route path="/*" element={<Component404 />} />
            </Routes>
        </>
    )
}