import React from "react";
import { ProductoCard } from "./ProductoCard";

export const ProductosList = ({
    productos,
    cambiarCantidadProducto,
    eliminarProducto,
}) => {
    return (
        <div className="productosList">
            {productos.map((producto) => {
                return (
                    <>
                        <ProductoCard
                            producto={producto}
                            key={producto._id}
                            cambiarCantidadProducto={cambiarCantidadProducto}
                            eliminarProducto={eliminarProducto}
                        />
                        <hr />
                    </>
                );
            })}
        </div>
    );
};
