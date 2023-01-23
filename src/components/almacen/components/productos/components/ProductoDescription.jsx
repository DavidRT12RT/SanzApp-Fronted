import { Divider } from "antd";
import React from "react";

export const ProductoDescription = ({
    isProductoEditing,
    informacionProducto,
    formValues,
    handleInputChange,
}) => {
    return (
        <>
            <Divider />
            <h1 className="nombre-producto">Descripcion del producto</h1>
            {isProductoEditing ? (
                <textarea
                    class="form-control descripcion-producto"
                    rows={5}
                    value={formValues.descripcion}
                    name="descripcion"
                    onChange={handleInputChange}
                ></textarea>
            ) : (
                <h1 className="descripcion-producto">
                    {informacionProducto.descripcion}
                </h1>
            )}
            <Divider />
            <h1 className="nombre-producto">Aplicaciones del producto</h1>
            {isProductoEditing ? (
                <textarea
                    class="form-control descripcion-producto"
                    rows={5}
                    value={formValues.aplicaciones}
                    name="aplicaciones"
                    onChange={handleInputChange}
                ></textarea>
            ) : (
                <h1 className="descripcion-producto">
                    {informacionProducto.aplicaciones}
                </h1>
            )}
        </>
    );
};
