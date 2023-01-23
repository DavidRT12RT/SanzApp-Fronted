import React from "react";
import { Trash3Fill } from "react-bootstrap-icons";

export const ProductoCard = ({ producto }) => {
    return (
        <div className="productoCard">
            <div className="img">
                <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/api/uploads/productos/${producto._id}`}
                />
            </div>
            <div>
                <h1 className="sub-titulo">{producto.nombre}</h1>
                <p className="descripcion">
                    {producto.descripcion.length > 13
                        ? producto.descripcion.slice(0, 30)
                        : producto.descripcion}
                    ...
                </p>
                <hr style={{ margin: "5px" }} />
                <p className="descripcion estatusProducto">Disponible</p>
            </div>
            {/* <div className="cantidad">
                <p className="titulo-descripcion">
                    A retirar:
                    {producto.cantidadARetirar}
                </p>
                <p className="titulo-descripcion">
                    En bodega:
                    {producto.cantidad}
                </p>
            </div> */}
        </div>
    );
};
