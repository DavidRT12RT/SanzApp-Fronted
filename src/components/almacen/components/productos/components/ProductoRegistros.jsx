import React from "react";

import { Divider, Tabs } from "antd";
import Barcode from "react-barcode";

//Component's
import { EntradasProducto } from "./EntradasProducto";
import { SalidasProducto } from "./SalidasProducto";
import { MovimientosProducto } from "./MovimientosProducto";

const { TabPane } = Tabs;

export const ProductoRegistros = ({ informacionProducto }) => {
    return (
        <>
            <Divider />
            <h1 className="nombre-producto">Registros del producto</h1>
            <Tabs defaultActiveKey="1" key="1" size="large">
                <TabPane tab="Entradas del producto">
                    <EntradasProducto
                        registros={informacionProducto.registrosEntradas}
                        informacionProducto={informacionProducto}
                    />
                </TabPane>
                <TabPane tab="Salidas del producto" key="2">
                    <SalidasProducto
                        registros={informacionProducto.registrosSalidas}
                        informacionProducto={informacionProducto}
                    />
                </TabPane>
                <TabPane tab="Movimientos del producto" key="3">
                    <MovimientosProducto
                        registros={informacionProducto.movimientos}
                        informacionProducto={informacionProducto}
                    />
                </TabPane>
                <TabPane tab="Codigo de barras" key="4">
                    <div className="d-flex justify-content-center align-items-center">
                        <Barcode value={informacionProducto._id} />
                    </div>
                </TabPane>
            </Tabs>
        </>
    );
};
