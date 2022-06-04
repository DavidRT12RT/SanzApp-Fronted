import { Tabs } from 'antd';
import React from 'react'
import { SalidaDirecta } from './SalidaDirecta';
import { SalidaPorObra } from './SalidaPorObra';
const { TabPane } = Tabs;

export const RealizarRetiroAlmacen = ({socket,informacionProducto,productoId}) => {

    return (
    <>
        <div style={{height:"100vh"}}>
            <Tabs type="card">

                <TabPane tab="Salida directa" key="1">
                    <SalidaDirecta informacionProducto={informacionProducto} socket={socket}/>
                </TabPane>

                <TabPane tab="Salida por obra" key="2">
                    <SalidaPorObra informacionProducto={informacionProducto} socket={socket}/>
                </TabPane>

            </Tabs>
        </div>
    </>
    )
}
