import React from "react";

import { Button, PageHeader } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";

export const ProductoHeader = ({
    isProductoEditing,
    setIsProductoEditing,
    onFinishEditingProduct,
    auth,
}) => {
    return (
        <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
            <div className="pageHeader">
                <p className="titulo-descripcion">
                    <ArrowLeft />
                </p>

                <Link to={`/almacen/productos`}>
                    <p className="titulo-descripcion">Volver a almacen</p>
                </Link>
            </div>

            <div>
                {isProductoEditing && (
                    <Button
                        type="primary"
                        className="me-3"
                        danger
                        onClick={() => {
                            setIsProductoEditing(false);
                        }}
                    >
                        Salir sin guardar
                    </Button>
                )}
                {auth.rol === "ADMIN_ROLE" ||
                auth.rol === "ENCARGADO_ALMACEN_ROL" ? (
                    isProductoEditing ? (
                        <Button
                            type="primary"
                            warning
                            onClick={() => {
                                onFinishEditingProduct();
                            }}
                        >
                            Guardar cambios
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            danger
                            onClick={() => {
                                setIsProductoEditing(true);
                            }}
                        >
                            Editar informacion
                        </Button>
                    )
                ) : null}
            </div>
        </div>
    );
};
