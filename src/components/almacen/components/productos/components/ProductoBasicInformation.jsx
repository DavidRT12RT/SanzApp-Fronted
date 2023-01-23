import React from "react";

import { Tag } from "antd";

export const ProductoBasicInformation = ({
    formValues,
    handleInputChange,
    isProductoEditing,
    informacionProducto,
    auth,
    categorias,
}) => {
    return (
        <>
            {isProductoEditing ? (
                <input
                    className="form-control nombre-producto"
                    value={formValues.nombre}
                    name="nombre"
                    onChange={handleInputChange}
                />
            ) : (
                <h1 className="nombre-producto">
                    {informacionProducto.nombre}
                </h1>
            )}
            {isProductoEditing ? (
                <select
                    id="estatus"
                    className="form-select mt-3 w-50 descripcion"
                    aria-describedby="inventariableHelpBlock"
                    value={formValues.estatus}
                    name="estatus"
                    onChange={handleInputChange}
                >
                    <option className="text-success" value={true}>
                        Disponible
                    </option>
                    <option className="text-danger" value={false}>
                        NO disponible
                    </option>
                </select>
            ) : informacionProducto.estatus ? (
                <h1 className="text-success estatus-producto">Disponible</h1>
            ) : (
                <h1 className="text-danger estatus-producto">No disponible</h1>
            )}
            {isProductoEditing ? (
                <select
                    className="form-select mt-3 col-5 w-50 descripcion my-4"
                    style={{ width: "50%", borderRadius: "0.25rem" }}
                    size="large"
                    name="categoria"
                    value={formValues.categoria}
                    onChange={handleInputChange}
                >
                    {categorias.map((categoria) => {
                        return (
                            <option value={categoria._id}>
                                {categoria.nombre}
                            </option>
                        );
                    })}
                </select>
            ) : (
                <Tag
                    className="descripcion my-3"
                    style={{
                        backgroundColor: informacionProducto.categoria.color,
                        borderColor: informacionProducto.categoria.color,
                        fontSize: "13px",
                        padding: "13px",
                        maxWidth: "fit-content",
                    }}
                >
                    {informacionProducto.categoria.nombre}
                </Tag>
            )}
            <h1 className="titulo-descripcion">Precio promedio X unidad:</h1>
            <h1 className="precio-por-unidad-producto">
                ${informacionProducto.costo}
            </h1>
            <div className="row mt-5">
                {auth.rol === "ADMIN_ROLE" && isProductoEditing ? (
                    <>
                        <h1 className="titulo-descripcion col-6 mt-3">
                            Cantidad en bodega:
                        </h1>
                        <input
                            className="form-control col-5 descripcion mt-3 w-50"
                            value={formValues.cantidad}
                            name="cantidad"
                            onChange={handleInputChange}
                            autoComplete="disabled"
                            required
                        />
                    </>
                ) : (
                    <>
                        <h1 className="titulo-descripcion col-6">Cantidad:</h1>
                        <h1 className="descripcion col-6">
                            {informacionProducto.cantidad}
                        </h1>
                    </>
                )}

                {isProductoEditing ? (
                    <>
                        <h1 className="titulo-descripcion col-6 mt-3">
                            Marca:
                        </h1>
                        <input
                            className="form-control col-5 w-50 descripcion mt-3"
                            placeholder="Marca del producto"
                            size="large"
                            value={formValues.marca}
                            name="marca"
                            onChange={handleInputChange}
                            autoComplete="disabled"
                            required
                        />
                    </>
                ) : (
                    <>
                        <h1 className="titulo-descripcion col-6">Marca:</h1>
                        <h1 className="descripcion col-6">
                            {informacionProducto.marca}
                        </h1>
                    </>
                )}
                {isProductoEditing ? (
                    <>
                        <h1 className="titulo-descripcion col-6 mt-3">
                            Unidad:{" "}
                        </h1>
                        <select
                            id="unidad"
                            className="form-select mt-3 col-5 w-50 descripcion"
                            aria-describedby="inventariableHelpBlock"
                            value={formValues.unidad}
                            name="unidad"
                            onChange={handleInputChange}
                        >
                            <option value={"Metro"}>Metro</option>
                            <option value={"Kilogramo"}>Kilogramo</option>
                            <option value={"Pieza"}>Pieza</option>
                            <option value={"Litro"}>Litro</option>
                        </select>
                    </>
                ) : (
                    <>
                        <h1 className="titulo-descripcion col-6">Unidad: </h1>
                        <h1 className="descripcion col-6">
                            {informacionProducto.unidad}
                        </h1>
                    </>
                )}
                {isProductoEditing ? (
                    <>
                        <h1 className="titulo-descripcion col-6 mt-3">
                            Estado del producto:{" "}
                        </h1>
                        <select
                            id="estado"
                            className="form-select col-5 mt-3 w-50 descripcion"
                            aria-describedby="inventariableHelpBlock"
                            value={formValues.estado}
                            name="estado"
                            onChange={handleInputChange}
                        >
                            <option value={"Nuevo"}>Nuevo</option>
                            <option value={"Usado"}>Usado</option>
                        </select>
                    </>
                ) : (
                    <>
                        <h1 className="titulo-descripcion col-6">
                            Estado del producto:{" "}
                        </h1>
                        <h1 className="descripcion col-6">
                            {informacionProducto.estado}
                        </h1>
                    </>
                )}
                {isProductoEditing ? (
                    <>
                        <h1 className="titulo-descripcion col-6 mt-3">
                            Fecha de registro en el sistema:{" "}
                        </h1>
                        <h1 className="descripcion col-6 text-danger mt-3">
                            {informacionProducto.fechaRegistro}
                        </h1>
                    </>
                ) : (
                    <>
                        <h1 className="titulo-descripcion col-6 ">
                            Fecha de registro en el sistema:{" "}
                        </h1>
                        <h1 className="descripcion col-6 text-danger">
                            {informacionProducto.fechaRegistro}
                        </h1>
                    </>
                )}
                <p className="mt-5 nota col-12 text-center">
                    Para mas detalles del producto comunicate a almacen...
                </p>
            </div>
        </>
    );
};
