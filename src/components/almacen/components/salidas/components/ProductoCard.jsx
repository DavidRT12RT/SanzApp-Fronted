import React from "react";
import { XLg } from "react-bootstrap-icons";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";

const { confirm } = Modal;

export const ProductoCard = ({
    producto,
    cambiarCantidadProducto,
    eliminarProducto,
}) => {
    return (
        <div className="productoCard">
            <XLg
                className="deleteProductBtn"
                onClick={(e) => {
                    confirm({
                        title: "¿Seguro quieres borrar el producto de la lista?",
                        icon: <ExclamationCircleOutlined />,
                        okText: "Borrar",
                        cancelText: "Volver atras",
                        async onOk() {
                            eliminarProducto(producto._id);
                        },
                    });
                }}
            />
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
                <div className="extraInfo">
                    <div>
                        <p className="descripcion">
                            Retirar:
                            <input
                                className="form-control sub-titulo text-danger"
                                type="number"
                                value={producto.cantidadRetirada}
                                onChange={(e) =>
                                    cambiarCantidadProducto(
                                        producto,
                                        parseInt(e.target.value)
                                    )
                                }
                            />
                        </p>
                    </div>
                    <div>
                        <p className="descripcion">
                            Bodega:
                            <input
                                className="form-control sub-titulo"
                                type="number"
                                value={producto.cantidad}
                                readOnly
                            />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
