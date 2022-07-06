import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom';
import { IngresarAlmacen } from '../components/almacen/components/entradas/IngresarAlmacen';
import { RetirarAlmacen } from '../components/almacen/components/salidas/RetirarAlmacen';
import { ProductoScreen } from '../components/almacen/components/productos/ProductoScreen';
import { ProductosScreen } from '../components/almacen/components/productos/ProductosScreen';
import { SalidasAlmacen } from '../components/almacen/components/salidas/SalidasAlmacen';
import { AlmacenNavbar } from '../components/almacen/ui/AlmacenNavbar';
import { Component404 } from '../components/component404/Component404';
import { SeccionNoticias } from '../components/noticias/SeccionNoticias';
import { SocketContext } from '../context/SocketContext';
import { RegistrarProducto } from '../components/almacen/components/productos/RegistrarProducto';
import { EntradaDevolucion } from '../components/almacen/components/entradas/EntradaDevolucion';
import { EntradasAlmacen } from '../components/almacen/components/entradas/EntradasAlmacen';

export const AlmacenRoutes = () => {
    const { socket } = useContext(SocketContext);
    //TODO: Alertas de almacen 
    return (
        <>
            <AlmacenNavbar/>
            <Routes>
                <Route path="/" element={<SeccionNoticias/>}/>
                <Route path="/productos" element={<ProductosScreen/>}/>
                <Route path="/productos/:productoId/" element ={<ProductoScreen/>}/>
                <Route path="/retirar/" element={<RetirarAlmacen/>}/>
                <Route path="/ingresar/" element={<IngresarAlmacen/>}/>
                <Route path="/productos/registrar/" element={<RegistrarProducto/>}/>
                <Route path="/salidas" element={<SalidasAlmacen/>}/>
                <Route path="/entradas" element={<EntradasAlmacen/>}/>
                <Route path="/productos/inventario/" element={<p>Inventario</p>}/>
                <Route path="/*" element={<Component404 />} />
            </Routes>
        </>
    )
}
