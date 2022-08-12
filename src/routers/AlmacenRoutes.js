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
import { EntradaDevolucion } from '../components/almacen/components/entradas/EntradaDevolucion';
import { EntradasAlmacen } from '../components/almacen/components/entradas/EntradasAlmacen';
import { PanelDeControl } from '../components/almacen/components/panel-de-control/PanelDeControl';
import { CategoriasRegistradas } from '../components/almacen/components/categorias/CategoriasRegistradas';
import { RegistrarProductoNew } from '../components/almacen/components/productos/RegistrarProductoNew';
import { Inventarios } from '../components/almacen/components/inventarios/Inventarios';
import { RegistrarInventario } from '../components/almacen/components/inventarios/RegistrarInventario';
import { Inventario } from '../components/almacen/components/inventarios/Inventario';
import { SalidaScreen } from '../components/almacen/components/salidas/SalidaScreen';
import { PanelDeControlNew } from '../components/almacen/components/panel-de-control/PanelDeControlNew';

export const AlmacenRoutes = () => {
    const { socket } = useContext(SocketContext);
    //TODO: Alertas de almacen 
    return (
        <>
            <AlmacenNavbar/>
            <Routes>
                <Route path="/" element={<SeccionNoticias/>}/>
                <Route path="/productos" element={<ProductosScreen/>}/>
                <Route path="/panel-de-control/" element={<PanelDeControl/>}/>
                <Route path="/productos/:productoId/" element={<ProductoScreen/>}/>
                <Route path="/retirar/" element={<RetirarAlmacen/>}/>
                <Route path="/ingresar/" element={<IngresarAlmacen/>}/>
                <Route path="/productos/registrar/" element={<RegistrarProductoNew/>}/>
                <Route path="/categorias" element={<CategoriasRegistradas/>}/>
                <Route path="/salidas" element={<SalidasAlmacen/>}/>
                <Route path="/salidas/:id/" element={<SalidaScreen/>}/>
                <Route path="/entradas" element={<EntradasAlmacen/>}/>
                <Route path="/inventarios/" element={<Inventarios/>}/>
                <Route path="/inventarios/:id" element={<Inventario/>}/>
                <Route path="/inventarios/registrar-inventario/" element={<RegistrarInventario/>}></Route>
                <Route path="/*" element={<Component404 />} />
            </Routes>
        </>
    )
}
