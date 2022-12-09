import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom';
import { IngresarAlmacen } from '../components/almacen/components/entradas/IngresarAlmacen';
import { RetirarAlmacen } from '../components/almacen/components/salidas/RetirarAlmacen';
import { AlmacenNavbar } from '../components/almacen/ui/AlmacenNavbar';
import { SeccionNoticias } from '../components/componentesGenerales/noticias/SeccionNoticias';
import { SocketContext } from '../context/SocketContext';
import { PanelDeControl } from '../components/almacen/components/panel-de-control/PanelDeControl';
import { CategoriasRegistradas } from '../components/almacen/components/categorias/CategoriasRegistradas';
import { RegistrarProductoNew } from '../components/almacen/components/productos/RegistrarProductoNew';
import { RegistrarInventario } from '../components/almacen/components/inventarios/RegistrarInventario';
import { Inventario } from '../components/almacen/components/inventarios/Inventario';
import { SalidaScreen } from '../components/almacen/components/salidas/SalidaScreen';
import { SalidasAlmacenNew } from '../components/almacen/components/salidas/SalidasAlmacenNew';
import { EntradasAlmacenNew } from '../components/almacen/components/entradas/EntradasAlmacenNew';
import { InventariosAlmacen } from '../components/almacen/components/inventarios/InventariosAlmacen';
import { EntradaScreen } from '../components/almacen/components/entradas/EntradaScreen';
import { Component404 } from "../components/componentesGenerales/component404/Component404";
import Footer from '../components/componentesGenerales/Footer';
import { MySpace } from '../components/componentesGenerales/mi-espacio/components/MySpace';
import { ProductoScreenAlmacen } from '../components/almacen/components/productos/ProductoScreenAlmacen';
import { ProductosScreen } from '../components/almacen/components/productosAlmacen/ProductosScreen';

export const AlmacenRoutes = () => {
    const { socket } = useContext(SocketContext);
    //TODO: Alertas de almacen 
    return (
        <>
            <AlmacenNavbar/>
            <Routes>
                <Route path="/" element={<SeccionNoticias/>}/>
                {/*<Route path="/productos" element={<ProductosScreen/>}/> */}
                <Route path="/productos/" element={<ProductosScreen/>}/>
                <Route path="/dashboard/" element={<PanelDeControl/>}/>
                <Route path="/productos/:productoId/" element={<ProductoScreenAlmacen/>}/>
                <Route path="/retirar/" element={<RetirarAlmacen/>}/>
                <Route path="/ingresar/" element={<IngresarAlmacen/>}/>
                <Route path="/productos/registrar/" element={<RegistrarProductoNew/>}/>
                <Route path="/categorias" element={<CategoriasRegistradas/>}/>
                <Route path="/salidas" element={<SalidasAlmacenNew/>}/>
                <Route path="/salidas/:id/" element={<SalidaScreen/>}/>
                <Route path="/entradas" element={<EntradasAlmacenNew/>}/>
                <Route path="/entradas/:id" element={<EntradaScreen/>}/>
                <Route path="/inventarios/" element={<InventariosAlmacen/>}/>
                <Route path="/inventarios/:id" element={<Inventario/>}/>
                <Route path="/inventarios/registrar-inventario/" element={<RegistrarInventario/>}></Route>
				<Route path="/mi-espacio/" element={
                    <MySpace/>
                }/>
                <Route path="/*" element={<Component404 />} />
            </Routes>
            <Footer/>
        </>
    )
}
