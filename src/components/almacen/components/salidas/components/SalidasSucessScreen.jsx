import { Button, Result } from "antd";
import React from "react";

export const SalidasSucessScreen = ({
    salida = { _id: "232323" },
    retirarOtraVezAlmacen,
}) => {
    return (
        <div className="SalidasSucessScreeen">
            <Result
                status="success"
                title="Retiro del almacen realizado con exito!"
                subTitle={`Salida con el id ${salida._id} registrada en el sistema, puedes descargar el documento PDF en el siguiente enlance.`}
                extra={[
                    <Button type="primary" key="console">
                        Descargar PDF
                    </Button>,
                    <Button key="buy" onClick={retirarOtraVezAlmacen}>
                        Registrar otra salida
                    </Button>,
                ]}
            />
        </div>
    );
};
