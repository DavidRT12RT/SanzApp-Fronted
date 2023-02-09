import { Button, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

export const SalidasSucessScreen = ({
    salida,
    retirarOtraVezAlmacen,
}) => {
    return (
        <div className="SalidasSucessScreeen">
            <Result
                status="success"
                title="Retiro del almacen realizado con exito!"
                subTitle={`Salida con el id ${salida._id} registrada en el sistema, puedes descargar el documento PDF en el siguiente enlance.`}
                extra={[
                    <Link to={`/almacen/salidas/${salida._id}`}>
                    <Button type="primary" key="console">
                        Ir a la pagina de salida
                    </Button>
                    </Link>,
                    <Button key="buy" onClick={retirarOtraVezAlmacen}>
                        Registrar otra salida
                    </Button>,
                ]}
            />
        </div>
    );
};
